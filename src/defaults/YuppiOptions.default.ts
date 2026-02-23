import type { YuppiOptions } from '../types/YuppiOptions.type';

export const YuppiOptionsDefault: YuppiOptions = {
  output_dir: './generated/yuppi',

  error_messages: {
    string: {
      type: 'Field {path} must be a string',
      enum: 'Field {path} must be one of the allowed values',
      pattern: 'Field {path} must match the required pattern',
      minimum: 'Field {path} must be at least {min} character{plural_suffix}',
      maximum: 'Field {path} must be at most {max} character{plural_suffix}',
      nullable: 'Field {path} cannot be null',
      required: 'Field {path} is required'
    },

    number: {
      type: 'Field {path} must be a number',
      enum: 'Field {path} must be one of the allowed values',
      minimum: 'Field {path} must be greater than or equal to {min}',
      maximum: 'Field {path} must be less than or equal to {max}',
      integer: 'Field {path} must be an integer',
      positive: 'Field {path} must be a positive',
      negative: 'Field {path} must be a negative',
      nullable: 'Field {path} cannot be null',
      required: 'Field {path} is required'
    },

    boolean: {
      type: 'Field {path} must be a boolean',
      nullable: 'Field {path} cannot be null',
      required: 'Field {path} is required'
    },

    date: {
      type: 'Field {path} must be a date',
      minimum: 'Field {path} must be after {min}',
      maximum: 'Field {path} must be before {max}',
      nullable: 'Field {path} cannot be null',
      required: 'Field {path} is required'
    },

    object: {
      type: 'Field {path} must be an object',
      nullable: 'Field {path} cannot be null',
      required: 'Field {path} is required'
    },

    array: {
      type: 'Field {path} must be an array',
      minimum: 'Field {path} must be at least {min} item${plural_suffix}',
      maximum: 'Field {path} must be at most {max} item${plural_suffix}',
      nullable: 'Field {path} cannot be null',
      required: 'Field {path} is required'
    },

    tuple: {
      type: 'Field {path} must be a tuple',
      nullable: 'Field {path} cannot be null',
      required: 'Field {path} is required'
    }
  },

  validation: {
    abort_early: false,
    strip_unknown: true
  }
};
