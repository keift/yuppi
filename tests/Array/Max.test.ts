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
    max: 1,
    nullable: false,
    required: true
  }
};

const correct_properties: YuppiTypes.AnyObject[] = [
  {
    field: ["test"]
  }
];

const faulty_properties: YuppiTypes.AnyObject[] = [
  {
    field: ["test", "test"]
  }
];

for (let i: number = 0; i < correct_properties.length; i++) {
  try {
    Yupp.validate(schema, correct_properties[i]);

    console.log(`✅ Success ${i + 1}/${correct_properties.length} [CORRECT_PROPERTIES]`);
  } catch {
    throw new Error(`❌ Error ${i + 1}/${correct_properties.length} [CORRECT_PROPERTIES]`);
  }
}

for (let i: number = 0; i < faulty_properties.length; i++) {
  try {
    Yupp.validate(schema, faulty_properties[i]);

    throw new Error(`❌ Error ${i + 1}/${faulty_properties.length} [FAULTY_PROPERTIES]`);
  } catch (error: unknown) {
    if ((error as YuppiTypes.ValidationError).name === "ValidationError") {
      console.log(`✅ Success ${i + 1}/${faulty_properties.length} [FAULTY_PROPERTIES]`);
    } else throw new Error(`❌ Error ${i + 1}/${faulty_properties.length} [FAULTY_PROPERTIES]`);
  }
}
