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
  field: 0
};

Yupp.validate(schema, properties_0)
  .then(() => {
    console.log("✅ [String] Checks successful! 1/2");
  })
  .catch(() => {
    throw new Error("❌ [String] 1/2");
  });

Yupp.validate(schema, properties_1)
  .then(() => {
    throw new Error("❌ [String] 2/2");
  })
  .catch(() => {
    console.log("✅ [String] Checks successful! 2/2");
  });
