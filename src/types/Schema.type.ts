export type String = {
  type: 'string';
  enum?: string[];
  pattern?: string;
  minimum?: number;
  maximum?: number;
  default?: string | null;
  trim?: boolean; // Default: true
  lowercase?: boolean;
  uppercase?: boolean;
  nullable?: boolean;
  required?: boolean; // Default: true
};

export type Number = {
  type: 'number';
  enum?: number[];
  minimum?: number;
  maximum?: number;
  integer?: boolean;
  positive?: boolean;
  negative?: boolean;
  default?: number | null;
  nullable?: boolean;
  required?: boolean; // Default: true
};

export type Boolean = {
  type: 'boolean';
  default?: boolean | null;
  nullable?: boolean;
  required?: boolean; // Default: true
};

export type Date = {
  type: 'date';
  minimum?: string;
  maximum?: string;
  default?: string | null;
  nullable?: boolean;
  required?: boolean; // Default: true
};

export type Object = {
  type: 'object';
  properties: Schema;
  default?: Record<string, unknown> | null;
  nullable?: boolean;
  required?: boolean; // Default: true
};

export type Array = {
  type: 'array';
  minimum?: number;
  maximum?: number;
  items: Type;
  default?: unknown[] | null;
  nullable?: boolean;
  required?: boolean; // Default: true
};

export type Tuple = {
  type: 'tuple';
  items: Type[];
  default?: unknown[] | null;
  nullable?: boolean;
  required?: boolean; // Default: true
};

// eslint-disable-next-line @typescript-eslint/array-type
export type TypeSingle = String | Number | Boolean | Date | Object | Array | Tuple;

export type TypeUnion = [TypeSingle, TypeSingle, ...TypeSingle[]];

export type Type = TypeSingle | TypeUnion;

export type SchemaSingle = Record<string, Type>;

export type SchemaUnion = [SchemaSingle, SchemaSingle, ...SchemaSingle[]];

export type Schema = SchemaSingle | SchemaUnion;
