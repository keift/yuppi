import type { InferSchema } from '../types/InferSchema.type';
import type { Schema, SchemaSingle, SchemaUnion, Type, TypeSingle, TypeUnion } from '../types/Schema.type';
import { ValidationError, type Issue } from '../types/ValidationError.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';

const formatPathToString = (path_array: (string | number)[]) =>
  path_array.reduce<string>((acc, curr, index) => {
    if (typeof curr === 'number') {
      return `${acc}[${String(curr)}]`;
    } else return index === 0 ? curr : `${acc}.${curr}`;
  }, '');

const reportIssue = (issue: Issue[]) => {};

export const validate = <const _Schema extends Schema>(schema: _Schema, data: unknown, options: YuppiOptions) => {
  const result = validateSchema(schema, data, [], options);

  if (result.issues.length > 0) throw new ValidationError({ issues: result.issues });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result.data as InferSchema<_Schema>;
};
