import * as Yup from "yup";

import type { AnyObject } from "../types/AnyObject.type";
import type { Schema, Types } from "../types/Schema.type";
import type { YuppiOptions } from "../types/YuppiOptions.type";

export const convertToYup = (schema: Schema, error_messages: YuppiOptions["error_messages"]): AnyObject => {
  const base = (schema: AnyObject, key: string, config: Types): AnyObject => {
    schema = schema.nullable();

    if (config.required)
      schema = schema.test(
        "required",
        ({ path }: { path: string }) => (error_messages?.base?.required ?? "").split("{path}").join(path),
        (property: unknown) => {
          if (property === undefined) return false;
          if (typeof property === "string" && property.trim() === "") return false;
          if (Array.isArray(property) && property.length === 0) return false;

          return true;
        }
      );

    if (!config.nullable && config.default !== null) schema = schema.nonNullable(({ path }: { path: string }) => (error_messages?.base?.nullable ?? "").split("{path}").join(path));

    if (config.default !== undefined) schema = schema.default(config.default);

    if (config.pattern !== undefined && schema.matches !== undefined)
      schema = schema.matches(new RegExp(config.pattern ?? "[\\s\\S]*"), ({ path }: { path: string }) =>
        (error_messages?.base?.pattern ?? "")
          .split("{path}")
          .join(path)
          .split("{pattern}")
          .join(new RegExp(config.pattern ?? "[\\s\\S]*").source)
      );

    return schema;
  };

  const build = (key: string, config: Types): AnyObject => {
    let schema: AnyObject;

    if (config.type === "string") {
      schema = Yup.string().typeError(({ path }: { path: string }) => (error_messages?.string?.type ?? "").split("{path}").join(path));
      schema = base(schema, key, config);

      schema = schema.transform((property: unknown) => (typeof property === "string" ? property.trim() : property));

      if (config.min !== undefined)
        schema = schema.min(config.min, ({ path, min }: { path: string; min: number }) =>
          (error_messages?.string?.min ?? "")
            .split("{path}")
            .join(path)
            .split("{min}")
            .join(min.toString())
            .split("{plural_suffix}")
            .join(min > 1 ? "s" : "")
        );

      if (config.max !== undefined)
        schema = schema.max(config.max, ({ path, max }: { path: string; max: number }) =>
          (error_messages?.string?.max ?? "")
            .split("{path}")
            .join(path)
            .split("{max}")
            .join(max.toString())
            .split("{plural_suffix}")
            .join(max > 1 ? "s" : "")
        );

      if (config.lowercase === true) schema = schema.transform((property: unknown) => (typeof property === "string" ? property.toLowerCase() : property));

      if (config.uppercase === true) schema = schema.transform((property: unknown) => (typeof property === "string" ? property.toUpperCase() : property));

      return schema;
    } else if (config.type === "number") {
      schema = Yup.number().typeError(({ path }: { path: string }) => (error_messages?.number?.type ?? "").split("{path}").join(path));
      schema = base(schema, key, config);

      if (config.min !== undefined) schema = schema.min(config.min, ({ path, min }: { path: string; min: number }) => (error_messages?.number?.min ?? "").split("{path}").join(path).split("{min}").join(min.toString()));

      if (config.max !== undefined) schema = schema.max(config.max, ({ path, max }: { path: string; max: number }) => (error_messages?.number?.max ?? "").split("{path}").join(path).split("{max}").join(max.toString()));

      if (config.integer === true) schema = schema.integer(({ path }: { path: string }) => (error_messages?.number?.integer ?? "").split("{path}").join(path));

      if (config.positive === true) schema = schema.positive(({ path }: { path: string }) => (error_messages?.number?.positive ?? "").split("{path}").join(path));

      if (config.negative === true) schema = schema.negative(({ path }: { path: string }) => (error_messages?.number?.negative ?? "").split("{path}").join(path));

      return schema;
    } else if (config.type === "boolean") {
      schema = Yup.boolean().typeError(({ path }: { path: string }) => (error_messages?.boolean?.type ?? "").split("{path}").join(path));
      schema = base(schema, key, config);

      return schema;
    } else if (config.type === "date") {
      schema = Yup.date().typeError(({ path }: { path: string }) => (error_messages?.date?.type ?? "").split("{path}").join(path));
      schema = base(schema, key, config);

      if (config.min !== undefined) schema = schema.min(config.min, ({ path, min }: { path: string; min: number }) => (error_messages?.date?.min ?? "").split("{path}").join(path).split("{min}").join(new Date(min).toISOString()));

      if (config.max !== undefined) schema = schema.max(config.max, ({ path, max }: { path: string; max: number }) => (error_messages?.date?.max ?? "").split("{path}").join(path).split("{max}").join(new Date(max).toISOString()));

      return schema;
    } else if (config.type === "object") {
      schema = Yup.object().typeError(({ path }: { path: string }) => (error_messages?.object?.type ?? "").split("{path}").join(path));
      schema = base(schema, key, config);

      const nested_properties: AnyObject = {};

      for (const [nested_key, nested_config] of Object.entries(config.properties)) nested_properties[nested_key] = build(nested_key, nested_config);

      schema = schema.shape(nested_properties);

      return schema;
    } else if (config.type === "array") {
      schema = Yup.array().typeError(({ path }: { path: string }) => (error_messages?.array?.type ?? "").split("{path}").join(path));
      schema = base(schema, key, config);

      if (config.min !== undefined)
        schema = schema.min(config.min, ({ path, min }: { path: string; min: number }) =>
          (error_messages?.array?.min ?? "")
            .split("{path}")
            .join(path)
            .split("{min}")
            .join(min.toString())
            .split("{plural_suffix}")
            .join(min > 1 ? "s" : "")
        );

      if (config.max !== undefined)
        schema = schema.max(config.max, ({ path, max }: { path: string; max: number }) =>
          (error_messages?.array?.max ?? "")
            .split("{path}")
            .join(path)
            .split("{max}")
            .join(max.toString())
            .split("{plural_suffix}")
            .join(max > 1 ? "s" : "")
        );

      schema = schema.of(build(key, config.items));

      return schema;
    } else throw new Error(`Unsupported schema type for ${key}`);
  };

  const properties: AnyObject = {};

  for (const [key, config] of Object.entries(schema)) properties[key] = build(key, config);

  return Yup.object().shape(properties);
};
