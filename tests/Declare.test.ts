import { Yuppi, Patterns } from '../src/main';

const yuppi = new Yuppi({ output_dir: './tests/generated/yuppi' });

const schema = yuppi.schema({
  display_name: {
    type: 'string',
    max: 32
  },

  username: {
    type: 'string',
    pattern: Patterns.Username,
    min: 3,
    max: 16
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
});

await schema.declare('User');

console.log('✅ Success');
