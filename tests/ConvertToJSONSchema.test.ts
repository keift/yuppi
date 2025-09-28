import { Yuppi, Patterns, type Schema } from '../src/main';

const Yupp = new Yuppi();

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

const example_json_schema = {
  type: 'object',
  properties: {
    display_name: {
      minLength: 1,
      maxLength: 32,
      type: 'string'
    },
    username: {
      minLength: 3,
      maxLength: 16,
      pattern: '^(?=.*[a-zA-Z])[a-zA-Z0-9][a-zA-Z0-9_]*$',
      type: 'string'
    },
    email: {
      pattern: '^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$',
      type: 'string'
    }
  },
  required: ['display_name', 'username', 'email']
};

const conversion = Yupp.convertToJSONSchema(schema);

if (JSON.stringify(conversion) !== JSON.stringify(example_json_schema)) throw new Error('❌ Error');

console.log('✅ Success');
