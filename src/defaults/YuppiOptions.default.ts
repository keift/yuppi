import type { YuppiOptions } from '../types/YuppiOptions.type';

export const YuppiOptionsDefault: YuppiOptions = {
  output_dir: './generated/yuppi',

  issue_messages: {
    string: {
      type: (issue) => `Field ${issue.texts.path} must be a string`,
      enum: (issue) => `Field ${issue.texts.path} must be one of the allowed values`,
      pattern: (issue) => `Field ${issue.texts.path} must match the required pattern`,
      min: (issue) => `Field ${issue.texts.path} must be at least ${String(issue.minimum)} character${issue.texts.plural_suffix}`,
      max: (issue) => `Field ${issue.texts.path} must be at most ${String(issue.maximum)} character${issue.texts.plural_suffix}`,
      nullable: (issue) => `Field ${issue.texts.path} cannot be null`,
      required: (issue) => `Field ${issue.texts.path} is required`
    },

    number: {
      type: (issue) => `Field ${issue.texts.path} must be a number`,
      enum: (issue) => `Field ${issue.texts.path} must be one of the allowed values`,
      min: (issue) => `Field ${issue.texts.path} must be greater than or equal to ${String(issue.minimum)}`,
      max: (issue) => `Field ${issue.texts.path} must be less than or equal to ${String(issue.maximum)}`,
      integer: (issue) => `Field ${issue.texts.path} must be an integer`,
      nullable: (issue) => `Field ${issue.texts.path} cannot be null`,
      required: (issue) => `Field ${issue.texts.path} is required`
    },

    boolean: {
      type: (issue) => `Field ${issue.texts.path} must be a boolean`,
      nullable: (issue) => `Field ${issue.texts.path} cannot be null`,
      required: (issue) => `Field ${issue.texts.path} is required`
    },

    date: {
      type: (issue) => `Field ${issue.texts.path} must be a date`,
      min: (issue) => `Field ${issue.texts.path} must be after ${String(issue.minimum)}`,
      max: (issue) => `Field ${issue.texts.path} must be before ${String(issue.maximum)}`,
      nullable: (issue) => `Field ${issue.texts.path} cannot be null`,
      required: (issue) => `Field ${issue.texts.path} is required`
    },

    object: {
      type: (issue) => `Field ${issue.texts.path} must be an object`,
      nullable: (issue) => `Field ${issue.texts.path} cannot be null`,
      required: (issue) => `Field ${issue.texts.path} is required`
    },

    array: {
      type: (issue) => `Field ${issue.texts.path} must be an array`,
      min: (issue) => `Field ${issue.texts.path} must be at least ${String(issue.minimum)} item${issue.texts.plural_suffix}`,
      max: (issue) => `Field ${issue.texts.path} must be at most ${String(issue.maximum)} item${issue.texts.plural_suffix}`,
      nullable: (issue) => `Field ${issue.texts.path} cannot be null`,
      required: (issue) => `Field ${issue.texts.path} is required`
    },

    tuple: {
      type: (issue) => `Field ${issue.texts.path} must be a tuple`,
      nullable: (issue) => `Field ${issue.texts.path} cannot be null`,
      required: (issue) => `Field ${issue.texts.path} is required`
    }
  },

  validation: {
    abort_early: false
  }
};
