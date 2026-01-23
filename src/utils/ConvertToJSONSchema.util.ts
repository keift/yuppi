import { Type, type TAnySchema } from '@sinclair/typebox';

import type { Schema, Types } from '../types/Schema.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';

export const convertToJSONSchema = (schema: Schema, options: YuppiOptions) => {
  const base = (schema: TAnySchema, key: string, config: Types) => {
    if (config.nullable || config.default === null) schema = Type.Union([schema, Type.Null()]);

    if (!config.required) schema = Type.Optional(schema);

    return schema;
  };

  const build = (key: string, config: Types) => {
    let schema: TAnySchema;

    if (config.type === 'string') {
      schema = Type.String({ enum: config.enum, minLength: config.min, maxLength: config.max, pattern: config.pattern !== undefined ? new RegExp(config.pattern).source : undefined, default: config.default });

      schema = base(schema, key, config);

      return schema;
    } else if (config.type === 'number') {
      let exclusive_minimum;
      let exclusive_maximum;

      if (config.positive === true && config.min === undefined) exclusive_minimum = 0;

      if (config.negative === true && config.max === undefined) exclusive_maximum = 0;

      schema = config.integer === true ? Type.Integer({ enum: config.enum, minimum: config.min, maximum: config.max, exclusiveMinimum: exclusive_minimum, exclusiveMaximum: exclusive_maximum, positive: config.positive, negative: config.negative, default: config.default }) : Type.Number({ enum: config.enum, minimum: config.min, maximum: config.max, exclusiveMinimum: exclusive_minimum, exclusiveMaximum: exclusive_maximum, positive: config.positive, negative: config.negative, default: config.default });

      schema = base(schema, key, config);

      return schema;
    } else if (config.type === 'boolean') {
      schema = Type.Boolean({ default: config.default });

      schema = base(schema, key, config);

      return schema;
    } else if (config.type === 'date') {
      schema = Type.String({ format: 'date-time', formatMinimum: config.min !== undefined ? new Date(config.min).toISOString() : undefined, formatMaximum: config.max !== undefined ? new Date(config.max).toISOString() : undefined, default: config.default });

      schema = base(schema, key, config);

      return schema;
    } else if (config.type === 'object') {
      const nested_properties: Record<string, TAnySchema> = {};

      for (const [nested_key, nested_config] of Object.entries(config.properties)) nested_properties[nested_key] = build(nested_key, nested_config);

      schema = Type.Object(nested_properties, { default: config.default, additionalProperties: !(options.validate_options?.stripUnknown ?? false) });

      schema = base(schema, key, config);

      return schema;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (config.type === 'array') {
      schema = Type.Array(build(key, config.items), { minItems: config.min, maxItems: config.max, default: config.default });

      schema = base(schema, key, config);

      return schema;
    } else throw new Error(`Unsupported schema type for ${key}`);
  };

  const properties: Record<string, TAnySchema> = {};

  for (const [key, config] of Object.entries(schema)) properties[key] = build(key, config);

  return Type.Object(properties, { additionalProperties: !(options.validate_options?.stripUnknown ?? false) });
};
