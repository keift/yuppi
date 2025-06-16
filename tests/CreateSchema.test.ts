import { Yuppi, type Types as YuppiTypes } from "../src/main";

const Yupp: Yuppi = new Yuppi();

const yuppi_schema: YuppiTypes.Schema = {
  users: {
    type: "array",
    items: {
      type: "object",
      properties: {
        email: {
          type: "string",
          pattern: /^[\w-\.]+@[\w-]+\.[a-z]{2,}$/i,
          nullable: false,
          required: true
        }
      },
      nullable: false,
      required: true
    },
    nullable: false,
    required: true
  }
};

const fields: YuppiTypes.AnyObject = {
  users: [
    {
      email: "fir4tozden@gmail.com"
    }
  ]
};

const validation: YuppiTypes.AnyObject = await Yupp.validate(yuppi_schema, fields);
const typebox_schema: YuppiTypes.JSONSchema = Yupp.convertToJSONSchema(yuppi_schema);

console.log(JSON.stringify(validation));
console.log(JSON.stringify(typebox_schema, null, 2));
