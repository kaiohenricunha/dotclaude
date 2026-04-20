// Unit tests for the v2 remote-store schema helpers in
// plugins/dotclaude/bin/dotclaude-handoff.mjs. Covers:
// SCHEMA_VERSION, V1_BRANCH_RE, V2_BRANCH_RE, monthBucket, slugify,
// v2BranchName, readRemoteSchema.
//
// readRemoteSchema is integration-ish — it shells out to `git clone`
// against a local bare repo scratch-built per test. Keeps the happy
// path and the uninitialised-store path covered without needing a
// real GitHub account.

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  SCHEMA_VERSION,
  V1_BRANCH_RE,
  V2_BRANCH_RE,
  monthBucket,
  slugify,
  v2BranchName,
  readRemoteSchema,
} from "../bin/dotclaude-handoff.mjs";

describe("SCHEMA_VERSION", () => {
  it("is the string '2' (v0.10.0 pin)", () => {
    expect(SCHEMA_VERSION).toBe("2");
  });
});

describe("V2_BRANCH_RE", () => {
  it("matches a well-formed v2 branch", () => {
    expect(V2_BRANCH_RE.test("handoff/dotclaude/claude/2026-04/aaaa1111")).toBe(true);
  });

  it("accepts all three supported CLIs", () => {
    expect(V2_BRANCH_RE.test("handoff/proj/claude/2026-04/aaaa1111")).toBe(true);
    expect(V2_BRANCH_RE.test("handoff/proj/copilot/2026-04/aaaa1111")).toBe(true);
    expect(V2_BRANCH_RE.test("handoff/proj/codex/2026-04/aaaa1111")).toBe(true);
  });

  it("rejects v1-shaped branches", () => {
    expect(V2_BRANCH_RE.test("handoff/claude/aaaa1111")).toBe(false);
  });

  it("rejects unknown CLIs", () => {
    expect(V2_BRANCH_RE.test("handoff/proj/gpt/2026-04/aaaa1111")).toBe(false);
  });

  it("rejects uppercase segments (enforces normalised slug)", () => {
    expect(V2_BRANCH_RE.test("handoff/DotClaude/claude/2026-04/aaaa1111")).toBe(false);
  });

  it("rejects short-UUID that is not exactly 8 hex chars", () => {
    expect(V2_BRANCH_RE.test("handoff/proj/claude/2026-04/aaaa111")).toBe(false);
    expect(V2_BRANCH_RE.test("handoff/proj/claude/2026-04/aaaa11111")).toBe(false);
    expect(V2_BRANCH_RE.test("handoff/proj/claude/2026-04/ZZZZ1111")).toBe(false);
  });

  it("rejects a month missing the dash or with a 3-digit month", () => {
    expect(V2_BRANCH_RE.test("handoff/proj/claude/202604/aaaa1111")).toBe(false);
    expect(V2_BRANCH_RE.test("handoff/proj/claude/2026-004/aaaa1111")).toBe(false);
  });
});

describe("V1_BRANCH_RE", () => {
  it("matches a legacy v1 branch", () => {
    expect(V1_BRANCH_RE.test("handoff/claude/aaaa1111")).toBe(true);
  });

  it("rejects a v2 branch (so classification forks cleanly)", () => {
    expect(V1_BRANCH_RE.test("handoff/dotclaude/claude/2026-04/aaaa1111")).toBe(false);
  });
});

describe("monthBucket", () => {
  it("returns a YYYY-MM bucket for an ISO-8601 string", () => {
    expect(monthBucket("2026-04-20T12:00:00Z")).toBe("2026-04");
  });

  it("returns YYYY-MM for end-of-year UTC rollover", () => {
    expect(monthBucket("2025-12-31T23:59:59Z")).toBe("2025-12");
  });

  it("falls back to current month when input is null/undefined", () => {
    const now = new Date();
    const expected = `${now.getUTCFullYear()}-${(now.getUTCMonth() + 1).toString().padStart(2, "0")}`;
    expect(monthBucket(null)).toBe(expected);
    expect(monthBucket(undefined)).toBe(expected);
  });

  it("falls back to current month for malformed input", () => {
    const now = new Date();
    const expected = `${now.getUTCFullYear()}-${(now.getUTCMonth() + 1).toString().padStart(2, "0")}`;
    expect(monthBucket("not-a-date")).toBe(expected);
  });

  it("zero-pads single-digit months", () => {
    expect(monthBucket("2026-01-15T00:00:00Z")).toBe("2026-01");
    expect(monthBucket("2026-09-15T00:00:00Z")).toBe("2026-09");
  });
});

