# FitTracker - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Current Situation

You're seeing an error because the backend functions aren't running. Here's how to fix it:

### Option 1: Quick Test (After Database Setup)

```bash
# Run with Netlify Functions
npx netlify dev

# Or use the npm script
npm run dev:full
```

Then open **http://localhost:8888** (not 5174!)

### Option 2: Complete Setup (Required for Production)

Follow these steps in order:

#### Step 1: Link to Netlify

```bash
npx netlify login
npx netlify link
```

Choose: "Use current git remote origin"

#### Step 2: Initialize Database

```bash
npx netlify db init --boilerplate=drizzle
```

This creates your Neon Postgres database.

#### Step 3: Run Migrations

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

This creates all the tables (users, profiles, goals, dailyLogs, weightHistory).

#### Step 4: Start Development Server

```bash
npm run dev:full
```

Open **http://localhost:8888**

#### Step 5: Login

- Email: `federod2001@gmail.com`
- Password: `Top$#gun2022`

Your account will be created automatically on first login!

---

## 🔑 Your Credentials

- **Email**: federod2001@gmail.com
- **Password**: Top$#gun2022

These will work once you complete the database setup.

---

## 📁 What Was Built

### Backend (Netlify Functions)
- `auth-login` - Login/registration with password hashing
- `user-profile` - Get/update profile & goals
- `daily-logs` - Save meals, workouts, notes
- `weight-history` - Track weight over time

### Frontend
- Login page with password authentication
- Database integration (replaces localStorage)
- Logout button in settings
- User email display

### Database (Neon Postgres)
- `users` - User accounts
- `profiles` - Weight, height, age, sex
- `goals` - Calorie & macro goals
- `dailyLogs` - Daily meals, workouts, notes
- `weightHistory` - Weight tracking

---

## ⚠️ Important

### Claim Your Database!

After running `npx netlify db init`, you MUST claim your database within 7 days:

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Open your FitTracker project
3. Go to **Extensions** → **Neon database**
4. Click **"Claim database"**

**Without claiming, your database will be deleted after 7 days!**

---

## 🐛 Troubleshooting

### "Failed to execute 'json' on 'Response'"

**Problem**: Netlify Functions aren't running.

**Solution**: Use `npm run dev:full` instead of `npm run dev`

### "Project must be linked"

**Problem**: Not linked to Netlify yet.

**Solution**: Run `npx netlify link`

### "Database not found"

**Problem**: Database not initialized.

**Solution**: Run `npx netlify db init --boilerplate=drizzle`

### Functions work locally but not in production

**Problem**: Need to deploy.

**Solution**:
```bash
git add .
git commit -m "Add authentication and database"
git push
```

---

## 📖 Full Documentation

See `AUTH_AND_DATABASE_SETUP.md` for complete documentation including:
- Detailed architecture
- API endpoints
- Security notes
- Advanced troubleshooting

---

## 🎯 Next Steps

1. ✅ Complete database setup (Steps 1-3)
2. ✅ Test locally with `npm run dev:full`
3. ✅ Login with your credentials
4. ✅ Claim your database on Netlify
5. ✅ Deploy: `git push`

Happy tracking! 💪
