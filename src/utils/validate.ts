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

const report_issue = (type: TypeSingle, issue: Issue, issues: Issue[], options: YuppiOptions) => {
  const message = (options.issue_messages as Record<string, Record<string, (issue: Issue) => string>>)[type.type][issue.type];

  if (typeof message === 'function') {
    issue.message = message(issue);
  }

  issues.push(issue);

  if (options.validation?.abort_early === true && issues.length === 1) {
    throw new ValidationError({ issues });
  }
};

const validate_type_single = (type: TypeSingle, data: unknown, path: (string | number)[], issues: Issue[], options: YuppiOptions) => {
  if (type.type === 'string') {
    if (typeof data !== 'string') {
      report_issue(
        type,
        {
          type: 'type',
          expected: type.type,
          received: get_received_type(data),
          nullable: type.nullable === true || type.default === null ? true : false,
          path,
          texts: { path: format_path_to_string(path) },
          message: ''
        },
        issues,
        options
      );
    }
  }

  return data;
};

const validate_type_union = (types: TypeUnion, data: unknown, path: (string | number)[], options: YuppiOptions) => {};

const validate_type = (type: Type, data: unknown, path: (string | number)[], options: YuppiOptions) => {};

const validate_schema_single = (schema: SchemaSingle, data: unknown, path: (string | number)[], options: YuppiOptions) => {};

const validate_schema_union = (schemas: SchemaUnion, data: unknown, path: (string | number)[], options: YuppiOptions) => {};

const validate_schema = (schema: Schema, data: unknown, path: (string | number)[], options: YuppiOptions) => {};

export const validate = (schema: Schema, data: unknown, options: YuppiOptions) => {
  if (typeof data === 'object') {
    data = structuredClone(data);
  }

  return data;
};
