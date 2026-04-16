# `dotclaude` Information Architecture & Faceted Taxonomy

## Context

`dotclaude` is an npm package + library of Claude Code artifacts (agents, skills, commands, hooks, templates). Current layout is already type-first (`commands/`, `skills/`, plugin-side `agents/`, `.claude/hooks/`) but frontmatter carries **zero taxonomy fields** — no `domain`, `platform`, `task`, `maturity`, or `tags`. As the library grows, discovery will degrade unless classification is made explicit *and* scalable.

The goal: formalize a faceted taxonomy where **artifact type drives directory layout** (because type changes consumption contracts — symlink destination, file format, validator) and **all other axes live in frontmatter** (because they're multi-valued lenses, not contracts). Preserve the dual-persona delivery (root symlinks for library users, npm tarball for CLI users) and the existing `skills-manifest.json` contract.

## Overall recommendation

**Type-first folders + facets in YAML frontmatter + generated index.**

Why not folder-based faceting (e.g., `skills/kubernetes/debugging/…`):

1. Filesystems are single-valued; a skill that is both `infra` and `observability` would duplicate or need symlinks.
2. Deep nesting breaks the symlink flow into `~/.claude/` and churns `skills-manifest.json` on every rename.
3. Frontmatter is cheap to refactor (sed); 50-file folder migrations are not.
4. A CLI scanning frontmatter (`dotclaude list --platform kubernetes --task debugging`) beats `tree` for multi-facet queries.

## Proposed repo layout

Keep one flat directory per type; promote `agents/`, `hooks/`, `templates/` to root (matching the user's starting layout). Canonical sources at root; `plugins/dotclaude/` stays the **delivery vehicle** for the npm tarball.

```
dotclaude/
  agents/                 # flat, *.md (symlink -> plugins/dotclaude/templates/claude/agents/)
  commands/               # flat, *.md (already canonical)
  skills/                 # flat, <slug>/SKILL.md (already canonical)
  hooks/                  # canonical: *.sh + sibling *.md sidecar with frontmatter
  templates/              # canonical: *.md scaffolding templates
  schemas/
    _base.schema.json
    agent.schema.json
    skill.schema.json
    command.schema.json
    hook.schema.json
    template.schema.json
    vocabularies.json     # controlled enum source of truth
  index/                  # GENERATED — do not hand-edit
    all.json
    by-domain/<value>.json
    by-platform/<value>.json
    by-task/<value>.json
    by-maturity/<value>.json
  .claude/
    skills-manifest.json  # extended, still the integrity contract
    hooks/                # symlink -> ../hooks
    commands/             # existing symlink -> ../commands
    skills/               # existing symlink -> ../skills
  plugins/dotclaude/
    templates/claude/agents/   # canonical agent source (root `agents/` symlinks here)
    templates/claude/hooks/    # canonical hook source shipped via npm
    .claude-plugin/plugin.json # unchanged; still lists agents paths
  scripts/
    build-index.mjs       # generator + validator; CI drift gate
    validate.mjs          # frontmatter + vocabulary lint
```

Why agents stay canonical inside `plugins/dotclaude/templates/claude/agents/` with a root `agents/` symlink: the npm tarball's `files` array already ships that path; flipping canonical-ness would touch `plugin.json` and every downstream scaffolded project. Root symlink gives the user flat discoverability without breaking the package contract.

## Frontmatter schema

**Shared base** (all types extend):

```yaml
name: string                    # required, globally unique, kebab-case
description: string             # required, one-line trigger prose
type: agent|skill|command|hook|template   # required
domain: [enum]                  # required, >=1
platform: [enum]                # required, >=1 ("none" if agnostic)
task: [enum]                    # required, >=1
maturity: draft|validated|production|deprecated   # required
owners: [github-handle]         # optional, defaults to CODEOWNERS
since: YYYY-MM-DD               # optional, first-shipped date
deprecated_by: string           # required iff maturity=deprecated
```

**Type-specific extensions (additive — all current fields preserved):**

| Type     | Required additions                       | Optional                          |
| -------- | ---------------------------------------- | --------------------------------- |
| agent    | `model`, `tools`                         | `effort`                          |
| skill    | `model`, `tools`                         | `argument-hint`, `effort`         |
| command  | `model`                                  | `argument-hint`                   |
| hook     | `event`, `matcher`, `script`, `blocking` | —                                 |
| template | `target`                                 | `overwrite`, `variables`          |

Vocabularies (`schemas/vocabularies.json`):

```json
{
  "domain":   ["infra","backend","frontend","data","security","observability","devex","writing"],
  "platform": ["aws","kubernetes","docker","vercel","flyio","neon","github-actions","none"],
  "task":     ["debugging","migration","scaffolding","review","testing","documentation","incident-response","other"],
  "maturity": ["draft","validated","production","deprecated"]
}
```

Each type schema `$ref`s `vocabularies.json` so enums live in one place.

## Example artifacts

**Agent — `agents/security-auditor.md`**
```yaml
---
name: security-auditor
type: agent
description: Use when conducting security audits, reviewing code for vulnerabilities, assessing secrets exposure, or evaluating compliance posture.
domain: [security]
platform: [none]
task: [review, documentation]
maturity: production
model: opus
tools: [Read, Grep, Glob]
since: 2026-02-01
---
```

**Skill — `skills/kube-debug-pod-crashloop/SKILL.md`**
```yaml
---
name: kube-debug-pod-crashloop
type: skill
description: Diagnose CrashLoopBackOff pods by correlating events, logs, and probe config. Triggers on "pod crashloop", "restart loop".
domain: [infra, observability]
platform: [kubernetes]
task: [debugging, incident-response]
maturity: validated
model: sonnet
tools: [Bash, Read, Grep]
argument-hint: "<namespace>/<pod>"
effort: medium
---
```

**Command — `commands/merge-pr.md`**
```yaml
---
name: merge-pr
type: command
description: Merge a PR only after full local verification, with a data-regression gate for PRs touching data/calibration/rankings.
domain: [devex]
platform: [github-actions]
task: [review]
maturity: production
model: sonnet
argument-hint: "[PR#]"
---
```

**Hook — `hooks/guard-destructive-git.md` (sidecar for `guard-destructive-git.sh`)**
```yaml
---
name: guard-destructive-git
type: hook
description: Block destructive git ops (force-push, hard reset, branch delete) unless BYPASS_DESTRUCTIVE_GIT=1.
domain: [devex, security]
platform: [none]
task: [incident-response]
maturity: production
event: PreToolUse
matcher: "^Bash$"
script: ./guard-destructive-git.sh
blocking: true
---
```

**Template — `templates/agent-starter.md`**
```yaml
---
name: agent-starter
type: template
description: Scaffold a new sub-agent with opinionated frontmatter and working-approach skeleton.
domain: [devex]
platform: [none]
task: [scaffolding]
maturity: validated
target: .claude/agents/{{slug}}.md
overwrite: never
variables:
  slug: { type: string, required: true }
  model: { type: enum, values: [opus, sonnet, haiku], default: sonnet }
---
```

## Naming conventions

- **kebab-case, ASCII, no spaces** for files, folders, slugs. (Already the convention.)
- **`name` field = canonical ID.** Globally unique across all types — manifest is keyed by `name` and `.claude/` flattens everything; collisions are silent bugs. Validator rejects duplicates.
- **Slugs stay pure by default** (`debug-pod-crashloop`). Encode a facet in the slug **only** when platform disambiguates an otherwise-identical task (`kube-debug-pod-crashloop` vs `aws-debug-ecs-task`). **Never** encode `domain` or `maturity` in slugs — they change; renames break symlinks.
- **Collision handling:** platform prefix (`kube-*`, `aws-*`) for same-task-different-platform. Scope suffix (`review-pr-security`, `review-pr-perf`) for same-task-different-scope. No numeric suffixes.
- **File extensions:** `.md` for all prompt artifacts; `.sh`/`.mjs` for hook scripts with `.md` sidecar alongside.

## Search, filtering, tagging

`.claude/skills-manifest.json` stays the integrity manifest. **Extend it** with resolved facet fields from frontmatter (purely additive — the `{name, path, checksum, dependencies, lastValidated}` shape remains a subset):

```json
{
  "name": "merge-pr",
  "path": ".claude/commands/merge-pr.md",
  "type": "command",
  "domain": ["devex"],
  "platform": ["github-actions"],
  "task": ["review"],
  "maturity": "production",
  "checksum": "sha256:…",
  "dependencies": [],
  "lastValidated": "2026-04-16"
}
```

**Always generated, never hand-edited.** `scripts/build-index.mjs` walks `agents/`, `commands/`, `skills/`, `hooks/`, `templates/`, validates each artifact against its type schema, and writes `skills-manifest.json` plus per-facet views under `index/`. CI fails on drift (`git diff --exit-code` after regeneration). Per-facet JSON files are cheap (ms to regenerate) and let the CLI answer queries in one read.

## Cross-cutting artifacts (avoid duplication)

Default to **multi-valued arrays** (`domain: [infra, observability]`, `platform: [aws, gcp]`). Split into variants only when:

1. Instructions diverge beyond a paragraph (different tools, different workflow), OR
2. Platforms have incompatible invocation (e.g., `kubectl` vs AWS CLI), OR
3. Users would trigger them with genuinely different phrasing.

When splitting, factor shared prose into `skills/_shared/<name>.md` and `@include` from each variant's `SKILL.md` (resolved at build time). Do **not** attempt runtime inheritance — Claude Code has no such primitive; build-time include is the honest version.

## Variation vs new artifact — decision rubric

Apply in order:

1. **Prose ≥80% identical across platforms?** One artifact with `platform: [a, b, c]`. Trust Claude to branch on platform in-context.
2. **Needs different `tools:` or `model:`?** Split. Frontmatter is a contract; conditional tool-use is unsupported.
3. **Triggers are genuinely different phrases** ("debug my k8s pod" vs "debug my ECS task")? Split even if prose is similar — description-driven skill selection degrades when triggers are buried in conditionals.

Example: `debug-container-crash` covers docker+kubernetes (rule 1). `kube-debug-pod-crashloop` + `aws-debug-ecs-task` split (rules 2+3).

## Governance (lightweight, automated)

- **CI validator** (`scripts/validate.mjs`): runs on every PR, lints frontmatter against type schemas, checks enum membership against `vocabularies.json`, rejects duplicate `name`s, verifies `deprecated_by` points at an existing artifact, regenerates manifest+index and asserts zero drift.
- **Promotion ladder:** `draft` (not shipped in npm `files`) → `validated` (≥1 passing example + owner sign-off) → `production` (shipped, backward-compat promise) → `deprecated` (terminal). Deprecated artifacts stay for two minor versions with `deprecated_by` pointing at successor, then delete.
- **CODEOWNERS:** `/agents/` → agents-wg, `/skills/` → skills-wg, `/commands/` → commands-wg, `/hooks/` → security-wg (hooks are security-sensitive), `/schemas/` + `/templates/` → core-wg.
- **Vocabulary changes:** PR editing `vocabularies.json` must (a) explain rationale, (b) reclassify ≥1 artifact to the new term in the same PR, (c) get core-wg review. Never silently remove a term — orphans artifacts.
- **Drift detection:** the generator is deterministic; CI runs it and `git diff --exit-code` on manifest + index.

## Migration path (phased, non-breaking)

Every phase is independently revertible. Symlink and scaffolder flows never change paths consumers depend on.

1. **Phase 0 — schemas only.** Land `schemas/*.schema.json` + `vocabularies.json`. No artifact changes. Validator in warn-only mode.
2. **Phase 1 — additive frontmatter backfill.** One PR per type adds `type`, `domain`, `platform`, `task`, `maturity: validated` to existing 14 commands + 3 skills + 8 agents + 1 hook. Existing fields untouched. Symlinks keep working.
3. **Phase 2 — canonicalize agents & hooks at root.** Add `agents/` symlink → `plugins/dotclaude/templates/claude/agents/`. Add root `hooks/` and move `.claude/hooks/` to a symlink pointing there. Update `sync.sh` + `bootstrap.sh` accordingly. `plugin.json` unchanged.
4. **Phase 3 — hook sidecars.** For each hook script, add a sibling `*.md` with frontmatter. Register in manifest.
5. **Phase 4 — extend manifest + write index.** `scripts/build-index.mjs` regenerates `skills-manifest.json` with facet fields and writes `index/by-*/`. Existing consumer contract preserved as subset.
6. **Phase 5 — enforce.** Flip validator to error-on-violation. Promote artifacts `validated` → `production` as owners sign off.

## Trade-offs rejected

- **Deep folder hierarchies** (`skills/platform/kubernetes/task/debugging/`): forces a single primary facet; filesystem picks wrong.
- **Dewey-decimal / numeric IDs** (`SKL-042`): opaque, needs a registry service. Names are already unique and human-readable.
- **Per-facet symlink trees** (UNIX man-pages style): doubles inode count, breaks on Windows consumers.
- **Free-form tags**: drift within a quarter without controlled vocabularies.
- **Single giant `artifacts/` dir with `type:` in frontmatter**: collapses the only axis that *does* change consumption contracts (Claude Code expects agents at `~/.claude/agents/`, skills at `~/.claude/skills/`).
- **Runtime skill inheritance / base classes**: Claude Code has no such primitive; build-time `@include` is the honest version.

## Critical files to create or modify

- `schemas/vocabularies.json` *(new — enum source of truth)*
- `schemas/_base.schema.json` *(new — shared facet fields)*
- `schemas/{agent,skill,command,hook,template}.schema.json` *(new — per-type schemas, `$ref` base + vocabularies)*
- `scripts/build-index.mjs` *(new — generator + validator; CI drift gate)*
- `scripts/validate.mjs` *(new — frontmatter + vocabulary lint invoked by build-index)*
- `.claude/skills-manifest.json` *(extend additively with facet fields; preserve existing shape)*
- `sync.sh` + `bootstrap.sh` *(add `agents/`, `hooks/` canonical symlinks; keep dual-persona flow)*
- `agents/` *(new top-level symlink → `plugins/dotclaude/templates/claude/agents/`)*
- `hooks/` *(new canonical home with scripts + sidecar `.md` frontmatter)*
- `templates/` *(new canonical home for scaffolding templates)*
- `index/` *(new, generated — do not hand-edit)*
- `CODEOWNERS` *(new — per-type ownership)*
- Existing artifacts: 14 × `commands/*.md`, 3 × `skills/*/SKILL.md`, 8 × `plugins/dotclaude/templates/claude/agents/*.md`, `.claude/hooks/guard-destructive-git.sh` *(Phase 1 frontmatter additions)*

## Verification

End-to-end validation after implementation:

1. **Schema lint:** `node scripts/validate.mjs` — must exit 0 with zero schema or vocabulary violations across all artifacts.
2. **Manifest regen:** `node scripts/build-index.mjs && git diff --exit-code .claude/skills-manifest.json index/` — generator is deterministic; no diff means in sync.
3. **Duplicate-name check:** validator fails if any `name` appears twice across types.
4. **Symlink sanity:** after `./bootstrap.sh`, verify `~/.claude/agents/`, `~/.claude/hooks/`, `~/.claude/commands/`, `~/.claude/skills/` resolve to canonical sources with `readlink -f`.
5. **Claude Code discovery:** open a fresh Claude Code session; run `/help` and confirm each command, skill, and agent appears with its expected frontmatter description.
6. **Facet query smoke test:** `jq '.[] | select(.platform[] == "kubernetes")' index/all.json` returns the expected subset; per-facet views under `index/by-platform/kubernetes.json` match.
7. **Deprecation flow:** temporarily mark one artifact `maturity: deprecated` with a valid `deprecated_by`; validator passes. Remove the `deprecated_by`; validator fails with a clear error.
8. **npm tarball smoke test:** `npm pack` and inspect — `draft` artifacts excluded, `validated`/`production` included.
