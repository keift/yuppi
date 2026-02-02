/* eslint-disable @typescript-eslint/array-type */

export type String = {
  type: 'string';
  enum?: string[];
  pattern?: string;
  min?: number;
  max?: number;
  lowercase?: boolean;
  uppercase?: boolean;
  default?: string | null;
  nullable: boolean;
  required: boolean;
};

export type Number = {
  type: 'number';
  enum?: number[];
  min?: number;
  max?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
  default?: number | null;
  nullable: boolean;
  required: boolean;
};

export type Boolean = {
  type: 'boolean';
  default?: boolean | null;
  nullable: boolean;
  required: boolean;
};

export type Date = {
  type: 'date';
  min?: string;
  max?: string;
  default?: string | null;
  nullable: boolean;
  required: boolean;
};

export type Object = {
  type: 'object';
  properties: Schema;
  default?: Record<string, unknown> | null;
  nullable: boolean;
  required: boolean;
};

export type Array = {
  type: 'array';
  min?: number;
  max?: number;
  items: Types;
  default?: unknown[] | null;
  nullable: boolean;
  required: boolean;
};

export type Type = String | Number | Boolean | Date | Object | Array;

export type Union = [Type, Type, ...Type[]];

export type Types = Type | Union;

export type Schema = Record<string, Types>;
