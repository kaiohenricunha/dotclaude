#!/usr/bin/env node
/**
 * Updates `_Last updated: vX.Y.Z_` stamps in every top-level `docs/*.md` file
 * to match the current `version` in `package.json`.
 *
 * Usage:
 *   node scripts/stamp-doc-versions.mjs           # rewrite stale stamps
 *   node scripts/stamp-doc-versions.mjs --check   # exit 1 if any stamp is stale
 *
 * Run as part of the release flow (`npm run docs:stamp`) to keep version stamps
 * in sync with the package version. Wire `--check` into CI to catch stamps that
 * were not refreshed before a release commit.
 *
 * Intentionally dependency-free — mirrors the zero-runtime-deps promise in
 * `package.json` and ADR-0002.
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = resolve(__dirname, "..");

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");

const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
const version = pkg.version;

const STAMP_RE = /_Last updated: v\d+\.\d+\.\d+_/g;
const CURRENT_STAMP = `_Last updated: v${version}_`;

const docsDir = join(repoRoot, "docs");
const mdFiles = readdirSync(docsDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => join(docsDir, f));

let staleCount = 0;

for (const filePath of mdFiles) {
  const original = readFileSync(filePath, "utf8");
  const updated = original.replace(STAMP_RE, CURRENT_STAMP);

  if (updated === original) continue;

  staleCount++;
  const rel = filePath.slice(repoRoot.length + 1);

  if (checkOnly) {
    process.stderr.write(`stale stamp: ${rel}\n`);
  } else {
    writeFileSync(filePath, updated, "utf8");
    process.stdout.write(`stamped: ${rel}\n`);
  }
}

if (checkOnly) {
  if (staleCount > 0) {
    process.stderr.write(
      `\n${staleCount} doc(s) have stale version stamps. Run: npm run docs:stamp\n`,
    );
    process.exit(1);
  }
  process.stdout.write(
    `✓ all ${mdFiles.length} docs stamped with v${version}\n`,
  );
} else {
  if (staleCount > 0) {
    process.stdout.write(`\nstamped ${staleCount} doc(s) with v${version}\n`);
  } else {
    process.stdout.write(
      `✓ all ${mdFiles.length} docs already stamped with v${version}\n`,
    );
  }
}
