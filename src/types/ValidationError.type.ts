import slugify from 'slugify';

import type { TypeSingle } from './Schema.type';

export type Issue = {
  type: 'type' | 'enum' | 'pattern' | 'min' | 'max' | 'integer' | 'nullable' | 'required' | 'positive' | 'negative';
  expected: TypeSingle['type'] | 'null' | 'undefined';
  received: TypeSingle['type'] | 'null' | 'undefined';
  path: (string | number)[];
  parts: { path: string; min?: number; max?: number; plural_suffix?: '' | 's' };
  code: string;
  message: string;
};

export class ValidationError extends Error {
  public issues: Issue[];

  public constructor(options: { issues: Issue[] }) {
    super(options.issues[0].message);

    this.name = 'ValidationError';

    this.issues = options.issues.map((error) => ({ ...error, code: slugify(error.message.replaceAll('_', '-'), { strict: true, trim: true, lower: true }) }));

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
