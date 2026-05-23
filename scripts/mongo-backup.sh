#!/usr/bin/env bash
set -euo pipefail

# Usage: ./mongo-backup.sh /path/to/output/dir
OUT_DIR=${1:-./backups}
mkdir -p "$OUT_DIR"

MONGO_URI=${MONGODB_URI:-${DATABASE_URL:-}}
if [ -z "$MONGO_URI" ]; then
  echo "MONGODB_URI or DATABASE_URL must be set in env"
  exit 1
fi

TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
DEST="$OUT_DIR/mongo-backup-$TIMESTAMP"
mkdir -p "$DEST"

echo "Starting mongodump to $DEST"
mongodump --uri="$MONGO_URI" --archive="$DEST/dump.archive" --gzip
echo "Backup complete: $DEST/dump.archive"
