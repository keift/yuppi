import type { Base } from "../types/Schema.type";

export const Username: Base["pattern"] = "^(?=.*[a-zA-Z])[a-zA-Z0-9][a-zA-Z0-9_]*$";
