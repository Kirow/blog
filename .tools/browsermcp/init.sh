#!/bin/sh

# Resolve the project root (assume script is in .tools/browsermcp)
PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
echo "Project root resolved to: $PROJECT_ROOT"
ENV_FILE="$PROJECT_ROOT/.env"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env file not found at $ENV_FILE" >&2
  exit 1
fi

# Extract BUN_EXE from .env (handles quoted and unquoted values)
BUN_EXE="$(grep -E '^BUN_EXE=' "$ENV_FILE" | head -n1 | cut -d '=' -f2- | sed -e 's/^["'\'']//;s/["'\'']$//')"

if [ -z "$BUN_EXE" ]; then
  echo "Error: BUN_EXE variable not set in $ENV_FILE" >&2
  exit 2
fi

if [ ! -x "$BUN_EXE" ]; then
  echo "Error: BUN_EXE points to '$BUN_EXE', which is not executable or does not exist." >&2
  exit 3
fi

echo "Using BUN_EXE at: $BUN_EXE"

exec "$BUN_EXE" @browsermcp/mcp@latest "$@"
