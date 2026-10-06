// Copy non-TypeScript runtime assets (widget client files) into dist/.
import { cpSync, mkdirSync } from "node:fs";
mkdirSync("dist/ui/client", { recursive: true });
cpSync("src/ui/client", "dist/ui/client", { recursive: true });
console.log("copied src/ui/client -> dist/ui/client");
