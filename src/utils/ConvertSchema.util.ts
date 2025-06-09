import * as Yup from "yup";

import type { Schema } from "../types/Schema.type";

export const createYupSchema = (schema: Schema): Yup.ObjectSchema<Yup.AnyObject> => {
  const createYupSchemaInternal = (key: string, config: Types, parent_path = ""): Yup.Schema<unknown> => {
    let yupSchema: Yup.Schema<unknown>;
    const field_path = parent_path ? `${parent_path}.${key}` : key;

    if (config.type === "string") {
      yupSchema = Yup.string().typeError(`Field ${field_path} must be a string`);

      if (typeof config.min !== "undefined") {
        yupSchema = (yupSchema as Yup.StringSchema).min(config.min, `Field ${field_path} must be at least ${config.min} character${config.min > 1 ? "s" : ""}`);
      }
      if (typeof config.max !== "undefined") {
        yupSchema = (yupSchema as Yup.StringSchema).max(config.max, `Field ${field_path} must be at most ${config.max} character${config.max > 1 ? "s" : ""}`);
      }
    } else if (config.type === "number") {
      yupSchema = Yup.number().typeError(`Field ${field_path} must be a number`);

      if (typeof config.min !== "undefined") {
        yupSchema = (yupSchema as Yup.NumberSchema).min(config.min, `Field ${field_path} must be greater than or equal to ${config.min}`);
      }
      if (typeof config.max !== "undefined") {
        yupSchema = (yupSchema as Yup.NumberSchema).max(config.max, `Field ${field_path} must be less than or equal to ${config.max}`);
      }
      if ((config as NumberSchemaConfig).integer === true) {
        yupSchema = (yupSchema as Yup.NumberSchema).integer(`Field ${field_path} must be an integer`);
      }
      if ((config as NumberSchemaConfig).positive === true) {
        yupSchema = (yupSchema as Yup.NumberSchema).positive(`Field ${field_path} must be a positive number`);
      }
      if ((config as NumberSchemaConfig).negative === true) {
        yupSchema = (yupSchema as Yup.NumberSchema).negative(`Field ${field_path} must be a negative number`);
      }
    } else if (config.type === "boolean") {
      yupSchema = Yup.boolean().typeError(`Field ${field_path} must be a boolean`);
    } else if (config.type === "object") {
      yupSchema = Yup.object().typeError(`Field ${field_path} must be an object`);

      if ((config as ObjectSchemaConfig).object) {
        const nested_schema: { [key: string]: Yup.Schema<unknown> } = {};
        for (const [nested_key, nested_config] of Object.entries((config as ObjectSchemaConfig).object)) {
          nested_schema[nested_key] = createYupSchemaInternal(nested_key, nested_config, field_path);
        }
        yupSchema = (yupSchema as Yup.ObjectSchema<Yup.AnyObject>).shape(nested_schema);
      }
    } else if (config.type === "array") {
      yupSchema = Yup.array().typeError(`Field ${field_path} must be an array`);

      if (typeof config.min !== "undefined") {
        yupSchema = (yupSchema as Yup.ArraySchema<unknown>).min(config.min, `Field ${field_path} must be at least ${config.min} item${config.min > 1 ? "s" : ""}`);
      }
      if (typeof config.max !== "undefined") {
        yupSchema = (yupSchema as Yup.ArraySchema<unknown>).max(config.max, `Field ${field_path} must be at most ${config.max} item${config.max > 1 ? "s" : ""}`);
      }
      if ((config as ArraySchemaConfig).array) {
        yupSchema = (yupSchema as Yup.ArraySchema<unknown>).of(createYupSchemaInternal(`${key}[]`, (config as ArraySchemaConfig).array));
      }
    } else if (config.type === "date") {
      yupSchema = Yup.date().typeError(`Field ${field_path} must be a date`);

      if ((config as DateSchemaConfig).min) {
        yupSchema = (yupSchema as Yup.DateSchema).min((config as DateSchemaConfig).min as Date, ({ min }) => `Field ${field_path} must be after ${new Date(min).toISOString()}`);
      }
      if ((config as DateSchemaConfig).max) {
        yupSchema = (yupSchema as Yup.DateSchema).max((config as DateSchemaConfig).max as Date, ({ max }) => `Field ${field_path} must be before ${new Date(max).toISOString()}`);
      }
    } else {
      yupSchema = Yup.mixed();
    }

    yupSchema = yupSchema.nullable();

    if (typeof config.pattern !== "undefined" && typeof (yupSchema as Yup.StringSchema).matches === "function") {
      yupSchema = (yupSchema as Yup.StringSchema).matches(config.pattern, `Field ${field_path} must match the required pattern`);
    }

    if (typeof config.default !== "undefined") {
      yupSchema = yupSchema.default(config.default);
    }

    if (config.nullable !== true && config.default !== null) {
      yupSchema = yupSchema.test("cannot-be-null", `Field ${field_path} cannot be null`, (value: unknown) => value !== null);
    }

    if (config.required === true) {
      yupSchema = yupSchema.required(`Field ${field_path} is required`);
    }

    return yupSchema;
  };

  const shape: { [key: string]: Yup.Schema<unknown> } = {};

  for (const [key, config] of Object.entries(schema)) shape[key] = createYupSchemaInternal(key, config);

  return Yup.object().shape(shape);
};
