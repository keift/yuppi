import { Yuppi, type Schema, type ValidationError } from '../../src/main';

const Yupp = new Yuppi();

const schema: Schema = {
  field: {
    type: 'object',
    properties: {
      field: {
        type: 'string',
        nullable: false,
        required: true
      }
    },
    nullable: false,
    required: true
  }
};

const correct_properties = [
  {
    field: {
      field: 'test'
    }
  }
];

const faulty_properties = [
  {
    field: {
      field: []
    }
  }
];

for (let i = 0; i < correct_properties.length; i++) {
  try {
    Yupp.validate(schema, correct_properties[i]);

    console.log(`✅ Success ${(i + 1).toString()}/${correct_properties.length.toString()} [CORRECT_PROPERTIES]`);
  } catch {
    throw new Error(`❌ Error ${(i + 1).toString()}/${correct_properties.length.toString()} [CORRECT_PROPERTIES]`);
  }
}

for (let i = 0; i < faulty_properties.length; i++) {
  try {
    Yupp.validate(schema, faulty_properties[i]);

    throw new Error(`❌ Error ${(i + 1).toString()}/${faulty_properties.length.toString()} [FAULTY_PROPERTIES]`);
  } catch (error) {
    if ((error as ValidationError).name === 'ValidationError') {
      console.log(`✅ Success ${(i + 1).toString()}/${faulty_properties.length.toString()} [FAULTY_PROPERTIES]`);
    } else throw new Error(`❌ Error ${(i + 1).toString()}/${faulty_properties.length.toString()} [FAULTY_PROPERTIES]`);
  }
}
