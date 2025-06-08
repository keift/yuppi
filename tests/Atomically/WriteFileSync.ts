import { fs } from "../../src/main";

const interval: NodeJS.Timeout = setInterval(() => {
  fs.writeFileSync("./test/test.json", JSON.stringify({ updated_at: new Date().toISOString() }));
}, 5);

setTimeout(() => {
  clearInterval(interval);

  console.log("✅ [WriteFileSync] Checks successful!");
}, 5000);
