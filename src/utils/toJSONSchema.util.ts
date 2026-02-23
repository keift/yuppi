import { Type as Typebox } from '@sinclair/typebox';

import type { JSONSchema } from '../types/JSONSchema.type';
import type { Schema, SchemaSingle, SchemaUnion, Type, TypeSingle, TypeUnion } from '../types/Schema.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';

export const toJSONSchema = (schema: Schema, options: YuppiOptions) => {
  const buildTypeSingle = (type: TypeSingle): JSONSchema => {
    if (type.type === 'string') {
      let json_schema: JSONSchema = Typebox.String({ enum: type.enum, minLength: type.min, maxLength: type.max, pattern: type.pattern !== undefined ? new RegExp(type.pattern).source : undefined, trim: type.trim === false ? false : true, lowercase: type.lowercase, uppercase: type.uppercase, default: type.default });

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else if (type.type === 'number') {
      let minimum = type.min;

      let exclusive_maximum;

      if (type.positive === true && type.min === undefined) minimum = 0;

      if (type.negative === true && type.max === undefined) exclusive_maximum = 0;

      let json_schema: JSONSchema = type.integer === true ? Typebox.Integer({ enum: type.enum, minimum, maximum: type.max, exclusiveMaximum: exclusive_maximum, default: type.default }) : Typebox.Number({ enum: type.enum, minimum, maximum: type.max, exclusiveMaximum: exclusive_maximum, default: type.default });

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else if (type.type === 'boolean') {
      let json_schema: JSONSchema = Typebox.Boolean({ default: type.default });

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else if (type.type === 'date') {
      let json_schema: JSONSchema = Typebox.String({ format: 'date-time', formatMinimum: type.min !== undefined ? new Date(type.min).toISOString() : undefined, formatMaximum: type.max !== undefined ? new Date(type.max).toISOString() : undefined, default: type.default });

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else if (type.type === 'object') {
      let json_schema: JSONSchema;

      if (Array.isArray(type.properties)) {
        const schemas = type.properties.map((schema) => {
          const nested_properties: Record<string, JSONSchema> = {};

          for (const [nested_key, nested_schema] of Object.entries(schema)) nested_properties[nested_key] = buildType(nested_schema);

          return Typebox.Object(nested_properties, { additionalProperties: !(options.validation?.strip_unknown ?? false) });
        });

        json_schema = Typebox.Union(schemas, { default: type.default });
      } else {
        const nested_properties: Record<string, JSONSchema> = {};

        for (const [nested_key, nested_schema] of Object.entries(type.properties)) nested_properties[nested_key] = buildType(nested_schema);

        json_schema = Typebox.Object(nested_properties, { default: type.default, additionalProperties: !(options.validation?.strip_unknown ?? false) });
      }

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else if (type.type === 'array') {
      let json_schema: JSONSchema = Typebox.Array(buildType(type.items), { minItems: type.min, maxItems: type.max, default: type.default });

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else {
      let json_schema: JSONSchema = Typebox.Tuple(
        type.items.map((item) => buildType(item)),

        { default: type.default }
      );

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    }
  };

  const buildTypeUnion = (types: TypeUnion) => {
    const schemas = types.map((type) => buildTypeSingle(type));

    const optional = types.every((type) => type.required === false);

    const union_schema = Typebox.Union(schemas);

    return optional ? Typebox.Optional(union_schema) : union_schema;
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

  const buildSchemaUnion = (schemas: SchemaUnion) => {
    const mapped_schemas = schemas.map((schema) => buildSchemaSingle(schema));

    return Typebox.Union(mapped_schemas);
  };

  const buildSchema = (schema: Schema) => {
    if (Array.isArray(schema)) {
      return buildSchemaUnion(schema);
    } else return buildSchemaSingle(schema);
  };

  return buildSchema(schema);
};
