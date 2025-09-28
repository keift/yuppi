/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import * as Yup from 'yup';

import { Any as AnyPattern } from '../patterns/Any.pattern';

import type { AnyObject } from '../types/AnyObject.type';
import type { Schema, Types } from '../types/Schema.type';
import type { YuppiOptions } from '../types/YuppiOptions.type';

export const convertToYup = (schema: Schema, error_messages: YuppiOptions['error_messages']) => {
  const base = (schema: AnyObject, key: string, config: Types) => {
    schema = schema.nullable();

    if (config.required)
      schema = schema.test(
        'required',
        ({ path }: { path: string }) => (error_messages?.base?.required ?? '').replaceAll('{path}', path),
        (property: unknown) => {
          if (property === undefined) return false;
          if (typeof property === 'string' && property.trim() === '') return false;
          if (Array.isArray(property) && property.length === 0) return false;

          return true;
        }
      );

    if (!config.nullable && config.default !== null) schema = schema.nonNullable(({ path }: { path: string }) => (error_messages?.base?.nullable ?? '').replaceAll('{path}', path));

    if (config.default) schema = schema.default(config.default);

    return schema;
  };

  const build = (key: string, config: Types) => {
    let schema: AnyObject;

    if (config.type === 'string') {
      schema = Yup.string().typeError(({ path }: { path: string }) => (error_messages?.string?.type ?? '').replaceAll('{path}', path));
      schema = base(schema, key, config);

      schema = schema.transform((property: unknown) => (typeof property === 'string' ? property.trim() : property));

      if (config.enum)
        schema = schema.oneOf(
          config.enum.map((item) => item.trim()),
          ({ path }: { path: string }) => (error_messages?.string?.enum ?? '').replaceAll('{path}', path)
        );

      if (config.pattern) schema = schema.matches(new RegExp(config.pattern ?? AnyPattern), ({ path }: { path: string }) => (error_messages?.string?.pattern ?? '').replaceAll('{path}', path).replaceAll('{pattern}', new RegExp(config.pattern ?? AnyPattern).source));

      if (config.min)
        schema = schema.min(config.min, ({ path, min }: { path: string; min: number }) =>
          (error_messages?.string?.min ?? '')
            .replaceAll('{path}', path)
            .replaceAll('{min}', min.toString())
            .replaceAll('{plural_suffix}', min > 1 ? 's' : '')
        );

      if (config.max)
        schema = schema.max(config.max, ({ path, max }: { path: string; max: number }) =>
          (error_messages?.string?.max ?? '')
            .replaceAll('{path}', path)
            .replaceAll('{max}', max.toString())
            .replaceAll('{plural_suffix}', max > 1 ? 's' : '')
        );

      if (config.lowercase) schema = schema.transform((property: unknown) => (typeof property === 'string' ? property.toLowerCase() : property));

      if (config.uppercase) schema = schema.transform((property: unknown) => (typeof property === 'string' ? property.toUpperCase() : property));

      return schema;
    } else if (config.type === 'number') {
      schema = Yup.number().typeError(({ path }: { path: string }) => (error_messages?.number?.type ?? '').replaceAll('{path}', path));
      schema = base(schema, key, config);

      if (config.enum) schema = schema.oneOf(config.enum, ({ path }: { path: string }) => (error_messages?.number?.enum ?? '').replaceAll('{path}', path));

      if (config.min) schema = schema.min(config.min, ({ path, min }: { path: string; min: number }) => (error_messages?.number?.min ?? '').replaceAll('{path}', path).replaceAll('{min}', min.toString()));

      if (config.max) schema = schema.max(config.max, ({ path, max }: { path: string; max: number }) => (error_messages?.number?.max ?? '').replaceAll('{path}', path).replaceAll('{max}', max.toString()));

      if (config.integer) schema = schema.integer(({ path }: { path: string }) => (error_messages?.number?.integer ?? '').replaceAll('{path}', path));

      if (config.positive) schema = schema.positive(({ path }: { path: string }) => (error_messages?.number?.positive ?? '').replaceAll('{path}', path));

      if (config.negative) schema = schema.negative(({ path }: { path: string }) => (error_messages?.number?.negative ?? '').replaceAll('{path}', path));

      return schema;
    } else if (config.type === 'boolean') {
      schema = Yup.boolean().typeError(({ path }: { path: string }) => (error_messages?.boolean?.type ?? '').replaceAll('{path}', path));
      schema = base(schema, key, config);

      return schema;
    } else if (config.type === 'date') {
      schema = Yup.date().typeError(({ path }: { path: string }) => (error_messages?.date?.type ?? '').replaceAll('{path}', path));
      schema = base(schema, key, config);

      if (config.min) schema = schema.min(config.min, ({ path, min }: { path: string; min: number }) => (error_messages?.date?.min ?? '').replaceAll('{path}', path).replaceAll('{min}', new Date(min).toISOString()));

      if (config.max) schema = schema.max(config.max, ({ path, max }: { path: string; max: number }) => (error_messages?.date?.max ?? '').replaceAll('{path}', path).replaceAll('{max}', new Date(max).toISOString()));

      return schema;
    } else if (config.type === 'object') {
      schema = Yup.object().typeError(({ path }: { path: string }) => (error_messages?.object?.type ?? '').replaceAll('{path}', path));
      schema = base(schema, key, config);

      const nested_properties: AnyObject = {};

      for (const [nested_key, nested_config] of Object.entries(config.properties)) nested_properties[nested_key] = build(nested_key, nested_config);

      schema = schema.shape(nested_properties);

      return schema;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (config.type === 'array') {
      schema = Yup.array().typeError(({ path }: { path: string }) => (error_messages?.array?.type ?? '').replaceAll('{path}', path));
      schema = base(schema, key, config);

      if (config.min)
        schema = schema.min(config.min, ({ path, min }: { path: string; min: number }) =>
          (error_messages?.array?.min ?? '')
            .replaceAll('{path}', path)
            .replaceAll('{min}', min.toString())
            .replaceAll('{plural_suffix}', min > 1 ? 's' : '')
        );

      if (config.max)
        schema = schema.max(config.max, ({ path, max }: { path: string; max: number }) =>
          (error_messages?.array?.max ?? '')
            .replaceAll('{path}', path)
            .replaceAll('{max}', max.toString())
            .replaceAll('{plural_suffix}', max > 1 ? 's' : '')
        );

      schema = schema.of(build(key, config.items));

      return schema;
    } else throw new Error(`Unsupported schema type for ${key}`);
  };

  const properties: AnyObject = {};

  for (const [key, config] of Object.entries(schema)) properties[key] = build(key, config);

  return Yup.object().shape(properties);
};
