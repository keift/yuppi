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

const validate_type_union = (types: TypeUnion, data: unknown, path: (string | number)[], issues: Issue[], options: YuppiOptions) => {
  const union_issues: Issue[][] = [];

  for (const type of types) {
    const branch_issues: Issue[] = [];
    // Dal kontrolü yaparken abort_early kapatılmalı ki throw etmeden sonucu görebilelim
    const branch_options: YuppiOptions = {
      ...options,
      validation: { ...options.validation, abort_early: false }
    };

    const validated = validate_type_single(type, data, path, branch_issues, branch_options);

    if (branch_issues.length === 0) {
      return validated; // İlk başarılı tipte veriyi dön ve çık
    }

    union_issues.push(branch_issues);
  }

  // Hiçbir dal tutmadıysa tüm dalların hatalarını ana havuza dök
  for (const b_issues of union_issues) {
    issues.push(...b_issues);
  }

  if (options.validation?.abort_early === true && issues.length > 0) {
    throw new ValidationError({ issues });
  }

  return data;
};

const validate_type = (type: Type, data: unknown, path: (string | number)[], issues: Issue[], options: YuppiOptions) => {
  if (Array.isArray(type)) {
    return validate_type_union(type, data, path, issues, options);
  }

  return validate_type_single(type, data, path, issues, options);
};

const validate_schema_single = (schema: SchemaSingle, data: unknown, path: (string | number)[], issues: Issue[], options: YuppiOptions) => {
  const target = typeof data === 'object' && data !== null && !Array.isArray(data) ? (data as Record<string, unknown>) : {};

  for (const [key, prop_type] of Object.entries(schema)) {
    target[key] = validate_type(prop_type, target[key], [...path, key], issues, options);
  }

  return target;
};

const validate_schema_union = (schemas: SchemaUnion, data: unknown, path: (string | number)[], issues: Issue[], options: YuppiOptions) => {
  const union_issues: Issue[][] = [];

  for (const schema of schemas) {
    const branch_issues: Issue[] = [];
    const branch_options: YuppiOptions = {
      ...options,
      validation: { ...options.validation, abort_early: false }
    };

    const validated = validate_schema_single(schema, data, path, branch_issues, branch_options);

    if (branch_issues.length === 0) {
      return validated;
    }

    union_issues.push(branch_issues);
  }

  for (const b_issues of union_issues) {
    issues.push(...b_issues);
  }

  if (options.validation?.abort_early === true && issues.length > 0) {
    throw new ValidationError({ issues });
  }

  return data;
};

const validate_schema = (schema: Schema, data: unknown, path: (string | number)[], issues: Issue[], options: YuppiOptions) => {
  if (Array.isArray(schema)) {
    const first_item = schema[0] as { type?: unknown } | undefined;
    // Eğer array'in ilk elemanının 'type' propertysi string ise bu bir TypeUnion'dır, değilse SchemaUnion'dır
    if (first_item && typeof first_item.type === 'string') {
      return validate_type_union(schema as TypeUnion, data, path, issues, options);
    }
    return validate_schema_union(schema as SchemaUnion, data, path, issues, options);
  }

  const s = schema as { type?: unknown };
  if (s && typeof s.type === 'string') {
    return validate_type_single(schema as TypeSingle, data, path, issues, options);
  }

  return validate_schema_single(schema as SchemaSingle, data, path, issues, options);
};

export const validate = (schema: Schema, data: unknown, options: YuppiOptions) => {
  if (typeof data === 'object' && data !== null) {
    data = structuredClone(data);
  }

  const issues: Issue[] = [];
  const validated_data = validate_schema(schema, data, [], issues, options);

  if (issues.length > 0) {
    throw new ValidationError({ issues });
  }

  return validated_data;
};
