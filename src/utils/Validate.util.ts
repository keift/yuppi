import type { InferSchema } from '../types/InferSchema.type';
import type { Schema, Type, TypeSingle, TypeUnion, SchemaSingle, SchemaUnion } from '../types/Schema.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';
import { ValidationError } from '../types/ValidationError.type';

const regexes = new Map<string, RegExp>();

const getRegex = (pattern: string) => {
  let regex = regexes.get(pattern);

  if (!regex) {
    regex = new RegExp(pattern);

    regexes.set(pattern, regex);
  }

  return regex;
};

const findMatchedType = (type_union: TypeUnion, property: unknown) => {
  if (property === undefined) {
    const schema_with_default = type_union.find((schema) => schema.default !== undefined);

    if (schema_with_default) return schema_with_default;

    return type_union[0];
  }

  const matched = type_union.find((schema) => {
    if (property === null) return schema.nullable;

    if (schema.type === 'date') return typeof property === 'string' || property instanceof Date;
    if (schema.type === 'array') return Array.isArray(property);
    if (schema.type === 'object') return typeof property === 'object' && !Array.isArray(property);

    return typeof property === schema.type;
  });

  return matched ?? type_union[0];
};

const findMatchedSchema = (schema_union: SchemaUnion, properties: Record<string, unknown>) => {
  let best_match = schema_union[0];
  let max_score = -1;

  for (const schema_record of schema_union) {
    let score = 0;

    for (const key of Object.keys(schema_record)) {
      const property = properties[key];
      const schema_def = schema_record[key];
      const target_type = Array.isArray(schema_def) ? findMatchedType(schema_def, property) : schema_def;

      if (property === null) {
        if (target_type.nullable) {
          score++;
        } else score -= 2;
      } else if (property !== undefined) {
        if ((target_type.type === 'string' && typeof property === 'string') || (target_type.type === 'number' && typeof property === 'number') || (target_type.type === 'boolean' && typeof property === 'boolean') || (target_type.type === 'object' && typeof property === 'object' && !Array.isArray(property)) || (target_type.type === 'array' && Array.isArray(property))) {
          score++;
        } else score -= 2;
      } else if (target_type.required && target_type.default === undefined) score -= 1;
    }

    if (score > max_score) {
      max_score = score;
      best_match = schema_record;
    }
  }

  return best_match;
};

