import { fs } from "../../src/main";

if (!fs.gracefulify) throw new Error("❌ [Gracefulify]");

console.log("✅ [Gracefulify] Checks successful!");
