#!/usr/bin/env node
import { createHarnessContext } from "../src/spec-harness-lib.mjs";
import { validateManifest, refreshChecksums } from "../src/validate-skills-inventory.mjs";

const args = process.argv.slice(2);
const update = args.includes("--update");
const rrIdx = args.indexOf("--repo-root");
const repoRoot = rrIdx >= 0 ? args[rrIdx + 1] : undefined;

const ctx = createHarnessContext({ repoRoot });

if (update) {
  refreshChecksums(ctx);
  console.log(`✅ Manifest refreshed at ${ctx.manifestPath}`);
  process.exit(0);
}

const result = validateManifest(ctx);
if (result.ok) {
  console.log(`✅ Manifest valid (${result.manifest.skills.length} skills).`);
  process.exit(0);
}
console.error("❌ Manifest validation failed:");
for (const err of result.errors) console.error(`  - ${err}`);
process.exit(1);