export const validate = async <const _Schema extends Schema>(schema: _Schema, properties: Record<string, unknown>, options: YuppiOptions): Promise<InferSchema<_Schema>> => {
  if (Array.isArray(schema)) {
    const schema_union = schema as Record<string, Type>[];

    let last_error = new Error();

    for (const schema_single of schema_union) {
      try {
        const valid_properties = await validate(schema_single as unknown as _Schema, properties, options);

        return valid_properties;
      } catch (error) {
        last_error = error instanceof Error ? error : new Error(String(error));
      }
    }

    throw last_error;
  }

  const collected_errors: { message: string; parts: Record<string, string> }[] = [];

  const reportError = (error: { message: string; parts: Record<string, string> }) => {
    if (options.validation?.abort_early === false) {
      collected_errors.push(error);
    } else throw new ValidationError({ errors: [error] });
  };

  const processProperty = async (equivalent: TypeSingle, property: unknown, path: string): Promise<unknown> => {
    if (property === undefined) {
      if (equivalent.default !== undefined) {
        return equivalent.default;
      } else if (equivalent.required) {
        reportError({ message: (options.error_messages?.base?.required ?? '').replaceAll('{path}', path), parts: { path } });

        return;
      }

      return;
    }

    if (property === null) {
      if (!equivalent.nullable && equivalent.default !== null) reportError({ message: (options.error_messages?.base?.nullable ?? '').replaceAll('{path}', path), parts: { path } });

      return property;
    }

    if (equivalent.type === 'string') {
      if (typeof property !== 'string') {
        reportError({ message: (options.error_messages?.string?.type ?? '').replaceAll('{path}', path), parts: { path } });

        return property;
      }

      let value = property;

      if (equivalent.trim !== false) value = value.trim();

      if (equivalent.lowercase === true) value = value.toLowerCase();

      if (equivalent.uppercase === true) value = value.toUpperCase();

      if (equivalent.enum !== undefined) {
        const passed = equivalent.enum.some((item) => {
          let parsed = item;
          if (equivalent.trim !== false) parsed = parsed.trim();
          if (equivalent.lowercase === true) parsed = parsed.toLowerCase();
          if (equivalent.uppercase === true) parsed = parsed.toUpperCase();
          return parsed === value;
        });

        if (!passed) reportError({ message: (options.error_messages?.string?.enum ?? '').replaceAll('{path}', path), parts: { path } });
      }

      if (equivalent.pattern !== undefined) {
        const regex = getRegex(equivalent.pattern);

        if (!regex.test(value)) reportError({ message: (options.error_messages?.string?.pattern ?? '').replaceAll('{path}', path).replaceAll('{pattern}', equivalent.pattern), parts: { path, pattern: equivalent.pattern } });
      }

      if (equivalent.min !== undefined && value.length < equivalent.min) {
        const part_min = String(equivalent.min);
        const plural_suffix = equivalent.min > 1 ? 's' : '';

        reportError({ message: (options.error_messages?.string?.min ?? '').replaceAll('{path}', path).replaceAll('{min}', part_min).replaceAll('{plural_suffix}', plural_suffix), parts: { path, min: part_min, plural_suffix } });
      }

      if (equivalent.max !== undefined && value.length > equivalent.max) {
        const part_max = String(equivalent.max);
        const plural_suffix = equivalent.max > 1 ? 's' : '';

        reportError({ message: (options.error_messages?.string?.max ?? '').replaceAll('{path}', path).replaceAll('{max}', part_max).replaceAll('{plural_suffix}', plural_suffix), parts: { path, max: part_max, plural_suffix } });
      }

      return value;
    } else if (equivalent.type === 'number') {
      if (typeof property !== 'number' || !Number.isFinite(property)) {
        reportError({ message: (options.error_messages?.number?.type ?? '').replaceAll('{path}', path), parts: { path } });

        return property;
      }

      if (equivalent.enum !== undefined && !equivalent.enum.includes(property)) reportError({ message: (options.error_messages?.number?.enum ?? '').replaceAll('{path}', path), parts: { path } });

      if (equivalent.min !== undefined && property < equivalent.min) reportError({ message: (options.error_messages?.number?.min ?? '').replaceAll('{path}', path).replaceAll('{min}', String(equivalent.min)), parts: { path, min: String(equivalent.min) } });

      if (equivalent.max !== undefined && property > equivalent.max) reportError({ message: (options.error_messages?.number?.max ?? '').replaceAll('{path}', path).replaceAll('{max}', String(equivalent.max)), parts: { path, max: String(equivalent.max) } });

      if (equivalent.integer === true && !Number.isInteger(property)) reportError({ message: (options.error_messages?.number?.integer ?? '').replaceAll('{path}', path), parts: { path } });

      if (equivalent.positive === true && property < 0) reportError({ message: (options.error_messages?.number?.positive ?? '').replaceAll('{path}', path), parts: { path } });

      if (equivalent.negative === true && property > 0) reportError({ message: (options.error_messages?.number?.negative ?? '').replaceAll('{path}', path), parts: { path } });

      return property;
    } else if (equivalent.type === 'boolean') {
      if (typeof property !== 'boolean') reportError({ message: (options.error_messages?.boolean?.type ?? '').replaceAll('{path}', path), parts: { path } });

      return property;
    } else if (equivalent.type === 'date') {
      if (typeof property !== 'string' && !(property instanceof Date)) {
        reportError({ message: (options.error_messages?.date?.type ?? '').replaceAll('{path}', path), parts: { path } });

        return property;
      }

      const converted = property instanceof Date ? property : new Date(property);

      if (Number.isNaN(converted.getTime())) {
        reportError({ message: (options.error_messages?.date?.type ?? '').replaceAll('{path}', path), parts: { path } });

        return property;
      }

      if (equivalent.min !== undefined) {
        const min_date = new Date(equivalent.min);

        if (converted.getTime() < min_date.getTime()) reportError({ message: (options.error_messages?.date?.min ?? '').replaceAll('{path}', path).replaceAll('{min}', equivalent.min), parts: { path, min: equivalent.min } });
      }

      if (equivalent.max !== undefined) {
        const max_date = new Date(equivalent.max);

        if (converted.getTime() > max_date.getTime()) reportError({ message: (options.error_messages?.date?.max ?? '').replaceAll('{path}', path).replaceAll('{max}', equivalent.max), parts: { path, max: equivalent.max } });
      }

      return converted;
    } else if (equivalent.type === 'object') {
      if (typeof property !== 'object' || Array.isArray(property)) {
        reportError({ message: (options.error_messages?.object?.type ?? '').replaceAll('{path}', path), parts: { path } });

        return property;
      }

      const result_record: Record<string, unknown> = {};
      const property_record = property as Record<string, unknown>;

      let schema_record: SchemaSingle = {};

      if ('properties' in equivalent) schema_record = Array.isArray(equivalent.properties) ? findMatchedSchema(equivalent.properties, property_record) : equivalent.properties;

      for (const key of Object.keys(schema_record)) {
        const schema_property = schema_record[key];
        const target_schema = Array.isArray(schema_property) ? findMatchedType(schema_property, property_record[key]) : schema_property;

        const next_path = path === 'root' ? key : `${path}.${key}`;
        const property_processed = await processProperty(target_schema, property_record[key], next_path);

        if (property_processed !== undefined) result_record[key] = property_processed;
      }

      if (options.validation?.strip_unknown !== true) for (const key of Object.keys(property_record)) if (!(key in schema_record)) result_record[key] = property_record[key];

      return result_record;
    } else {
      if (!Array.isArray(property)) {
        reportError({ message: (options.error_messages?.array?.type ?? '').replaceAll('{path}', path), parts: { path } });

        return property;
      }

      if (equivalent.min !== undefined && property.length < equivalent.min) reportError({ message: (options.error_messages?.array?.min ?? '').replaceAll('{path}', path).replaceAll('{min}', String(equivalent.min)), parts: { path, min: String(equivalent.min) } });

      if (equivalent.max !== undefined && property.length > equivalent.max) reportError({ message: (options.error_messages?.array?.max ?? '').replaceAll('{path}', path).replaceAll('{max}', String(equivalent.max)), parts: { path, max: String(equivalent.max) } });

      const results_array = new Array(property.length);

      for (let i = 0; i < property.length; i++) {
        const target_schema = Array.isArray(equivalent.items) ? findMatchedType(equivalent.items, property[i]) : equivalent.items;

        const base_path = path === 'root' ? '' : path;
        const next_path = `${base_path}[${String(i)}]`;

        results_array[i] = await processProperty(target_schema, property[i], next_path);
      }

      return results_array;
    }
  };

  let result: unknown;

  try {
    if (typeof properties !== 'object' || Array.isArray(properties)) throw new ValidationError({ errors: [{ message: (options.error_messages?.object?.type ?? '').replaceAll('{path}', 'root'), parts: { path: 'root' } }] });

    const result_record: Record<string, unknown> = {};

    const schema_record = schema as Record<string, Type>;

    for (const key of Object.keys(schema_record)) {
      const schema_property = schema_record[key];
      const target_schema = Array.isArray(schema_property) ? findMatchedType(schema_property, properties[key]) : schema_property;

      const property_processed = await processProperty(target_schema, properties[key], key);

      if (property_processed !== undefined) result_record[key] = property_processed;
    }

    if (options.validation?.strip_unknown !== true) for (const key of Object.keys(properties)) if (!(key in schema_record)) result_record[key] = properties[key];

    result = result_record;

    if (collected_errors.length > 0) throw new ValidationError({ errors: collected_errors });

    return result as InferSchema<_Schema>;
  } catch (error) {
    if (error instanceof ValidationError) throw error;

    throw new Error(String(error), { cause: error });
  }
};
