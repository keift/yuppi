import { Yuppi, Patterns, type Schema } from '../src/main';

const Yupp = new Yuppi({ folder_path: './tests' });

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

Yupp.declare(schema, 'User');

console.log('✅ Success');
