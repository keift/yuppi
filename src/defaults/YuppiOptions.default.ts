import type { YuppiOptions } from "../types/YuppiOptions.type";

export const YuppiOptionsDefault: YuppiOptions = {
  error_messages: {
    base: {
      pattern: "Field {path} must match the required pattern {pattern}",
      nullable: "Field {path} cannot be null",
      required: "Field {path} is required"
    },

    string: {
      type: "Field {path} must be a string",
      min: "Field {path} must be at least {min} character{plural_suffix}",
      max: "Field {path} must be at most {max} character{plural_suffix}"
    },

    number: {
      type: "Field {path} must be a number",
      min: "Field {path} must be greater than or equal to {min}",
      max: "Field {path} must be less than or equal to {max}",
      integer: "Field {path} must be an integer",
      positive: "Field {path} must be a positive number",
      negative: "Field {path} must be a negative number"
    },

    boolean: {
      type: "Field {path} must be a boolean"
    },

    date: {
      type: "Field {path} must be a date",
      min: "Field {path} must be after {min}",
      max: "Field {path} must be before {max}"
    },

    object: {
      type: "Field {path} must be an object"
    },

    array: {
      type: "Field {path} must be an array",
      min: "Field {path} must be at least {min} item${plural_suffix}",
      max: "Field {path} must be at most {max} item${plural_suffix}"
    }
  },

  validate_options: {
    abortEarly: false,
    stripUnknown: true
  }
};
