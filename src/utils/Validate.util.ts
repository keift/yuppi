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

export const validate = <const _Schema extends Schema>(schema: _Schema, data: unknown, options: YuppiOptions) => {
  const result: unknown;
  const issues: Issue[] = [];

  const reportIssue = (issue: Issue) => {
    issues.push(issue);

    if (options.validation?.abort_early === true && issues.length === 1) throw new ValidationError({ issues });
  };

  const validateSchema = (schema: Schema, data: unknown, path: (string | number)[], options: YuppiOptions) => {
    if (Array.isArray(schema)) {
      if (schema.length > 0 && typeof (schema[0] as TypeSingle).type === 'string') return validateTypeUnion(schema as TypeUnion, data, path, options);

      return validateSchemaUnion(schema as SchemaUnion, data, path, options);
    } else {
      if (typeof (schema as TypeSingle).type === 'string') return validateTypeSingle(schema as TypeSingle, data, path, options);

      return validateSchemaSingle(schema as SchemaSingle, data, path, options);
    }
  };
};
