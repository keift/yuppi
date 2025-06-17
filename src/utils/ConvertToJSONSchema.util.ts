import { Type, type TString, type TNumber, type TInteger, type TBoolean, type TObject, type TArray, type TSchema, type TUnion, type TNull } from "@sinclair/typebox";

import type { AnyObject } from "../types/AnyObject.type";
import type { Schema, Types } from "../types/Schema.type";

export const convertToJSONSchema = (schema: Schema): TObject => {
  const build = (key: string, config: Types): TSchema => {
    if (config.type === "string") {
      let schema: TString | TUnion<[TString, TNull]> = Type.String({ minLength: config.min, maxLength: config.max, pattern: new RegExp(config.pattern ?? "[\\s\\S]*").source, default: config.default });

      if (config.nullable) schema = Type.Union([schema, Type.Null()]);

      return config.required ? schema : Type.Optional(schema);
    } else if (config.type === "number") {
      let schema: TNumber | TInteger | TUnion<[TNumber | TInteger, TNull]> = config.integer === true ? Type.Integer({ minimum: config.min, maximum: config.max, default: config.default }) : Type.Number({ minimum: config.min, maximum: config.max, default: config.default });

      if (config.nullable) schema = Type.Union([schema, Type.Null()]);

      return config.required ? schema : Type.Optional(schema);
    } else if (config.type === "boolean") {
      let schema: TBoolean | TUnion<[TBoolean, TNull]> = Type.Boolean({ default: config.default });

      if (config.nullable) schema = Type.Union([schema, Type.Null()]);

      return config.required ? schema : Type.Optional(schema);
    } else if (config.type === "date") {
      let schema: TString | TUnion<[TString, TNull]> = Type.String({ format: "date-time", minimum: config.min, maximum: config.max, pattern: new RegExp(config.pattern ?? "[\\s\\S]*").source, default: config.default });

      if (config.nullable) schema = Type.Union([schema, Type.Null()]);

      return config.required ? schema : Type.Optional(schema);
    } else if (config.type === "object") {
      const nested_properties: AnyObject = {};

      for (const [nested_key, nested_config] of Object.entries(config.properties)) nested_properties[nested_key] = build(nested_key, nested_config);

      let schema: TObject | TUnion<[TObject, TNull]> = Type.Object(nested_properties);

      if (config.nullable) schema = Type.Union([schema, Type.Null()]);

      return config.required ? schema : Type.Optional(schema);
    } else if (config.type === "array") {
      let schema: TArray | TUnion<[TArray, TNull]> = Type.Array(build(key, config.items), { minItems: config.min, maxItems: config.max, default: config.default });

      if (config.nullable) schema = Type.Union([schema, Type.Null()]);

      return config.required ? schema : Type.Optional(schema);
    } else throw new Error(`Unsupported schema type for ${key}`);
  };

  const properties: AnyObject = {};

  for (const [key, config] of Object.entries(schema)) properties[key] = build(key, config);

  return Type.Object(properties);
};
