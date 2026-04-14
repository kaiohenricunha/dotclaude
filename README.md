# dotclaude

Kaio's global Claude Code configuration.

## What lives here

- `CLAUDE.md` — global rule floor, symlinked to `~/.claude/CLAUDE.md`
- `commands/` — global slash commands (e.g. `/commit`, `/create-audit`), symlinked to `~/.claude/commands/`
- `skills/` — global directory-form skills, symlinked to `~/.claude/skills/`
- `plugins/harness/` — the portable harness: validators, hooks, templates. Dual-purpose Claude plugin + npm package.

## Fresh distro setup

```bash
git clone git@github.com:kaiohenricunha/dotclaude.git ~/Projects/kaiohenricunha/dotclaude
cd ~/Projects/kaiohenricunha/dotclaude
./bootstrap.sh
```

`bootstrap.sh` creates symlinks from this repo into `~/.claude/`. Run it again after pulling new commits.

## Sync between machines

- `./sync.sh pull` — fetch + rebase from origin.
- `./sync.sh push` — add all tracked changes, commit, push.

## Adding a new global command

Drop the `.md` file in `commands/`, re-run `./bootstrap.sh`, commit, push.

## Configuration decisions (2026-04-13 hardening)

Full context: [spec](docs/specs/claude-hardening/) · [audit](docs/audits/claude-code-global-config-2026-04-13.md) · [assessment](docs/assessments/claude-code-global-config-2026-04-13.md) · [plan](docs/plans/2026-04-13-claude-code-global-config-cleanup.md).

| Decision | Rationale | Where enforced |
|----------|-----------|---------------|
| **Secrets live in shell env, not `settings.json`** | An external API key was previously embedded literal in global settings. Now sourced from shell env via `${PROVIDER_API_KEY}` reference, exported in `~/.zshrc`. | Validator SEC-1 (regex on `*_KEY`/`*_TOKEN`/`*_SECRET` fields) |
| **Dangerous-mode confirmation restored** | `skipDangerousModePermissionPrompt` was silently bypassing the prompt globally. Safer default even with more friction on long skill chains. | Validator SEC-2 |
| **No `@latest` in MCP `args`** | An MCP package was refetching on every session start. Always pin to an explicit version in MCP `args`. Applies to every MCP. | Validator SEC-3 |
| **`claude-code-lsps` owns LSPs** | Dedicated marketplace beats the generalist `*-lsp@claude-plugins-official` triplet. Those three plugins were uninstalled. | Validator: `enabledPlugins` must contain no `*-lsp@claude-plugins-official` |
| **Project-bound MCPs live in `<project>/.mcp.json`** | Project-specific MCPs (e.g. language servers, project filesystems) previously pinned at user scope. Moved to `<project>/.mcp.json`. Genuinely cross-project MCPs stay global. | Pre-flight diff + validator MCP-command-exists check |
| **Hooks block kept minimal** | All 8 Vibecraft events were removed (consumer offline, `events.jsonl` truncated from 779 MB to 0). Only `validate-edit.sh` PostToolUse survives. | Validator: every `hooks[*].command` must exist on disk |
| **60-day age-based retention** | `~/.claude/projects/` and `~/.claude/file-history/` pruned on `mtime +60`. Soft budget: projects/ ≤ 1.5 GB, file-history/ ≤ 100 MB (warn only). | Validator OPS-2 (disk budget warning) |
| **`.credentials.json` mode 600** | Token file must never widen. | Validator SEC-4 |
| **`context7` runs globally, not per-project** | Library docs lookup is cross-project value; used to be pinned to a single project scope. | Global `enabledPlugins` |

### Validator

`plugins/harness/scripts/validate-settings.sh` encodes every decision above as a hard or soft check. Also symlinked at `~/.claude/scripts/validate-settings.sh`.

```bash
~/.claude/scripts/validate-settings.sh            # checks ~/.claude/settings.json
~/.claude/scripts/validate-settings.sh <path>     # checks an alternative file
```

Exit 0 = pass, 1 = hard failure. Warnings don't fail exit code. Tests: `plugins/harness/tests/test_validate_settings.sh` (8 fixtures covering positive + negative cases).

Run the validator after every settings.json edit. The harness system prompt's PostToolUse `validate-edit.sh` hook already invokes it for Edit/Write events on settings files.

### Pre-flight rollback snapshot

Before the 2026-04-13 hardening run, the previous state was captured at `~/.claude/settings.json.preflight-2026-04-13`. Restore with `cp` if anything breaks.

### Standing TODOs

- `~/.claude/projects/` is 1.85 GB (validator warns; soft limit 1.5 GB). Most transcripts are recent (< 60 days); the retention policy will reclaim space over time. For immediate relief, prune stale worktree sessions manually.
- `frontend-design`, `skill-creator`, `security-guidance`, `context7` show `version: "unknown"` in the install registry. Cosmetic; the marketplace manifest doesn't expose versions for these plugins. `claude plugins update` is a no-op.
