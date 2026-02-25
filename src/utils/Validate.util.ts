import type { InferSchema } from '../types/InferSchema.type';
import type { Schema, SchemaSingle, SchemaUnion, Type, TypeSingle, TypeUnion } from '../types/Schema.type';
import { ValidationError, type ErrorContext } from '../types/ValidationError.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';

const formatPathToString = (path_array: (string | number)[]) =>
  path_array.reduce<string>((acc, curr, index) => {
    if (typeof curr === 'number') {
      return `${acc}[${String(curr)}]`;
    } else return index === 0 ? curr : `${acc}.${curr}`;
  }, '');

const getReceivedType = (value: unknown): TypeSingle['type'] | 'null' | 'undefined' => {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  if (typeof value === 'object') return 'object';

  return 'undefined';
};

type ValidationResult = {
  data: unknown;
  errors: ErrorContext[];
};

const buildError = (error_type: ErrorContext['type'], schema_type: TypeSingle['type'], expected: ErrorContext['expected'], received: ErrorContext['received'], path: (string | number)[], options: YuppiOptions, min?: number, max?: number): ErrorContext => {
  const path_str = formatPathToString(path);
  const amount = min ?? max ?? 1;

  const parts: ErrorContext['parts'] = {
    path: path_str,
    min,
    max,
    plural_suffix: amount === 1 ? '' : 's'
  };

  const dummy: ErrorContext = {
    type: error_type,
    expected,
    received,
    path,
    parts,
    code: '',
    message: ''
  };

  const message_group = options.error_messages?.[schema_type];
  const message_fn = message_group?.[error_type as keyof typeof message_group] as ((e: ErrorContext) => string) | undefined;

  const message = message_fn ? message_fn(dummy) : `${path_str || 'root'}: ${error_type}`;

  return { ...dummy, message };
};

const validateTypeSingle = (type: TypeSingle, data: unknown, path: (string | number)[], options: YuppiOptions): ValidationResult => {
  const errors: ErrorContext[] = [];
  const is_nullable = type.nullable === true || type.default === null;
  let value = data;

  if (value === undefined) {
    if (type.default !== undefined) {
      value = type.default;
    } else if (type.required !== false) {
      errors.push(buildError('required', type.type, type.type, 'undefined', path, options));
      return { data: value, errors };
    } else {
      return { data: value, errors };
    }
  }

  if (value === null) {
    if (is_nullable) return { data: null, errors };
    errors.push(buildError('nullable', type.type, type.type, 'null', path, options));
    return { data: value, errors };
  }

  if (type.type === 'string') {
    if (typeof value !== 'string') {
      errors.push(buildError('type', 'string', 'string', getReceivedType(value), path, options));
      return { data: value, errors };
    }

    let str = value;
    if (type.trim !== false) str = str.trim();
    if (type.lowercase === true) str = str.toLowerCase();
    if (type.uppercase === true) str = str.toUpperCase();

    if (type.enum !== undefined) {
      let matched = false;
      for (const item of type.enum) {
        if (str === item) {
          matched = true;
          break;
        }
      }
      if (!matched) errors.push(buildError('enum', 'string', 'string', 'string', path, options));
    }

    if (type.pattern !== undefined && !new RegExp(type.pattern).test(str)) errors.push(buildError('pattern', 'string', 'string', 'string', path, options));

    if (type.min !== undefined && str.length < type.min) errors.push(buildError('min', 'string', 'string', 'string', path, options, type.min));

    if (type.max !== undefined && str.length > type.max) errors.push(buildError('max', 'string', 'string', 'string', path, options, undefined, type.max));

    return { data: str, errors };
  }

  if (type.type === 'number') {
    if (typeof value !== 'number') {
      errors.push(buildError('type', 'number', 'number', getReceivedType(value), path, options));
      return { data: value, errors };
    }

    if (type.enum !== undefined) {
      let matched = false;
      for (const item of type.enum) {
        if (value === item) {
          matched = true;
          break;
        }
      }
      if (!matched) errors.push(buildError('enum', 'number', 'number', 'number', path, options));
    }

    if (type.integer === true && !Number.isInteger(value)) errors.push(buildError('integer', 'number', 'number', 'number', path, options));

    if (type.min !== undefined && value < type.min) errors.push(buildError('min', 'number', 'number', 'number', path, options, type.min));

    if (type.max !== undefined && value > type.max) errors.push(buildError('max', 'number', 'number', 'number', path, options, undefined, type.max));

    if (type.positive === true && type.min === undefined && value <= 0) errors.push(buildError('positive', 'number', 'number', 'number', path, options));

    if (type.negative === true && type.max === undefined && value >= 0) errors.push(buildError('negative', 'number', 'number', 'number', path, options));

    return { data: value, errors };
  }

  if (type.type === 'boolean') {
    if (typeof value !== 'boolean') {
      errors.push(buildError('type', 'boolean', 'boolean', getReceivedType(value), path, options));
      return { data: value, errors };
    }
    return { data: value, errors };
  }

  if (type.type === 'date') {
    const date_obj = value instanceof Date ? value : new Date(value as string);

    if (Number.isNaN(date_obj.getTime())) {
      errors.push(buildError('type', 'date', 'date', getReceivedType(value), path, options));
      return { data: value, errors };
    }

    if (type.min !== undefined && date_obj < new Date(type.min)) errors.push(buildError('min', 'date', 'date', 'date', path, options));

    if (type.max !== undefined && date_obj > new Date(type.max)) errors.push(buildError('max', 'date', 'date', 'date', path, options));

    return { data: date_obj, errors };
  }

  if (type.type === 'object') {
    if (typeof value !== 'object' || Array.isArray(value)) {
      errors.push(buildError('type', 'object', 'object', getReceivedType(value), path, options));
      return { data: value, errors };
    }
    const result = validateSchema(type.properties, value, path, options);
    return { data: result.data, errors: [...errors, ...result.errors] };
  }

  if (type.type === 'array') {
    if (!Array.isArray(value)) {
      errors.push(buildError('type', 'array', 'array', getReceivedType(value), path, options));
      return { data: value, errors };
    }

    if (type.min !== undefined && value.length < type.min) errors.push(buildError('min', 'array', 'array', 'array', path, options, type.min));

    if (type.max !== undefined && value.length > type.max) errors.push(buildError('max', 'array', 'array', 'array', path, options, undefined, type.max));

    const validated_items: unknown[] = [];
    for (let i = 0; i < value.length; i++) {
      const item_result = validateType(type.items, value[i], [...path, i], options);
      validated_items.push(item_result.data);
      errors.push(...item_result.errors);
      if (options.validations?.abort_early === true && errors.length > 0) break;
    }

    return { data: validated_items, errors };
  }

  if (!Array.isArray(value) || value.length !== type.items.length) {
    errors.push(buildError('type', 'tuple', 'tuple', getReceivedType(value), path, options));
    return { data: value, errors };
  }

  const validated_tuple: unknown[] = [];
  for (let i = 0; i < type.items.length; i++) {
    const item_result = validateType(type.items[i], (value as unknown[])[i], [...path, i], options);
    validated_tuple.push(item_result.data);
    errors.push(...item_result.errors);
    if (options.validations?.abort_early === true && errors.length > 0) break;
  }

  return { data: validated_tuple, errors };
};

