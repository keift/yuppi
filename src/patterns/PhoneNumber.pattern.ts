import type { Base } from "../types/Schema.type";

export const PhoneNumber: Base["pattern"] = "^\\d{4}\\d{7,12}$";
