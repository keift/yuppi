

[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[Boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[Date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[Buffer]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
[Function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Void]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Undefined
[YuppiOptionsDefault]: ./src/defaults/YuppiOptions.default.ts
[Email]: ./src/patterns/Email.pattern.ts
[PhoneNumber]: ./src/patterns/PhoneNumber.pattern.ts
[URL]: ./src/patterns/URL.pattern.ts
[Username]: ./src/patterns/Username.pattern.ts
[AnyObject]: https://github.com/jquense/yup/blob/master/src/util/objectTypes.ts#L7
[JSONSchema]: https://github.com/sinclairzx81/typebox/blob/master/src/type/object/object.ts#L78
[Schema]: ./src/types/Schema.type.ts
[ValidateOptions]: https://github.com/jquense/yup/blob/master/src/types.ts#L47
[ValidationError]: https://github.com/jquense/yup/blob/master/src/ValidationError.ts#L53
[YuppiOptions]: ./src/types/YuppiOptions.type.ts

<div align="center">
  <br/>
  <img src="https://i.ibb.co/B5bQXHSM/unknown.png" width="350px"/>
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
  - [Patterns](#patterns)
  - [Types](#types)
- [Links](#links)
  - [Discord](https://discord.gg/keift)
  - [Telegram](https://t.me/keiftt)
  - [Twitter](https://x.com/keiftttt)
  - [GitHub](https://github.com/keift)
- [License](#license)

## About

Schemas that can be converted to Yup and JSON Schema.

## Features

- Easy and understandable schema
- Contains ready regex patterns
- Portable schemas as a JSON file
- Works with Yup, stable and secure
- It is strict and therefore does not accept more than one type
- Error messages are ready to be understood but can be edited if desired
- Can be converted to Yup and [JSON Schema](https://json-schema.org). JSON Schema is OpenAPI compatible

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
│   ├── validate(schema, properties)
│   ├── convertToYup(schema)
│   └── convertToJSONSchema(schema)
│
├── Patterns
│   ├── Email
│   ├── PhoneNumber
│   ├── URL
│   └── Username
│
└── type Types
    │
    ├── AnyObject
    ├── JSONSchema
    ├── Schema
    ├── ValidateOptions
    ├── ValidationError
    └── YuppiOptions
```

### Import

Briefly as follows.

> TypeScript
>
> ```typescript
> import { Yuppi, Patterns, type Types as YuppiTypes } from "yuppi";
> ```
>
> JavaScript
>
> ```javascript
> import { Yuppi, Patterns } from "yuppi";
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

### Methods

`Yuppi.validate(schema, properties)`

Validate the properties with your Yuppi schema.

> | Parameter  | Default | Description                                |
> | ---------- | ------- | ------------------------------------------ |
> | schema     |         | [Schema]<br/>Yuppi schema.                 |
> | properties |         | [AnyObject]<br/>Properties to be validate. |
>
> returns [AnyObject]
>
> Example:
>
> ```typescript
> const schema: YuppiTypes.Schema = {
>   display_name: {
>     type: "string",
>     min: 1,
>     max: 32,
>     nullable: false,
>     required: true
>   },
>
>   username: {
>     type: "string",
>     min: 3,
>     max: 16,
>     pattern: Patterns.Username,
>     nullable: false,
>     required: true
>   },
>
>   email: {
>     type: "string",
>     pattern: Patterns.Email,
>     lowercase: true,
>     nullable: false,
>     required: true
>   }
> };
>
> const properties: YuppiTypes.AnyObject = {
>   display_name: "Fırat",
>   username: "fir4tozden",
>   email: "fir4tozden@gmail.com"
> };
>
> try {
>   Yupp.validate(schema, properties);
>   /*
>     {
>       display_name: "Fırat",
>       username: "fir4tozden",
>       email: "fir4tozden@gmail.com"
>     }
>   */
> } catch((error: YuppiTypes.ValidationError)) {
>   console.log(error.message); // "Field email must match the required pattern ^[a-zA-Z0-9._%-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$"
> }
> ```

<br/>

`Yuppi.convertToYup(schema)`

Convert your Yuppi schema into Yup schema.

> | Parameter | Default | Description                |
> | --------- | ------- | -------------------------- |
> | schema    |         | [Schema]<br/>Yuppi schema. |
>
> returns [AnyObject]
>
> Example:
>
> ```typescript
> const schema: YuppiTypes.Schema = {
>   display_name: {
>     type: "string",
>     min: 1,
>     max: 32,
>     nullable: false,
>     required: true
>   },
>
>   username: {
>     type: "string",
>     min: 3,
>     max: 16,
>     pattern: Patterns.Username,
>     nullable: false,
>     required: true
>   },
>
>   email: {
>     type: "string",
>     pattern: Patterns.Email,
>     lowercase: true,
>     nullable: false,
>     required: true
>   }
> };
>
> Yupp.convertToYup(schema);
> ```

<br/>

`Yuppi.convertToJSONSchema(schema)`

Convert your Yuppi schema into [JSON Schema](https://json-schema.org).

> | Parameter | Default | Description                |
> | --------- | ------- | -------------------------- |
> | schema    |         | [Schema]<br/>Yuppi schema. |
>
> returns [AnyObject]
>
> Example:
>
> ```typescript
> const schema: YuppiTypes.Schema = {
>   display_name: {
>     type: "string",
>     min: 1,
>     max: 32,
>     nullable: false,
>     required: true
>   },
>
>   username: {
>     type: "string",
>     min: 3,
>     max: 16,
>     pattern: Patterns.Username,
>     nullable: false,
>     required: true
>   },
>
>   email: {
>     type: "string",
>     pattern: Patterns.Email,
>     lowercase: true,
>     nullable: false,
>     required: true
>   }
> };
>
> Yupp.convertToJSONSchema(schema);
> /*
>   {
>     type: "object",
>     properties: {
>       display_name: {
>         type: "string",
>         minLength: 1,
>         maxLength: 32,
>         pattern: "[\\s\\S]*"
>       },
>       username": {
>         type: "string",
>         minLength: 3,
>         maxLength: 16,
>         pattern: "^(?=.*[a-zA-Z])[a-zA-Z0-9][a-zA-Z0-9_]*$"
>       },
>       email: {
>         type: "string",
>         pattern: "^[a-zA-Z0-9._%-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$",
>       }
>     },
>     required: [
>       "display_name",
>       "username",
>       "email"
>     ]
>   }
> */
> ```

### Patterns

| Pattern       |
| ------------- |
| [Email]       |
| [PhoneNumber] |
| [URL]         |
| [Username]    |

### Types

| Type              |
| ----------------- |
| [AnyObject]       |
| [JSONSchema]      |
| [Schema]          |
| [ValidateOptions] |
| [ValidationError] |
| [YuppiOptions]    |

## Links

- [Discord](https://discord.gg/keift)
- [Telegram](https://t.me/keiftt)
- [Twitter](https://x.com/keiftttt)
- [GitHub](https://github.com/keift)

## License

MIT License

Copyright (c) 2025 Keift

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
