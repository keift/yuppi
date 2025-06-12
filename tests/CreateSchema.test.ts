import { Yuppi } from "../src/main";

import type * as Yup from "yup";

const Yupp: Yuppi = new Yuppi();

const yuppi_schema: Yup.ObjectSchema<Yup.AnyObject> = Yupp.create({
  username: {
    type: "string",
    nullable: false,
    required: true
  }
});

const example_fields: { username: number } = {
  username: 1
}

const validation: Yup.AnyObject = await yuppi_schema.validate(example_fields, {abortEarly: false, stripUnknown: true});

console.log(validation);
