// Pins the public surface of handoff-remote.mjs — the shared transport
// library extracted from bin/dotclaude-handoff.mjs in #91 Gap 1. These
// tests are redundant with handoff-unit / handoff-url-validator /
// handoff-bootstrap (which go through the bin re-exports), but they
// lock the library *directly* so a future gap can't silently narrow or
// widen the API without tripping a test.

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as lib from "../src/lib/handoff-remote.mjs";

describe("export shape", () => {
  // Keep alphabetized so the diff is readable when exports change.
  const expectedExports = [
    "CONFIG_FILE",
    "V1_BRANCH_RE",
    "V2_BRANCH_RE",
    "bootstrapTransportRepo",
    "decodeDescription",
    "encodeDescription",
    "enrichWithDescriptions",
    "extractLines",
    "extractMeta",
    "extractPrompts",
    "extractTurns",
    "fetchRemoteBranch",
    "ghAuthenticated",
    "ghAvailable",
    "ghLogin",
    "isRepoMissingError",
    "isTty",
    "listRemoteCandidates",
    "loadPersistedEnv",
    "matchesQuery",
    "mechanicalSummary",
    "monthBucket",
    "nextStepFor",
    "printManualSetupBlock",
    "projectSlugFromCwd",
    "promptLine",
    "pullRemote",
    "pushRemote",
    "renderHandoffBlock",
    "requireTransportRepo",
    "requireTransportRepoStrict",
    "runGit",
    "runGitOrThrow",
    "runScript",
    "slugify",
    "slugifyRepoName",
    "v2BranchName",
    "validateTransportUrl",
  ];

  it("exposes every documented name", () => {
    for (const name of expectedExports) {
      expect(lib[name], `missing export: ${name}`).toBeDefined();
    }
  });

  it("does not leak extra names beyond the documented set", () => {
    const actual = Object.keys(lib).sort();
    const extra = actual.filter((k) => !expectedExports.includes(k));
    expect(extra).toEqual([]);
  });
});

describe("v2BranchName", () => {
  it("assembles handoff/<project>/<cli>/<month>/<shortId>", () => {
    expect(
      lib.v2BranchName({ project: "foo", cli: "claude", month: "2026-04", shortId: "abcd1234" }),
    ).toBe("handoff/foo/claude/2026-04/abcd1234");
  });

  it("slugifies the project segment", () => {
    expect(
      lib.v2BranchName({ project: "My Project!", cli: "codex", month: "2026-04", shortId: "ff00aa11" }),
    ).toBe("handoff/my-project/codex/2026-04/ff00aa11");
  });
});

describe("monthBucket", () => {
  it("returns YYYY-MM for a valid ISO input", () => {
    expect(lib.monthBucket("2026-04-22T12:00:00Z")).toBe("2026-04");
  });

  it("falls back to the current month when given null", () => {
    const now = new Date();
    const expected = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
    expect(lib.monthBucket(null)).toBe(expected);
  });

  it("falls back to the current month when given a nonsense date", () => {
    const now = new Date();
    const expected = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
    expect(lib.monthBucket("not-a-date")).toBe(expected);
  });
});

describe("matchesQuery", () => {
  const c = {
    branch: "handoff/proj/claude/2026-04/abcd1234",
    description: "handoff:v2:claude/abcd1234/proj/host",
    commit: "0fba2e3d99",
  };

  it("matches by branch substring", () => {
    expect(lib.matchesQuery(c, "abcd1234")).toBe(true);
    expect(lib.matchesQuery(c, "proj")).toBe(true);
  });

  it("matches by commit prefix (startsWith)", () => {
    expect(lib.matchesQuery(c, "0fba")).toBe(true);
    expect(lib.matchesQuery(c, "2e3d")).toBe(false);
  });

  it("is case-insensitive across all three fields", () => {
    expect(lib.matchesQuery(c, "CLAUDE")).toBe(true);
    expect(lib.matchesQuery(c, "HOST")).toBe(true);
  });

  it("rejects unrelated input", () => {
    expect(lib.matchesQuery(c, "zzz")).toBe(false);
  });
});

describe("validateTransportUrl (accept/reject matrix)", () => {
  let exitSpy;
  let stderrSpy;

  beforeEach(() => {
    exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`__exit__${code}`);
    });
    stderrSpy = vi.spyOn(process.stderr, "write").mockReturnValue(true);
  });

  afterEach(() => {
    exitSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  for (const [label, url] of [
    ["https", "https://github.com/x/y.git"],
    ["http", "http://ghe/x/y.git"],
    ["git@", "git@github.com:x/y.git"],
    ["ssh://", "ssh://git@host:22/x.git"],
    ["file://", "file:///tmp/bare.git"],
    ["absolute path", "/tmp/bare"],
  ]) {
    it(`accepts ${label}`, () => {
      expect(lib.validateTransportUrl(url)).toBe(url);
      expect(exitSpy).not.toHaveBeenCalled();
    });
  }

  for (const [label, url] of [
    ["ext:: exec scheme", "ext::sh -c evil"],
    ["data:", "data:text/plain,x"],
    ["javascript:", "javascript:alert(1)"],
    ["relative path", "relative/path"],
    ["bare hostname", "github.com/x/y"],
  ]) {
    it(`rejects ${label}`, () => {
      expect(() => lib.validateTransportUrl(url)).toThrow(/__exit__2/);
    });
  }
});

describe("isRepoMissingError (phrasing union)", () => {
  it("matches GitHub's wording", () => {
    expect(lib.isRepoMissingError("ERROR: Repository not found.")).toBe(true);
    expect(lib.isRepoMissingError("remote: Not Found")).toBe(true);
  });

  it("matches GitLab's wording", () => {
    expect(
      lib.isRepoMissingError("The project you were looking for could not be found."),
    ).toBe(true);
  });

  it("matches raw SSH / git phrasings", () => {
    expect(lib.isRepoMissingError("Could not read from remote repository.")).toBe(true);
    expect(lib.isRepoMissingError("fatal: 'x' does not appear to be a git repository")).toBe(true);
    expect(lib.isRepoMissingError("Permission denied (publickey)")).toBe(true);
  });

  it("rejects unrelated errors so the retry branch doesn't fire on real bugs", () => {
    expect(lib.isRepoMissingError("error: failed to push some refs")).toBe(false);
    expect(lib.isRepoMissingError("")).toBe(false);
    expect(lib.isRepoMissingError(null)).toBe(false);
  });
});

describe("slugify / slugifyRepoName edge cases", () => {
  it("slugify collapses dash runs and trims edges", () => {
    expect(lib.slugify("  Foo !! Bar  ")).toBe("foo-bar");
    expect(lib.slugify("...")).toBe("adhoc");
    expect(lib.slugify("")).toBe("adhoc");
  });

  it("slugify caps at 40 chars", () => {
    expect(lib.slugify("a".repeat(80)).length).toBeLessThanOrEqual(40);
  });

  it("slugifyRepoName caps at 100 chars and trims edges", () => {
    expect(lib.slugifyRepoName("  -Handoff-Store-  ")).toBe("handoff-store");
    expect(lib.slugifyRepoName("a".repeat(200)).length).toBeLessThanOrEqual(100);
  });
});
