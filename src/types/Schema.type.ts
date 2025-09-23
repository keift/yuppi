/* eslint-disable @typescript-eslint/array-type */

export type String = {
  type: 'string';
  default?: string;
  enum?: string[];
  pattern?: string;
  min?: number;
  max?: number;
  lowercase?: boolean;
  uppercase?: boolean;
  nullable: boolean;
  required: boolean;
};

export type Number = {
  type: 'number';
  default?: number;
  enum?: number[];
  min?: number;
  max?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
  nullable: boolean;
  required: boolean;
};

export type Boolean = {
  type: 'boolean';
  default?: boolean;
  nullable: boolean;
  required: boolean;
};

export type Date = {
  type: 'date';
  default?: string;
  min?: string;
  max?: string;
  nullable: boolean;
  required: boolean;
};

export type Object = {
  type: 'object';
  default?: Schema;
  properties: Schema;
  nullable: boolean;
  required: boolean;
};

export type Array = {
  type: 'array';
  default?: Types;
  min?: number;
  max?: number;
  items: Types;
  nullable: boolean;
  required: boolean;
};

export type Types = String | Number | Boolean | Date | Object | Array;

export type Schema = Record<string, Types>;
