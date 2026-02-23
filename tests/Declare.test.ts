import { Yuppi, Patterns, type Schema } from '../src/main';

const yuppi = new Yuppi({ output_dir: './tests/generated/yuppi' });

const schema = {
  display_name: {
    type: 'string',
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
  },

  permissions: [
    {
      type: 'string',
      enum: ['*'],
      nullable: false,
      required: true
    },
    {
      type: 'array',
      items: {
        type: 'string',
        enum: ['read', 'write'],
        nullable: false,
        required: true
      },
      nullable: false,
      required: true
    }
  ]
} as const satisfies Schema;

const properties = {
  display_name: 'Fırat',
  username: 'fir4tozden',
  email: 'fir4tozden@gmail.com',
  permissions: '*'
};

await yuppi.validate(schema, properties);

await yuppi.declare(schema, 'User');

console.log('✅ Success');
