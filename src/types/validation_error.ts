import slugify from 'slugify';

import type { TypeSingle } from './schema';

export type IssueType = {
  type: 'type';
  expected: TypeSingle['type'];
  received: TypeSingle['type'] | 'null' | 'undefined';
  nullable: boolean;
  path: (string | number)[];
  texts: { path: string };
  message: string;
};

export type IssueEnum = {
  type: 'enum';
  expected: (string | number)[];
  received: string | number;
  nullable: boolean;
  path: (string | number)[];
  texts: { path: string };
  message: string;
};

export type IssuePattern = {
  type: 'pattern';
  expected: string;
  received: string | number;
  nullable: boolean;
  path: (string | number)[];
  texts: { path: string };
  message: string;
};

export type IssueMinimum = {
  type: 'minimum';
  minimum: number;
  received: number;
  nullable: boolean;
  path: (string | number)[];
  texts: { path: string; plural_suffix: '' | 's' };
  message: string;
};

export type IssueMaximum = {
  type: 'maximum';
  maximum: number;
  received: number;
  nullable: boolean;
  path: (string | number)[];
  texts: { path: string; plural_suffix: '' | 's' };
  message: string;
};

export type IssueInteger = {
  type: 'integer';
  nullable: boolean;
  path: (string | number)[];
  texts: { path: string };
  message: string;
};

export type IssueTuple = {
  type: 'tuple';
  expected: string[];
  received: string[];
  nullable: boolean;
  path: (string | number)[];
  texts: { path: string };
  message: string;
};

export type IssueNullable = {
  type: 'nullable';
  nullable: boolean;
  path: (string | number)[];
  texts: { path: string };
  message: string;
};

export type IssueRequired = {
  type: 'required';
  nullable: boolean;
  path: (string | number)[];
  texts: { path: string };
  message: string;
};

export type Issue = IssueType | IssueEnum | IssuePattern | IssueMinimum | IssueMaximum | IssueInteger | IssueNullable | IssueRequired;

export class ValidationError extends Error {
  public issues: Issue[];

  public constructor(options: { issues: Issue[] }) {
    super(options.issues[0].message);

    this.name = 'ValidationError';

    this.issues = options.issues.map((error) => ({ ...error, code: slugify(error.message.replaceAll('_', '-'), { strict: true, trim: true, lower: true }) }));

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
