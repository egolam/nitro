#!/bin/sh
# Run migrations (safe schema push)
echo "Running db:push..."
# DEBUG: Print the hostname we are trying to connect to (hiding credentials)
node -e 'try { const url = new URL(process.env.DATABASE_URL); console.log("Connecting to DB Host:", url.hostname); } catch (e) { console.error("Invalid DATABASE_URL"); }'
npm run db:push

# OPTIONAL: Run seed if explicitly enabled via env var (safer!)
if [ "$SEED_ON_START" = "true" ]; then
  echo "Running db:seed (WARNING: This might wipe data)..."
  npm run db:seed
fi

# Start the Next.js app
echo "Starting application..."
npm start
