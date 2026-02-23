import { Type as Typebox } from '@sinclair/typebox';

import type { JSONSchema } from '../types/JSONSchema.type';
import type { Schema, SchemaSingle, SchemaUnion, Type, TypeSingle, TypeUnion } from '../types/Schema.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';

export const toJSONSchema = (schema: Schema, options: YuppiOptions) => {
  const buildTypeSingle = (schema: TypeSingle): JSONSchema => {
    if (schema.type === 'string') {
      let json_schema: JSONSchema = Typebox.String({ enum: schema.enum, minLength: schema.min, maxLength: schema.max, pattern: schema.pattern !== undefined ? new RegExp(schema.pattern).source : undefined, trim: schema.trim === false ? false : true, lowercase: schema.lowercase, uppercase: schema.lowercase, default: schema.default });

      if (schema.nullable === true || schema.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (schema.required === false) {
        json_schema = Typebox.Optional(json_schema);
      } else json_schema = Typebox.Required(json_schema);

      return json_schema;
    } else if (schema.type === 'number') {
      let minimum = schema.min;
      let exclusive_maximum;

      if (schema.positive === true && schema.min === undefined) minimum = 0;

      if (schema.negative === true && schema.max === undefined) exclusive_maximum = 0;

      let json_schema: JSONSchema = schema.integer === true ? Typebox.Integer({ enum: schema.enum, minimum, maximum: schema.max, exclusiveMaximum: exclusive_maximum, default: schema.default }) : Typebox.Number({ enum: schema.enum, minimum, maximum: schema.max, exclusiveMaximum: exclusive_maximum, default: schema.default });

      if (schema.nullable === true || schema.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (schema.required === false) {
        json_schema = Typebox.Optional(json_schema);
      } else json_schema = Typebox.Required(json_schema);

      return json_schema;
    } else if (schema.type === 'boolean') {
      let json_schema: JSONSchema = Typebox.Boolean({ default: schema.default });

      if (schema.nullable === true || schema.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (schema.required === false) {
        json_schema = Typebox.Optional(json_schema);
      } else json_schema = Typebox.Required(json_schema);

      return json_schema;
    } else if (schema.type === 'date') {
      let json_schema: JSONSchema = Typebox.String({ format: 'date-time', formatMinimum: schema.min !== undefined ? new Date(schema.min).toISOString() : undefined, formatMaximum: schema.max !== undefined ? new Date(schema.max).toISOString() : undefined, default: schema.default });

      if (schema.nullable === true || schema.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (schema.required === false) {
        json_schema = Typebox.Optional(json_schema);
      } else json_schema = Typebox.Required(json_schema);

      return json_schema;
    } else if (schema.type === 'object') {
      let json_schema: JSONSchema;

      if (Array.isArray(schema.properties)) {
        const schemas = schema.properties.map((schema) => {
          const nested_properties: Record<string, JSONSchema> = {};

          for (const [nested_key, nested_schema] of Object.entries(schema)) nested_properties[nested_key] = buildType(nested_schema);

          return Typebox.Object(nested_properties, { additionalProperties: !(options.validation?.strip_unknown ?? false) });
        });

        json_schema = Typebox.Union(schemas, { default: schema.default });
      } else {
        const nested_properties: Record<string, JSONSchema> = {};

        for (const [nested_key, nested_schema] of Object.entries(schema.properties)) nested_properties[nested_key] = buildType(nested_schema);

        json_schema = Typebox.Object(nested_properties, { default: schema.default, additionalProperties: !(options.validation?.strip_unknown ?? false) });
      }

      if (schema.nullable === true || schema.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (schema.required === false) {
        json_schema = Typebox.Optional(json_schema);
      } else json_schema = Typebox.Required(json_schema);

      return json_schema;
    } else if (schema.type === 'array') {
      let json_schema: JSONSchema = Typebox.Array(buildType(schema.items), { minItems: schema.min, maxItems: schema.max, default: schema.default });

      if (schema.nullable === true || schema.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (schema.required === false) {
        json_schema = Typebox.Optional(json_schema);
      } else json_schema = Typebox.Required(json_schema);

      return json_schema;
    } else {
      let json_schema: JSONSchema = Typebox.Tuple(
        schema.items.map((item) => buildType(item)),
        { default: schema.default }
      );

      if (schema.nullable === true || schema.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (schema.required === false) {
        json_schema = Typebox.Optional(json_schema);
      } else json_schema = Typebox.Required(json_schema);

      return json_schema;
    }
  };

  const buildTypeUnion = (type: TypeUnion) => {
    const schemas = type.map((type) => buildTypeSingle(type));

    const optional = type.every((type) => type.required === false);

    const union_schema = Typebox.Union(schemas);

    return optional ? Typebox.Optional(union_schema) : Typebox.Required(union_schema);
  };

  const buildType = (type: Type) => {
    if (Array.isArray(type)) {
      return buildTypeUnion(type);
    } else return buildTypeSingle(type);
  };

  const buildSchemaSingle = (schema: SchemaSingle) => {
    const properties: Record<string, JSONSchema> = {};

    for (const [key, type] of Object.entries(schema)) properties[key] = buildType(type);

    return Typebox.Object(properties, { additionalProperties: !(options.validation?.strip_unknown ?? false) });
  };

  const buildSchemaUnion = (schema: SchemaUnion) => {
    const schemas = schema.map((schema) => buildSchemaSingle(schema));

    return Typebox.Union(schemas);
  };

  const buildSchema = (schema: Schema) => {
    if (Array.isArray(schema)) {
      return buildSchemaUnion(schema);
    } else return buildSchemaSingle(schema);
  };

  return buildSchema(schema);
};
