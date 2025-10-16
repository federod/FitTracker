# FitTracker - Manual Setup Steps (Simplified)

## Current Status

✅ Neon extension is installed on your Netlify account
✅ Project is linked to Netlify (federicofittracker)
⚠️ DATABASE_URL is not set yet - need to connect Neon database

## What You Need to Do Now

### Step 1: Connect Neon Database via Dashboard

1. **Open your Netlify project**:
   https://app.netlify.com/sites/federicofittracker

2. **Go to Extensions**:
   - Click on **"Extensions"** in the left sidebar
   - Find **"Neon"** (it should say "Installed")
   - Click on it

3. **Connect/Configure Neon**:
   - You should see a button like **"Connect Neon"** or **"Configure"**
   - Click it and follow the prompts
   - This will create a Neon project and set DATABASE_URL automatically

4. **Or connect existing Neon account**:
   - If you already have a Neon account, you can link it
   - Choose your existing project or create a new one
   - Copy the connection string

### Step 2: Verify DATABASE_URL is Set

After connecting Neon, run this in your terminal:

```bash
npx netlify env:list
```

You should see `DATABASE_URL` listed.

### Step 3: Run Database Migrations

Once DATABASE_URL is set, create the database tables:

```bash
# Generate migrations from schema
npx drizzle-kit generate

# Push migrations to database (create tables)
npx drizzle-kit push
```

### Step 4: Start Development Server

```bash
# Start Netlify Dev (includes functions!)
npm run dev:full
```

Or:

```bash
npx netlify dev
```

This will start at **http://localhost:8888**

### Step 5: Login!

1. Open http://localhost:8888
2. You'll see the login page
3. Enter:
   - Email: `federod2001@gmail.com`
   - Password: `Top$#gun2022`
4. Your account will be created automatically!

---

## Alternative: Set DATABASE_URL Manually

If you can't connect through the dashboard, you can:

### 1. Create a Neon Database Manually

1. Go to https://console.neon.tech/
2. Sign up or log in
3. Create a new project called "FitTracker"
4. Copy the connection string (it looks like):
   ```
   postgresql://user:pass@ep-something.region.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Set it in Netlify

```bash
npx netlify env:set DATABASE_URL "your_connection_string_here"
```

### 3. Continue with migrations (Step 3 above)

---

## Troubleshooting

### Netlify Dev Hangs at "Installing extensions"

This is a known issue. Try:

```bash
# Kill any running processes
pkill -f netlify

# Try again with different port
npx netlify dev --port 8888
```

### Or skip Netlify Dev and use separate servers:

Terminal 1 (Vite for frontend):
```bash
npm run dev
```

Terminal 2 (Netlify Functions):
```bash
npx netlify functions:serve
```

Then access:
- Frontend: http://localhost:5174
- Functions: http://localhost:9999/.netlify/functions/

### Can't run migrations - "DATABASE_URL required"

Make sure DATABASE_URL is set:
```bash
# Check
npx netlify env:list

# Or use .env.local for local dev
echo 'DATABASE_URL="your_connection_string"' > .env.local
```

---

## Next Steps After Setup

Once everything is running:

1. ✅ Test login at http://localhost:8888
2. ✅ Add some meals and workouts
3. ✅ Check that data persists in database
4. ✅ Deploy to production: `git push`
5. ✅ **IMPORTANT**: Claim your Neon database in Netlify dashboard within 7 days!

---

## Need Help?

If you get stuck, check:
- Netlify logs: `npx netlify logs`
- Neon dashboard: https://console.neon.tech/
- Browser console: F12 → Console tab

The most common issue is DATABASE_URL not being set. Make sure it's configured before running migrations!
