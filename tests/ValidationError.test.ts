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

const properties: YuppiTypes.AnyObject = {
  display_name: "Fırat",
  username: "fir4tozden",
  email: "fir4tozden@!gmail.com"
};

Yupp.validate(schema, properties)
  .then(() => {
    throw new Error("❌ [ValidationError]");
  })
  .catch(() => {
    console.log("✅ [ValidationError] Checks successful!");
  });
