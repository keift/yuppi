import type { IssueType, IssueEnum, IssuePattern, IssueMinimum, IssueMaximum, IssueInteger, IssueNullable, IssueRequired } from './validation_error';

export type YuppiOptions = {
  output_dir?: string;

  issue_messages?: {
    string?: {
      type?: (issue: IssueType) => string;
      enum?: (issue: IssueEnum) => string;
      pattern?: (issue: IssuePattern) => string;
      minimum?: (issue: IssueMinimum) => string;
      maximum?: (issue: IssueMaximum) => string;
      nullable?: (issue: IssueNullable) => string;
      required?: (issue: IssueRequired) => string;
    };

    number?: {
      type?: (issue: IssueType) => string;
      enum?: (issue: IssueEnum) => string;
      minimum?: (issue: IssueMinimum) => string;
      maximum?: (issue: IssueMaximum) => string;
      integer?: (issue: IssueInteger) => string;
      nullable?: (issue: IssueNullable) => string;
      required?: (issue: IssueRequired) => string;
    };

    boolean?: {
      type?: (issue: IssueType) => string;
      nullable?: (issue: IssueNullable) => string;
      required?: (issue: IssueRequired) => string;
    };

    date?: {
      type?: (issue: IssueType) => string;
      minimum?: (issue: IssueMinimum) => string;
      maximum?: (issue: IssueMaximum) => string;
      nullable?: (issue: IssueNullable) => string;
      required?: (issue: IssueRequired) => string;
    };

    object?: {
      type?: (issue: IssueType) => string;
      nullable?: (issue: IssueNullable) => string;
      required?: (issue: IssueRequired) => string;
    };

    array?: {
      type?: (issue: IssueType) => string;
      minimum?: (issue: IssueMinimum) => string;
      maximum?: (issue: IssueMaximum) => string;
      nullable?: (issue: IssueNullable) => string;
      required?: (issue: IssueRequired) => string;
    };

    tuple?: {
      type?: (issue: IssueType) => string;
      nullable?: (issue: IssueNullable) => string;
      required?: (issue: IssueRequired) => string;
    };
  };

  validation?: {
    abort_early?: boolean;
  };
};
