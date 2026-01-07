import type { SchemaDef, InferRow, TableNames } from '../../schema';
import type { MutationResult } from '../types';
export declare function useMutation<S extends SchemaDef, T extends TableNames<S>>(dbName: string, tableName: T): MutationResult<InferRow<S[T]>, S[T]>;
//# sourceMappingURL=useMutation.d.ts.map