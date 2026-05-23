#!/usr/bin/env bash
set -e

echo "Checking for Docker..."
if command -v docker >/dev/null 2>&1; then
  if [ "$(docker ps -a -q -f name=glovia-mongo)" = "" ]; then
    echo "Starting MongoDB container (mongo:6)..."
    docker run -d --name glovia-mongo -p 27017:27017 -e MONGO_INITDB_DATABASE=glovia mongo:6
  else
    echo "MongoDB container already exists. Starting if stopped..."
    docker start glovia-mongo || true
  fi
  echo "Exporting DATABASE_URL and starting backend in development mode"
  export DATABASE_URL='mongodb://127.0.0.1:27017/glovia'
  echo "Run: DATABASE_URL='$DATABASE_URL' NODE_ENV=development node server.js"
  exit 0
fi

echo "Docker not found. Checking for brew (macOS)..."
if command -v brew >/dev/null 2>&1; then
  echo "Installing/starting mongodb-community via Homebrew (requires user approval)..."
  brew tap mongodb/brew || true
  # Install the latest mongodb-community formula available via Homebrew
  brew install mongodb/brew/mongodb-community || true
  brew services start mongodb/brew/mongodb-community || true
  echo "Exporting DATABASE_URL"
  export DATABASE_URL='mongodb://127.0.0.1:27017/glovia'
  echo "Run: DATABASE_URL='$DATABASE_URL' NODE_ENV=development node server.js"
  exit 0
fi

echo "No Docker or Homebrew detected. Please install MongoDB (Docker or Homebrew) or set DATABASE_URL to a running Mongo instance (Atlas)."
echo "See README_DEV.md for detailed instructions."
exit 1
