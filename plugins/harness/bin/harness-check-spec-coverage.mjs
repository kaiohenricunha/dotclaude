#!/usr/bin/env node
import { createHarnessContext, getChangedFiles, getPullRequestContext } from "../src/spec-harness-lib.mjs";
import { checkSpecCoverage } from "../src/check-spec-coverage.mjs";

const rrIdx = process.argv.indexOf("--repo-root");
const repoRoot = rrIdx >= 0 ? process.argv[rrIdx + 1] : undefined;
const ctx = createHarnessContext({ repoRoot });

const { isPullRequest, body, actor } = getPullRequestContext();
const changedFiles = getChangedFiles();

const r = checkSpecCoverage(ctx, { changedFiles, isPullRequest, body, actor });
if (r.ok) {
  console.log(`✅ spec coverage ok (${r.protectedFiles.length} protected file(s) changed).`);
  process.exit(0);
}
for (const e of r.errors) console.error(`❌ ${e}`);
process.exit(1);
