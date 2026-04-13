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
