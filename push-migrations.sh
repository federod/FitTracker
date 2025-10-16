#!/bin/bash
export NETLIFY_DATABASE_URL=$(npx netlify env:get NETLIFY_DATABASE_URL --context dev 2>&1 | grep -v "^⬥" | grep -v "^Warning" | tail -1)
echo "Using DATABASE_URL: ${NETLIFY_DATABASE_URL:0:30}..."
npx drizzle-kit push
