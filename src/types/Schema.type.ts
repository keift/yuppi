/* eslint-disable @typescript-eslint/array-type */

export type Base = {
  pattern?: string;
  default?: unknown;
  nullable: boolean;
  required: boolean;
};

export type String = Base & {
  type: "string";
  enum?: string[];
  min?: number;
  max?: number;
  lowercase?: boolean;
  uppercase?: boolean;
};

export type Number = Base & {
  type: "number";
  enum?: number[];
  min?: number;
  max?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
};

export type Boolean = Base & {
  type: "boolean";
};

export type Date = Base & {
  type: "date";
  min?: string;
  max?: string;
};

export type Object = Base & {
  type: "object";
  properties: Schema;
};

export type Array = Base & {
  type: "array";
  min?: number;
  max?: number;
  items: Types;
};

export type Types = String | Number | Boolean | Date | Object | Array;

export type Schema = Record<string, Types>;
