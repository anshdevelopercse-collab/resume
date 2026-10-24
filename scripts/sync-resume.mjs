import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// The PDF at the repo root is the single source of truth; public/ gets a copy.
const src = resolve("Ansh_Sharma_Resume.pdf");
if (!existsSync(src)) {
  console.warn("sync-resume: Ansh_Sharma_Resume.pdf not found at repo root");
  process.exit(0);
}
mkdirSync(resolve("public"), { recursive: true });
copyFileSync(src, resolve("public/Ansh_Sharma_Resume.pdf"));
console.log("sync-resume: copied resume PDF to public/");
