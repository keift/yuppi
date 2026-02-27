import { typof } from 'typof';

import type { InferSchema } from '../types/InferSchema.type';
import type { Schema, SchemaSingle, SchemaUnion, Type, TypeSingle, TypeUnion } from '../types/Schema.type';
import { ValidationError, type Issue } from '../types/ValidationError.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';

const formatPathToString = (path: (string | number)[]) =>
  path.reduce<string>((acc, curr, index) => {
    if (typeof curr === 'number') {
      return `${acc}[${String(curr)}]`;
    } else return index === 0 ? curr : `${acc}.${curr}`;
  }, '');

const getReceivedType = (value: unknown) => typof(value)[0] as Issue['received'];

export const validate = <const _Schema extends Schema>(schema: _Schema, data: unknown, options: YuppiOptions) => {
  const result: unknown;
  const issues: Issue[] = [];

  const reportIssue = (issue: Issue) => {
    const message = (options.issue_messages as Record<string, Record<string, (issue: Issue) => string>>)[issue.expected][issue.type];

    if (typeof message === 'function') issue = { ...issue, message: message(issue) };

    issues.push(issue);

    if (options.validation?.abort_early === true && issues.length === 1) throw new ValidationError({ issues });
  };

  const validateType = (type: TypeSingle, data: unknown, path: (string | number)[]) => {
    if (type.type === 'string') {
      if (typeof data !== 'string') {
        reportIssue({ type: 'type', expected: type.type, received: getReceivedType(data), path, texts: { path: formatPathToString(path) }, code: '', message: '' });

        return;
      }
    }
  };
};
