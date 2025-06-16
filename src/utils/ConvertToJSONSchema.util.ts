import { Type, type TString, type TNumber, type TInteger, type TBoolean, type TObject, type TArray, type TSchema, type TUnion, type TNull } from "@sinclair/typebox";

import type { AnyObject } from "../types/AnyObject.type";
import type { Schema, Types } from "../types/Schema.type";

export const convertToJSONSchema = (schema: Schema): TObject => {
  const build = (config: Types): TSchema => {
    if (config.type === "string") {
      let schema: TString | TUnion<[TString, TNull]> = Type.String({ minLength: config.min, maxLength: config.max, pattern: (config.pattern ?? /[\s\S]*/).toString(), default: config.default, nullable: config.nullable, required: config.required });

      if (config.nullable) schema = Type.Union([schema, Type.Null()]);

      return config.required ? schema : Type.Optional(schema);
    } else if (config.type === "number") {
      let schema: TNumber | TInteger | TUnion<[TNumber | TInteger, TNull]> = config.integer === true ? Type.Integer({ minimum: config.min, maximum: config.max, default: config.default, nullable: config.nullable, required: config.required }) : Type.Number({ minimum: config.min, maximum: config.max, default: config.default, nullable: config.nullable, required: config.required });

      if (config.nullable) schema = Type.Union([schema, Type.Null()]);

      return config.required ? schema : Type.Optional(schema);
    } else if (config.type === "boolean") {
      let schema: TBoolean | TUnion<[TBoolean, TNull]> = Type.Boolean({ default: config.default, nullable: config.nullable, required: config.required });

      if (config.nullable) schema = Type.Union([schema, Type.Null()]);

      return config.required ? schema : Type.Optional(schema);
    } else if (config.type === "date") {
      let schema: TString | TUnion<[TString, TNull]> = Type.String({ format: "date-time", minimum: config.min, maximum: config.max, pattern: (config.pattern ?? /[\s\S]*/).toString(), default: config.default, nullable: config.nullable, required: config.required });

      if (config.nullable) schema = Type.Union([schema, Type.Null()]);

      return config.required ? schema : Type.Optional(schema);
    } else if (config.type === "object") {
      const nested_props: AnyObject = {};

      for (const [key, value] of Object.entries(config.properties)) nested_props[key] = build(value);

      let schema: TObject | TUnion<[TObject, TNull]> = Type.Object(nested_props);

      if (config.nullable) schema = Type.Union([schema, Type.Null()]);

      return config.required ? schema : Type.Optional(schema);
    } else if (config.type === "array") {
      let schema: TArray | TUnion<[TArray, TNull]> = Type.Array(build(config.items), { minItems: config.min, maxItems: config.max, default: config.default, nullable: config.nullable, required: config.required });

      if (config.nullable) schema = Type.Union([schema, Type.Null()]);

      return config.required ? schema : Type.Optional(schema);
    } else return Type.Any();
  };

  const properties: AnyObject = {};

  for (const [key, config] of Object.entries(schema)) properties[key] = build(config);

  return Type.Object(properties);
};
