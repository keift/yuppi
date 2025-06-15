import type { ValidateOptions } from "yup";

export type YuppiOptions = {
  error_messages?: {
    base?: {
      pattern?: string;
      nullable?: string;
      required?: string;
    };
    string?: {
      type?: string;
      min?: string;
      max?: string;
    };
    number?: {
      type?: string;
      min?: string;
      max?: string;
      integer?: string;
      positive?: string;
      negative?: string;
    };
    boolean?: {
      type?: string;
    };
    date?: {
      type?: string;
      min?: string;
      max?: string;
    };
    object?: {
      type?: string;
    };
    array?: {
      type?: string;
      min?: string;
      max?: string;
    };
  };
  validate_options?: ValidateOptions;
};
