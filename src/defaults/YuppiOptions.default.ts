import type { Issue } from '../types/ValidationError.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';

export const YuppiOptionsDefault: YuppiOptions = {
  output_dir: './generated/yuppi',

  issue_messages: {
    string: {
      type: (error: Issue) => `Field ${error.parts.path} must be a string`,
      enum: (error: Issue) => `Field ${error.parts.path} must be one of the allowed values`,
      pattern: (error: Issue) => `Field ${error.parts.path} must match the required pattern`,
      min: (error: Issue) => `Field ${error.parts.path} must be at least ${String(error.parts.min ?? 0)} character${error.parts.plural_suffix ?? ''}`,
      max: (error: Issue) => `Field ${error.parts.path} must be at most ${String(error.parts.max ?? 0)} character${error.parts.plural_suffix ?? ''}`,
      nullable: (error: Issue) => `Field ${error.parts.path} cannot be null`,
      required: (error: Issue) => `Field ${error.parts.path} is required`
    },

    number: {
      type: (error: Issue) => `Field ${error.parts.path} must be a number`,
      enum: (error: Issue) => `Field ${error.parts.path} must be one of the allowed values`,
      min: (error: Issue) => `Field ${error.parts.path} must be greater than or equal to ${String(error.parts.min ?? 0)}`,
      max: (error: Issue) => `Field ${error.parts.path} must be less than or equal to ${String(error.parts.max ?? 0)}`,
      integer: (error: Issue) => `Field ${error.parts.path} must be an integer`,
      positive: (error: Issue) => `Field ${error.parts.path} must be a positive`,
      negative: (error: Issue) => `Field ${error.parts.path} must be a negative`,
      nullable: (error: Issue) => `Field ${error.parts.path} cannot be null`,
      required: (error: Issue) => `Field ${error.parts.path} is required`
    },

    boolean: {
      type: (error: Issue) => `Field ${error.parts.path} must be a boolean`,
      nullable: (error: Issue) => `Field ${error.parts.path} cannot be null`,
      required: (error: Issue) => `Field ${error.parts.path} is required`
    },

    date: {
      type: (error: Issue) => `Field ${error.parts.path} must be a date`,
      min: (error: Issue) => `Field ${error.parts.path} must be after ${String(error.parts.min ?? 0)}`,
      max: (error: Issue) => `Field ${error.parts.path} must be before ${String(error.parts.max ?? 0)}`,
      nullable: (error: Issue) => `Field ${error.parts.path} cannot be null`,
      required: (error: Issue) => `Field ${error.parts.path} is required`
    },

    object: {
      type: (error: Issue) => `Field ${error.parts.path} must be an object`,
      nullable: (error: Issue) => `Field ${error.parts.path} cannot be null`,
      required: (error: Issue) => `Field ${error.parts.path} is required`
    },

    array: {
      type: (error: Issue) => `Field ${error.parts.path} must be an array`,
      min: (error: Issue) => `Field ${error.parts.path} must be at least ${String(error.parts.min ?? 0)} item${error.parts.plural_suffix ?? ''}`,
      max: (error: Issue) => `Field ${error.parts.path} must be at most ${String(error.parts.max ?? 0)} item${error.parts.plural_suffix ?? ''}`,
      nullable: (error: Issue) => `Field ${error.parts.path} cannot be null`,
      required: (error: Issue) => `Field ${error.parts.path} is required`
    },

    tuple: {
      type: (error: Issue) => `Field ${error.parts.path} must be a tuple`,
      nullable: (error: Issue) => `Field ${error.parts.path} cannot be null`,
      required: (error: Issue) => `Field ${error.parts.path} is required`
    }
  },

  validations: {
    abort_early: false,
    strip_unknown: true
  }
};
