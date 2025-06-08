type Base = {
  pattern?: RegExp;
  default?: unknown;
  nullable: boolean;
  required: boolean;
};

type String = Base & {
  type: "string";
  min?: number;
  max?: number;
};

type Number = Base & {
  type: "number";
  min?: number;
  max?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
};

type Boolean = Base & {
  type: "boolean";
};

type Date = Base & {
  min?: number;
  max?: number;
};

type Object = Base & {
  type: "object";
  object: Schema;
};

type Array = Base & {
  min?: number;
  max?: number;
  array: Schema;
};

type Types = String | Number | Boolean | Date | Object | Array;

export type Schema = {
  [key: string]: Types;
};
