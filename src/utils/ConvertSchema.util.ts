import * as Yup from "yup";

import type { }

export const ConvertSchema = schema => {
  let createYupSchema = (key, config, parent_path = "") => {
    let schema;
    let field_path = parent_path ? parent_path + "." + key : key;

    if (config.type === "string") {
      schema = Yup.string().typeError("Field " + field_path + " must be a string");

      if (config.min !== undefined) schema = schema.min(config.min, "Field " + field_path + " must be at least " + config.min + " character" + (config.min > 1 ? "s" : ""));
      if (config.max !== undefined) schema = schema.max(config.max, "Field " + field_path + " must be at most " + config.max + " character" + (config.max > 1 ? "s" : ""));
    } else if (config.type === "number") {
      schema = Yup.number().typeError("Field " + field_path + " must be a number");

      if (config.min !== undefined) schema = schema.min(config.min, "Field " + field_path + " must be greater than or equal to " + config.min);
      if (config.max !== undefined) schema = schema.max(config.max, "Field " + field_path + " must be less than or equal to " + config.max);
      if (config.integer === true) schema = schema.integer("Field " + field_path + " must be a integer");
      if (config.positive === true) schema = schema.positive("Field " + field_path + " must be a positive number");
      if (config.negative === true) schema = schema.negative("Field " + field_path + " must be a negative number");
    } else if (config.type === "boolean") {
      schema = Yup.boolean().typeError("Field " + field_path + " must be a boolean");
    } else if (config.type === "object") {
      schema = Yup.object().typeError("Field " + field_path + " must be an object");

      if (config.object) {
        let nested_schema = {};

        for (let [nested_key, nested_config] of Object.entries(config.object)) nested_schema[nested_key] = createYupSchema(nested_key, nested_config, field_path);

        schema = schema.shape(nested_schema);
      }
    } else if (config.type === "array") {
      schema = Yup.array().typeError("Field " + field_path + " must be an array");

      if (config.min !== undefined) schema = schema.min(config.min, "Field " + field_path + " must be at least " + config.min + " item" + (config.min > 1 ? "s" : ""));
      if (config.max !== undefined) schema = schema.max(config.max, "Field " + field_path + " must be at most " + config.max + " item" + (config.max > 1 ? "s" : ""));
      if (config.array) schema = schema.of(createYupSchema(key + "[]", config.array));
    } else if (config.type === "date") {
      schema = Yup.date().typeError("Field " + field_path + " must be a date");

      if (config.min) schema = schema.min(config.min, ({ min }) => "Field " + field_path + " must be after " + new Date(min).toISOString());
      if (config.max) schema = schema.max(config.max, ({ max }) => "Field " + field_path + " must be before " + new Date(max).toISOString());
    }

    schema = schema.nullable();

    if (config.pattern !== undefined && schema.matches) schema = schema.matches(config.pattern, "Field " + field_path + " must match the required pattern");

    if (config.default !== undefined) schema = schema.default(config.default);

    if (config.nullable !== true && config.default !== null) schema = schema.test("cannot-be-null", "Field " + field_path + " cannot be null", value => value !== null);

    if (config.required === true) schema = schema.required("Field " + field_path + " is required");

    return schema;
  }

  let shape = {};

  for (let [key, config] of Object.entries(schema)) {
    if (config.disabled === true) continue;

    shape[key] = createYupSchema(key, config);
  }

  return Yup.object().shape(shape);
};