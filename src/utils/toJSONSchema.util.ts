import { Type as Typebox } from '@sinclair/typebox';

import type { JSONSchema } from '../types/JSONSchema.type';
import type { Schema, SchemaSingle, SchemaUnion, Type, TypeSingle, TypeUnion } from '../types/Schema.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';

export const toJSONSchema = (schema: Schema, options: YuppiOptions) => {
  const buildTypeSingle = (type: TypeSingle): JSONSchema => {
    if (type.type === 'string') {
      let json_schema: JSONSchema = Typebox.String({ enum: type.enum, minLength: type.minimum, maxLength: type.maximum, pattern: type.pattern !== undefined ? new RegExp(type.pattern).source : undefined, trim: type.trim === false ? false : true, lowercase: type.lowercase, uppercase: type.uppercase, default: type.default });

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else if (type.type === 'number') {
      const minimum = type.minimum;
      const maximum = type.maximum;

      let exclusive_minimum;
      let exclusive_maximum;

      if (type.positive === true && type.minimum === undefined) exclusive_minimum = 0;

      if (type.negative === true && type.maximum === undefined) exclusive_maximum = 0;

      const number_options = {
        enum: type.enum,
        minimum,
        exclusiveMinimum: exclusive_minimum,
        maximum,
        exclusiveMaximum: exclusive_maximum,
        default: type.default
      };

      let json_schema: JSONSchema = type.integer === true ? Typebox.Integer(number_options) : Typebox.Number(number_options);

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else if (type.type === 'boolean') {
      let json_schema: JSONSchema = Typebox.Boolean({ default: type.default });

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else if (type.type === 'date') {
      let json_schema: JSONSchema = Typebox.String({ format: 'date-time', formatMinimum: type.minimum !== undefined ? new Date(type.minimum).toISOString() : undefined, formatMaximum: type.maximum !== undefined ? new Date(type.maximum).toISOString() : undefined, default: type.default });

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else if (type.type === 'object') {
      let json_schema: JSONSchema = buildSchema(type.properties);

      if (type.default !== undefined) json_schema = { ...json_schema, default: type.default };

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else if (type.type === 'array') {
      let json_schema: JSONSchema = Typebox.Array(buildType(type.items), { minItems: type.minimum, maxItems: type.maximum, default: type.default });

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
