import type { TAnySchema, TObject } from '@sinclair/typebox';

export type JSONSchema = TObject<Record<string, TAnySchema>>;
