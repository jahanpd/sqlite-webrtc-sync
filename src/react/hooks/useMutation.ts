import { useState, useCallback } from 'react';
import { useDatabaseContext } from '../context';
import type { SchemaDef, InferRow, InsertData, UpdateData, TableNames, TableDef } from '../../schema';
import { validateInsertData, validateUpdateData } from '../../schema';
import type { MutationResult } from '../types';

export function useMutation<S extends SchemaDef, T extends TableNames<S>>(
  dbName: string,
  tableName: T
): MutationResult<InferRow<S[T]>, S[T]> {
  const context = useDatabaseContext<S>(dbName);

  const { db, store, schema } = context ? context : { db: null, store: null, schema: null };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  type Row = InferRow<S[T]>;
  type Table = S[T];

  const insert = useCallback(async (data: InsertData<Table>): Promise<Row | null> => {
    if (!db || !schema) return null;
    setIsLoading(true);
    setError(null);

    try {
      const tableDef = schema.tables[tableName];
      validateInsertData(tableDef, data);

      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map(() => '?').join(', ');

      const sql = `INSERT INTO ${String(tableName)} (${columns.join(', ')}) VALUES (${placeholders})`;
      const result = await db.exec(sql, values);

      store.invalidateTables([String(tableName)]);

      if (result.affectedRows && result.affectedRows.length > 0) {
        const insertedId = result.affectedRows[0].id;
        const selectResult = await db.exec(
          `SELECT * FROM ${String(tableName)} WHERE id = ?`,
          [insertedId]
        );

        if (selectResult.rows.length > 0) {
          return selectResult.rows[0] as Row;
        }
      }

      throw new Error('Insert succeeded but could not retrieve inserted row');
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [db, store, schema, tableName]);

  const update = useCallback(async (id: string, data: UpdateData<Table>): Promise<Row | null> => {
    if (!db || !schema) return null;
    setIsLoading(true);
    setError(null);

    try {
      const tableDef = schema.tables[tableName];
      validateUpdateData(tableDef, data);

      const entries = Object.entries(data).filter(([_, v]) => v !== undefined);
      if (entries.length === 0) {
        const selectResult = await db.exec(
          `SELECT * FROM ${String(tableName)} WHERE id = ?`,
          [id]
        );
        if (selectResult.rows.length > 0) {
          return selectResult.rows[0] as Row;
        }
        throw new Error(`Row with id "${id}" not found`);
      }

      const setClauses = entries.map(([col]) => `${col} = ?`).join(', ');
      const values = entries.map(([_, v]) => v);

      const sql = `UPDATE ${String(tableName)} SET ${setClauses} WHERE id = ?`;
      await db.exec(sql, [...values, id]);

      store.invalidateTables([String(tableName)]);

      const selectResult = await db.exec(
        `SELECT * FROM ${String(tableName)} WHERE id = ?`,
        [id]
      );

      if (selectResult.rows.length > 0) {
        return selectResult.rows[0] as Row;
      }

      throw new Error(`Row with id "${id}" not found after update`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [db, store, schema, tableName]);

  const remove = useCallback(async (id: string): Promise<Row | null> => {
    if (!db) return null;
    setIsLoading(true);
    setError(null);

    try {
      const selectResult = await db.exec(
        `SELECT * FROM ${String(tableName)} WHERE id = ?`,
        [id]
      );

      if (selectResult.rows.length === 0) {
        throw new Error(`Row with id "${id}" not found`);
      }

      const row = selectResult.rows[0] as Row;

      await db.exec(`DELETE FROM ${String(tableName)} WHERE id = ?`, [id]);

      store.invalidateTables([String(tableName)]);

      return row;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [db, store, tableName]);

  if (!context) {
    return {
      insert: async () => { throw new Error('Database still initializing'); },
      update: async () => { throw new Error('Database still initializing'); },
      remove: async () => { throw new Error('Database still initializing'); },
      isLoading: false,
      error: new Error('Database still initializing'),
    };
  }
  return { insert, update, remove, isLoading, error };
}
