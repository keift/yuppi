import { Yuppi, ValidationError } from '../../src/main';

const yuppi = new Yuppi();

const correct_schemas = [
  yuppi.schema({
    field: {
      type: 'string',
      nullable: true
    }
  }),
  yuppi.schema({
    field: {
      type: 'string',
      default: null,
      nullable: false
    }
  })
];

const faulty_schemas = [
  yuppi.schema({
    field: {
      type: 'string',
      nullable: false
    }
  })
];

const properties = {
  field: null
};

for (let i = 0; i < correct_schemas.length; i++) {
  try {
    correct_schemas[i].validate(properties);

    console.log(`✅ Success ${String(i + 1)}/${String(correct_schemas.length)} [CORRECT_SCHEMAS]`);
  } catch {
    throw new Error(`❌ Error ${String(i + 1)}/${String(correct_schemas.length)} [CORRECT_SCHEMAS]`);
  }
}

for (let i = 0; i < faulty_schemas.length; i++) {
  try {
    faulty_schemas[i].validate(properties);

    throw new Error(`❌ Error ${String(i + 1)}/${String(faulty_schemas.length)} [FAULTY_SCHEMAS]`);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log(`✅ Success ${String(i + 1)}/${String(faulty_schemas.length)} [FAULTY_SCHEMAS]`);
    } else throw new Error(`❌ Error ${String(i + 1)}/${String(faulty_schemas.length)} [FAULTY_SCHEMAS]`, { cause: error });
  }
}
