import type { Schema, SchemaSingle, SchemaUnion, Type, TypeSingle, TypeUnion } from './Schema.type';

type InferString<StringType extends { type: 'string' }> = StringType extends { enum: readonly (infer EnumValue)[] } ? (StringType extends { required: false } ? EnumValue | undefined : StringType extends { nullable: true } ? EnumValue | null : StringType extends { default: null } ? EnumValue | null : EnumValue) : StringType extends { required: false } ? string | undefined : StringType extends { nullable: true } ? string | null : StringType extends { default: null } ? string | null : string;

type InferNumber<NumberType extends { type: 'number' }> = NumberType extends { enum: readonly (infer EnumValue)[] } ? (NumberType extends { required: false } ? EnumValue | undefined : NumberType extends { nullable: true } ? EnumValue | null : NumberType extends { default: null } ? EnumValue | null : EnumValue) : NumberType extends { required: false } ? number | undefined : NumberType extends { nullable: true } ? number | null : NumberType extends { default: null } ? number | null : number;

type InferBoolean<BooleanType extends { type: 'boolean' }> = BooleanType extends { required: false } ? boolean | undefined : BooleanType extends { nullable: true } ? boolean | null : BooleanType extends { default: null } ? boolean | null : boolean;

type InferDate<DateType extends { type: 'date' }> = DateType extends { required: false } ? Date | undefined : DateType extends { nullable: true } ? Date | null : DateType extends { default: null } ? Date | null : Date;

type InferObject<ObjectType extends { type: 'object'; properties: SchemaSingle | SchemaUnion }> = ObjectType extends { required: false } ? InferSchema<ObjectType['properties']> | undefined : ObjectType extends { nullable: true } ? InferSchema<ObjectType['properties']> | null : ObjectType extends { default: null } ? InferSchema<ObjectType['properties']> | null : InferSchema<ObjectType['properties']>;

type InferArray<ArrayType extends { type: 'array'; items: Type }> = ArrayType extends { required: false } ? InferType<ArrayType['items']>[] | undefined : ArrayType extends { nullable: true } ? InferType<ArrayType['items']>[] | null : ArrayType extends { default: null } ? InferType<ArrayType['items']>[] | null : InferType<ArrayType['items']>[];

type InferTuple<TupleType extends { type: 'tuple'; items: Type[] }> = TupleType extends { required: false } ? InferTupleItems<TupleType['items']> | undefined : TupleType extends { nullable: true } ? InferTupleItems<TupleType['items']> | null : TupleType extends { default: null } ? InferTupleItems<TupleType['items']> | null : InferTupleItems<TupleType['items']>;

type InferTupleItems<Items extends Type[]> = {
  [Index in keyof Items]: InferType<Items[Index]>;
};

type InferTypeSingle<SingleType extends TypeSingle> = SingleType extends { type: 'string' } ? InferString<SingleType> : SingleType extends { type: 'number' } ? InferNumber<SingleType> : SingleType extends { type: 'boolean' } ? InferBoolean<SingleType> : SingleType extends { type: 'date' } ? InferDate<SingleType> : SingleType extends { type: 'object'; properties: SchemaSingle | SchemaUnion } ? InferObject<SingleType> : SingleType extends { type: 'array'; items: Type } ? InferArray<SingleType> : SingleType extends { type: 'tuple'; items: Type[] } ? InferTuple<SingleType> : never;

type InferTypeUnion<UnionType extends TypeUnion> = InferTypeSingle<UnionType[number]>;

type InferType<FieldType extends Type> = FieldType extends TypeUnion ? InferTypeUnion<FieldType> : FieldType extends TypeSingle ? InferTypeSingle<FieldType> : never;

type InferSchemaSingle<SchemaShape extends SchemaSingle> = {
  [Key in keyof SchemaShape as SchemaShape[Key] extends { required: false } ? never : Key]: InferType<SchemaShape[Key]>;
} & {
  [Key in keyof SchemaShape as SchemaShape[Key] extends { required: false } ? Key : never]?: InferType<SchemaShape[Key]>;
};

type InferSchemaUnion<UnionShape extends SchemaUnion> = {
  [Index in keyof UnionShape]: UnionShape[Index] extends SchemaSingle ? InferSchemaSingle<UnionShape[Index]> : never;
}[number];

export type InferSchema<InputSchema extends Schema> = InputSchema extends SchemaUnion ? InferSchemaUnion<InputSchema> : InputSchema extends SchemaSingle ? InferSchemaSingle<InputSchema> : InputSchema extends TypeUnion ? InferTypeUnion<InputSchema> : InputSchema extends TypeSingle ? InferTypeSingle<InputSchema> : never;
