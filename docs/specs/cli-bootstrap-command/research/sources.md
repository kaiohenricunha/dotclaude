# Research Sources

> Indexed documents feeding into this spec. Each tagged with which sections it informs.

- **DOC-1**: `bootstrap.sh` — shell script that symlinks dotclaude files into `~/.claude/`; canonical reference for the symlinking algorithm, backup behavior, and agent-copy logic. Feeds: §1, §4, §6.
- **DOC-2**: `sync.sh` — pull/push/status wrapper; canonical reference for git rebase flow, secret-scan regex (`SECRET_RX`), and `HARNESS_SYNC_SKIP_SECRET_SCAN` escape hatch. Feeds: §4, §6, §7.
- **DOC-3**: `plugins/dotclaude/bin/dotclaude.mjs` — umbrella dispatcher; defines `SUBCOMMANDS` array and spawn pattern all bins must follow. Feeds: §3, §5, §6.
- **DOC-4**: `plugins/dotclaude/bin/dotclaude-init.mjs` — reference implementation for a bin entry-point (arg parsing, META, exit code mapping). Feeds: §6.
- **DOC-5**: `plugins/dotclaude/src/lib/output.mjs` — `createOutput` / ✓/✗/⚠ format contract all new modules must use. Feeds: §4, §5.
- **DOC-6**: `plugins/dotclaude/src/lib/argv.mjs` — `parse()` / `helpText()` contract; defines `HARNESS_FLAGS` and the `FlagsSpec` type. Feeds: §5.
- **DOC-7**: `package.json` — `files` array and `bin` map; defines what ships in the tarball and what bins are registered. Feeds: §2, §5, §6.
- **DOC-8**: `docs/repo-facts.json` — protected paths list; confirms that `commands/`, `skills/`, `CLAUDE.md` are not currently in the `files` array of the npm package. Feeds: §2.
