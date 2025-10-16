# FitTracker Authentication & Database Integration - Complete Setup Guide

## ⚠️ IMPORTANT: Getting the "JSON parse error"?

If you're seeing **"Failed to execute 'json' on 'Response': Unexpected end of JSON input"**, it means the Netlify Functions aren't running yet. You need to:

1. **Complete the database setup** (see Step 1-3 below)
2. **Use `npx netlify dev` instead of `npm run dev`** to run functions locally

The regular `npm run dev` only runs Vite and doesn't include the backend functions!

---

## Overview

Your FitTracker app now has full authentication and database integration! Here's what was implemented:

### What's Been Done

#### 1. Database Schema (✅ Complete)
- Created 5 database tables:
  - `users` - User accounts (email, timestamps)
  - `profiles` - User profile data (weight, height, age, sex)
  - `goals` - Calorie and macro goals
  - `dailyLogs` - Daily meal and workout logs
  - `weightHistory` - Weight tracking over time

#### 2. Netlify Functions (✅ Complete)
Created serverless API endpoints in `/netlify/functions/`:
- **auth-login.ts** - Simple email-based login (auto-creates account on first login)
- **user-profile.ts** - Get/update user profile and goals
- **daily-logs.ts** - CRUD operations for daily meals, workouts, and notes
- **weight-history.ts** - Track weight over time

#### 3. Authentication System (✅ Complete)
- **JWT-based authentication** using jsonwebtoken
- **Login page** (`/login.html`) with simple email entry
- **Auto-registration** on first login (no password required for now)
- **Session management** with localStorage for JWT tokens
- **Logout functionality** in settings drawer

#### 4. Frontend Integration (✅ Complete)
- **Updated app.js** to use database API instead of localStorage
- All data now syncs to your Neon Postgres database
- Authentication check on page load (redirects to login if not authenticated)
- User email displayed in settings
- Logout button in settings drawer

### Architecture

```
┌─────────────────┐
│   login.html    │ ──┐
└─────────────────┘   │
                      │ POST /auth-login
┌─────────────────┐   │ (email) → JWT token
│   index.html    │ ◄─┘
│   (main app)    │
└─────────────────┘
        │
        │ All requests include:
        │ Authorization: Bearer <JWT>
        ▼
┌─────────────────────────────────┐
│   Netlify Functions (API)       │
│                                  │
│  /.netlify/functions/            │
│    - auth-login                  │
│    - user-profile                │
│    - daily-logs                  │
│    - weight-history              │
└─────────────────────────────────┘
        │
        │ Drizzle ORM
        ▼
┌─────────────────────────────────┐
│   Neon Postgres Database        │
│   (Netlify DB)                   │
└─────────────────────────────────┘
```

### Authentication Flow

1. **User visits index.html**
   - App checks for JWT token in localStorage
   - If no token → redirect to `/login.html`

2. **User enters email and password on login page**
   - POST to `/.netlify/functions/auth-login` with email and password
   - Backend checks if user exists:
     - **New user**: Creates account with bcrypt-hashed password, default profile/goals
     - **Existing user**: Verifies password with bcrypt.compare()
   - Returns JWT token if successful

3. **Token stored in localStorage**
   - `authToken` - JWT token (7-day expiry)
   - `userEmail` - User's email

4. **All API requests include token**
   - Header: `Authorization: Bearer <token>`
   - Backend verifies token and extracts userId
   - All operations scoped to authenticated user

5. **Logout**
   - Click "Sign out" in settings
   - Clears localStorage
   - Redirects to login page

### Password Security

- Passwords are hashed using **bcryptjs** (10 rounds)
- Never stored in plain text
- Compared securely during login

## Setup Steps (You Need to Do This!)

### Step 1: Link Project to Netlify

```bash
# Login to Netlify (if not already logged in)
npx netlify login

# Link this project to your existing Netlify site
npx netlify link
# Choose: "Use current git remote origin"
```

### Step 2: Initialize Netlify DB

```bash
# Initialize the database
npx netlify db init --boilerplate=drizzle

# This will:
# - Create a Neon database instance
# - Set up DATABASE_URL environment variable
# - Configure database connection
```

### Step 3: Generate and Run Migrations

```bash
# Generate migration files from your schema
npx drizzle-kit generate

# Push migrations to your database
npx drizzle-kit push
```

### Step 4: Claim Your Database (IMPORTANT!)

**⚠️ Unclaimed databases expire after 7 days with complete data loss!**

