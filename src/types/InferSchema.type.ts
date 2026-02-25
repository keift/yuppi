import type { String, Number, Boolean, Date, Object, Array, Tuple, TypeSingle, TypeUnion, Type, SchemaSingle, SchemaUnion, Schema } from './Schema.type';

export type ApplyNullable<TypeDefinition, InferredType> = TypeDefinition extends { nullable: true } ? InferredType | null : TypeDefinition extends { default: null } ? InferredType | null : InferredType;

export type GetRequiredKeys<SchemaRecord> = {
  [Key in keyof SchemaRecord]: SchemaRecord[Key] extends { required: false } ? never : Key;
}[keyof SchemaRecord];

export type GetOptionalKeys<SchemaRecord> = {
  [Key in keyof SchemaRecord]: SchemaRecord[Key] extends { required: false } ? Key : never;
}[keyof SchemaRecord];

export type Prettify<ObjectType> = {
  [Key in keyof ObjectType]: ObjectType[Key];
};

export type InferSchemaSingle<SchemaRecord> = Prettify<
  {
    [Key in GetRequiredKeys<SchemaRecord>]: InferType<SchemaRecord[Key]>;
  } & {
    [Key in GetOptionalKeys<SchemaRecord>]?: InferType<SchemaRecord[Key]>;
  }
>;

export type InferSchemaUnion<UnionElements extends readonly unknown[]> = UnionElements extends readonly [infer FirstSchema, ...infer RestSchemas] ? (FirstSchema extends SchemaSingle ? InferSchemaSingle<FirstSchema> | InferSchemaUnion<RestSchemas> : never) : never;

export type InferTupleItems<TupleElements extends readonly unknown[]> = TupleElements extends readonly [infer FirstElement, ...infer RestElements] ? (FirstElement extends Type ? [InferType<FirstElement>, ...InferTupleItems<RestElements>] : []) : [];

export type InferObject<ObjectType extends Object> = ObjectType['properties'] extends SchemaSingle ? InferSchemaSingle<ObjectType['properties']> : ObjectType['properties'] extends SchemaUnion ? InferSchemaUnion<ObjectType['properties']> : unknown;

// eslint-disable-next-line @typescript-eslint/array-type
export type BaseInferTypeSingle<SingleType> = SingleType extends String ? (SingleType['enum'] extends (infer EnumValue)[] ? EnumValue : string) : SingleType extends Number ? (SingleType['enum'] extends (infer EnumValue)[] ? EnumValue : number) : SingleType extends Boolean ? boolean : SingleType extends Date ? Date | string : SingleType extends Object ? InferObject<SingleType> : SingleType extends Array ? InferType<SingleType['items']>[] : SingleType extends Tuple ? InferTupleItems<SingleType['items']> : unknown;

export type InferTypeUnion<UnionElements extends readonly unknown[]> = UnionElements extends readonly [infer FirstType, ...infer RestTypes] ? (FirstType extends TypeSingle ? InferType<FirstType> | InferTypeUnion<RestTypes> : never) : never;

export type InferType<TypeDefinition> = TypeDefinition extends TypeSingle ? ApplyNullable<TypeDefinition, BaseInferTypeSingle<TypeDefinition>> : TypeDefinition extends TypeUnion ? InferTypeUnion<TypeDefinition> : unknown;

export type InferSchema<SchemaDefinition extends Schema> = SchemaDefinition extends SchemaSingle ? InferSchemaSingle<SchemaDefinition> : SchemaDefinition extends SchemaUnion ? InferSchemaUnion<SchemaDefinition> : SchemaDefinition extends Type ? InferType<SchemaDefinition> : unknown;
