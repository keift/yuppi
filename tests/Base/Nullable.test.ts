import { Yuppi, type Types as YuppiTypes } from "../../src/main";

const Yupp: Yuppi = new Yuppi();

const correct_schema: YuppiTypes.Schema = {
  field: {
    type: "string",
    nullable: true,
    required: true
  }
};

const faulty_schema: YuppiTypes.Schema = {
  field: {
    type: "string",
    nullable: false,
    required: true
  }
};

const properties: YuppiTypes.AnyObject = {
  field: null
};

try {
  Yupp.validate(correct_schema, properties);

  console.log("✅ Success 1/2");
} catch {
  throw new Error("❌ Error 1/2");
}

try {
  Yupp.validate(faulty_schema, properties);

  throw new Error("❌ Error 2/2");
} catch (error: unknown) {
  if ((error as YuppiTypes.ValidationError).name === "ValidationError") {
    console.log("✅ Success 2/2");
  } else throw new Error("❌ Error 2/2");
}