1. Go to your [Netlify dashboard](https://app.netlify.com)
2. Navigate to your FitTracker project
3. Go to **Extensions** → **Neon database**
4. Click "Connect Neon" and complete account setup
5. Click "Claim database"

### Step 5: Deploy to Netlify

```bash
# Deploy your app
git add .
git commit -m "Add authentication and database integration"
git push

# OR use Netlify CLI
npx netlify deploy --prod
```

## Testing Locally

### Start Local Development Server

```bash
# Start Netlify Dev (includes functions)
npx netlify dev

# This will:
# - Start Vite dev server
# - Run Netlify Functions locally
# - Proxy API requests correctly
```

### Access Your App

1. Open http://localhost:8888 (Netlify Dev port)
2. You'll be redirected to `/login.html`
3. Enter your email (any email)
4. You'll be auto-registered and logged in
5. Start using the app!

## Environment Variables

### Local Development

Create a `.env` file (already exists):
```bash
VITE_API_NINJAS_KEY=ZEv05ridT7tMOUpzxPE+ig==QaSVIhQpIQ4wNiJ9
# DATABASE_URL will be set automatically by netlify dev
```

### Production (Netlify)

Environment variables are automatically set by Netlify:
- `DATABASE_URL` - Set by Netlify DB
- `VITE_API_NINJAS_KEY` - Already in your .env (will be used in build)

## File Structure

```
FitTracker/
├── netlify/
│   └── functions/
│       ├── utils/
│       │   ├── auth.ts          # JWT auth utilities
│       │   └── db.ts            # Database connection
│       ├── auth-login.ts        # Login endpoint
│       ├── user-profile.ts      # Profile & goals endpoint
│       ├── daily-logs.ts        # Daily logs endpoint
│       └── weight-history.ts    # Weight tracking endpoint
├── db/
│   ├── schema.ts                # Database schema
│   └── config.ts                # DB connection config
├── src/
│   ├── api.js                   # Frontend API service
│   └── workoutApi.js            # API Ninjas integration
├── assets/
│   └── app.js                   # Main app (updated for DB)
├── login.html                   # Login page
├── index.html                   # Main app (added logout)
├── drizzle.config.ts            # Drizzle migrations config
└── .env                         # Environment variables
```

## API Endpoints

### Authentication
- `POST /.netlify/functions/auth-login`
  - Body: `{ "email": "user@example.com" }`
  - Returns: `{ "token": "jwt...", "user": { "id": 1, "email": "..." } }`

### User Profile
- `GET /.netlify/functions/user-profile`
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ "profile": {...}, "goals": {...} }`

- `PUT /.netlify/functions/user-profile`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "profile": {...}, "goals": {...} }`

### Daily Logs
- `GET /.netlify/functions/daily-logs?date=2025-10-16`
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ "log": { "meals": {...}, "workouts": [...], "notes": "..." } }`

- `POST /.netlify/functions/daily-logs`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "date": "2025-10-16", "meals": {...}, "workouts": [...], "notes": "..." }`

### Weight History
- `GET /.netlify/functions/weight-history`
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ "history": [...] }`

- `POST /.netlify/functions/weight-history`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "date": "2025-10-16", "weight": 180 }`

## Security Notes

### Current Implementation
- **JWT-based authentication** with 7-day expiry
- **Password authentication** with bcrypt hashing (10 rounds)
- **Auto-registration** on first login with password
- **Token stored in localStorage** (not httpOnly cookies)

### Future Improvements
- Add email verification
- Use httpOnly cookies instead of localStorage
- Add rate limiting
- Add CSRF protection
- Add 2FA support
- Add password reset functionality

## Troubleshooting

### "Project must be linked"
Run `npx netlify link` first

### "Database not found"
Make sure you ran `npx netlify db init`

### "Connection error"
Check that `DATABASE_URL` is set (run `npx netlify env:list`)

### "401 Unauthorized"
- Clear localStorage and login again
- Check that JWT_SECRET matches in production

### Functions not working locally
Use `npx netlify dev` instead of `npm run dev`

## Next Steps

1. **Complete database setup** (Steps 1-4 above)
2. **Test locally** with `npx netlify dev`
3. **Deploy to Netlify** with `git push`
4. **Test in production** at your Netlify URL

## Features Now Available

✅ Multi-user support (each user has their own data)
✅ User authentication with JWT
✅ Persistent data storage in Postgres
✅ Profile and goals saved to database
✅ Daily meals, workouts, and notes synced
✅ Logout functionality
✅ API Ninjas integration for workouts
✅ Personalized calorie calculations

## Important Notes

- **First login**: Enter your email and password - account will be created automatically with default settings
  - Example: `federod2001@gmail.com` with password `Top$#gun2022`
- **Password required**: All new accounts require a password for security
- **Data persistence**: All your food logs, workouts, and notes are now saved to the database
- **Multi-device**: You can login from any device with your email/password and access your data
- **Claim your database**: Don't forget to claim your Neon database within 7 days!

---

**Questions or issues?** Check the Netlify logs:
```bash
npx netlify logs
```

Or run functions locally with debugging:
```bash
npx netlify dev --debug
```
