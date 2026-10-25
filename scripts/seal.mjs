// Seals files so they can sit in the repo without being read by accident.
// Usage: node scripts/seal.mjs <name> <root> <file> [file...]
// Each file is stored under its path relative to <root>; `npm run unseal <name>` writes it back to that path
// (Markdown files are printed instead). Base64 is a speed bump, not encryption: the rule is that you don't.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { relative, resolve } from "node:path";

const [name, root, ...files] = process.argv.slice(2);
if (!name || !root || files.length === 0) {
  console.error("usage: node scripts/seal.mjs <name> <root> <file> [file...]");
  process.exit(1);
}
const bundle = {};
for (const f of files) bundle[relative(resolve(root), resolve(f)).replaceAll("\\", "/")] = readFileSync(f, "utf8");
mkdirSync("sealed", { recursive: true });
const text = Buffer.from(JSON.stringify(bundle), "utf8").toString("base64").replace(/.{76}/g, "$&\n");
writeFileSync(`sealed/${name}.b64`, text + "\n");
console.log(`sealed/${name}.b64: ${Object.keys(bundle).join(", ")}`);
