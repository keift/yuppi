import * as Yup from "yup";

import type { Schema } from "../types/Schema.type";

export const ConvertSchema = (schema: Schema): Yup.AnyObject => {
  let shape = {};

  for (let [key, config] of Object.entries(schema)) {
    if (config.disabled === true) continue;

    shape[key] = createYupSchema(key, config);
  }

  return Yup.object().shape(shape);
};
