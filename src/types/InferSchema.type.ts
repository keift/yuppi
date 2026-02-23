export type Prettify<Type> = {
  [Key in keyof Type]: Type[Key];
} & {};

type InferBaseType<Type> = Type extends { type: 'string' } ? (Type extends { enum: readonly (infer EnumValues)[] } ? EnumValues : string) : Type extends { type: 'number' } ? (Type extends { enum: readonly (infer EnumValues)[] } ? EnumValues : number) : Type extends { type: 'boolean' } ? boolean : Type extends { type: 'date' } ? Date : Type extends { type: 'object'; properties: infer Properties } ? InferSchema<Properties> : Type extends { type: 'array'; items: infer Items } ? InferType<Items>[] : never;

type ApplyNullable<Type, Definition> = Definition extends { nullable: true } ? Type | null : Type;

type InferTypeSingle<Type> = Type extends unknown ? ApplyNullable<InferBaseType<Type>, Type> : never;

type InferType<Type> = Type extends readonly unknown[] ? InferTypeSingle<Type[number]> : InferTypeSingle<Type>;

type IsOptional<Type> = Type extends readonly [infer First, ...unknown[]] ? (First extends { required: false } ? ('default' extends keyof First ? false : true) : false) : Type extends { required: false } ? ('default' extends keyof Type ? false : true) : false;

type RequiredKeys<Schema> = {
  [Key in keyof Schema]: IsOptional<Schema[Key]> extends true ? never : Key;
}[keyof Schema];

type OptionalKeys<Schema> = {
  [Key in keyof Schema]: IsOptional<Schema[Key]> extends true ? Key : never;
}[keyof Schema];

type InferSchemaSingle<Schema> = Prettify<{ [Key in RequiredKeys<Schema>]: InferType<Schema[Key]> } & { [Key in OptionalKeys<Schema>]?: InferType<Schema[Key]> }>;

type DistributeSchema<Schema> = Schema extends unknown ? InferSchemaSingle<Schema> : never;

export type InferSchema<Schema> = Schema extends readonly unknown[] ? DistributeSchema<Schema[number]> : InferSchemaSingle<Schema>;
