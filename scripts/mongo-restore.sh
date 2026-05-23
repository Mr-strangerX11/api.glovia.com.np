#!/usr/bin/env bash
set -euo pipefail

# Usage: ./mongo-restore.sh /path/to/dump.archive
DUMP_FILE=${1:-}
if [ -z "$DUMP_FILE" ]; then
  echo "Provide path to dump.archive"
  exit 1
fi

MONGO_URI=${MONGODB_URI:-${DATABASE_URL:-}}
if [ -z "$MONGO_URI" ]; then
  echo "MONGODB_URI or DATABASE_URL must be set in env"
  exit 1
fi

echo "Restoring $DUMP_FILE to $MONGO_URI"
mongorestore --uri="$MONGO_URI" --archive="$DUMP_FILE" --gzip --drop
echo "Restore complete"
