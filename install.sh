#!/usr/bin/env bash
set -euo pipefail

# Env overrides
DOTCLAUDE_VERSION="${DOTCLAUDE_VERSION:-latest}"
DOTCLAUDE_SKIP_BOOTSTRAP="${DOTCLAUDE_SKIP_BOOTSTRAP:-}"

# Color helpers (suppressed when NO_COLOR is set or stdout is not a TTY)
if [[ -z "${NO_COLOR:-}" ]] && [[ -t 1 ]]; then
  RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BOLD='\033[1m'; RESET='\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; BOLD=''; RESET=''
fi

info()  { printf '%b==>%b %s\n' "$GREEN" "$RESET" "$*"; }
warn()  { printf '%bwarn:%b %s\n' "$YELLOW" "$RESET" "$*" >&2; }
error() { printf '%berror:%b %s\n' "$RED" "$RESET" "$*" >&2; exit 1; }

# ── 1. Prerequisites ──────────────────────────────────────────────────────────

if ! command -v node >/dev/null 2>&1; then
  error "Node.js is required but not found. Install Node >= 20 from https://nodejs.org"
fi

node_version=$(node --version)
node_major="${node_version%%.*}"
node_major="${node_major#v}"
if [[ "$node_major" -lt 20 ]]; then
  error "Node >= 20 required (found ${node_version}). Upgrade at https://nodejs.org"
fi

if ! command -v npm >/dev/null 2>&1; then
  error "npm is required but not found. It ships with Node — try reinstalling Node from https://nodejs.org"
fi

# ── 2. Install ────────────────────────────────────────────────────────────────

info "Installing @dotclaude/dotclaude@${DOTCLAUDE_VERSION} ..."
npm install -g "@dotclaude/dotclaude@${DOTCLAUDE_VERSION}"

npm_prefix="$(npm prefix -g 2>/dev/null || true)"
npm_bin_dir=""
if [[ -n "$npm_prefix" ]]; then
  npm_bin_dir="${npm_prefix%/}/bin"
fi

if ! command -v dotclaude >/dev/null 2>&1; then
  if [[ -n "$npm_bin_dir" ]]; then
    error "'dotclaude' was installed but is not on your PATH. Add '${npm_bin_dir}' to PATH and re-run. For example: export PATH=\"${npm_bin_dir}:\$PATH\""
  else
    error "'dotclaude' was installed but is not on your PATH. Add npm's global bin directory to PATH and re-run."
  fi
fi

# ── 3. Bootstrap ~/.claude/ ───────────────────────────────────────────────────

if [[ -z "$DOTCLAUDE_SKIP_BOOTSTRAP" ]]; then
  info "Running dotclaude bootstrap ..."
  if ! dotclaude bootstrap; then
    warn "bootstrap step failed — run 'dotclaude doctor' to diagnose"
  fi
fi

# ── 4. Doctor ─────────────────────────────────────────────────────────────────

info "Running dotclaude doctor ..."
dotclaude doctor || true   # non-zero is informational, not fatal

# ── 5. Done ───────────────────────────────────────────────────────────────────

printf '\n%bdotclaude installed successfully.%b\n' "$BOLD" "$RESET"
printf '  %bdotclaude --help%b   see all commands\n' "$GREEN" "$RESET"
printf '  %bdotclaude doctor%b   re-run diagnostics any time\n\n' "$GREEN" "$RESET"
