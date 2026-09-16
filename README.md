[domain]: ./src/patterns/domain.ts
[email]: ./src/patterns/email.ts
[http]: ./src/patterns/http.ts
[phone_number]: ./src/patterns/phone_number.ts
[uri]: ./src/patterns/uri.ts
[username]: ./src/patterns/username.ts

<!---->

[yuppi_options]: ./src/defaults/yuppi_options.ts

<!---->

[InferSchema]: ./src/types/infer_schema.ts
[JSONSchema]: ./src/types/json_schema.ts
[Schema]: ./src/types/schema.ts
[ValidationError]: ./src/types/validation_error.ts
[YuppiOptions]: ./src/types/yuppi_options.ts

<div align="center">
  <br/>
  <img src="./assets/logo.png" width="350px"/>
  <br/>
  <br/>
  <img src="https://img.shields.io/npm/v/yuppi?label=version&color=615fff"/>
  <img src="https://img.shields.io/npm/l/yuppi?label=license&color=615fff"/>
  <img src="https://img.shields.io/npm/dw/yuppi?label=downloads&color=00bc7d"/>
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
  - [Constants](#constants)
  - [Types](#types)

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
│       └── json_schema()
│
└── Patterns
    │
    ├── Domain
    ├── Email
    ├── HTTP
    ├── PhoneNumber
    ├── URI
    └── Username

yuppi/types
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

> | Parameter  | Type           | Default         | Description            |
> | ---------- | -------------- | --------------- | ---------------------- |
> | `options?` | [YuppiOptions] | [yuppi_options] | Constructor's options. |
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
>       display_name: 'Fırat',
>       username: 'fir4tozden',
>       email: 'fir4tozden@gmail.com',
>       permissions: '*'
>     }
>   */
> } catch (error) {
>   if (error instanceof ValidationError) console.log(errors[0]);
>   /*
>     {
>       message: 'Field email must match the required pattern',
>       parts: {
>         path: 'email'
>       },
>       code: 'field-email-must-match-the-required-pattern'
>     }
>   */
> }
>
> console.log(fields.display_name); // 'Fırat'
> ```

<br/>

`Yuppi.schema(schema).declare(name)`

Declare your Yuppi schema for TypeScript.

> | Parameter | Type     | Default | Description       |
> | --------- | -------- | ------- | ----------------- |
> | `schema`  | [Schema] |         | Yuppi schema.     |
> | `name`    | String   |         | Declaration name. |
>
> returns Promise<Void>
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
>       permissions: '*' | ('read' | 'write')[];
>     }
>   */
> } catch (error) {
>   // ...
> }
> ```

<br/>

`Yuppi.schema(schema).json_schema()`

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
> schema.json_schema();
> /*
>   {
>     additionalProperties: false,
>     type: 'object',
>     required: ['display_name', 'username', 'email', 'permissions'],
>     properties: {
>       display_name: {
>         type: 'string',
>         maxLength: 32,
>         trim: true
>       },
>       username: {
>         type: 'string',
>         minLength: 3,
>         maxLength: 16,
>         pattern: '^(?=.*[a-zA-Z])[a-zA-Z0-9][a-zA-Z0-9_]*$',
>         trim: true
>       },
>       email: {
>         type: 'string',
>         pattern: '^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$',
>         trim: true,
>         lowercase: true,
>         uppercase: true
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

### Constants

`patterns`

Ready to use regex patterns.

> Example:
>
> ```typescript
> yuppi.schema({
>   domain: { type: 'string', pattern: patterns.domain }, // "google.com" ✅ "www.google.com" ✅ "https://google.com" ❌
>   email: { type: 'string', pattern: patterns.email }, // "fir4tozden@gmail.com" ✅ "fir4tozden+2@gmail.com" ❌
>   http: { type: 'string', pattern: patterns.http }, // "https://google.com" ✅ "http://google.com" ✅ "google.com" ❌
>   phone_number: { type: 'string', pattern: patterns.phone_number }, // "0090-555555555" ✅ "90-5555555555" ❌
>   uri: { type: 'string', pattern: patterns.uri }, // "mongodb://mongodb.net" ✅ "https://google.com" ✅ "google.com" ❌
>   username: { type: string, pattern: patterns.username } // ✅ "fir4tozden" ✅ "Fir4tozden" ❌ "fir4t ozden"
> });
> ```

### Types

| Type              |
| ----------------- |
| [InferSchema]     |
| [JSONSchema]      |
| [Schema]          |
| [ValidationError] |
| [YuppiOptions]    |
