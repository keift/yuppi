/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import * as Yup from 'yup';

import type { AnyObject } from '../types/AnyObject.type';
import type { Schema, Types } from '../types/Schema.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';

export const convertToYup = (schema: Schema, error_messages: YuppiOptions['error_messages']) => {
  const base = (schema: AnyObject, key: string, config: Types) => {
    schema = schema.nullable();
    schema = schema.optional();

    if (config.default !== undefined) schema = schema.default(config.default);

    if (!config.nullable && config.default !== null) schema = schema.nonNullable(({ path }: { path: string }) => (error_messages?.base?.nullable ?? '').replaceAll('{path}', path));

    if (config.required)
      schema = schema.test(
        'required',
        ({ path }: { path: string }) => (error_messages?.base?.required ?? '').replaceAll('{path}', path),
        (property: unknown) => {
          if (property === undefined) return false;
          if (typeof property === 'string' && property.trim() === '') return false;

          return true;
        }
      );

    return schema;
  };

  const build = (key: string, config: Types) => {
    let schema: AnyObject;

    if (config.type === 'string') {
      schema = Yup.string().typeError(({ path }: { path: string }) => (error_messages?.string?.type ?? '').replaceAll('{path}', path));

      schema = schema.transform((property: unknown) => (typeof property === 'string' ? property.trim() : property));

      if (config.enum)
        schema = schema.oneOf(
          config.enum.map((item) => item.trim()),
          ({ path }: { path: string }) => (error_messages?.string?.enum ?? '').replaceAll('{path}', path)
        );

      if (config.pattern !== undefined) schema = schema.matches(new RegExp(config.pattern), ({ path }: { path: string }) => (error_messages?.string?.pattern ?? '').replaceAll('{path}', path).replaceAll('{pattern}', config.pattern !== undefined ? new RegExp(config.pattern).source : ''));

      if (config.min !== undefined)
        schema = schema.min(config.min, ({ path, min }: { path: string; min: number }) =>
          (error_messages?.string?.min ?? '')
            .replaceAll('{path}', path)
            .replaceAll('{min}', String(min))
            .replaceAll('{plural_suffix}', min > 1 ? 's' : '')
        );

      if (config.max !== undefined)
        schema = schema.max(config.max, ({ path, max }: { path: string; max: number }) =>
          (error_messages?.string?.max ?? '')
            .replaceAll('{path}', path)
            .replaceAll('{max}', String(max))
            .replaceAll('{plural_suffix}', max > 1 ? 's' : '')
        );

      if (config.lowercase === true) schema = schema.transform((property: unknown) => (typeof property === 'string' ? property.toLowerCase() : property));

      if (config.uppercase === true) schema = schema.transform((property: unknown) => (typeof property === 'string' ? property.toUpperCase() : property));

      schema = base(schema, key, config);

      return schema;
    } else if (config.type === 'number') {
      schema = Yup.number().typeError(({ path }: { path: string }) => (error_messages?.number?.type ?? '').replaceAll('{path}', path));

      if (config.enum) schema = schema.oneOf(config.enum, ({ path }: { path: string }) => (error_messages?.number?.enum ?? '').replaceAll('{path}', path));

      if (config.min !== undefined) schema = schema.min(config.min, ({ path, min }: { path: string; min: number }) => (error_messages?.number?.min ?? '').replaceAll('{path}', path).replaceAll('{min}', String(min)));

      if (config.max !== undefined) schema = schema.max(config.max, ({ path, max }: { path: string; max: number }) => (error_messages?.number?.max ?? '').replaceAll('{path}', path).replaceAll('{max}', String(max)));

      if (config.integer === true) schema = schema.integer(({ path }: { path: string }) => (error_messages?.number?.integer ?? '').replaceAll('{path}', path));

      if (config.positive === true) schema = schema.positive(({ path }: { path: string }) => (error_messages?.number?.positive ?? '').replaceAll('{path}', path));

      if (config.negative === true) schema = schema.negative(({ path }: { path: string }) => (error_messages?.number?.negative ?? '').replaceAll('{path}', path));

      schema = base(schema, key, config);

      return schema;
    } else if (config.type === 'boolean') {
      schema = Yup.boolean().typeError(({ path }: { path: string }) => (error_messages?.boolean?.type ?? '').replaceAll('{path}', path));

      schema = base(schema, key, config);

      return schema;
    } else if (config.type === 'date') {
      schema = Yup.date().typeError(({ path }: { path: string }) => (error_messages?.date?.type ?? '').replaceAll('{path}', path));

      if (config.min !== undefined) schema = schema.min(config.min, ({ path, min }: { path: string; min: string }) => (error_messages?.date?.min ?? '').replaceAll('{path}', path).replaceAll('{min}', new Date(min).toISOString()));

      if (config.max !== undefined) schema = schema.max(config.max, ({ path, max }: { path: string; max: string }) => (error_messages?.date?.max ?? '').replaceAll('{path}', path).replaceAll('{max}', new Date(max).toISOString()));

      schema = base(schema, key, config);

      return schema;
    } else if (config.type === 'object') {
      schema = Yup.object().typeError(({ path }: { path: string }) => (error_messages?.object?.type ?? '').replaceAll('{path}', path));

      const nested_properties: AnyObject = {};

      for (const [nested_key, nested_config] of Object.entries(config.properties)) nested_properties[nested_key] = build(nested_key, nested_config);

      schema = schema.shape(nested_properties);

      schema = base(schema, key, config);

      return schema;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (config.type === 'array') {
      schema = Yup.array().typeError(({ path }: { path: string }) => (error_messages?.array?.type ?? '').replaceAll('{path}', path));

      if (config.min !== undefined)
        schema = schema.min(config.min, ({ path, min }: { path: string; min: number }) =>
          (error_messages?.array?.min ?? '')
            .replaceAll('{path}', path)
            .replaceAll('{min}', String(min))
            .replaceAll('{plural_suffix}', min > 1 ? 's' : '')
        );

      if (config.max !== undefined)
        schema = schema.max(config.max, ({ path, max }: { path: string; max: number }) =>
          (error_messages?.array?.max ?? '')
            .replaceAll('{path}', path)
            .replaceAll('{max}', String(max))
            .replaceAll('{plural_suffix}', max > 1 ? 's' : '')
        );

      schema = schema.of(build(key, config.items));

      schema = base(schema, key, config);

      return schema;
    } else throw new Error(`Unsupported schema type for ${key}`);
  };

  const properties: AnyObject = {};

  for (const [key, config] of Object.entries(schema)) properties[key] = build(key, config);

  return Yup.object().shape(properties);
};
