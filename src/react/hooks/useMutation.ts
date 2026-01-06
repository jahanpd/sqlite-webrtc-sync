import { useState, useCallback } from 'react';
import { useDatabaseContext } from '../context';
import type { SchemaDef, InferRow, InsertData, UpdateData, TableNames } from '../../schema';
import type { MutationResult } from '../types';

/**
 * Hook for mutating data in a table (insert, update, remove).
 * Automatically invalidates related queries after mutations.
 * 
 * @param dbName - Database name
 * @param tableName - Table to mutate
 * 
 * @example
 * ```tsx
 * function AddTodo() {
 *   const [title, setTitle] = useState('');
 *   const { insert, isLoading } = useMutation('my-app', 'todos');
 *   
 *   const handleAdd = async () => {
 *     const newTodo = await insert({ title, completed: false });
 *     console.log('Created:', newTodo.id);
 *     setTitle('');
 *   };
 *   
 *   return (
 *     <form onSubmit={handleAdd}>
 *       <input value={title} onChange={e => setTitle(e.target.value)} />
 *       <button disabled={isLoading}>Add</button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useMutation<S extends SchemaDef, T extends TableNames<S>>(
  dbName: string,
  tableName: T
): MutationResult<InferRow<S[T]>> {
  const context = useDatabaseContext<S>(dbName);
  const { db, store } = context;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  type Row = InferRow<S[T]>;
  
  /**
   * Insert a new row. Returns the full inserted row with generated id.
   */
  const insert = useCallback(async (data: InsertData<Row>): Promise<Row> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build INSERT statement
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map(() => '?').join(', ');
      
      const sql = `INSERT INTO ${String(tableName)} (${columns.join(', ')}) VALUES (${placeholders})`;
      const result = await db.exec(sql, values);
      
      // Invalidate queries for this table
      store.invalidateTables([String(tableName)]);
      
      // Get the inserted row (we need to query for it to get the full row with system columns)
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
  }, [db, store, tableName]);
  
  /**
   * Update an existing row by id. Returns the updated row.
   */
  const update = useCallback(async (id: string, data: UpdateData<Row>): Promise<Row> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build UPDATE statement
      const entries = Object.entries(data).filter(([_, v]) => v !== undefined);
      const setClauses = entries.map(([col]) => `${col} = ?`).join(', ');
      const values = entries.map(([_, v]) => v);
      
      const sql = `UPDATE ${String(tableName)} SET ${setClauses} WHERE id = ?`;
      await db.exec(sql, [...values, id]);
      
      // Invalidate queries for this table
      store.invalidateTables([String(tableName)]);
      
      // Get the updated row
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
  }, [db, store, tableName]);
  
  /**
   * Remove a row by id (soft delete). Returns the removed row.
   */
  const remove = useCallback(async (id: string): Promise<Row> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the row before deletion
      const selectResult = await db.exec(
        `SELECT * FROM ${String(tableName)} WHERE id = ?`,
        [id]
      );
      
      if (selectResult.rows.length === 0) {
        throw new Error(`Row with id "${id}" not found`);
      }
      
      const row = selectResult.rows[0] as Row;
      
      // Delete (soft delete via SQL rewriting)
      await db.exec(`DELETE FROM ${String(tableName)} WHERE id = ?`, [id]);
      
      // Invalidate queries for this table
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
  
  return { insert, update, remove, isLoading, error };
}
