type Prettify<TargetType> = {
  [Key in keyof TargetType]: TargetType[Key];
} & {};

type IsOptional<TargetType> = TargetType extends readonly unknown[] ? (Exclude<TargetType[number], { required: false }> extends never ? true : false) : TargetType extends { required: false } ? true : false;

type ApplyNullable<TargetType, SchemaDefinition> = SchemaDefinition extends { nullable: true } ? TargetType | null : SchemaDefinition extends { default: null } ? TargetType | null : TargetType;

type InferTypeSingle<TypeDefinition> = TypeDefinition extends { type: 'string' } ? (TypeDefinition extends { enum: readonly (infer EnumElement)[] } ? EnumElement : string) : TypeDefinition extends { type: 'number' } ? (TypeDefinition extends { enum: readonly (infer EnumElement)[] } ? EnumElement : number) : TypeDefinition extends { type: 'boolean' } ? boolean : TypeDefinition extends { type: 'date' } ? string : TypeDefinition extends { type: 'object'; properties: infer NestedProperties } ? InferSchema<NestedProperties> : TypeDefinition extends { type: 'array'; items: infer ArrayItems } ? InferType<ArrayItems>[] : TypeDefinition extends { type: 'tuple'; items: infer TupleItems } ? (TupleItems extends readonly unknown[] ? { [Key in keyof TupleItems]: InferType<TupleItems[Key]> } : never) : never;

type InferType<TypeDefinition> = TypeDefinition extends readonly unknown[] ? InferType<TypeDefinition[number]> : ApplyNullable<InferTypeSingle<TypeDefinition>, TypeDefinition>;

type RequiredKeys<SchemaDefinition> = {
  [Key in keyof SchemaDefinition]: IsOptional<SchemaDefinition[Key]> extends true ? never : Key;
}[keyof SchemaDefinition];

type OptionalKeys<SchemaDefinition> = Exclude<keyof SchemaDefinition, RequiredKeys<SchemaDefinition>>;

type InferSchemaSingle<SchemaDefinition> = Prettify<{ [Key in RequiredKeys<SchemaDefinition>]: InferType<SchemaDefinition[Key]> } & { [Key in OptionalKeys<SchemaDefinition>]?: InferType<SchemaDefinition[Key]> }>;

export type InferSchema<SchemaDefinition> = SchemaDefinition extends readonly unknown[] ? InferSchemaSingle<SchemaDefinition[number]> : InferSchemaSingle<SchemaDefinition>;
