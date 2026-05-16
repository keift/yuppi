export type String = {
  type: 'string';
  enum?: string[];
  pattern?: string;
  min?: number;
  max?: number;
  default?: string | null;
  trim?: boolean; // Default: true
  lowercase?: boolean;
  uppercase?: boolean;
  nullable?: boolean; // If the default is null, it is assumed to be true.
  required?: boolean; // Default: true
};

export type Number = {
  type: 'number';
  enum?: number[];
  min?: number;
  max?: number;
  integer?: boolean;
  default?: number | null;
  nullable?: boolean; // If the default is null, it is assumed to be true.
  required?: boolean; // Default: true
};

export type Boolean = {
  type: 'boolean';
  default?: boolean | null;
  nullable?: boolean; // If the default is null, it is assumed to be true.
  required?: boolean; // Default: true
};

export type Date = {
  type: 'date';
  min?: string;
  max?: string;
  default?: string | null;
  nullable?: boolean; // If the default is null, it is assumed to be true.
  required?: boolean; // Default: true
};

export type Object = {
  type: 'object';
  properties: SchemaSingle | SchemaUnion;
  default?: Record<string, unknown> | null;
  nullable?: boolean; // If the default is null, it is assumed to be true.
  required?: boolean; // Default: true
};

export type Array = {
  type: 'array';
  min?: number;
  max?: number;
  items: Type;
  default?: unknown[] | null;
  nullable?: boolean; // If the default is null, it is assumed to be true.
  required?: boolean; // Default: true
};

export type Tuple = {
  type: 'tuple';
  items: Type[];
  default?: unknown[] | null;
  nullable?: boolean; // If the default is null, it is assumed to be true.
  required?: boolean; // Default: true
};

// eslint-disable-next-line @typescript-eslint/array-type
export type TypeSingle = String | Number | Boolean | Date | Object | Array | Tuple;

export type TypeUnion = [TypeSingle, TypeSingle, ...TypeSingle[]];

export type Type = TypeSingle | TypeUnion;

export type SchemaSingle = Record<string, Type>;

export type SchemaUnion = [SchemaSingle, SchemaSingle, ...SchemaSingle[]];

export type Schema = SchemaSingle | SchemaUnion | Type;
