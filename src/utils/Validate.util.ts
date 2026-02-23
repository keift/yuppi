import type { InferSchema } from '../types/InferSchema.type';
import type { Schema } from '../types/Schema.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';

export const validate = async <const _Schema extends Schema>(schema: _Schema, properties: Record<string, unknown>, options: YuppiOptions): Promise<InferSchema<_Schema>> => {};
