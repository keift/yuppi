import { fs } from "../../src/main";

if (!fs.copy) throw new Error("❌ [Copy]");

console.log("✅ [Copy] Checks successful!");
