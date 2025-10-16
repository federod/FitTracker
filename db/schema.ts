import { pgTable, serial, text, integer, timestamp, jsonb, date } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password'), // bcrypt hashed password
  createdAt: timestamp('created_at').defaultNow(),
});

// User profiles
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: text('name'), // user's name
  weight: integer('weight'), // in lbs
  height: integer('height'), // in inches
  age: integer('age'),
  sex: text('sex'), // 'male' or 'female'
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Goals
export const goals = pgTable('goals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  calories: integer('calories'),
  protein: integer('protein'),
  carbs: integer('carbs'),
  fat: integer('fat'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Daily logs
export const dailyLogs = pgTable('daily_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  date: date('date').notNull(),
  meals: jsonb('meals'), // {breakfast: [], lunch: [], dinner: [], snacks: []}
  workouts: jsonb('workouts'), // array of workout entries
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Weight history (for tracking weight over time)
export const weightHistory = pgTable('weight_history', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  date: date('date').notNull(),
  weight: integer('weight'), // in lbs
  createdAt: timestamp('created_at').defaultNow(),
});
