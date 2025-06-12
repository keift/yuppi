import type * as Yup from "yup";

import { convertToYup } from "./utils/ConvertToYup.util";

import type { Schema } from "./types/Schema.type";

export class Yuppi {
  public constructor() {
    this._ = "blank";
  }

  public create(schema: Schema): Yup.ObjectSchema<Yup.AnyObject> {
    return convertToYup(schema);
  }
}
