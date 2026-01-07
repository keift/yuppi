import { Yuppi, type Schema, type ValidationError } from '../../src/main';

const Yupp = new Yuppi();

const correct_schemas: Schema[] = [
  {
    field: {
      type: 'string',
      nullable: true,
      required: true
    }
  },
  {
    field: {
      type: 'string',
      default: null,
      nullable: false,
      required: true
    }
  }
];

const faulty_schemas: Schema[] = [
  {
    field: {
      type: 'string',
      nullable: false,
      required: true
    }
  }
];

const properties = {
  field: null
};

for (let i = 0; i < correct_schemas.length; i++) {
  try {
    await Yupp.validate(correct_schemas[i], properties);

    console.log(`✅ Success ${(i + 1).toString()}/${correct_schemas.length.toString()} [CORRECT_SCHEMAS]`);
  } catch {
    throw new Error(`❌ Error ${(i + 1).toString()}/${correct_schemas.length.toString()} [CORRECT_SCHEMAS]`);
  }
}

for (let i = 0; i < faulty_schemas.length; i++) {
  try {
    await Yupp.validate(faulty_schemas[i], properties);

    throw new Error(`❌ Error ${(i + 1).toString()}/${faulty_schemas.length.toString()} [FAULTY_SCHEMAS]`);
  } catch (error) {
    if ((error as ValidationError).name === 'ValidationError') {
      console.log(`✅ Success ${(i + 1).toString()}/${faulty_schemas.length.toString()} [FAULTY_SCHEMAS]`);
    } else throw new Error(`❌ Error ${(i + 1).toString()}/${faulty_schemas.length.toString()} [FAULTY_SCHEMAS]`);
  }
}
