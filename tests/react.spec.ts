import { test, expect } from '@playwright/test';

test.describe('React Integration', () => {
  test.setTimeout(30000);

  test('Schema definition works correctly', async ({ page }) => {
    // Use test.html as base page (simpler, no React dependency for schema tests)
    await page.goto('/test.html');

    // Test schema definition
    const schemaTest = await page.evaluate(async () => {
      // @ts-ignore - accessing modules from page context
      const { defineSchema, defineTable, column } = await import('./schema.js');

      const schema = defineSchema({
        users: defineTable({
          name: column.text(),
          age: column.integer().optional(),
          active: column.boolean(),
        }),
      });

      // Get SQL for the users table
      const sql = schema.getTableSQL('users');

      return {
        hasUserTable: 'users' in schema.tables,
        sqlContainsName: sql.includes('name TEXT'),
        sqlContainsAge: sql.includes('age INTEGER'),
        sqlContainsId: sql.includes('id TEXT PRIMARY KEY'),
        sqlContainsUpdatedAt: sql.includes('updated_at INTEGER'),
        sqlContainsDeleted: sql.includes('deleted INTEGER'),
        sql: sql
      };
    });

    expect(schemaTest.hasUserTable).toBe(true);
    expect(schemaTest.sqlContainsName).toBe(true);
    expect(schemaTest.sqlContainsAge).toBe(true);
    expect(schemaTest.sqlContainsId).toBe(true);
    expect(schemaTest.sqlContainsUpdatedAt).toBe(true);
    expect(schemaTest.sqlContainsDeleted).toBe(true);
  });

  test('Multiple column types work', async ({ page }) => {
    await page.goto('/test.html');

    const columnTest = await page.evaluate(async () => {
      // @ts-ignore
      const { defineSchema, defineTable, column } = await import('./schema.js');

      const schema = defineSchema({
        items: defineTable({
          textCol: column.text(),
          intCol: column.integer(),
          realCol: column.real(),
          boolCol: column.boolean(),
          optionalText: column.text().optional(),
        }),
      });

      const sql = schema.getTableSQL('items');

      return {
        sql,
        hasText: sql.includes('textCol TEXT NOT NULL'),
        hasInt: sql.includes('intCol INTEGER NOT NULL'),
        hasReal: sql.includes('realCol REAL NOT NULL'),
        hasBool: sql.includes('boolCol INTEGER NOT NULL'),
        hasOptional: sql.includes('optionalText TEXT') && !sql.includes('optionalText TEXT NOT NULL'),
      };
    });

    expect(columnTest.hasText).toBe(true);
    expect(columnTest.hasInt).toBe(true);
    expect(columnTest.hasReal).toBe(true);
    expect(columnTest.hasBool).toBe(true);
    expect(columnTest.hasOptional).toBe(true);
  });

  test('Schema generates all table SQL', async ({ page }) => {
    await page.goto('/test.html');

    const result = await page.evaluate(async () => {
      // @ts-ignore
      const { defineSchema, defineTable, column } = await import('./schema.js');

      const schema = defineSchema({
        todos: defineTable({
          title: column.text(),
          completed: column.boolean(),
        }),
        users: defineTable({
          name: column.text(),
          email: column.text(),
        }),
      });

      const allSQL = schema.toSQL();

      return {
        tableCount: allSQL.length,
        hasTodos: allSQL.some((s: string) => s.includes('CREATE TABLE IF NOT EXISTS todos')),
        hasUsers: allSQL.some((s: string) => s.includes('CREATE TABLE IF NOT EXISTS users')),
      };
    });

    expect(result.tableCount).toBe(2);
    expect(result.hasTodos).toBe(true);
    expect(result.hasUsers).toBe(true);
  });
});
