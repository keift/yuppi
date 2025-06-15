import { Yuppi, type Types as YuppiTypes } from "../src/main";

import type * as Yup from "yup";

const Yupp: Yuppi = new Yuppi();

const yuppi_schema: YuppiTypes.Schema = {
  users: {
    type: "array",
    array: {
      type: "object",
      object: {
        email: {
          type: "string",
          nullable: true,
          required: true
        }
      },
      nullable: true,
      required: true
    },
    nullable: true,
    required: true
  }
};

const example_fields: Yup.AnyObject = {
  users: [{}]
};

const validation: Yup.AnyObject = await Yupp.validate(yuppi_schema, example_fields);

console.log(validation);
