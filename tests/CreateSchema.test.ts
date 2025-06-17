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
    pattern: {
      regex: "^(?=.*[a-zA-Z])[a-zA-Z0-9][a-zA-Z0-9_]*$"
    },
    nullable: false,
    required: true
  },

  email: {
    type: "string",
    pattern: {
      regex: "^[\\w-\\.]+@[\\w-]+\\.[a-z]{2,}$",
      flags: "i"
    },
    nullable: false,
    required: true
  }
};

const properties: YuppiTypes.AnyObject = {
  display_name: "Fırat",
  username: "fir4tozden",
  email: "fir4tozden@!gmail.com"
};

Yupp.validate(schema, properties)
  .then((properties: YuppiTypes.AnyObject) => {
    console.log(JSON.stringify(properties));
  })
  .catch((error: YuppiTypes.ValidationError) => {
    console.log(error.message);
  });

const typebox_schema: YuppiTypes.JSONSchema = Yupp.convertToJSONSchema(schema);

console.log(typebox_schema);
