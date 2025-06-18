import { Yuppi, type Types as YuppiTypes } from "../../src/main";

const Yupp: Yuppi = new Yuppi();

const schema: YuppiTypes.Schema = {
  field: {
    type: "string",
    lowercase: true,
    nullable: true,
    required: true
  }
};

const correct_properties: YuppiTypes.AnyObject = {
  field: []
};

/*const faulty_properties: YuppiTypes.AnyObject = {
  field: []
};*/

Yupp.validate(schema, correct_properties)
  .then(() => {
    console.log("✅ [Type] Checks successful! 1/2");
  })
  .catch((e: YuppiTypes.ValidationError) => {
    console.log(e);
    throw new Error("❌ [Type] Error 1/2");
  });
/*
Yupp.validate(schema, faulty_properties)
  .then(() => {
    throw new Error("❌ [Type] Error 2/2");
  })
  .catch((error: YuppiTypes.ValidationError) => {
    if (error.name === "ValidationError") {
      console.log("✅ [Type] Checks successful! 2/2");
    } else throw new Error("❌ [Type] Error 2/2");
  });
*/
