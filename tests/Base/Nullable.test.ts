import { Yuppi, type Schema, type ValidationError } from '../../src/main';

const yuppi = new Yuppi();

const correct_schemas = [
  {
    field: {
      type: 'string',
      nullable: true,
    }
  },
  {
    field: {
      type: 'string',
      default: null,
      nullable: false,
    }
  }
] as const satisfies Schema[];

const faulty_schemas = [
  {
    field: {
      type: 'string',
      nullable: false,
    }
  }
] as const satisfies Schema[];

const properties = {
  field: null
};

for (let i = 0; i < correct_schemas.length; i++) {
  try {
    await yuppi.validate(correct_schemas[i], properties);

    console.log(`✅ Success ${String(i + 1)}/${String(correct_schemas.length)} [CORRECT_SCHEMAS]`);
  } catch {
    throw new Error(`❌ Error ${String(i + 1)}/${String(correct_schemas.length)} [CORRECT_SCHEMAS]`);
  }
}

for (let i = 0; i < faulty_schemas.length; i++) {
  try {
    await yuppi.validate(faulty_schemas[i], properties);

    throw new Error(`❌ Error ${String(i + 1)}/${String(faulty_schemas.length)} [FAULTY_SCHEMAS]`);
  } catch (error) {
    if ((error as ValidationError).name === 'ValidationError') {
      console.log(`✅ Success ${String(i + 1)}/${String(faulty_schemas.length)} [FAULTY_SCHEMAS]`);
    } else throw new Error(`❌ Error ${String(i + 1)}/${String(faulty_schemas.length)} [FAULTY_SCHEMAS]`, { cause: error });
  }
}
