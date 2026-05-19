import { Type as Typebox } from '@sinclair/typebox';

import type { JSONSchema } from '../types/json_schema';
import type { Schema, SchemaSingle, SchemaUnion, Type, TypeSingle, TypeUnion } from '../types/schema';

export const json_schema = (schema: Schema) => {
  const build_type_single = (type: TypeSingle): JSONSchema => {
    if (type.type === 'string') {
      let json_schema: JSONSchema = Typebox.String({
        enum: type.enum,
        pattern: type.pattern !== undefined ? new RegExp(type.pattern).source : undefined,
        minLength: type.min,
        maxLength: type.max,
        default: type.default,
        trim: type.trim === false ? false : true,
        lowercase: type.lowercase,
        uppercase: type.uppercase
      });

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else if (type.type === 'number') {
      const number_options = {
        enum: type.enum,
        minimum: type.min,
        maximum: type.max,
        default: type.default
      };

      let json_schema: JSONSchema = type.integer === true ? Typebox.Integer(number_options) : Typebox.Number(number_options);

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else if (type.type === 'boolean') {
      let json_schema: JSONSchema = Typebox.Boolean({
        default: type.default
      });

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else if (type.type === 'date') {
      let json_schema: JSONSchema = Typebox.String({
        format: 'date-time',
        formatMinimum: type.min !== undefined ? new Date(type.min).toISOString() : undefined,
        formatMaximum: type.max !== undefined ? new Date(type.max).toISOString() : undefined,
        default: type.default
      });

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else if (type.type === 'object') {
      let json_schema: JSONSchema = build_schema(type.properties);

      if (type.default !== undefined) json_schema = { ...json_schema, default: type.default };

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else if (type.type === 'array') {
      let json_schema: JSONSchema = Typebox.Array(build_type(type.items), {
        minItems: type.min,
        maxItems: type.max,
        default: type.default
      });

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    } else {
      let json_schema: JSONSchema = Typebox.Tuple(
        type.items.map((item) => build_type(item)),
        {
          default: type.default
        }
      );

      if (type.nullable === true || type.default === null) json_schema = Typebox.Union([json_schema, Typebox.Null()]);

      if (type.required === false) json_schema = Typebox.Optional(json_schema);

      return json_schema;
    }
  };

  const build_type_union = (types: TypeUnion) => {
    const schemas = types.map((type) => build_type_single(type));

    const optional = types.every((type) => type.required === false);

    const union_schema = Typebox.Union(schemas);

    return optional ? Typebox.Optional(union_schema) : union_schema;
  };

  const build_type = (type: Type) => {
    if (Array.isArray(type)) {
      return build_type_union(type);
    } else return build_type_single(type);
  };

  const build_schema_single = (schema: SchemaSingle) => {
    const properties: Record<string, JSONSchema> = {};

    for (const [key, type] of Object.entries(schema)) properties[key] = build_type(type);

    return Typebox.Object(properties, { additionalProperties: false });
  };

  const build_schema_union = (schemas: SchemaUnion) => {
    const mapped_schemas = schemas.map((schema) => build_schema_single(schema));

    return Typebox.Union(mapped_schemas);
  };

  const build_schema = (schema: Schema) => {
    if (Array.isArray(schema)) {
      if (schema.length > 0 && typeof (schema[0] as TypeSingle).type === 'string') return build_type_union(schema as TypeUnion);

      return build_schema_union(schema as SchemaUnion);
    } else {
      if (typeof (schema as TypeSingle).type === 'string') return build_type_single(schema as TypeSingle);

      return build_schema_single(schema as SchemaSingle);
    }
  };

  return build_schema(schema);
};
