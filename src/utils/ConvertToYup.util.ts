import * as Yup from "yup";

import type { AnyObject } from "../types/AnyObject.type";
import type { Schema, Types } from "../types/Schema.type";
import type { YuppiOptions } from "../types/YuppiOptions.type";

export const convertToYup = (schema: Schema, error_messages: YuppiOptions["error_messages"]): AnyObject => {
  const build = (key: string, config: Types, parent_path: string = ""): AnyObject => {
    const field_path: string = parent_path ? `${parent_path}.${key}` : key;
    let schema: AnyObject;

    if (config.type === "string") {
      schema = Yup.string().typeError((error_messages?.string?.type ?? "").split("{field}").join(field_path));

      if (config.min !== undefined)
        schema = schema.min(
          config.min,
          (error_messages?.string?.min ?? "")
            .split("{field}")
            .join(field_path)
            .split("{min}")
            .join(config.min.toString())
            .split("{plural_suffix}")
            .join(config.min > 1 ? "s" : "")
        );
      if (config.max !== undefined)
        schema = schema.max(
          config.max,
          (error_messages?.string?.max ?? "")
            .split("{field}")
            .join(field_path)
            .split("{max}")
            .join(config.max.toString())
            .split("{plural_suffix}")
            .join(config.max > 1 ? "s" : "")
        );
    } else if (config.type === "number") {
      schema = Yup.number().typeError((error_messages?.number?.type ?? "").split("{field}").join(field_path));

      if (config.min !== undefined) schema = schema.min(config.min, (error_messages?.number?.min ?? "").split("{field}").join(field_path).split("{min}").join(config.min.toString()));
      if (config.max !== undefined) schema = schema.max(config.max, (error_messages?.number?.max ?? "").split("{field}").join(field_path).split("{max}").join(config.max.toString()));
      if (config.integer) schema = schema.integer((error_messages?.number?.integer ?? "").split("{field}").join(field_path));
      if (config.positive) schema = schema.positive((error_messages?.number?.positive ?? "").split("{field}").join(field_path));
      if (config.negative) schema = schema.negative((error_messages?.number?.negative ?? "").split("{field}").join(field_path));
    } else if (config.type === "boolean") {
      schema = Yup.boolean().typeError((error_messages?.boolean?.type ?? "").split("{field}").join(field_path));
    } else if (config.type === "date") {
      schema = Yup.date().typeError((error_messages?.date?.type ?? "").split("{field}").join(field_path));

      if (config.min !== undefined) schema = schema.min(config.min, ({ min }: { min: number }) => (error_messages?.date?.min ?? "").split("{field}").join(field_path).split("{min}").join(new Date(min).toISOString()));
      if (config.max !== undefined) schema = schema.max(config.max, ({ max }: { max: number }) => (error_messages?.date?.max ?? "").split("{field}").join(field_path).split("{max}").join(new Date(max).toISOString()));
    } else if (config.type === "object") {
      schema = Yup.object().typeError((error_messages?.object?.type ?? "").split("{field}").join(field_path));

      if (config.object) {
        const nested_schema: { [key: string]: AnyObject } = {};

        for (const [nested_key, nested_config] of Object.entries(config.object)) nested_schema[nested_key] = build(nested_key, nested_config, field_path);

        schema = schema.shape(nested_schema);
      }
    } else if (config.type === "array") {
      schema = Yup.array().typeError((error_messages?.array?.type ?? "").split("{field}").join(field_path));

      if (config.min !== undefined)
        schema = schema.min(
          config.min,
          (error_messages?.array?.min ?? "")
            .split("{field}")
            .join(field_path)
            .split("{min}")
            .join(config.min.toString())
            .split("{plural_suffix}")
            .join(config.min > 1 ? "s" : "")
        );
      if (config.max !== undefined)
        schema = schema.max(
          config.max,
          (error_messages?.array?.max ?? "")
            .split("{field}")
            .join(field_path)
            .split("{max}")
            .join(config.max.toString())
            .split("{plural_suffix}")
            .join(config.max > 1 ? "s" : "")
        );
      if (config.array) schema = schema.of(build(`${key}[]`, config.array));
    } else throw new Error(`Unsupported schema type for key: ${key}`);

    schema = schema.nullable();

    if (config.pattern !== undefined && schema.matches) schema = schema.matches(config.pattern, (error_messages?.base?.pattern ?? "").split("{field}").join(field_path));

    if (config.default !== undefined) schema = schema.default(config.default);

    if (!config.nullable && config.default !== null) schema = schema.test("nullable", (error_messages?.base?.nullable ?? "").split("{field}").join(field_path), (value: unknown) => value !== null);

    if (config.required) schema = schema.required((error_messages?.base?.required ?? "").split("{field}").join(field_path));

    return schema;
  };

  const shape: AnyObject = {};

  for (const [key, config] of Object.entries(schema)) shape[key] = build(key, config);

  return Yup.object().shape(shape);
};
