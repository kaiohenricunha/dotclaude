#!/usr/bin/env bash
# validate-settings.sh — enforce the contract in
# docs/specs/claude-hardening/spec/7-non-functional-requirements.md.
#
# Usage:
#   validate-settings.sh                      # validates ~/.claude/settings.json
#   validate-settings.sh <path-to-settings>   # validates an alternative file
#
# Exit codes:
#   0 — all hard checks pass
#   1 — at least one hard check failed
#
# Hard checks:
#   SEC-1  no secret literals in *_KEY/*_TOKEN/*_SECRET fields (unless ${VAR})
#   SEC-2  skipDangerousModePermissionPrompt must not be present
#   SEC-3  no @latest in mcpServers[*].args
#   SEC-4  .credentials.json mode == 600
#   OPS-1  JSON well-formed
#          every mcpServers[*].command resolves on PATH or as existing absolute path
#          every hooks[*].command + statusLine.command path exists
#          every enabledPlugins key exists in installed_plugins.json
#
# Soft checks (warn, exit 0):
#   OPS-2  ~/.claude/projects/ ≤ 1.5 GB, ~/.claude/file-history/ ≤ 100 MB

set -u

SETTINGS=${1:-$HOME/.claude/settings.json}
PLUGINS_REG=$HOME/.claude/plugins/installed_plugins.json
CREDS=$HOME/.claude/.credentials.json
PROJECTS_DIR=$HOME/.claude/projects
FILE_HISTORY_DIR=$HOME/.claude/file-history

FAIL=0
WARN=0

if [ -t 1 ]; then
  G=$'\033[32m'; R=$'\033[31m'; Y=$'\033[33m'; N=$'\033[0m'
else
  G=""; R=""; Y=""; N=""
fi

pass() { printf '  %s✓%s %s\n' "$G" "$N" "$1"; }
fail() { printf '  %s✗%s %s\n' "$R" "$N" "$1"; FAIL=$((FAIL+1)); }
warn() { printf '  %s⚠%s %s\n' "$Y" "$N" "$1"; WARN=$((WARN+1)); }

echo "Validating $SETTINGS"
echo

# --- JSON validity (blocking) ---
if jq -e . < "$SETTINGS" > /dev/null 2>&1; then
  pass "JSON well-formed"
else
  fail "JSON malformed"
  echo
  echo "Summary: 1 failure"
  exit 1
fi

# --- SEC-2: no skipDangerousModePermissionPrompt ---
if jq -e 'has("skipDangerousModePermissionPrompt")' < "$SETTINGS" > /dev/null 2>&1; then
  fail "SEC-2 skipDangerousModePermissionPrompt is set"
else
  pass "SEC-2 skipDangerousModePermissionPrompt absent"
fi

# --- SEC-1: no secret literals ---
SECRET_LEAKS=$(jq -r '
  . as $root
  | [paths(scalars)] as $ps
  | $ps[]
  | select((last | tostring) | test("(_KEY|_TOKEN|_SECRET)$"; "i"))
  | . as $p
  | ($root | getpath($p)) as $v
  | select(($v | type) == "string")
  | select($v | test("^[A-Za-z0-9_-]{20,}$"))
  | ($p | map(tostring) | join("."))
' < "$SETTINGS")

if [ -z "$SECRET_LEAKS" ]; then
  pass "SEC-1 no secret literals in *_KEY/*_TOKEN/*_SECRET fields"
else
  while IFS= read -r p; do fail "SEC-1 secret literal at: $p"; done <<< "$SECRET_LEAKS"
fi

# --- SEC-3: no @latest in MCP args ---
LATEST_REFS=$(jq -r '
  .mcpServers // {} | to_entries[]
  | . as $s
  | ($s.value.args // [])[]
  | select(. | test("@latest$"))
  | $s.key + " → " + .
' < "$SETTINGS")

if [ -z "$LATEST_REFS" ]; then
  pass "SEC-3 no @latest in MCP args"
else
  while IFS= read -r l; do fail "SEC-3 @latest pinned in: $l"; done <<< "$LATEST_REFS"
fi

# --- MCP command resolvable ---
while IFS= read -r cmd; do
  [ -z "$cmd" ] && continue
  if [[ "$cmd" == /* ]]; then
    if [ -x "$cmd" ]; then
      pass "MCP command executable: $cmd"
    else
      fail "MCP command missing or not executable: $cmd"
    fi
  else
    if command -v "$cmd" > /dev/null 2>&1; then
      pass "MCP command on PATH: $cmd"
    else
      fail "MCP command not on PATH: $cmd"
    fi
  fi
done < <(jq -r '.mcpServers // {} | to_entries[] | .value.command' < "$SETTINGS")

# --- hooks + statusLine target paths ---
while IFS= read -r cmd; do
  [ -z "$cmd" ] && continue
  script=$(echo "$cmd" | awk '{for(i=1;i<=NF;i++) if($i ~ /^\//) {print $i; exit}}')
  [ -z "$script" ] && script="$cmd"
  if [ -f "$script" ]; then
    pass "hook/statusLine target exists: $script"
  else
    fail "hook/statusLine target missing: $script"
  fi
done < <(jq -r '
  [
    (.hooks // {} | to_entries[] | .value[] | .hooks[] | .command),
    (.statusLine.command // empty)
  ][] // empty
' < "$SETTINGS")

# --- enabledPlugins installed? ---
if [ -f "$PLUGINS_REG" ]; then
  while IFS= read -r plugin; do
    [ -z "$plugin" ] && continue
    if jq -e --arg p "$plugin" '.plugins | has($p)' < "$PLUGINS_REG" > /dev/null 2>&1; then
      pass "enabled plugin installed: $plugin"
    else
      fail "enabled plugin NOT installed: $plugin"
    fi
  done < <(jq -r '.enabledPlugins // {} | to_entries[] | select(.value == true) | .key' < "$SETTINGS")
else
  warn "plugin registry not found at $PLUGINS_REG"
fi

# --- SEC-4: .credentials.json mode 600 ---
if [ -f "$CREDS" ]; then
  MODE=$(stat -c '%a' "$CREDS" 2>/dev/null)
  if [ "$MODE" = "600" ]; then
    pass "SEC-4 .credentials.json mode 600"
  else
    fail "SEC-4 .credentials.json mode is $MODE (expected 600)"
  fi
else
  warn ".credentials.json not found (may not be logged in)"
fi

# --- OPS-2 disk budgets (soft) ---
if [ -d "$PROJECTS_DIR" ]; then
  PROJECTS_MB=$(du -sm "$PROJECTS_DIR" 2>/dev/null | awk '{print $1}')
  if [ "$PROJECTS_MB" -gt 1536 ]; then
    warn "~/.claude/projects/ is ${PROJECTS_MB} MB (budget: 1536 MB). Prune: find ~/.claude/projects -mindepth 2 -maxdepth 2 -type f -mtime +60 -delete"
  else
    pass "projects/ size OK (${PROJECTS_MB} MB / 1536)"
  fi
fi

if [ -d "$FILE_HISTORY_DIR" ]; then
  FH_MB=$(du -sm "$FILE_HISTORY_DIR" 2>/dev/null | awk '{print $1}')
  if [ "$FH_MB" -gt 100 ]; then
    warn "~/.claude/file-history/ is ${FH_MB} MB (budget: 100 MB)"
  else
    pass "file-history/ size OK (${FH_MB} MB / 100)"
  fi
fi

echo
echo "Summary: $FAIL failure(s), $WARN warning(s)"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