const validateTypeUnion = (types: TypeUnion, data: unknown, path: (string | number)[], options: YuppiOptions): ValidationResult => {
  for (const type of types) {
    const result = validateTypeSingle(type, data, path, options);
    if (result.errors.length === 0) return result;
  }
  return validateTypeSingle(types[0], data, path, options);
};

const validateType = (type: Type, data: unknown, path: (string | number)[], options: YuppiOptions): ValidationResult => {
  if (Array.isArray(type)) return validateTypeUnion(type, data, path, options);
  return validateTypeSingle(type, data, path, options);
};

const validateSchemaSingle = (schema: SchemaSingle, data: unknown, path: (string | number)[], options: YuppiOptions): ValidationResult => {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return {
      data,
      errors: [buildError('type', 'object', 'object', getReceivedType(data), path, options)]
    };
  }

  const record = data as Record<string, unknown>;
  const result: Record<string, unknown> = options.validations?.strip_unknown === true ? {} : { ...record };

  const errors: ErrorContext[] = [];

  for (const [key, type] of Object.entries(schema)) {
    const field_result = validateType(type, record[key], [...path, key], options);
    result[key] = field_result.data;
    errors.push(...field_result.errors);
    if (options.validations?.abort_early === true && errors.length > 0) break;
  }

  return { data: result, errors };
};

const validateSchemaUnion = (schemas: SchemaUnion, data: unknown, path: (string | number)[], options: YuppiOptions): ValidationResult => {
  for (const schema of schemas) {
    const result = validateSchemaSingle(schema, data, path, options);
    if (result.errors.length === 0) return result;
  }
  return validateSchemaSingle(schemas[0], data, path, options);
};

const validateSchema = (schema: Schema, data: unknown, path: (string | number)[], options: YuppiOptions): ValidationResult => {
  if (Array.isArray(schema)) {
    if (schema.length > 0 && typeof (schema[0] as TypeSingle).type === 'string') return validateTypeUnion(schema as TypeUnion, data, path, options);
    return validateSchemaUnion(schema as SchemaUnion, data, path, options);
  }

  if (typeof (schema as TypeSingle).type === 'string') return validateTypeSingle(schema as TypeSingle, data, path, options);

  return validateSchemaSingle(schema as SchemaSingle, data, path, options);
};

export const validate = <const _Schema extends Schema>(schema: _Schema, data: unknown, options: YuppiOptions): InferSchema<_Schema> => {
  const result = validateSchema(schema, data, [], options);

  if (result.errors.length > 0) throw new ValidationError({ errors: result.errors });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result.data as InferSchema<_Schema>;
};
