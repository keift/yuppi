/* eslint-disable */

import type { InferSchema } from '../types/infer_schema';
import type { Schema, SchemaSingle, SchemaUnion, Type, TypeSingle, TypeUnion } from '../types/schema';
import { ValidationError, type Issue } from '../types/validation_error';
import type { YuppiOptions } from '../types/yuppi_options';

const format_path_to_string = (path_array: (string | number)[]) =>
  path_array.reduce<string>((acc, curr, index) => {
    if (typeof curr === 'number') {
      return `${acc}[${String(curr)}]`;
    } else {
      return index === 0 ? curr : `${acc}.${curr}`;
    }
  }, '');

const get_received_type = (value: unknown): TypeSingle['type'] | 'null' | 'undefined' => {
  if (value === undefined) {
    return 'undefined';
  }
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'string') {
    return 'string';
  }
  if (typeof value === 'number') {
    return 'number';
  }
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  if (value instanceof Date) {
    return 'date';
  }
  if (typeof value === 'object') {
    return 'object';
  }

  return 'undefined';
};

type ValidationResult = {
  data: unknown;
  issues: Issue[];
};

const build_issue = (issue_type: Issue['type'], schema_type: TypeSingle['type'], expected: Issue['expected'], received: Issue['received'], path: (string | number)[], options: YuppiOptions, min?: number, max?: number): Issue => {
  const path_str = format_path_to_string(path);
  const amount = min ?? max ?? 1;

  const parts: Issue['texts'] = {
    path: path_str,
    min,
    max,
    plural_suffix: amount === 1 ? '' : 's'
  };

  const dummy: Issue = {
    type: issue_type,
    expected,
    received,
    path,
    texts: parts,
    code: '',
    message: ''
  };

  const message_group = options.issue_messages?.[schema_type];
  const message_fn = message_group?.[issue_type as keyof typeof message_group] as ((e: Issue) => string) | undefined;

  const message = message_fn ? message_fn(dummy) : `${path_str || 'root'}: ${issue_type}`;

  return { ...dummy, message };
};

const validate_type_single = (type: TypeSingle, data: unknown, path: (string | number)[], options: YuppiOptions): ValidationResult => {
  const issues: Issue[] = [];
  const is_nullable = type.nullable === true || type.default === null;
  let value = data;

  if (value === undefined) {
    if (type.default !== undefined) {
      value = type.default;
    } else if (type.required !== false) {
      issues.push(build_issue('required', type.type, type.type, 'undefined', path, options));
      return { data: value, issues };
    } else {
      return { data: value, issues };
    }
  }

  if (value === null) {
    if (is_nullable) {
      return { data: null, issues };
    }
    issues.push(build_issue('nullable', type.type, type.type, 'null', path, options));
    return { data: value, issues };
  }

  if (type.type === 'string') {
    if (typeof value !== 'string') {
      issues.push(build_issue('type', 'string', 'string', get_received_type(value), path, options));
      return { data: value, issues };
    }

    let str = value;
    if (type.trim !== false) {
      str = str.trim();
    }
    if (type.lowercase === true) {
      str = str.toLowerCase();
    }
    if (type.uppercase === true) {
      str = str.toUpperCase();
    }

    if (type.enum !== undefined) {
      let matched = false;
      for (const item of type.enum) {
        if (str === item) {
          matched = true;
          break;
        }
      }
      if (!matched) {
        issues.push(build_issue('enum', 'string', 'string', 'string', path, options));
      }
    }

    if (type.pattern !== undefined && !new RegExp(type.pattern).test(str)) {
      issues.push(build_issue('pattern', 'string', 'string', 'string', path, options));
    }

    if (type.minimum !== undefined && str.length < type.minimum) {
      issues.push(build_issue('min', 'string', 'string', 'string', path, options, type.minimum));
    }

    if (type.maximum !== undefined && str.length > type.maximum) {
      issues.push(build_issue('max', 'string', 'string', 'string', path, options, undefined, type.maximum));
    }

    return { data: str, issues };
  }

  if (type.type === 'number') {
    if (typeof value !== 'number') {
      issues.push(build_issue('type', 'number', 'number', get_received_type(value), path, options));
      return { data: value, issues };
    }

    if (type.enum !== undefined) {
      let matched = false;
      for (const item of type.enum) {
        if (value === item) {
          matched = true;
          break;
        }
      }
      if (!matched) {
        issues.push(build_issue('enum', 'number', 'number', 'number', path, options));
      }
    }

    if (type.integer === true && !Number.isInteger(value)) {
      issues.push(build_issue('integer', 'number', 'number', 'number', path, options));
    }

    if (type.minimum !== undefined && value < type.minimum) {
      issues.push(build_issue('min', 'number', 'number', 'number', path, options, type.minimum));
    }

    if (type.maximum !== undefined && value > type.maximum) {
      issues.push(build_issue('max', 'number', 'number', 'number', path, options, undefined, type.maximum));
    }

    if (type.positive === true && type.minimum === undefined && value <= 0) {
      issues.push(build_issue('positive', 'number', 'number', 'number', path, options));
    }

    if (type.negative === true && type.maximum === undefined && value >= 0) {
      issues.push(build_issue('negative', 'number', 'number', 'number', path, options));
    }

    return { data: value, issues };
  }

  if (type.type === 'boolean') {
    if (typeof value !== 'boolean') {
      issues.push(build_issue('type', 'boolean', 'boolean', get_received_type(value), path, options));
      return { data: value, issues };
    }
    return { data: value, issues };
  }

  if (type.type === 'date') {
    const date_obj = value instanceof Date ? value : new Date(value as string);

    if (Number.isNaN(date_obj.getTime())) {
      issues.push(build_issue('type', 'date', 'date', get_received_type(value), path, options));
      return { data: value, issues };
    }

    if (type.minimum !== undefined && date_obj < new Date(type.minimum)) {
      issues.push(build_issue('min', 'date', 'date', 'date', path, options));
    }

    if (type.maximum !== undefined && date_obj > new Date(type.maximum)) {
      issues.push(build_issue('max', 'date', 'date', 'date', path, options));
    }

    return { data: date_obj, issues };
  }

  if (type.type === 'object') {
    if (typeof value !== 'object' || Array.isArray(value)) {
      issues.push(build_issue('type', 'object', 'object', get_received_type(value), path, options));
      return { data: value, issues };
    }
    const result = validate_schema(type.properties, value, path, options);
    return { data: result.data, issues: [...issues, ...result.issues] };
  }

  if (type.type === 'array') {
    if (!Array.isArray(value)) {
      issues.push(build_issue('type', 'array', 'array', get_received_type(value), path, options));
      return { data: value, issues };
    }

    if (type.minimum !== undefined && value.length < type.minimum) {
      issues.push(build_issue('min', 'array', 'array', 'array', path, options, type.minimum));
    }

    if (type.maximum !== undefined && value.length > type.maximum) {
      issues.push(build_issue('max', 'array', 'array', 'array', path, options, undefined, type.maximum));
    }

    const validated_items: unknown[] = [];
    for (let i = 0; i < value.length; i++) {
      const item_result = validate_type(type.items, value[i], [...path, i], options);
      validated_items.push(item_result.data);
      issues.push(...item_result.issues);
      if (options.validation?.abort_early === true && issues.length > 0) {
        break;
      }
    }

    return { data: validated_items, issues };
  }

  if (!Array.isArray(value) || value.length !== type.items.length) {
    issues.push(build_issue('type', 'tuple', 'tuple', get_received_type(value), path, options));
    return { data: value, issues };
  }

  const validated_tuple: unknown[] = [];
  for (let i = 0; i < type.items.length; i++) {
    const item_result = validate_type(type.items[i], (value as unknown[])[i], [...path, i], options);
    validated_tuple.push(item_result.data);
    issues.push(...item_result.issues);
    if (options.validation?.abort_early === true && issues.length > 0) {
      break;
    }
  }

  return { data: validated_tuple, issues };
};

