export type Base = {
  pattern?: string;
  default?: unknown;
  nullable: boolean;
  required: boolean;
};

export type _String = Base & {
  type: "string";
  enum?: string[];
  min?: number;
  max?: number;
  lowercase?: boolean;
  uppercase?: boolean;
};

export type _Number = Base & {
  type: "number";
  enum?: number[];
  min?: number;
  max?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
};

export type _Boolean = Base & {
  type: "boolean";
};

export type _Date = Base & {
  type: "date";
  min?: string;
  max?: string;
};

export type _Object = Base & {
  type: "object";
  properties: Schema;
};

export type _Array = Base & {
  type: "array";
  min?: number;
  max?: number;
  items: Types;
};

export type Types = _String | _Number | _Boolean | _Date | _Object | _Array;

export type Schema = Record<string, Types>;
