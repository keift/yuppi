import type { ErrorContext } from '../types/ValidationError.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';

export const YuppiOptionsDefault: YuppiOptions = {
  output_dir: './generated/yuppi',

  error_messages: {
    string: {
      type: (error: ErrorContext) => `Field ${error.parts.path} must be a string`,
      enum: (error: ErrorContext) => `Field ${error.parts.path} must be one of the allowed values`,
      pattern: (error: ErrorContext) => `Field ${error.parts.path} must match the required pattern`,
      min: (error: ErrorContext) => `Field ${error.parts.path} must be at least ${String(error.parts.min ?? 0)} character${error.parts.plural_suffix ?? ''}`,
      max: (error: ErrorContext) => `Field ${error.parts.path} must be at most ${String(error.parts.max ?? 0)} character${error.parts.plural_suffix ?? ''}`,
      nullable: (error: ErrorContext) => `Field ${error.parts.path} cannot be null`,
      required: (error: ErrorContext) => `Field ${error.parts.path} is required`
    },

    number: {
      type: (error: ErrorContext) => `Field ${error.parts.path} must be a number`,
      enum: (error: ErrorContext) => `Field ${error.parts.path} must be one of the allowed values`,
      min: (error: ErrorContext) => `Field ${error.parts.path} must be greater than or equal to ${String(error.parts.min ?? 0)}`,
      max: (error: ErrorContext) => `Field ${error.parts.path} must be less than or equal to ${String(error.parts.max ?? 0)}`,
      integer: (error: ErrorContext) => `Field ${error.parts.path} must be an integer`,
      positive: (error: ErrorContext) => `Field ${error.parts.path} must be a positive`,
      negative: (error: ErrorContext) => `Field ${error.parts.path} must be a negative`,
      nullable: (error: ErrorContext) => `Field ${error.parts.path} cannot be null`,
      required: (error: ErrorContext) => `Field ${error.parts.path} is required`
    },

    boolean: {
      type: (error: ErrorContext) => `Field ${error.parts.path} must be a boolean`,
      nullable: (error: ErrorContext) => `Field ${error.parts.path} cannot be null`,
      required: (error: ErrorContext) => `Field ${error.parts.path} is required`
    },

    date: {
      type: (error: ErrorContext) => `Field ${error.parts.path} must be a date`,
      min: (error: ErrorContext) => `Field ${error.parts.path} must be after ${String(error.parts.min ?? 0)}`,
      max: (error: ErrorContext) => `Field ${error.parts.path} must be before ${String(error.parts.max ?? 0)}`,
      nullable: (error: ErrorContext) => `Field ${error.parts.path} cannot be null`,
      required: (error: ErrorContext) => `Field ${error.parts.path} is required`
    },

    object: {
      type: (error: ErrorContext) => `Field ${error.parts.path} must be an object`,
      nullable: (error: ErrorContext) => `Field ${error.parts.path} cannot be null`,
      required: (error: ErrorContext) => `Field ${error.parts.path} is required`
    },

    array: {
      type: (error: ErrorContext) => `Field ${error.parts.path} must be an array`,
      min: (error: ErrorContext) => `Field ${error.parts.path} must be at least ${String(error.parts.min ?? 0)} item${error.parts.plural_suffix ?? ''}`,
      max: (error: ErrorContext) => `Field ${error.parts.path} must be at most ${String(error.parts.max ?? 0)} item${error.parts.plural_suffix ?? ''}`,
      nullable: (error: ErrorContext) => `Field ${error.parts.path} cannot be null`,
      required: (error: ErrorContext) => `Field ${error.parts.path} is required`
    },

    tuple: {
      type: (error: ErrorContext) => `Field ${error.parts.path} must be a tuple`,
      nullable: (error: ErrorContext) => `Field ${error.parts.path} cannot be null`,
      required: (error: ErrorContext) => `Field ${error.parts.path} is required`
    }
  },

  validations: {
    abort_early: false,
    strip_unknown: true
  }
};
