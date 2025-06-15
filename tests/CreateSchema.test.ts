import { Yuppi, type Types as YuppiTypes } from "../src/main";

import type * as Yup from "yup";

const Yupp: Yuppi = new Yuppi();

const yuppi_schema: YuppiTypes.Schema = {
  username: {
    type: "boolean",
    nullable: false,
    required: true
  }
};

const example_fields: { username: number } = {
  username: 5
};

const validation: Yup.AnyObject = await Yupp.validate(yuppi_schema, example_fields);

console.log(validation);