const validate_type_union = (types: TypeUnion, data: unknown, path: (string | number)[], options: YuppiOptions) => {
  for (const type of types) {
    const result = validate_type_single(type, data, path, options);
    if (result.issues.length === 0) {
      return result;
    }
  }
  return validate_type_single(types[0], data, path, options);
};

const validate_type = (type: Type, data: unknown, path: (string | number)[], options: YuppiOptions) => {
  if (Array.isArray(type)) {
    return validate_type_union(type, data, path, options);
  } else {
    return validate_type_single(type, data, path, options);
  }
};

const validate_schema_single = (schema: SchemaSingle, data: unknown, path: (string | number)[], options: YuppiOptions) => {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return {
      data,
      issues: [build_issue('type', 'object', 'object', get_received_type(data), path, options)]
    };
  }

  const record = data as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  const issues: Issue[] = [];

  for (const [key, type] of Object.entries(schema)) {
    const field_result = validate_type(type, record[key], [...path, key], options);

    result[key] = field_result.data;
    issues.push(...field_result.issues);

    if (options.validation?.abort_early === true && issues.length > 0) {
      break;
    }
  }

  return { data: result, issues };
};

const validate_schema_union = (schemas: SchemaUnion, data: unknown, path: (string | number)[], options: YuppiOptions) => {
  for (const schema of schemas) {
    const result = validate_schema_single(schema, data, path, options);

    if (result.issues.length === 0) {
      return result;
    }
  }

  return validate_schema_single(schemas[0], data, path, options);
};

const validate_schema = (schema: Schema, data: unknown, path: (string | number)[], options: YuppiOptions) => {
  if (Array.isArray(schema)) {
    if (schema.length > 0 && typeof (schema[0] as TypeSingle).type === 'string') {
      return validate_type_union(schema as TypeUnion, data, path, options);
    }

    return validate_schema_union(schema as SchemaUnion, data, path, options);
  } else {
    if (typeof (schema as TypeSingle).type === 'string') {
      return validate_type_single(schema as TypeSingle, data, path, options);
    }

    return validate_schema_single(schema as SchemaSingle, data, path, options);
  }
};

export const validate = <const _Schema extends Schema>(schema: _Schema, data: unknown, options: YuppiOptions) => {
  const result = validate_schema(schema, data, [], options);

  if (result.issues.length > 0) {
    throw new ValidationError({ issues: result.issues });
  }

  return result.data as InferSchema<_Schema>;
};
