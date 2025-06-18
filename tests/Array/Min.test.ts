import { Yuppi, type Types as YuppiTypes } from "../../src/main";

const Yupp: Yuppi = new Yuppi();

const schema: YuppiTypes.Schema = {
  field: {
    type: "array",
    items: {
      type: "string",
      nullable: false,
      required: true
    },
    min: 1,
    nullable: false,
    required: true
  }
};

const correct_properties: YuppiTypes.AnyObject = {
  field: ["test"]
};

const faulty_properties: YuppiTypes.AnyObject = {
  field: []
};

Yupp.validate(schema, correct_properties)
  .then(() => {
    console.log("✅ Success 1/2");
  })
  .catch(() => {
    throw new Error("❌ Error 1/2");
  });

Yupp.validate(schema, faulty_properties)
  .then(() => {
    throw new Error("❌ Error 2/2");
  })
  .catch((error: YuppiTypes.ValidationError) => {
    if (error.name === "ValidationError") {
      console.log("✅ Success 2/2");
    } else throw new Error("❌ Error 2/2");
  });
