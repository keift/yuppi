import { Yuppi, Patterns, type Schema, type JSONSchema } from '../src/main';

const Yupp: Yuppi = new Yuppi();

const schema: Schema = {
  display_name: {
    type: 'string',
    min: 1,
    max: 32,
    nullable: false,
    required: true
  },

  username: {
    type: 'string',
    min: 3,
    max: 16,
    pattern: Patterns.Username,
    nullable: false,
    required: true
  },

  email: {
    type: 'string',
    pattern: Patterns.Email,
    lowercase: true,
    nullable: false,
    required: true
  }
};

const conversion: JSONSchema = Yupp.convertToJSONSchema(schema);

if (conversion.properties.username.pattern !== Patterns.Username) throw new Error('❌ Error');

console.log('✅ Success');
