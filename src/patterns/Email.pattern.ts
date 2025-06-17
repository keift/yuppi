import type { Base } from "../types/Schema.type";

export const Email: Base["pattern"] = "^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
