import { Yuppi, Patterns, type Schema, type ValidationError } from '../../src/main';

const Yupp = new Yuppi();

const schema: Schema = {
  field: {
    type: 'string',
    pattern: Patterns.Email,
    nullable: false,
    required: true
  }
};

const correct_properties = [
  {
    field: 'fir4tozden@gmail.com'
  }
];

const faulty_properties = [
  {
    field: 'fir4tozden@!gmail.com'
  }
];

for (let i = 0; i < correct_properties.length; i++) {
  try {
    await Yupp.validate(schema, correct_properties[i]);

    console.log(`✅ Success ${(i + 1).toString()}/${correct_properties.length.toString()} [CORRECT_PROPERTIES]`);
  } catch {
    throw new Error(`❌ Error ${(i + 1).toString()}/${correct_properties.length.toString()} [CORRECT_PROPERTIES]`);
  }
}

for (let i = 0; i < faulty_properties.length; i++) {
  try {
    await Yupp.validate(schema, faulty_properties[i]);

    throw new Error(`❌ Error ${(i + 1).toString()}/${faulty_properties.length.toString()} [FAULTY_PROPERTIES]`);
  } catch (error) {
    if ((error as ValidationError).name === 'ValidationError') {
      console.log(`✅ Success ${(i + 1).toString()}/${faulty_properties.length.toString()} [FAULTY_PROPERTIES]`);
    } else throw new Error(`❌ Error ${(i + 1).toString()}/${faulty_properties.length.toString()} [FAULTY_PROPERTIES]`);
  }
}
