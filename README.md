[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[Boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[Date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[Buffer]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Void]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Undefined
[Null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null
[Undefined]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Undefined

<!---->

[Domain]: ./src/patterns/Domain.pattern.ts
[Email]: ./src/patterns/Email.pattern.ts
[HTTP]: ./src/patterns/HTTP.pattern.ts
[PhoneNumber]: ./src/patterns/PhoneNumber.pattern.ts
[URI]: ./src/patterns/URI.pattern.ts
[Username]: ./src/patterns/Username.pattern.ts

<!---->

[YuppiOptionsDefault]: ./src/defaults/YuppiOptions.default.ts

<!---->

[InferSchema]: ./src/types/InferSchema.type.ts
[JSONSchema]: ./src/types/JSONSchema.type.ts
[Schema]: ./src/types/Schema.type.ts
[ValidationError]: ./src/types/ValidationError.type.ts
[YuppiOptions]: ./src/types/YuppiOptions.type.ts

<div align="center">
  <br/>
  <img src="./assets/logo.png" width="350px"/>
  <br/>
  <br/>
  <img src="https://img.shields.io/npm/v/yuppi?label=version&color=615fff"/>
  <img src="https://img.shields.io/npm/l/yuppi?label=license&color=615fff"/>
  <img src="https://img.shields.io/npm/dt/yuppi?label=downloads&color=00bc7d"/>
  <img src="https://img.shields.io/npm/unpacked-size/yuppi?label=size&color=00bc7d"/>
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
  - [Telegram](https://t.me/keiftco)
  - [Twitter](https://x.com/keiftco)
  - [GitHub](https://github.com/keift)
- [License](#license)

## About

Portable and simple schemas for property validation.

## Features

- Easy and understandable schemas
- Contains ready regex patterns
- Portable schemas as a JSON file
- Schemas can be declared for TypeScript
- Schemas can be converted to [JSON Schema](https://json-schema.org). JSON Schema is OpenAPI compatible
- Error messages are ready to be understood but can be edited if desired

## Installation

You can install it as follows.

```shell
# NPM
npm add yuppi

# PNPM
pnpm add yuppi

# Yarn
yarn add yuppi

# Bun
bun add yuppi

# Deno
deno add yuppi
```

## Documentation

### Tree

Briefly as follows.

```typescript
yuppi
│
├── new Yuppi(options?)
│   │
│   └── schema(schema)
│       │
│       ├── validate(data)
│       ├── declare(name)
│       └── toJSONSchema()
│
├── Patterns
│   │
│   ├── Domain
│   ├── Email
│   ├── HTTP
│   ├── PhoneNumber
│   ├── URI
│   └── Username
│
├── type InferSchema
├── type JSONSchema
├── type Schema
├── ValidationError
└── type YuppiOptions
```

### Import

Briefly as follows.

```typescript
import { Yuppi, Patterns } from 'yuppi';
```

### Constructors

`new Yuppi(options?)`

Yuppi schema builder.

> | Parameter  | Type           | Default               | Description            |
> | ---------- | -------------- | --------------------- | ---------------------- |
> | `options?` | [YuppiOptions] | [YuppiOptionsDefault] | Constructor's options. |
>
> Example:
>
> ```typescript
> const yuppi = new Yuppi();
> ```

### Methods

`Yuppi.schema(schema).validate(data)`

Validate the data with your Yuppi schema.

> | Parameter | Type     | Default | Description          |
> | --------- | -------- | ------- | -------------------- |
> | `schema`  | [Schema] |         | Yuppi schema.        |
> | `data`    | Unknown  |         | data to be validate. |
>
> returns [InferSchema]\<Schema\>
>
> Example:
>
> ```typescript
> const schema = yuppi.schema({
>   display_name: { type: 'string', max: 32 },
>   username: { type: 'string', pattern: Patterns.Username, min: 3, max: 16 },
>   email: { type: 'string', pattern: Patterns.Email, lowercase: true },
>   permissions: [
>     { type: 'string', enum: ['*'] },
>     { type: 'array', items: { type: 'string', enum: ['read', 'write'] } }
>   ]
> });
>
> const data = {
>   display_name: 'Fırat',
>   username: 'fir4tozden',
>   email: 'fir4tozden@gmail.com',
>   permissions: '*'
> };
>
> let fields;
>
> try {
>   fields = schema.validate(data);
>   /*
>     {
>       display_name: "Fırat",
>       username: "fir4tozden",
>       email: "fir4tozden@gmail.com",
>       permissions: "*"
>     }
>   */
> } catch (error) {
>   if (error instanceof ValidationError) console.log(errors[0]);
>   /*
>     {
>       message: "Field email must match the required pattern",
>       parts: {
>         path: "email"
>       },
>       code: "field-email-must-match-the-required-pattern",
>     }
>   */
> }
>
> console.log(fields.display_name); // "Fırat"
> ```

<br/>

`Yuppi.schema(schema).declare(name)`

Declare your Yuppi schema for TypeScript.

> | Parameter | Type     | Default | Description       |
> | --------- | -------- | ------- | ----------------- |
> | `schema`  | [Schema] |         | Yuppi schema.     |
> | `name`    | [String] |         | Declaration name. |
>
> returns [Promise]<[Void]>
>
> Example:
>
> ```typescript
> import type { User } from './generated/yuppi/types/User';
>
> await schema.declare('User');
>
> let fields;
>
> try {
>   fields = schema.validate(data) as User;
>   /*
>     interface User {
>       display_name: string;
>       username: string;
>       email: string;
>       permissions: "*" | ("read" | "write")[];
>     }
>   */
> } catch (error) {
>   // ...
> }
> ```

<br/>

`Yuppi.schema(schema).toJSONSchema()`

Convert your Yuppi schema into [JSON Schema](https://json-schema.org).

> | Parameter | Type     | Default | Description   |
> | --------- | -------- | ------- | ------------- |
> | `schema`  | [Schema] |         | Yuppi schema. |
>
> returns [JSONSchema]
>
> Example:
>
> ```typescript
> schema.toJSONSchema();
> /*
>   {
>     additionalProperties: false,
>     type: 'object',
>     required: ['display_name', 'username', 'email', 'permissions'],
>     properties: {
>       display_name: {
>         maxLength: 32,
>         trim: true,
>         type: 'string'
>       },
>       username: {
>         minLength: 3,
>         maxLength: 16,
>         pattern: '^(?=.*[a-zA-Z])[a-zA-Z0-9][a-zA-Z0-9_]*$',
>         trim: true,
>         type: 'string'
>       },
>       email: {
>         pattern: '^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$',
>         trim: true,
>         lowercase: true,
>         uppercase: true,
>         type: 'string'
>       },
>       permissions: {
>         anyOf: [
>           { enum: ['*'], trim: true, type: 'string' },
>           { type: 'array', items: { enum: ['read', 'write'], trim: true, type: 'string' } }
>         ]
>       }
>     }
>   }
> */
> ```

### Patterns

| Pattern       | Description                    | Examples                                                                         |
| ------------- | ------------------------------ | -------------------------------------------------------------------------------- |
| [Domain]      | Domains.                       | `"google.com"` ✅<br/>`"www.google.com"` ✅<br/>`"https://google.com"` ❌        |
| [Email]       | Emails.                        | `"fir4tozden@gmail.com"` ✅<br/>`"fir4tozden+2@gmail.com"` ❌                    |
| [HTTP]        | HTTP only links.               | `"https://google.com"` ✅<br/>`"http://google.com"` ✅<br/>`"google.com"` ❌     |
| [PhoneNumber] | Country code and phone number. | `"0090-555555555"` ✅<br/>`"90-5555555555"` ❌                                   |
| [URI]         | Protocol free links.           | `"mongodb://mongodb.net"` ✅<br/>`"https://google.com"` ✅<br/>`"google.com"` ❌ |
| [Username]    | Usernames like Twitter.        | `"fir4tozden"` ✅<br/>`"Fir4tozden"` ✅<br/>`"fir4t ozden"` ❌                   |

### Types

| Type              |
| ----------------- |
| [InferSchema]     |
| [JSONSchema]      |
| [Schema]          |
| [ValidationError] |
| [YuppiOptions]    |

## Links

- [Discord](https://discord.gg/keift)
- [Telegram](https://t.me/keiftco)
- [Twitter](https://x.com/keiftco)
- [GitHub](https://github.com/keift)

## License

MIT License

Copyright (c) 2025 Keift

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
