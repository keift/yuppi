import { Yuppi, type Types as YuppiTypes } from "../src/main";

const Yupp: Yuppi = new Yuppi();

const schema: YuppiTypes.Schema = {
  display_name: {
    type: "string",
    min: 1,
    max: 32,
    nullable: false,
    required: true
  },

  username: {
    type: "string",
    min: 3,
    max: 16,
    pattern: /^(?=.*[a-zA-Z])[a-zA-Z0-9][a-zA-Z0-9_]*$/,
    nullable: false,
    required: true
  },

  email: {
    type: "string",
    pattern: /^[\w-\.]+@[\w-]+\.[a-z]{2,}$/i,
    nullable: false,
    required: true
  }
};

const fields: YuppiTypes.AnyObject = {
  display_name: "Fırat",
  username: "fir4tozden",
  email: "fir4tozden@!gmail.com"
};

Yupp.validate(schema, fields)
  .then((fields: YuppiTypes.AnyObject) => {
    console.log(JSON.stringify(fields));
  })
  .catch((error: YuppiTypes.ValidationError) => {
    console.log(error.message);
  });

const typebox_schema: YuppiTypes.JSONSchema = Yupp.convertToJSONSchema(schema);

console.log(JSON.stringify(typebox_schema, null, 2));
