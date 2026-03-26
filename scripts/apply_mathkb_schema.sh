#!/bin/sh

set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

: "${MATHKB_ADMIN_DATABASE_URL:?Set MATHKB_ADMIN_DATABASE_URL to an admin connection string for the mathkb database.}"

echo "Applying mathkb schema..."
psql "$MATHKB_ADMIN_DATABASE_URL" -f "$ROOT_DIR/db/mathkb.sql"

echo "Applying mathkb roles and grants..."
psql "$MATHKB_ADMIN_DATABASE_URL" -f "$ROOT_DIR/db/mathkb.roles.sql"

if [ "${MATHKB_APPLY_SEED:-false}" = "true" ]; then
  echo "Applying sample seed data..."
  psql "$MATHKB_ADMIN_DATABASE_URL" -f "$ROOT_DIR/db/mathkb.seed.sql"
fi

echo "Done."
