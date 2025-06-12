
export type Base = {
  pattern?: RegExp;
  default?: unknown;
  nullable: boolean;
  required: boolean;
};

export type String = Base & {
  type: "string";
  min?: number;
  max?: number;
};

export type Number = Base & {
  type: "number";
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
  min?: string | globalThis.Date;
  max?: string | globalThis.Date;
};

export type Object = Base & {
  type: "object";
  object: Schema;
};

export type Array = Base & {
  type: "array";
  min?: number;
  max?: number;
  array: Types;
};

export type Types = String | Number | Boolean | Date | Object | Array;

export type Schema = {
  [key: string]: Types;
};
