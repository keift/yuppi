# Change Log

## v1.2.12 → v1.3.0

- Added:
  - **`Yuppi.declare()` method.** Declare your Yuppi schema for TypeScript.
  - **`enum` in string type.** Allows to accept only predefined strings.
  - **`enum` in number type.** Allows to accept only predefined numbers.

## v1.2.3 → v1.2.4

- Added:
  - **`enum` to string type.** Allows to accept only predefined strings.
  - **`enum` to number type.** Allows to accept only predefined numbers.

## v1.1.2 → v1.2.0

- Added:
  - **Pattern `Domain`.** This pattern only accepts domain names.
  - **Pattern `URI`.** This pattern accepts links with any protocol.

- Changes:
  - **If default is null, it becomes nullable.** When the default is null, it is assumed that the property may also be null.
  - **Pattern `URL` name changed to `HTTP`.** To avoid confusion, the name of the pattern that accepts only the HTTP protocol has been changed.
  - **Patterns have been edited.** Edited to make more accurate matching of patterns.

## v1.0.4 → v1.1.0

- Changes:
  - **Synchronous validate.** `Yuppi.validate()` method is no longer asynchronous.
