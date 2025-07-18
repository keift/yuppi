import { Yuppi, type Types as YuppiTypes } from "../../src/main";

const Yupp: Yuppi = new Yuppi();

const correct_schemas: YuppiTypes.Schema[] = [
  {
    field: {
      type: "string",
      nullable: true,
      required: true
    }
  },
  {
    field: {
      type: "string",
      default: null,
      nullable: false,
      required: true
    }
  }
];

const faulty_schemas: YuppiTypes.Schema[] = [
  {
    field: {
      type: "string",
      nullable: false,
      required: true
    }
  }
];

const properties: YuppiTypes.AnyObject = {
  field: null
};

for (let i: number = 0; i < correct_schemas.length; i++) {
  try {
    Yupp.validate(correct_schemas[i], properties);

    console.log(`✅ Success ${i + 1}/${correct_schemas.length} [CORRECT_SCHEMAS]`);
  } catch {
    throw new Error(`❌ Error ${i + 1}/${correct_schemas.length} [CORRECT_SCHEMAS]`);
  }
}

for (let i: number = 0; i < faulty_schemas.length; i++) {
  try {
    Yupp.validate(faulty_schemas[i], properties);

    throw new Error(`❌ Error ${i + 1}/${faulty_schemas.length} [FAULTY_SCHEMAS]`);
  } catch (error: unknown) {
    if ((error as YuppiTypes.ValidationError).name === "ValidationError") {
      console.log(`✅ Success ${i + 1}/${faulty_schemas.length} [FAULTY_SCHEMAS]`);
    } else throw new Error(`❌ Error ${i + 1}/${faulty_schemas.length} [FAULTY_SCHEMAS]`);
  }
}
