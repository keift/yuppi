import { Yuppi, Patterns, type Schema } from '../src/main';

const yuppi = new Yuppi();

const schema = {
  display_name: {
    type: 'string',
    max: 32
  },

  username: {
    type: 'string',
    min: 3,
    max: 16,
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

const example_json_schema = {
  additionalProperties: false,
  type: 'object',
  required: ['display_name', 'username', 'email', 'permissions'],
  properties: {
    display_name: {
      maxLength: 32,
      trim: true,
      type: 'string'
    },
    username: {
      minLength: 3,
      maxLength: 16,
      pattern: '^(?=.*[a-zA-Z])[a-zA-Z0-9][a-zA-Z0-9_]*$',
      trim: true,
      type: 'string'
    },
    email: {
      pattern: '^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$',
      trim: true,
      lowercase: true,
      type: 'string'
    },
    permissions: {
      anyOf: [
        { enum: ['*'], trim: true, type: 'string' },
        { type: 'array', items: { enum: ['read', 'write'], trim: true, type: 'string' } }
      ]
    }
  }
};

const conversion = yuppi.toJSONSchema(schema);

console.log(JSON.stringify(conversion));

if (JSON.stringify(conversion) !== JSON.stringify(example_json_schema)) throw new Error('❌ Error');

console.log('✅ Success');
