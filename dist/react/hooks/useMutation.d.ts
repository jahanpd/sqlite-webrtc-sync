import type { SchemaDef, InferRow, TableNames } from '../../schema';
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
export declare function useMutation<S extends SchemaDef, T extends TableNames<S>>(dbName: string, tableName: T): MutationResult<InferRow<S[T]>>;
//# sourceMappingURL=useMutation.d.ts.map