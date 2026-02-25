import { Yuppi } from '../../src/main';

const yuppi = new Yuppi();

const schema = yuppi.schema({
  field: {
    type: 'string'
  }
});

const correct_properties = [
  {
    field: ' test '
  }
];

for (let i = 0; i < correct_properties.length; i++) {
  try {
    const fields = schema.validate(correct_properties[i]);

    if (fields.field !== 'test') throw new Error();

    console.log(`✅ Success ${String(i + 1)}/${String(correct_properties.length)} [CORRECT_PROPERTIES]`);
  } catch {
    throw new Error(`❌ Error ${String(i + 1)}/${String(correct_properties.length)} [CORRECT_PROPERTIES]`);
  }
}
