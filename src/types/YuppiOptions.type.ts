import type { Issue } from './ValidationError.type';

export type YuppiOptions = {
  output_dir?: string;

  issue_messages?: {
    string?: {
      type?: (issue: Issue) => string;
      enum?: (issue: Issue) => string;
      pattern?: (issue: Issue) => string;
      min?: (issue: Issue) => string;
      max?: (issue: Issue) => string;
      nullable?: (issue: Issue) => string;
      required?: (issue: Issue) => string;
    };

    number?: {
      type?: (issue: Issue) => string;
      enum?: (issue: Issue) => string;
      min?: (issue: Issue) => string;
      max?: (issue: Issue) => string;
      integer?: (issue: Issue) => string;
      positive?: (issue: Issue) => string;
      negative?: (issue: Issue) => string;
      nullable?: (issue: Issue) => string;
      required?: (issue: Issue) => string;
    };

    boolean?: {
      type?: (issue: Issue) => string;
      nullable?: (issue: Issue) => string;
      required?: (issue: Issue) => string;
    };

    date?: {
      type?: (issue: Issue) => string;
      min?: (issue: Issue) => string;
      max?: (issue: Issue) => string;
      nullable?: (issue: Issue) => string;
      required?: (issue: Issue) => string;
    };

    object?: {
      type?: (issue: Issue) => string;
      nullable?: (issue: Issue) => string;
      required?: (issue: Issue) => string;
    };

    array?: {
      type?: (issue: Issue) => string;
      min?: (issue: Issue) => string;
      max?: (issue: Issue) => string;
      nullable?: (issue: Issue) => string;
      required?: (issue: Issue) => string;
    };

    tuple?: {
      type?: (issue: Issue) => string;
      nullable?: (issue: Issue) => string;
      required?: (issue: Issue) => string;
    };
  };

  validation?: {
    abort_early?: boolean;
  };
};
