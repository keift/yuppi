import type { Issue } from './ValidationError.type';

export type YuppiOptions = {
  output_dir?: string;

  issue_messages?: {
    string?: {
      type?: (error: Issue) => string;
      enum?: (error: Issue) => string;
      pattern?: (error: Issue) => string;
      min?: (error: Issue) => string;
      max?: (error: Issue) => string;
      nullable?: (error: Issue) => string;
      required?: (error: Issue) => string;
    };

    number?: {
      type?: (error: Issue) => string;
      enum?: (error: Issue) => string;
      min?: (error: Issue) => string;
      max?: (error: Issue) => string;
      integer?: (error: Issue) => string;
      positive?: (error: Issue) => string;
      negative?: (error: Issue) => string;
      nullable?: (error: Issue) => string;
      required?: (error: Issue) => string;
    };

    boolean?: {
      type?: (error: Issue) => string;
      nullable?: (error: Issue) => string;
      required?: (error: Issue) => string;
    };

    date?: {
      type?: (error: Issue) => string;
      min?: (error: Issue) => string;
      max?: (error: Issue) => string;
      nullable?: (error: Issue) => string;
      required?: (error: Issue) => string;
    };

    object?: {
      type?: (error: Issue) => string;
      nullable?: (error: Issue) => string;
      required?: (error: Issue) => string;
    };

    array?: {
      type?: (error: Issue) => string;
      min?: (error: Issue) => string;
      max?: (error: Issue) => string;
      nullable?: (error: Issue) => string;
      required?: (error: Issue) => string;
    };

    tuple?: {
      type?: (error: Issue) => string;
      nullable?: (error: Issue) => string;
      required?: (error: Issue) => string;
    };
  };

  validation?: {
    abort_early?: boolean;
  };
};
