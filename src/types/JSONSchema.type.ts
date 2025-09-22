import type { TSchema, TObject } from '@sinclair/typebox';

export type JSONSchema = TObject<Record<string, TSchema>>;
