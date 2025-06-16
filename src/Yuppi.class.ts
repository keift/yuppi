import _ from "lodash";

import { convertToYup } from "./utils/ConvertToYup.util";
import { convertToJSONSchema } from "./utils/ConvertToJSONSchema.util";

import type { AnyObject } from "./types/AnyObject.type";
import type { JSONSchema } from "./types/JSONSchema.type";
import type { Schema } from "./types/Schema.type";
import type { YuppiOptions } from "./types/YuppiOptions.type";

const YuppiOptionsDefault: YuppiOptions = {
  error_messages: {
    base: {
      pattern: "Field {path} must match the required pattern",
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

export class Yuppi {
  private readonly options: YuppiOptions;

  public constructor(options: YuppiOptions = YuppiOptionsDefault) {
    this.options = _.merge({}, YuppiOptionsDefault, options);
  }

  public async validate(schema: Schema, fields: Record<string, unknown>): Promise<Record<string, unknown>> {
    const yup_schema: AnyObject = convertToYup(schema, this.options.error_messages);
    const validation: Record<string, unknown> = await yup_schema.validate(fields, this.options.validate_options);

    return validation;
  }

  public convertToYup(schema: Schema): AnyObject {
    return convertToYup(schema, this.options.error_messages);
  }

  public convertToJSONSchema(schema: Schema): JSONSchema {
    return convertToJSONSchema(schema);
  }
}
