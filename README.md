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
  - [Import](#import)
  - [Methods](#methods)
  - [Types](#types)
- [Links](#links)
  - [Change Log](CHANGELOG.md)

## About

Trusty file methods.

## Features

- Respects CommonJS
- Secure with [Atomically](https://github.com/fabiospampinato/atomically)
- Functional with [FS Extra](https://github.com/jprichardson/node-fs-extra)
- Stable with [Graceful FS](https://github.com/isaacs/node-graceful-fs)

## Installation

You can install it as follows.

```shell
// NPM
npm install trufs

// PNPM
pnpm install trufs

// Yarn
yarn add trufs

// Bun
bun add trufs

// Deno
deno install npm:trufs
```

## Documentation

### Import

It is enough to change the `fs` to `trufs`.

> TypeScript
>
> ```diff
> - import fs from "fs";
> + import { fs, type Types as TrufsTypes } from "trufs";
> ```
>
> JavaScript
>
> ```diff
> - import fs from "fs";
> + import { fs } from "trufs";
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

<br/>

`fs.readFileSync(filepath, options?)`

Read file synchronous.

> | Parameter | Description                                                                                                                    |
> | --------- | ------------------------------------------------------------------------------------------------------------------------------ |
> | filepath  | [String]<br/>File path to read.                                                                                                |
> | options   | [Object] (optional)<br/>Method options. [More details](https://github.com/fabiospampinato/atomically?tab=readme-ov-file#usage) |
>
> returns [String] | [Buffer]
>
> Example:
>
> ```typescript
> const reading: string | Buffer = fs.readFileSync("./config.json");
> ```

<br/>

`fs.writeFile(filepath, data, options?)`

Write file asynchronous.

> | Parameter | Description                                                                                                                    |
> | --------- | ------------------------------------------------------------------------------------------------------------------------------ |
> | filepath  | [String]<br/>File path to write.                                                                                               |
> | data      | [String] \| [Buffer]<br/>Data to be written.                                                                                   |
> | options   | [Object] (optional)<br/>Method options. [More details](https://github.com/fabiospampinato/atomically?tab=readme-ov-file#usage) |
>
> returns [Promise]<[Void]>
>
> Example:
>
> ```typescript
> const writing: unknown = await fs.writeFile("./config.json", JSON.stringify({}));
> ```

<br/>

`fs.writeFileSync(filepath, data, options?)`

Write file synchronous.

> | Parameter | Description                                                                                                                    |
> | --------- | ------------------------------------------------------------------------------------------------------------------------------ |
> | filepath  | [String]<br/>File path to write.                                                                                               |
> | data      | [String] \| [Buffer]<br/>Data to be written.                                                                                   |
> | options   | [Object] (optional)<br/>Method options. [More details](https://github.com/fabiospampinato/atomically?tab=readme-ov-file#usage) |
>
> returns [Void]
>
> Example:
>
> ```typescript
> const writing: unknown = fs.writeFileSync("./config.json", JSON.stringify({}));
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
