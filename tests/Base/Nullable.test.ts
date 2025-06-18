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

Yupp.validate(correct_schema, properties)
  .then(() => {
    console.log("✅ Success 1/2");
  })
  .catch((error: YuppiTypes.ValidationError) => {
    console.log(error);
    throw new Error("❌ Error 1/2");
  });

Yupp.validate(faulty_schema, properties)
  .then(() => {
    throw new Error("❌ Error 2/2");
  })
  .catch((error: YuppiTypes.ValidationError) => {
    if (error.name === "ValidationError") {
      console.log("✅ Success 2/2");
    } else throw new Error("❌ Error 2/2");
  });
