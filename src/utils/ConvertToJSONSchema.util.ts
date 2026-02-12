import { Type as Typebox } from '@sinclair/typebox';

import type { JSONSchema } from '../types/JSONSchema.type';
import type { Schema, Types, Type } from '../types/Schema.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';

export const convertToJSONSchema = (schema: Schema, options: YuppiOptions) => {
  const base = (schema: JSONSchema, key: string, config: Type) => {
    if (config.nullable || config.default === null) schema = Typebox.Union([schema, Typebox.Null()]);

    if (!config.required) schema = Typebox.Optional(schema);

    return schema;
  };

  const buildSingle = (key: string, config: Type) => {
    let schema: JSONSchema;

    if (config.type === 'string') {
      schema = Typebox.String({ enum: config.enum, minLength: config.min, maxLength: config.max, pattern: config.pattern !== undefined ? new RegExp(config.pattern).source : undefined, default: config.default });

      schema = base(schema, key, config);

      return schema;
    } else if (config.type === 'number') {
      let exclusive_minimum;
      let exclusive_maximum;

      if (config.positive === true && config.min === undefined) exclusive_minimum = 0;

      if (config.negative === true && config.max === undefined) exclusive_maximum = 0;

      schema = config.integer === true ? Typebox.Integer({ enum: config.enum, minimum: config.min, maximum: config.max, exclusiveMinimum: exclusive_minimum, exclusiveMaximum: exclusive_maximum, positive: config.positive, negative: config.negative, default: config.default }) : Typebox.Number({ enum: config.enum, minimum: config.min, maximum: config.max, exclusiveMinimum: exclusive_minimum, exclusiveMaximum: exclusive_maximum, positive: config.positive, negative: config.negative, default: config.default });

      schema = base(schema, key, config);

      return schema;
    } else if (config.type === 'boolean') {
      schema = Typebox.Boolean({ default: config.default });

      schema = base(schema, key, config);

      return schema;
    } else if (config.type === 'date') {
      schema = Typebox.String({ format: 'date-time', formatMinimum: config.min !== undefined ? new Date(config.min).toISOString() : undefined, formatMaximum: config.max !== undefined ? new Date(config.max).toISOString() : undefined, default: config.default });

      schema = base(schema, key, config);

      return schema;
    } else if (config.type === 'object') {
      const nested_properties: Record<string, JSONSchema> = {};

      for (const [nested_key, nested_config] of Object.entries(config.properties)) nested_properties[nested_key] = build(nested_key, nested_config);

      schema = Typebox.Object(nested_properties, { default: config.default, additionalProperties: !(options.validate_options?.stripUnknown ?? false) });

      schema = base(schema, key, config);

      return schema;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (config.type === 'array') {
      schema = Typebox.Array(build(key, config.items), { minItems: config.min, maxItems: config.max, default: config.default });

      schema = base(schema, key, config);

      return schema;
    } else throw new Error(`Invalid schema type for ${key}`);
  };

  const build = (key: string, config: Types) => {
    if (!Array.isArray(config)) return buildSingle(key, config);

    const schemas = config.map((config) => buildSingle(key, config));

    const optional = config.every((config) => !config.required);

    const union_schema = Typebox.Union(schemas);

    return optional ? Typebox.Optional(union_schema) : union_schema;
  };

  const properties: Record<string, JSONSchema> = {};

  for (const [key, config] of Object.entries(schema)) properties[key] = build(key, config);

  return Typebox.Object(properties, { additionalProperties: !(options.validate_options?.stripUnknown ?? false) });
};
