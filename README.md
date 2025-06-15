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
[Fs]: ./src/types/Fs.type.ts

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
  - [Methods](#methods)
  - [Types](#types)
- [Links](#links)
  - [Change Log](CHANGELOG.md)

## About

Write your schemas in JSON then convert to Yup and OpenAPI.

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
├── new Snowflake(options?)
│   │
│   ├── generate()
│   └── resolve(id)
│
├── new Symbolic(options?)
│   │
│   ├── generate()
│   └── resolve(id)
│
└── type Types
    │
    ├── SnowflakeOptions
    ├── SnowflakeResolve
    ├── SymbolicOptions
    └── SymbolicResolve
```

### Import

Briefly as follows.

> TypeScript
>
> ```typescript
> import { Schema, type Types as YuppiTypes } from "yuppi";
> ```
>
> JavaScript
>
> ```javascript
> import { Schema } from "yuppi";
> ```

### Methods

`fs.readFile(filepath, options?)`

Read file asynchronous.

> | Parameter | Description                                                                                                                    |
> | --------- | ------------------------------------------------------------------------------------------------------------------------------ |
> | filepath  | [String]<br/>File path to read.                                                                                                |
> | options   | [Object] (optional)<br/>Method options. [More details](https://github.com/fabiospampinato/atomically?tab=readme-ov-file#usage) |
>
> returns [Promise]<[String] | [Buffer]>
>
> Example:
>
> ```typescript
> const reading: string | Buffer = await fs.readFile("./config.json");
> ```

### Types

> | Type | Place          |
> | ---- | -------------- |
> | [Fs] | [fs](#methods) |
>
> Example:
>
> ```typescript
> import { fs, type Types as TrufsTypes } from "trufs";
>
> const Trufs: TrufsTypes.Fs = fs;
>
> const writing: unknown = Trufs.writeFileSync("./config.json", JSON.stringify({}));
> const reading: string | Buffer = Trufs.readFileSync("./config.json");
> ```

## Links

- [Change Log](CHANGELOG.md)

## License

[MIT](LICENSE.md)
