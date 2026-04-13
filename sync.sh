#!/usr/bin/env bash
# sync.sh — pull/push convenience wrapper for dotclaude.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

cmd="${1:-pull}"
case "$cmd" in
  pull)
    git fetch origin
    git rebase origin/main
    ./bootstrap.sh
    ;;
  push)
    git add -A
    if git diff --cached --quiet; then
      echo "no changes to push"
      exit 0
    fi
    git commit -m "dotclaude: sync $(date +%Y-%m-%d)"
    git push
    ;;
  status)
    git status --short
    ;;
  *)
    echo "usage: $0 {pull|push|status}" >&2
    exit 64
    ;;
esac
