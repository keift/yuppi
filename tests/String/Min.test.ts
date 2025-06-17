import { Yuppi, type Types as YuppiTypes } from "../../src/main";

const Yupp: Yuppi = new Yuppi();

const schema: YuppiTypes.Schema = {
  field: {
    type: "string",
    nullable: false,
    required: true
  }
};

const properties_0: YuppiTypes.AnyObject = {
  field: "test"
};

const properties_1: YuppiTypes.AnyObject = {
  field: ["test"]
};

Yupp.validate(schema, properties_0)
  .then(() => {
    console.log("✅ [Min] Checks successful! 1/2");
  })
  .catch(() => {
    throw new Error("❌ [Min] 1/2");
  });

Yupp.validate(schema, properties_1)
  .then(() => {
    throw new Error("❌ [Min] 2/2");
  })
  .catch((error: YuppiTypes.ValidationError) => {
    if (error.name !== "ValidationError") {
      console.log("✅ [Min] Checks successful! 2/2");
    } else throw new Error("❌ [Min] 2/2");
  })