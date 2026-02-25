import type { ErrorContext } from './ValidationError.type';

export type YuppiOptions = {
  output_dir?: string;

  error_messages?: {
    string?: {
      type?: (error: ErrorContext) => string;
      enum?: (error: ErrorContext) => string;
      pattern?: (error: ErrorContext) => string;
      min?: (error: ErrorContext) => string;
      max?: (error: ErrorContext) => string;
      nullable?: (error: ErrorContext) => string;
      required?: (error: ErrorContext) => string;
    };

    number?: {
      type?: (error: ErrorContext) => string;
      enum?: (error: ErrorContext) => string;
      min?: (error: ErrorContext) => string;
      max?: (error: ErrorContext) => string;
      integer?: (error: ErrorContext) => string;
      positive?: (error: ErrorContext) => string;
      negative?: (error: ErrorContext) => string;
      nullable?: (error: ErrorContext) => string;
      required?: (error: ErrorContext) => string;
    };

    boolean?: {
      type?: (error: ErrorContext) => string;
      nullable?: (error: ErrorContext) => string;
      required?: (error: ErrorContext) => string;
    };

    date?: {
      type?: (error: ErrorContext) => string;
      min?: (error: ErrorContext) => string;
      max?: (error: ErrorContext) => string;
      nullable?: (error: ErrorContext) => string;
      required?: (error: ErrorContext) => string;
    };

    object?: {
      type?: (error: ErrorContext) => string;
      nullable?: (error: ErrorContext) => string;
      required?: (error: ErrorContext) => string;
    };

    array?: {
      type?: (error: ErrorContext) => string;
      min?: (error: ErrorContext) => string;
      max?: (error: ErrorContext) => string;
      nullable?: (error: ErrorContext) => string;
      required?: (error: ErrorContext) => string;
    };

    tuple?: {
      type?: (error: ErrorContext) => string;
      nullable?: (error: ErrorContext) => string;
      required?: (error: ErrorContext) => string;
    };
  };

  validations?: {
    abort_early?: boolean;
    strip_unknown?: boolean;
  };
};
