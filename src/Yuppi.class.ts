import _ from "lodash";

import { convertToYup } from "./utils/ConvertToYup.util";

import type { AnyObject } from "./types/AnyObject.type";
import type { Schema } from "./types/Schema.type";
import type { YuppiOptions } from "./types/YuppiOptions.type";

const YuppiOptionsDefault: YuppiOptions = {
  error_messages: {
    base: {
      pattern: "Field {field} must match the required pattern",
      nullable: "Field {field} cannot be null",
      required: "Field {field} is required"
    },
    string: {
      type: "Field {field} must be a string",
      min: "Field {field} must be at least {min} character{plural_suffix}",
      max: "Field {field} must be at most {max} character{plural_suffix}"
    },
    number: {
      type: "Field {field} must be a number",
      min: "Field {field} must be greater than or equal to {min}",
      max: "Field {field} must be less than or equal to {max}",
      integer: "Field {field} must be an integer",
      positive: "Field {field} must be a positive number",
      negative: "Field {field} must be a negative number"
    },
    boolean: {
      type: "Field {field} must be a boolean"
    },
    date: {
      type: "Field {field} must be a date",
      min: "Field {field} must be after {min}",
      max: "Field {field} must be before {max}"
    },
    object: {
      type: "Field {field} must be an object"
    },
    array: {
      type: "Field {field} must be an array",
      min: "Field {field} must be at least {min} item${plural_suffix}",
      max: "Field {field} must be at most {max} item${plural_suffix}"
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

  public convert(schema: Schema): AnyObject {
    return convertToYup(schema, this.options.error_messages);
  }
}
