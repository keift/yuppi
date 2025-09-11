/* eslint-disable @typescript-eslint/explicit-function-return-type */

import _ from "lodash";

import { convertToYup } from "./utils/ConvertToYup.util";
import { convertToJSONSchema } from "./utils/ConvertToJSONSchema.util";

import { YuppiOptionsDefault } from "./defaults/YuppiOptions.default";

import type { AnyObject } from "./types/AnyObject.type";
import type { JSONSchema } from "./types/JSONSchema.type";
import type { Schema } from "./types/Schema.type";
import type { YuppiOptions } from "./types/YuppiOptions.type";

export class Yuppi {
  private readonly options: YuppiOptions;

  public constructor(options: YuppiOptions = YuppiOptionsDefault) {
    this.options = _.merge({}, YuppiOptionsDefault, options);
  }

  public validate(schema: Schema, properties: AnyObject) {
    const yup_schema = convertToYup(schema, this.options.error_messages);
    const validation = yup_schema.validateSync(properties, this.options.validate_options);

    return validation;
  }

  public convertToYup(schema: Schema) {
    return convertToYup(schema, this.options.error_messages);
  }

  public convertToJSONSchema(schema: Schema): JSONSchema {
    return convertToJSONSchema(schema);
  }
}
