import type { Fields } from "./Schema.type";

export type EndpointConfig = {
  path: string;
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  limit: number;
  cooldown: number;
  authorization: boolean;
  permissions: Permissions[][];
  fields: Fields;
  disabled: boolean;
};
