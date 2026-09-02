#!/usr/bin/env bash
# Fails if a server only secret, or a value that looks like one, is present in the built
# client output. This is the guardrail behind the constraint "keep server only credentials
# out of client bundles" in WORLD_CLASS_APP_THESIS.md.
#
# Usage:  bash .github/scripts/check-client-bundle.sh [build-dir]
# Config: .github/scripts/server-only-vars.txt  one variable name per line

set -euo pipefail

BUILD_DIR="${1:-}"
if [ -z "$BUILD_DIR" ]; then
  for candidate in .next/static dist build out public; do
    if [ -d "$candidate" ]; then BUILD_DIR="$candidate"; break; fi
  done
fi

if [ -z "$BUILD_DIR" ] || [ ! -d "$BUILD_DIR" ]; then
  echo "FAIL: no client build directory found. Build first, or pass the path as an argument."
  echo "A check that cannot run is a failure, not a pass."
  exit 1
fi

VARS_FILE="$(dirname "$0")/server-only-vars.txt"
FAILED=0

echo "Scanning $BUILD_DIR"

# 1. Any value held by a server only variable must not appear in the bundle.
if [ -f "$VARS_FILE" ]; then
  while IFS= read -r VAR; do
    case "$VAR" in ""|\#*) continue ;; esac
    VALUE="${!VAR:-}"
    if [ -z "$VALUE" ]; then
      echo "  skip $VAR: not set in this environment, value cannot be checked"
      continue
    fi
    if [ "${#VALUE}" -lt 8 ]; then
      echo "  skip $VAR: value too short to match reliably"
      continue
    fi
    if grep -rqF -- "$VALUE" "$BUILD_DIR"; then
      echo "  FAIL $VAR: its value appears in the client bundle"
      FAILED=1
    else
      echo "  ok   $VAR"
    fi
  done < "$VARS_FILE"
else
  echo "  note: $VARS_FILE not found, skipping variable value check"
fi

# 2. Patterns that are never acceptable in client output.
PATTERNS='sk_live_|sk_test_|rk_live_|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|SERVICE_ROLE|service_role'
if grep -rqE -- "$PATTERNS" "$BUILD_DIR"; then
  echo "  FAIL: a known secret pattern appears in the client bundle:"
  grep -rlE -- "$PATTERNS" "$BUILD_DIR" | head -20
  FAILED=1
else
  echo "  ok   no known secret patterns"
fi

if [ "$FAILED" -ne 0 ]; then
  echo "Client bundle check failed. Do not ship this build."
  exit 1
fi

echo "Client bundle check passed."
