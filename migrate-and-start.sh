#!/bin/sh
set -e

echo "Running database migrations..."
# Using npx to execute drizzle-kit (which we can ensure is installed)
npx drizzle-kit push

echo "Starting application..."
node server.js
