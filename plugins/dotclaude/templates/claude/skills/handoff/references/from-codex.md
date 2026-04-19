# Using handoff from Codex (or any shell)

Codex CLI does not autoload `~/.claude/skills/`, so it cannot invoke
the `/handoff` slash command directly. Use the packaged binary via
Codex's bash tool instead. Same binary works from any shell.

## One command, one shape

```
!dotclaude handoff <source-cli> <id-or-name>
```

- `<source-cli>`: `claude` | `copilot` | `codex`
- `<id-or-name>`: full UUID, short UUID (8 hex), `latest`, or a
  named alias where the source CLI supports it (Claude `customTitle`,
  Codex `thread_name`).

The output is a `<handoff>` block that lands directly in Codex's
context. Follow up with "continue" and you are back on task.

## Examples

```
# Claude hit its token limit; continue that session in Codex.
!dotclaude handoff claude b8d2dd0a
!dotclaude handoff claude "test-handoff"       # customTitle alias
!dotclaude handoff claude latest

# Resume a Copilot session in Codex.
!dotclaude handoff copilot e6c2e29a

# Resume a renamed Codex thread in a fresh Codex session.
!dotclaude handoff codex test                   # thread_name alias
!dotclaude handoff codex 019da2f6
!dotclaude handoff codex latest
```

## Prerequisite

`npm install -g @dotclaude/dotclaude` (installs `dotclaude` on PATH
with `handoff` as one of its sub-commands). Or run ad-hoc with
`npx dotclaude handoff ...`.

## Sub-commands (power users)

The bare form above is shorthand for the common `digest` path. Full
sub-command list:

```
dotclaude handoff <cli> <id>                 # implicit digest (default)
dotclaude handoff resolve  <cli> <id>        # file path only
dotclaude handoff describe <cli> <id>        # inline markdown summary
dotclaude handoff digest   <cli> <id>        # full <handoff> block
dotclaude handoff list     <cli>             # recent sessions
dotclaude handoff file     <cli> <id>        # write to docs/handoffs/
```

All subcommands support `--help`, `--version`, `--json`, `--verbose`,
`--no-color`. Exit codes: 0 ok, 2 not found / parse error, 64 usage.

## Why the binary and not the skill file?

`skills/handoff/SKILL.md` is the authoritative runbook for Claude
Code and Copilot CLI (both load it automatically). Codex does not
load it. Rather than asking Codex to ingest a 460-line spec, the
binary bundles the resolution and extraction logic into a single
call. Same code path as the skill; no skill load required.
