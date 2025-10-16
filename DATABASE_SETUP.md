# FitTracker Database Setup Guide

## Overview

Your FitTracker app is now configured to use **Netlify DB** (powered by Neon Postgres) instead of localStorage. This guide will help you complete the setup.

## What's Already Done

✅ Installed dependencies (`@netlify/neon`, `drizzle-orm`, `@neondatabase/serverless`)
✅ Created database schema (`db/schema.ts`)
✅ Created database config (`db/config.ts`)
✅ Created Drizzle config (`drizzle.config.ts`)

## Database Schema

Your fitness tracker database includes:

- **users** - User accounts
- **profiles** - User profile data (weight, height, age, sex)
- **goals** - Calorie and macro goals
- **dailyLogs** - Daily meal and workout logs
- **weightHistory** - Weight tracking over time

## Setup Steps

### 1. Link Your Project to Netlify

Run these commands in your terminal:

```bash
# Login to Netlify (if not already logged in)
npx netlify login

# Link this project to your Netlify site
npx netlify link
# Choose: "Use current git remote origin"
```

### 2. Initialize Netlify DB

```bash
# Initialize the database
npx netlify db init --boilerplate=drizzle

# This will:
# - Create a Neon database instance
# - Set up DATABASE_URL environment variable
# - Configure database connection
```

### 3. Generate and Run Migrations

```bash
# Generate migration files from your schema
npx drizzle-kit generate:pg

# Push migrations to your database
npx drizzle-kit push:pg
```

### 4. Claim Your Database (Important!)

**⚠️ Unclaimed databases expire after 7 days with complete data loss!**

1. Go to your [Netlify dashboard](https://app.netlify.com)
2. Navigate to your FitTracker project
3. Go to **Extensions** → **Neon database**
4. Click "Connect Neon" and complete account setup
5. Click "Claim database"

### 5. Add Database URL to .env

Your `DATABASE_URL` will be automatically set by Netlify in production. For local development:

```bash
# Get your database URL from Netlify
npx netlify env:list

# Add it to your .env file
echo "DATABASE_URL=your_database_url_here" >> .env
```

## Next Steps

After setup is complete, you'll need to:

1. **Create Netlify Functions** - API endpoints for database operations
2. **Update Frontend** - Replace localStorage with API calls
3. **Add Authentication** - Optional, but recommended for multi-user support

## Useful Commands

```bash
# Start local development with Netlify
npx netlify dev

# View database in Neon console
# Visit: https://console.neon.tech

# Run database migrations
npx drizzle-kit push:pg

# Generate new migrations after schema changes
npx drizzle-kit generate:pg
```

## Database URL Format

Your DATABASE_URL will look like:
```
postgresql://user:password@host.neon.tech/database?sslmode=require
```

## Troubleshooting

- **"Project must be linked"**: Run `npx netlify link` first
- **Database not found**: Make sure you ran `npx netlify db init`
- **Connection error**: Check that `DATABASE_URL` is set in your environment
- **Migrations failing**: Ensure your database is claimed and active

## Support

- [Netlify DB Docs](https://docs.netlify.com/build/data-and-storage/netlify-db/)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Neon Docs](https://neon.tech/docs/introduction)
