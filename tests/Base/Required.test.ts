import { Yuppi, type Types as YuppiTypes } from "../../src/main";

const Yupp: Yuppi = new Yuppi();

const schema: YuppiTypes.Schema = {
  field: {
    type: "string",
    nullable: false,
    required: true
  }
};

const correct_properties: YuppiTypes.AnyObject = {
  field: "test"
};

const faulty_properties: YuppiTypes.AnyObject = {};

try {
  Yupp.validate(schema, correct_properties);

  console.log("✅ Success 1/2");
} catch {
  throw new Error("❌ Error 1/2");
}

try {
  Yupp.validate(schema, faulty_properties);

  throw new Error("❌ Error 2/2");
} catch (error: unknown) {
  if ((error as YuppiTypes.ValidationError).name === "ValidationError") {
    console.log("✅ Success 2/2");
  } else throw new Error("❌ Error 2/2");
}
