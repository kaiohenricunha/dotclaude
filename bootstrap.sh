#!/usr/bin/env bash
# bootstrap.sh — symlink dotclaude contents into ~/.claude/
#
# Idempotent: safe to re-run after pulling new commits.
# Backs up pre-existing real files (not symlinks) to <name>.bak-<timestamp>.

set -euo pipefail

DOTCLAUDE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="$HOME/.claude"
TS=$(date +%Y%m%d-%H%M%S)

mkdir -p "$TARGET"

link_one() {
  local src="$1"
  local dst="$2"

  if [ -L "$dst" ]; then
    # Already a symlink — update if pointing elsewhere.
    if [ "$(readlink "$dst")" != "$src" ]; then
      rm "$dst"
      ln -s "$src" "$dst"
      echo "  updated: $dst -> $src"
    else
      echo "  ok:      $dst"
    fi
  elif [ -e "$dst" ]; then
    # Real file/dir — back it up before linking.
    mv "$dst" "${dst}.bak-${TS}"
    ln -s "$src" "$dst"
    echo "  backed up + linked: $dst (old at ${dst}.bak-${TS})"
  else
    ln -s "$src" "$dst"
    echo "  linked:  $dst -> $src"
  fi
}

echo "==> linking CLAUDE.md"
[ -f "$DOTCLAUDE/CLAUDE.md" ] && link_one "$DOTCLAUDE/CLAUDE.md" "$TARGET/CLAUDE.md"

echo "==> linking commands/"
mkdir -p "$TARGET/commands"
for f in "$DOTCLAUDE/commands"/*.md; do
  [ -e "$f" ] || continue
  link_one "$f" "$TARGET/commands/$(basename "$f")"
done

echo "==> linking skills/"
mkdir -p "$TARGET/skills"
for d in "$DOTCLAUDE/skills"/*/; do
  [ -e "$d" ] || continue
  name=$(basename "$d")
  link_one "${d%/}" "$TARGET/skills/$name"
done

echo ""
echo "bootstrap complete."
echo "dotclaude: $DOTCLAUDE"
echo "target:    $TARGET"
