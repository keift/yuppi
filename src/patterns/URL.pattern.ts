import type { Base } from "../types/Schema.type";

export const URL: Base["pattern"] = "^(https?:\\/\\/)?([\\w-]+\\.)+[\\w-]{2,}(\\/[\\w-./?%&=]*)?$";
