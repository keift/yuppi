import { Yuppi, Patterns, type Schema } from '../src/main';

const yuppi = new Yuppi({ output_dir: './tests/generated/yuppi' });

const schema = {
  display_name: {
    type: 'string',
    maximum: 32
  },

  username: {
    type: 'string',
    minimum: 3,
    maximum: 16,
    pattern: Patterns.Username
  },

  email: {
    type: 'string',
    pattern: Patterns.Email,
    lowercase: true
  },

  permissions: [
    {
      type: 'string',
      enum: ['*']
    },
    {
      type: 'array',
      items: {
        type: 'string',
        enum: ['read', 'write']
      }
    }
  ]
} as const satisfies Schema;

const properties = {
  display_name: 'Fırat',
  username: 'fir4tozden',
  email: 'fir4tozden@gmail.com',
  permissions: '*',
  a: 1
};

console.log(yuppi.validate(schema, properties));

await yuppi.declare(schema, 'User');

console.log('✅ Success');
