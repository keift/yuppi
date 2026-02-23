import slugify from 'slugify';

export class ValidationError extends Error {
  public errors: { message: string; code: string; parts: Record<string, string> }[];

  public constructor(options: { errors: { message: string; parts: Record<string, string> }[] }) {
    super(options.errors[0].message);

    this.name = 'ValidationError';

    this.errors = options.errors.map((error) => ({ ...error, code: slugify(error.message.replaceAll('_', '-'), { strict: true, trim: true, lower: true }) }));

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
