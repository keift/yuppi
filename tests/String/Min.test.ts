import { Yuppi, type ValidationError } from '../../src/main';

const yuppi = new Yuppi();

const schema = yuppi.schema({
  field: {
    type: 'string',
    minimum: 4
  }
});

const correct_properties = [
  {
    field: 'test'
  }
];

const faulty_properties = [
  {
    field: 'tes'
  }
];

for (let i = 0; i < correct_properties.length; i++) {
  try {
    schema.validate(correct_properties[i]);

    console.log(`✅ Success ${String(i + 1)}/${String(correct_properties.length)} [CORRECT_PROPERTIES]`);
  } catch {
    throw new Error(`❌ Error ${String(i + 1)}/${String(correct_properties.length)} [CORRECT_PROPERTIES]`);
  }
}

for (let i = 0; i < faulty_properties.length; i++) {
  try {
    schema.validate(faulty_properties[i]);

    throw new Error(`❌ Error ${String(i + 1)}/${String(faulty_properties.length)} [FAULTY_PROPERTIES]`);
  } catch (error) {
    if ((error as ValidationError).name === 'ValidationError') {
      console.log(`✅ Success ${String(i + 1)}/${String(faulty_properties.length)} [FAULTY_PROPERTIES]`);
    } else throw new Error(`❌ Error ${String(i + 1)}/${String(faulty_properties.length)} [FAULTY_PROPERTIES]`, { cause: error });
  }
}
