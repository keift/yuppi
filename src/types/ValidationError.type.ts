import slugify from 'slugify';

import type { TypeSingle } from './Schema.type';

export type ErrorContext = { expected: TypeSingle['type']; received: TypeSingle['type']; code?: string; path: (string | number)[]; message: string; parts: { path: string; min?: number; max?: number; plural_suffix?: '' | 's' } };

export class ValidationError extends Error {
  public errors: ErrorContext[];

  public constructor(options: { errors: ErrorContext[] }) {
    super(options.errors[0].message);

    this.name = 'ValidationError';

    this.errors = options.errors.map((error) => ({ ...error, code: slugify(error.message.replaceAll('_', '-'), { strict: true, trim: true, lower: true }) }));

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
