import { Yuppi, type Schema, type ValidationError } from '../../src/main';

const Yupp = new Yuppi();

const schema: Schema = {
  field: {
    type: 'array',
    items: {
      type: 'string',
      nullable: false,
      required: true
    },
    nullable: false,
    required: true
  }
};

const correct_properties = [
  {
    field: ['test']
  }
];

const faulty_properties = [
  {
    field: [[]]
  }
];

for (let i = 0; i < correct_properties.length; i++) {
  try {
    await Yupp.validate(schema, correct_properties[i]);

    console.log(`✅ Success ${String(i + 1)}/${String(correct_properties.length)} [CORRECT_PROPERTIES]`);
  } catch {
    throw new Error(`❌ Error ${String(i + 1)}/${String(correct_properties.length)} [CORRECT_PROPERTIES]`);
  }
}

for (let i = 0; i < faulty_properties.length; i++) {
  try {
    await Yupp.validate(schema, faulty_properties[i]);

    throw new Error(`❌ Error ${String(i + 1)}/${String(faulty_properties.length)} [FAULTY_PROPERTIES]`);
  } catch (error) {
    if ((error as ValidationError).name === 'ValidationError') {
      console.log(`✅ Success ${String(i + 1)}/${String(faulty_properties.length)} [FAULTY_PROPERTIES]`);
    } else throw new Error(`❌ Error ${String(i + 1)}/${String(faulty_properties.length)} [FAULTY_PROPERTIES]`);
  }
}