describe("slugify", () => {
  it("lowercases and replaces non-[a-z0-9-] with dashes", () => {
    expect(slugify("My Project Name!")).toBe("my-project-name");
  });

  it("caps at 40 chars", () => {
    expect(slugify("a".repeat(100)).length).toBe(40);
  });

  it("returns 'adhoc' for empty / whitespace-only input", () => {
    expect(slugify("")).toBe("adhoc");
    expect(slugify("   ")).toBe("adhoc");
  });
});

describe("v2BranchName", () => {
  it("composes the canonical v2 shape", () => {
    expect(
      v2BranchName({ project: "dotclaude", cli: "claude", month: "2026-04", shortId: "aaaa1111" })
    ).toBe("handoff/dotclaude/claude/2026-04/aaaa1111");
  });

  it("output always matches V2_BRANCH_RE", () => {
    const b = v2BranchName({ project: "x", cli: "codex", month: "2026-04", shortId: "deadbeef" });
    expect(V2_BRANCH_RE.test(b)).toBe(true);
  });

  it("slugifies the project segment so malformed inputs still produce a valid branch", () => {
    const b = v2BranchName({ project: "My Proj!", cli: "claude", month: "2026-04", shortId: "aaaa1111" });
    expect(V2_BRANCH_RE.test(b)).toBe(true);
    expect(b).toBe("handoff/my-proj/claude/2026-04/aaaa1111");
  });
});

describe("readRemoteSchema (integration)", () => {
  // Each test spins up a fresh bare repo in a tmp dir and points
  // DOTCLAUDE_HANDOFF_REPO at it. We build main by cloning, writing,
  // committing, and pushing — same pattern the binary's `init` uses.
  let REPO;
  let SAVED_ENV;

  function runGit(args, cwd) {
    return spawnSync("git", args, { encoding: "utf8", cwd });
  }

  function seedMain(pinJson, { includeReadme = false } = {}) {
    const work = mkdtempSync(join(tmpdir(), "schema-test-"));
    runGit(["clone", "-q", "--branch", "main", REPO, "."], work);
    // `clone --branch main` against an empty bare repo returns exit != 0
    // before ever creating `.git`, so initialise from scratch instead.
    if (!existsSync(join(work, ".git"))) {
      runGit(["init", "-q", "-b", "main"], work);
      runGit(["remote", "add", "origin", REPO], work);
    }
    runGit(["config", "user.email", "test@test.local"], work);
    runGit(["config", "user.name", "schema-test"], work);
    if (pinJson !== null) {
      writeFileSync(join(work, ".dotclaude-handoff.json"), pinJson);
    }
    if (includeReadme) {
      writeFileSync(join(work, "README.md"), "# test store\n");
    }
    runGit(["add", "."], work);
    runGit(["commit", "-q", "-m", "seed"], work);
    runGit(["push", "-q", "origin", "main"], work);
    rmSync(work, { recursive: true, force: true });
  }

  beforeEach(() => {
    REPO = mkdtempSync(join(tmpdir(), "schema-repo-"));
    rmSync(REPO, { recursive: true, force: true });
    execFileSync("git", ["init", "-q", "--bare", REPO]);
    SAVED_ENV = process.env.DOTCLAUDE_HANDOFF_REPO;
    process.env.DOTCLAUDE_HANDOFF_REPO = REPO;
  });

  afterEach(() => {
    if (SAVED_ENV === undefined) delete process.env.DOTCLAUDE_HANDOFF_REPO;
    else process.env.DOTCLAUDE_HANDOFF_REPO = SAVED_ENV;
    rmSync(REPO, { recursive: true, force: true });
  });

  it("returns null when the remote is completely empty", () => {
    expect(readRemoteSchema()).toBeNull();
  });

  it("returns null when main exists but lacks the pin", () => {
    seedMain(null, { includeReadme: true });
    expect(readRemoteSchema()).toBeNull();
  });

  it("returns the parsed pin when present and well-formed", () => {
    const pin = {
      schema_version: "2",
      created_at: "2026-04-20T00:00:00Z",
      layout: "branch-per-handoff",
    };
    seedMain(JSON.stringify(pin, null, 2) + "\n");
    expect(readRemoteSchema()).toEqual(pin);
  });

  it("throws when the pin file is not valid JSON", () => {
    seedMain("{not json");
    expect(() => readRemoteSchema()).toThrow(/not valid JSON/);
  });
});
