// Usage: npm run unseal <name>
// Only after you have committed the work the sealed file checks. Your commit time is your proof.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { dirname } from "node:path";
import { execSync } from "node:child_process";

const name = process.argv[2];
if (!name || !existsSync(`sealed/${name}.b64`)) {
  console.error(`usage: npm run unseal <name>   (available: ${listSealed()})`);
  process.exit(1);
}
try {
  const dirty = execSync("git status --porcelain", { encoding: "utf8" }).trim();
  if (dirty) {
    console.error("You have uncommitted changes. Commit your attempt first, then unseal: the commit is your timestamp.");
    process.exit(1);
  }
} catch { /* not a git checkout: carry on */ }

const bundle = JSON.parse(Buffer.from(readFileSync(`sealed/${name}.b64`, "utf8").replace(/\s/g, ""), "base64").toString("utf8"));
for (const [path, content] of Object.entries(bundle)) {
  if (path.endsWith("key.md")) { console.log(content); continue; } // answer keys are printed, never left on disk
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  console.log(`wrote ${path}`);
}

function listSealed() {
  try { return readdirSync("sealed").filter((f) => f.endsWith(".b64")).map((f) => f.slice(0, -4)).join(", "); }
  catch { return "none"; }
}
