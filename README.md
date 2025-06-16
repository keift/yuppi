[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[Date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[Boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[Buffer]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
[Function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Void]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Undefined
[YuppiOptionsDefault]: ./src/defaults/YuppiOptions.default.ts
[AnyObject]: ./src/types/AnyObject.type.ts
[JSONSchema]: ./src/types/JSONSchema.type.ts
[Schema]: ./src/types/Schema.type.ts
[ValidateOptions]: ./src/types/ValidateOptions.type.ts
[YuppiOptions]: ./src/types/YuppiOptions.type.ts

<div align="center">
  <br/>
  <img src="https://i.ibb.co/kVmjj374/logo.png" width="350px"/>
  <br/>
  <br/>
  <img src="https://img.shields.io/npm/v/yuppi?label=version&color=%23633BFF"/>
  <img src="https://img.shields.io/npm/l/yuppi?label=license&color=%23633BFF"/>
  <img src="https://img.shields.io/npm/dt/yuppi?label=downloads&color=%2300927F"/>
  <img src="https://img.shields.io/npm/unpacked-size/yuppi?label=size&color=%2300927F"/>
</div>

## Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Documentation](#documentation)
  - [Tree](#tree)
  - [Import](#import)
  - [Constructors](#constructors)
  - [Methods](#methods)
  - [Types](#types)
- [Links](#links)
  - [Change Log](CHANGELOG.md)

## About

Schemas that can be converted to Yup and JSON Schema.

## Features

- Can be converted to OpenAPI schema.

## Installation

You can install it as follows.

```shell
// NPM
npm install yuppi

// PNPM
pnpm install yuppi

// Yarn
yarn add yuppi

// Bun
bun add yuppi

// Deno
deno install npm:yuppi
```

## Documentation

### Tree

Briefly as follows.

```typescript
Yuppi
│
├── new Yuppi(options?)
│   │
│   ├── validate(schema, fields)
│   ├── convertToYup(schema)
│   └── convertToJSONSchema(schema)
│
└── type Types
    │
    ├── AnyObject
    ├── JSONSchema
    ├── Schema
    └── YuppiOptions
```

### Import

Briefly as follows.

> TypeScript
>
> ```typescript
> import { Yuppi, type Types as YuppiTypes } from "yuppi";
> ```
>
> JavaScript
>
> ```javascript
> import { Yuppi } from "yuppi";
> ```

### Constructors

`new Yuppi(options?)`

Yuppi schema builder.

> | Parameter | Default               | Description                                          |
> | --------- | --------------------- | ---------------------------------------------------- |
> | options   | [YuppiOptionsDefault] | [YuppiOptions] (optional)<br/>Constructor's options. |
>
> Example:
>
> ```typescript
> const Yupp: Yuppi = new Yuppi();
> ```

<br/>

### Methods

`Yuppi.validate(schema, fields)`

Read file asynchronous.

> | Parameter | Description                                |
> | --------- | ------------------------------------------ |
> | schema    | [Schema]<br/>Yuppi schema.            |
> | fields    | [AnyObject] (optional)<br/>Object to be validate. |
>
> returns [Promise]<[AnyObject]>
>
> Example:
>
> ```typescript
> const validation: YuppiTypes.AnyObject = await Yuppi.validate({
>   
> });
> ```

### Types

> | Type           |
> | -------------- |
> | [AnyObject]    |
> | [JSONSchema]   |
> | [Schema]       |
> | [YuppiOptions] |
>
> Example:
>
> ```typescript
> import { Yuppi, type Types as YuppiTypes } from "yuppi";
>
> const Yupp: Yuppi = new Yuppi();
> ```

## Links

- [Change Log](CHANGELOG.md)

## License

[MIT](LICENSE.md)
