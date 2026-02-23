import type { InferSchema } from '../types/InferSchema.type';
import type { Schema, SchemaSingle } from '../types/Schema.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';

const formatPathToString = (path_array: (string | number)[]): string =>
  path_array.reduce<string>((acc, curr, index) => {
    if (typeof curr === 'number') return `${acc}[${String(curr)}]`;

    return index === 0 ? curr : `${acc}.${curr}`;
  }, '');

export const validate = <const _Schema extends Schema>(schema: _Schema, properties: Record<string, unknown>, options: YuppiOptions): InferSchema<_Schema> => {
  const result: Record<string, unknown> = {};
  const errors: { path: string; path_array: (string | number)[]; message: string }[] = [];

  const reportError = (path_array: (string | number)[], message: string) => {
    const pathString = formatPathToString(path_array);

    if (options.validations?.abort_early === true) throw new Error(`Validation Error at [${pathString}]: ${message}`);

    errors.push({ path: pathString, path_array, message });
  };

  const processSchemaSingle = (schema: SchemaSingle, properties: Record<string, unknown>, result_target: Record<string, unknown>, path_array: (string | number)[] = []) => {
    if (options.validations?.strip_unknown === false && typeof properties === 'object' && !Array.isArray(properties)) {
      for (const key of Object.keys(data)) {
        if (!(key in schema)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          result_target[key] = properties[key];
        }
      }
    }

    for (const [key, type] of Object.entries(schema)) {
      const property = properties[key];
      const current_path_array = [...path_array, key];

      if (property !== undefined) result_target[key] = property;

      const type_to_validate = Array.isArray(type) ? type : [type];

      for (const singleConfig of type_to_validate) {
        const type = singleConfig.type;

        if (type === 'string') {
          // TODO
        } else if (type === 'number') {
          // TODO
        } else if (type === 'boolean') {
          // TODO
        } else if (type === 'date') {
          // TODO
        } else if (type === 'object') {
          if (typeof property === 'object' && !Array.isArray(property)) {
            result_target[key] = {};

            processSchemaSingle(singleConfig.properties as SchemaSingle, property as Record<string, unknown>, result_target[key] as Record<string, unknown>, current_path_array);
          }
        } else if (type === 'array') {
          if (!Array.isArray(property)) throw new Error();

          for (let i = 0; i < property.length; i++) {
            // 5. İndeksi path dizisine ekliyoruz (örn: ['obj', 'arr', 2])
            const item = property[i];
            const itemPath = [...current_path_array, i];

            // TODO: Burada item değerini singleConfig.items (Type) kurallarına göre doğrulayacaksın
            // Hata olursa reportError(itemPath, "Hata mesajı") şeklinde çağıracaksın.

            // Örnek hata tetiklemesi:
            // if (singleConfig.items.type === 'string' && typeof item !== 'string') {
            //   reportError(itemPath, `Dizi elemanı string olmalı, ${typeof item} bulundu.`);
            // }
            (result_target[key] as unknown[]).push(item);
          }
        } else {
          // TODO
        }
      }
    }
  };

  if (Array.isArray(schema)) {
    processSchemaSingle(schema[0], properties, result);
  } else processSchemaSingle(schema, properties, result);

  if (options.validations?.abort_early === false && errors.length > 0) throw new Error(`Validation Failed: ${JSON.stringify(errors, null, 2)}`);

  return result as InferSchema<_Schema>;
};
