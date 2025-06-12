import * as Yup from "yup";

import type { Schema, Types } from "../types/Schema.type";

export const convertSchema = (schema: Schema): Yup.ObjectSchema<Yup.AnyObject> => {
  const buildSchema = (key: string, config: Types, parent_path: string = ""): Yup.AnyObject => {
    let schema: Yup.AnyObject;
    const field_path: string = parent_path ? `${parent_path}.${key}` : key;

    if (config.type === "string") {
      schema = Yup.string().typeError(`Field ${field_path} must be a string`);

      if (config.min !== undefined) schema = schema.min(config.min, `Field ${field_path} must be at least ${config.min} character${config.min > 1 ? "s" : ""}`);
      if (config.max !== undefined) schema = schema.max(config.max, `Field ${field_path} must be at most ${config.max} character${config.max > 1 ? "s" : ""}`);
    } else if (config.type === "number") {
      schema = Yup.number().typeError(`Field ${field_path} must be a number`);

      if (config.min !== undefined) schema = schema.min(config.min, `Field ${field_path} must be greater than or equal to ${config.min}`);
      if (config.max !== undefined) schema = schema.max(config.max, `Field ${field_path} must be less than or equal to ${config.max}`);
      if (config.integer === true) schema = schema.integer(`Field ${field_path} must be an integer`);
      if (config.positive === true) schema = schema.positive(`Field ${field_path} must be a positive number`);
      if (config.negative === true) schema = schema.negative(`Field ${field_path} must be a negative number`);
    } else if (config.type === "boolean") {
      schema = Yup.boolean().typeError(`Field ${field_path} must be a boolean`);
    } else if (config.type === "date") {
      schema = Yup.date().typeError(`Field ${field_path} must be a date`);

      if (config.min) schema = schema.min(config.min, ({ min }: { min: number }) => `Field ${field_path} must be after ${new Date(min).toISOString()}`);
      if (config.max) schema = schema.max(config.max, ({ max }: { max: number }) => `Field ${field_path} must be before ${new Date(max).toISOString()}`);
    } else if (config.type === "object") {
      schema = Yup.object().typeError(`Field ${field_path} must be an object`);

      if (config.object) {
        const nested_schema: { [key: string]: Yup.AnyObject } = {};
        for (const [nested_key, nested_config] of Object.entries(config.object)) {
          nested_schema[nested_key] = buildSchema(nested_key, nested_config, field_path);
        }
        schema = schema.shape(nested_schema);
      }
    } else if (config.type === "array") {
      schema = Yup.array().typeError(`Field ${field_path} must be an array`);

      if (config.min !== undefined) schema = schema.min(config.min, `Field ${field_path} must be at least ${config.min} item${config.min > 1 ? "s" : ""}`);
      if (config.max !== undefined) schema = schema.max(config.max, `Field ${field_path} must be at most ${config.max} item${config.max > 1 ? "s" : ""}`);
      if (config.array) schema = schema.of(buildSchema(`${key}[]`, config.array));
    } else throw new Error(`Unsupported schema type for key: ${key}`);

    schema = schema.nullable();

    if (config.pattern !== undefined && schema instanceof Yup.StringSchema) schema = schema.matches(config.pattern, `Field ${field_path} must match the required pattern`);

    if (config.default !== undefined) schema = schema.default(config.default);

    if (config.nullable !== true && config.default !== null) schema = schema.test("cannot-be-null", `Field ${field_path} cannot be null`, (value: unknown) => value !== null);

    if (config.required === true) schema = schema.required(`Field ${field_path} is required`);

    return schema;
  };

  const shape: Yup.AnyObject = {};

  for (const [key, config] of Object.entries(schema)) shape[key] = buildSchema(key, config);

  return Yup.object().shape(shape);
};
