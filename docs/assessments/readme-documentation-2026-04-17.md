# README Documentation — Assessment — 2026-04-17

Assessment of the overall documentation quality, with emphasis on README.md: clarity of project presentation, discoverability of skills/agents/commands, and beginner guidance. Benchmarked against two reference projects: [awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) and [claude-skills](https://github.com/Jeffallan/claude-skills).

**Target type:** document
**Overall grade: 6.1 / 10 — Passable**

## Scope

Files assessed: `README.md`, `docs/quickstart.md`, `docs/index.md`, `docs/personas.md`, `docs/taxonomy.md`, `docs/architecture.md`, `.claude/skills-manifest.json`, `commands/` glob (14 files), `skills/` glob (12 SKILL.md files). Reference comparisons drawn from the two GitHub repos above.

Rubric: built-in **document** rubric.

## Rubric & scores

| Dimension                                    |   Weight | Score | Weighted | Evidence                                                                                         |
| -------------------------------------------- | -------: | ----: | -------: | ------------------------------------------------------------------------------------------------ |
| Clarity                                      |     0.25 |   6/10 |     1.50 | `README.md:12-19` dual-path table is good; "spec-driven governance" lede buries the skills-first persona |
| Completeness                                 |     0.25 |   5/10 |     1.25 | 26 skills/commands (manifest) not listed or categorized anywhere in README; agents/ empty in practice |
| Evidence / citations                         |     0.15 |   8/10 |     1.20 | `README.md:147-157` ADR table + links; full further-reading table at L165; exit-code table with sysexits.h |
| Actionability                                |     0.20 |   6/10 |     1.20 | Install paths (L23-48) are clear; zero post-install skill invocation examples                    |
| Maintenance hooks (owner, dates, versioning) |     0.15 |   6/10 |     0.90 | npm + license badges present; no owner or last-updated; CHANGELOG linked                         |
| **Overall**                                  | **1.00** |     — |  **6.1** | —                                                                                                |

## Dimension detail

### Clarity — 6/10

The README opens with a decision table (`README.md:12-19`) that cleanly separates the two install paths — that's genuinely good. The CLI command table (`L74-86`) and Node API example (`L103-126`) are well-organized for the governance/npm persona.

The problem: the project description at `L7-8` ("bootstraps spec-driven-development governance") speaks only to the npm-install persona. A visitor looking for a Claude Code skills library — arguably the more discoverable use case — gets no orientation until the Clone & bootstrap section. The CLAUDE.md TL;DR box (which clearly frames both personas) is not in README. The `docs/personas.md` file solves this well but is buried in "Further reading" rather than referenced early.

Neither reference project has this ambiguity: VoltAgent leads with "a curated list of Claude Code subagents" (one sentence, immediately clear); claude-skills leads with a single-sentence install command and a link to QUICKSTART.

**To raise this score:** Move the personas framing (or a condensed version of `docs/personas.md:4-11`) to the top of README, directly below the description. Add one sentence explaining the skills/commands library separately from the governance CLI.

---

### Completeness — 5/10

The manifest (`skills-manifest.json`) contains 26 artifacts: 14 commands (git, ground-first, fix-with-evidence, create-audit, create-assessment, create-inspection, changelog, audit-and-fix, dependabot-sweep, detect-flaky, merge-pr, review-pr, security-review, markdown) and 12 specialist skills (aws, azure, gcp, kubernetes, crossplane, terraform, terragrunt, pulumi, spec, validate-spec, agents-search, veracity-audit). None of these appear in README.

The reference projects both surface their content catalog prominently:
- VoltAgent: every subagent listed inline with one-liner description and install command (130+ total).
- claude-skills: counts ("66 skills, 9 workflows") + decision trees in SKILLS_GUIDE.md.

`docs/taxonomy.md` describes the classification system but isn't linked from README. No categories are surfaced (cloud-providers, workflows, code-quality, etc.). A first-time visitor has no way to know what they're getting beyond "skills library."

**To raise this score:** Add a "What's included" section to README with a grouped table of all 26 skills/commands (category → name → one-liner), mirroring the pattern in claude-skills' SKILLS_GUIDE.md.

---

### Evidence / citations — 8/10

This is the strongest dimension. The hardening-decisions section (`README.md:146-160`) cites every architectural decision with a direct ADR link. The exit-code table (`L134-141`) references BSD `sysexits.h`. The "Further reading" table (`L165-182`) covers 11 specific docs by purpose. CLI commands all link to docs. Node API example is concrete and functional.

Minor gap: the shell-level hardening claim at `L158` ("SEC-1..4, OPS-1..2") references symbolic IDs without an anchor — a reader can't verify them without finding `validate-settings.sh` independently.

**To raise this score:** Link "SEC-1..4" to the `validate-settings.sh` file or the spec that defines those IDs.

---

### Actionability — 6/10

Install paths score well:
- Clone path (`README.md:27-29`): three lines, copy-paste ready.
- npm path (`L65-66`): clear with global vs per-project distinction.
- `dotclaude-init` scaffold (`L95-99`): shows the three commands in sequence.

What's missing: **post-install skill usage**. After bootstrapping, how does a user actually invoke a skill? Neither a `/ground-first` invocation, nor a `/aws-specialist` trigger example, nor a "type this in Claude Code" demo appears anywhere in README. Both reference projects show activation examples — VoltAgent with plugin install one-liners, claude-skills with natural-language prompt examples.

`docs/quickstart.md` covers steps 1-5 well but is entirely npm-persona focused and doesn't mention the skills library.

**To raise this score:** Add a "Quick taste" section to README with 2-3 concrete `/command` or `/skill` invocation examples in Claude Code, showing what happens after bootstrap.

---

### Maintenance hooks — 6/10

Positive signals: npm version badge, license badge, CHANGELOG badge (all `README.md:2-5`), CHANGELOG linked in "Further reading." The repo has a clear release cadence (v0.4.0 at time of assessment).

Gaps: no owner or maintainer listed in README, no last-updated date. For a project positioning itself as a governance framework for other repos, the absence of ownership metadata in its own primary doc is a credibility signal. Neither reference project has a strong owner-metadata pattern either, but the document rubric requires it.

**To raise this score:** Add a one-line maintainer/owner note (e.g., "Maintained by @kaiohenricunha") and a "Last updated" badge or date near the top.

---

## Highest-leverage improvements

Ranked by estimated grade lift.

1. **Add a "What's included" skills/commands catalog** (grouped table: category → name → one-liner trigger) — Completeness, Clarity — estimated lift: **+1.0**
2. **Add a "Quick taste" section** with 2-3 `/command` invocation examples in Claude Code — Actionability, Clarity — estimated lift: **+0.8**
3. **Promote personas framing to README top** (condensed from `docs/personas.md:4-11`) so the skills-library persona lands before the governance-CLI pitch — Clarity — estimated lift: **+0.4**
4. **Add owner/maintainer line and last-updated signal** — Maintenance — estimated lift: **+0.3**
5. **Link SEC-1..4 / OPS-1..2 identifiers** to `validate-settings.sh` or the governing spec — Evidence — estimated lift: **+0.1**

## Summary

The documentation scores **6.1 / 10 (Passable)**: install paths are clear and well-cited, but the 26 skills/commands that are the core value proposition are completely invisible in README. Compared to the reference projects, this is the widest gap — both competitors lead with content catalogs; dotclaude leads with architecture. The single highest-leverage fix is a grouped skills/commands table in README, which would address Completeness and Clarity simultaneously and push the grade into Solid territory.
