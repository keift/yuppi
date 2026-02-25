import type { InferSchema } from '../types/InferSchema.type';
import type { Schema } from '../types/Schema.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';

const formatPathToString = (path_array: (string | number)[]): string =>
  path_array.reduce<string>((acc, curr, index) => {
    if (typeof curr === 'number') return `${acc}[${String(curr)}]`;

    return index === 0 ? curr : `${acc}.${curr}`;
  }, '');

export const validate = <const _Schema extends Schema>(schema: _Schema, properties: Record<string, unknown>, options: YuppiOptions): InferSchema<_Schema> => {
  // ...
};
