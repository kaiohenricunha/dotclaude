#!/usr/bin/env bash
# test_validate_settings.sh — behavior tests for validate-settings.sh.
#
# Each test writes a temp settings.json fixture, runs the validator against it,
# and asserts exit code + stdout pattern.

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VALIDATOR="$SCRIPT_DIR/../scripts/validate-settings.sh"

if [ ! -x "$VALIDATOR" ]; then
  echo "validator not executable: $VALIDATOR"
  exit 1
fi

RUN=0 PASS=0 FAIL=0

run_test() {
  local name="$1"
  local fixture="$2"
  local expected_exit="$3"
  local expected_pattern="$4"

  RUN=$((RUN+1))
  local tmp; tmp=$(mktemp --suffix=.json)
  printf '%s' "$fixture" > "$tmp"

  local out; out=$("$VALIDATOR" "$tmp" 2>&1)
  local rc=$?

  if [ "$rc" -eq "$expected_exit" ] && echo "$out" | grep -qE "$expected_pattern"; then
    echo "  PASS: $name"
    PASS=$((PASS+1))
  else
    echo "  FAIL: $name"
    echo "    expected rc=$expected_exit, got $rc"
    echo "    expected pattern: $expected_pattern"
    echo "    output:"
    echo "$out" | sed 's/^/      /'
    FAIL=$((FAIL+1))
  fi
  rm -f "$tmp"
}

# --- 1. Clean minimal settings pass ---
run_test "passes_on_clean_settings" \
'{"env":{},"enabledPlugins":{},"mcpServers":{},"effortLevel":"high"}' \
0 "0 failure"

# --- 2. Kalshi literal value fails SEC-1 ---
run_test "fails_when_kalshi_literal_secret" \
'{"mcpServers":{"kalshi":{"command":"echo","env":{"KALSHI_API_KEY":"abcdefghij1234567890xyz"}}}}' \
1 "SEC-1 secret literal"

# --- 3. ${VAR} reference does not trigger SEC-1 ---
run_test "passes_on_env_var_reference" \
'{"mcpServers":{"kalshi":{"command":"echo","env":{"KALSHI_API_KEY":"${KALSHI_API_KEY}"}}}}' \
0 "SEC-1 no secret"

# --- 4. SEC-2 dangerous-mode bypass fails ---
run_test "fails_on_dangerous_mode_skip" \
'{"skipDangerousModePermissionPrompt":true,"mcpServers":{}}' \
1 "SEC-2 skipDangerousMode"

# --- 5. SEC-3 @latest fails ---
run_test "fails_on_at_latest_in_args" \
'{"mcpServers":{"foo":{"command":"echo","args":["-y","foo@latest"]}}}' \
1 "SEC-3 @latest"

# --- 6. Unknown enabled plugin fails ---
run_test "fails_on_unknown_enabled_plugin" \
'{"enabledPlugins":{"nope-fake-plugin-does-not-exist@unknown-marketplace":true},"mcpServers":{}}' \
1 "NOT installed"

# --- 7. Missing absolute-path MCP command fails ---
run_test "fails_on_missing_mcp_binary" \
'{"mcpServers":{"foo":{"command":"/nonexistent/binary-path","args":[]}}}' \
1 "MCP command missing"

# --- 8. Malformed JSON fails ---
RUN=$((RUN+1))
tmp=$(mktemp --suffix=.json); printf '{ not valid json ' > "$tmp"
out=$("$VALIDATOR" "$tmp" 2>&1); rc=$?
if [ "$rc" -eq 1 ] && echo "$out" | grep -q "JSON malformed"; then
  echo "  PASS: fails_on_malformed_json"; PASS=$((PASS+1))
else
  echo "  FAIL: fails_on_malformed_json (rc=$rc output=$out)"; FAIL=$((FAIL+1))
fi
rm -f "$tmp"

echo
echo "Tests: $RUN  Passed: $PASS  Failed: $FAIL"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
