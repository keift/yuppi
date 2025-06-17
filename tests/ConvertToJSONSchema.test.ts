import { Yuppi, Patterns, type Types as YuppiTypes } from "../src/main";

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
    pattern: Patterns.Username,
    nullable: false,
    required: true
  },

  email: {
    type: "string",
    pattern: Patterns.Email,
    lowercase: true,
    nullable: false,
    required: true
  }
};

const conversion: YuppiTypes.JSONSchema = Yupp.convertToJSONSchema(schema);

if (conversion.properties.username.pattern !== Patterns.Username) throw new Error("❌ [ConvertToJSONSchema]");

console.log("✅ [ConvertToJSONSchema] Checks successful!");