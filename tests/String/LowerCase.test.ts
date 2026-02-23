import { Yuppi, type Schema } from '../../src/main';

const yuppi = new Yuppi();

const schema = {
  field: {
    type: 'string',
    lowercase: true
  }
} as const satisfies Schema;

const correct_properties = [
  {
    field: 'TEST'
  }
];

for (let i = 0; i < correct_properties.length; i++) {
  try {
    const fields = await yuppi.validate(schema, correct_properties[i]);

    if (fields.field !== 'test') throw new Error();

    console.log(`✅ Success ${String(i + 1)}/${String(correct_properties.length)} [CORRECT_PROPERTIES]`);
  } catch {
    throw new Error(`❌ Error ${String(i + 1)}/${String(correct_properties.length)} [CORRECT_PROPERTIES]`);
  }
}
