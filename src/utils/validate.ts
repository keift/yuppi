import { typof } from 'typof';

import type { InferSchema } from '../types/infer_schema';
import type { Schema, SchemaSingle, SchemaUnion, Type, TypeSingle, TypeUnion } from '../types/schema';
import { ValidationError, type Issue, type IssueType } from '../types/validation_error';
import type { YuppiOptions } from '../types/yuppi_options';

const format_path_to_string = (path: (string | number)[]) =>
  path.reduce<string>((acc, curr, index) => {
    if (typeof curr === 'number') {
      return `${acc}[${String(curr)}]`;
    } else {
      return index === 0 ? curr : `${acc}.${curr}`;
    }
  }, '');

const get_received_type = (value: unknown) => typof(value)[0] as IssueType['received'];

export const validate = <const _Schema extends Schema>(schema: _Schema, data: unknown, options: YuppiOptions) => {
  const issues: Issue[] = [];

  const report_issue = (type: TypeSingle, issue: Issue) => {
    const message = (options.issue_messages as Record<string, Record<string, (issue: Issue) => string>>)[type.type][issue.type];

    if (typeof message === 'function') {
      issue.message = message(issue);
    }

    issues.push(issue);

    if (options.validation?.abort_early === true && issues.length === 1) {
      throw new ValidationError({ issues });
    }
  };

  const validate_type_single = (type: TypeSingle, data: unknown, path: (string | number)[]) => {
    let result: unknown;
    if (Date.now()) {
      result = { selam: true };
    }

    if (type.type === 'string') {
      if (typeof data !== 'string') {
        report_issue(type, {
          type: 'type',
          expected: type.type,
          received: get_received_type(data),
          nullable: type.nullable === true || type.default === null ? true : false,
          path,
          texts: { path: format_path_to_string(path) },
          message: ''
        });
      }
    }

    return { result, issues };
  };

  const validate_type_union = (types: TypeUnion, data: unknown, path: (string | number)[]) => {
    for (const type of types) {
      const result = validate_type_single(type, data, path);

      if (result.issues.length === 0) {
        return result;
      }
    }
  };

  const validate_type = (type: Type, data: unknown, path: (string | number)[]) => {
    if (Array.isArray(type)) {
      return validate_type_union(type, data, path);
    } else {
      return validate_type_single(type, data, path);
    }
  };

  return validate_type_single(schema, data, []) as InferSchema<_Schema>;
};
