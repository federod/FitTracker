# Federico's Fitness Tracker

A personal fitness tracking app built with Vue 3 and Vite.

## Features

- Comprehensive calorie and macro tracking with personalized BMR/TDEE calculations
- Food database integration with OpenFoodFacts API for nutrition search
- Extensive workout library with 30+ pre-configured exercises across multiple categories
- Daily meal tracking (breakfast, lunch, dinner, snacks) with macro breakdowns
- Workout logging with automatic calorie burn calculations using MET values
- Weight tracking with visual progress charts
- Daily notes and reflections
- All data persisted in localStorage for privacy

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Deployment to Netlify

### Option 1: Deploy via Netlify CLI

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via Netlify Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Go to [Netlify](https://app.netlify.com/) and sign in

3. Click "Add new site" > "Import an existing project"

4. Connect your Git provider and select your repository

5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

6. Click "Deploy site"

Your app will be live at a Netlify URL like `https://your-site-name.netlify.app`

### Option 3: Drag and Drop Deploy

1. Build your app locally:
   ```bash
   npm run build
   ```

2. Go to [Netlify Drop](https://app.netlify.com/drop)

3. Drag and drop the `dist` folder onto the page

Your site will be instantly deployed!

## Tech Stack

- Vue 3 (Composition API)
- Vite
- JavaScript (ES6+)
- CSS3 with custom properties (dark theme)
- Canvas API (for charts)
- localStorage API
- OpenFoodFacts API (food nutrition data)
- wger Workout Manager API (exercise database)

## Project Structure

```
FitTracker/
├── src/
│   ├── components/         # Vue components
│   ├── composables/        # Vue composables (state management)
│   ├── data.js            # Workout plans and configuration
│   ├── foodDatabase.js    # Comprehensive food nutrition database
│   ├── workoutApi.js      # wger API integration and workout utilities
│   ├── style.css          # Global styles
│   ├── App.vue            # Main app component
│   └── main.js            # App entry point
├── assets/
│   ├── app.js             # Main application logic
│   ├── styles.css         # Component styles and theme
│   └── workouts.json      # Local workout database (30+ exercises)
├── dist/                  # Production build output
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
├── netlify.toml           # Netlify deployment config
└── package.json           # Project dependencies
```

## Workout Library

The app includes a comprehensive workout library with 30+ pre-configured exercises:

**Cardio**: Outdoor Running, Treadmill Running, Cycling (indoor/outdoor), HIIT, Rowing, Swimming, Jump Rope, Walking, Hiking, Elliptical, Stair Climber, Boxing/Kickboxing

**Strength**: Full Body, Upper Body, Lower Body, Functional Training, CrossFit WOD, Circuit Training, Calisthenics, Core/Abs

**Mind & Body**: Power Yoga, Gentle Yoga, Pilates, Core & Mobility, Static Stretching

**Sports**: Basketball, Soccer, Tennis

Each workout includes:
- MET value (Metabolic Equivalent of Task) for accurate calorie calculations
- Default duration recommendations
- Intensity level (Very Light to Very High)
- Detailed descriptions

The workout library can be extended via the wger API integration or by editing `assets/workouts.json`.

## Calorie Tracking

The app uses the Mifflin-St Jeor equation to calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE):

**For Males**: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
**For Females**: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161

TDEE is calculated by multiplying BMR by your activity level factor, then adjusted based on your goal (lose weight, maintain, or gain weight).

Workout calories are calculated using: **Calories = MET × weight(kg) × duration(hours)**
