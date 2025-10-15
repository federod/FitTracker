# Federico's Fitness Tracker

A personal fitness tracking app built with Vue 3 and Vite.

## Features

- Daily workout tracking (Cardio, KOT/Plyos, Weights, Abs)
- Recovery and nutrition tracking
- Weekly progress overview
- Weight tracking with visual charts
- Daily notes and reflections
- Data persisted in localStorage

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
- CSS3
- Canvas API (for charts)
- localStorage API

## Project Structure

```
FitTracker/
├── src/
│   ├── components/         # Vue components
│   ├── composables/        # Vue composables (state management)
│   ├── data.js            # Workout plans and configuration
│   ├── style.css          # Global styles
│   ├── App.vue            # Main app component
│   └── main.js            # App entry point
├── dist/                  # Production build output
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
├── netlify.toml           # Netlify deployment config
└── package.json           # Project dependencies
```
