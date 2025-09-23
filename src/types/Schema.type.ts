/* eslint-disable @typescript-eslint/array-type */

export type String = {
  type: 'string';
  enum?: string[];
  pattern?: string;
  min?: number;
  max?: number;
  lowercase?: boolean;
  uppercase?: boolean;
  default?: string;
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
  default?: number;
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
  min?: string;
  max?: string;
  default?: string;
  nullable: boolean;
  required: boolean;
};

export type Object = {
  type: 'object';
  properties: Schema;
  default?: Schema;
  nullable: boolean;
  required: boolean;
};

export type Array = {
  type: 'array';
  min?: number;
  max?: number;
  items: Types;
  default?: Types;
  nullable: boolean;
  required: boolean;
};

export type Types = String | Number | Boolean | Date | Object | Array;

export type Schema = Record<string, Types>;


