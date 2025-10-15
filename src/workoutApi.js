// Workout API integration using wger Workout Manager (free, open-source)
// API docs: https://wger.de/en/software/api

const WGER_BASE_URL = 'https://wger.de/api/v2'
const CACHE_DURATION = 1000 * 60 * 60 * 24 // 24 hours

// Fallback workout database in case API is unavailable
export const FALLBACK_WORKOUTS = [
  {
    id: 'run_outdoor',
    name: 'Outdoor Running',
    category: 'Cardio',
    intensity: 'High',
    met: 9.8,
    caloriesPerHour: 750,
    defaultDuration: 45,
    description: 'Steady outdoor run on varied terrain.',
  },
  {
    id: 'run_treadmill',
    name: 'Treadmill Running',
    category: 'Cardio',
    intensity: 'Moderate',
    met: 8.5,
    caloriesPerHour: 680,
    defaultDuration: 40,
    description: 'Indoor treadmill session at moderate pace.',
  },
  {
    id: 'cycling',
    name: 'Cycling',
    category: 'Cardio',
    intensity: 'High',
    met: 8,
    caloriesPerHour: 620,
    defaultDuration: 60,
    description: 'Road cycling or stationary bike.',
  },
  {
    id: 'hiit',
    name: 'HIIT Training',
    category: 'Cardio',
    intensity: 'Very High',
    met: 10,
    caloriesPerHour: 820,
    defaultDuration: 30,
    description: 'High-intensity interval training.',
  },
  {
    id: 'strength_training',
    name: 'Strength Training',
    category: 'Strength',
    intensity: 'Moderate',
    met: 6,
    caloriesPerHour: 450,
    defaultDuration: 50,
    description: 'Weight lifting and resistance training.',
  },
  {
    id: 'yoga',
    name: 'Yoga',
    category: 'Flexibility',
    intensity: 'Light',
    met: 3,
    caloriesPerHour: 240,
    defaultDuration: 60,
    description: 'Flexibility and mindfulness practice.',
  },
  {
    id: 'swimming',
    name: 'Swimming',
    category: 'Cardio',
    intensity: 'High',
    met: 8.3,
    caloriesPerHour: 650,
    defaultDuration: 40,
    description: 'Lap swimming.',
  },
  {
    id: 'walking',
    name: 'Walking',
    category: 'Cardio',
    intensity: 'Light',
    met: 3.5,
    caloriesPerHour: 250,
    defaultDuration: 45,
    description: 'Brisk walking.',
  },
]

// Category to MET value mapping (Metabolic Equivalent of Task)
const CATEGORY_MET_MAP = {
  cardio: 8.5,
  strength: 6,
  flexibility: 3,
  sports: 7,
  default: 6,
}

// Cache for API responses
const cache = {
  exercises: null,
  categories: null,
  timestamp: null,
}

/**
 * Fetch all exercises from wger API
 */
export async function fetchWorkouts() {
  // Check cache first
  if (cache.exercises && cache.timestamp && Date.now() - cache.timestamp < CACHE_DURATION) {
    return { workouts: cache.exercises, categories: cache.categories, source: 'cache' }
  }

  try {
    // Fetch exercises (English language = 2)
    const exercisesResponse = await fetch(`${WGER_BASE_URL}/exercise/?language=2&limit=200`)

    if (!exercisesResponse.ok) {
      throw new Error(`API returned ${exercisesResponse.status}`)
    }

    const exercisesData = await exercisesResponse.json()
    const exercises = exercisesData.results || []

    // Fetch categories
    let categories = []
    try {
      const categoriesResponse = await fetch(`${WGER_BASE_URL}/exercisecategory/`)
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        categories = categoriesData.results || []
      }
    } catch (err) {
      console.warn('Could not fetch categories:', err)
    }

    // Transform exercises to our format
    const workouts = exercises.map((exercise) => transformWgerExercise(exercise, categories))

    // Update cache
    cache.exercises = workouts
    cache.categories = extractCategories(workouts)
    cache.timestamp = Date.now()

    return { workouts, categories: cache.categories, source: 'api' }
  } catch (error) {
    console.error('Failed to fetch workouts from wger API:', error)

    // Return fallback workouts
    return {
      workouts: FALLBACK_WORKOUTS,
      categories: ['Cardio', 'Strength', 'Flexibility'],
      source: 'fallback',
      error: error.message,
    }
  }
}

/**
 * Search workouts by name or category
 */
export function searchWorkouts(workouts, query) {
  if (!query || query.length < 2) return workouts

  const lowerQuery = query.toLowerCase()
  return workouts.filter(
    (workout) =>
      workout.name.toLowerCase().includes(lowerQuery) ||
      workout.category.toLowerCase().includes(lowerQuery) ||
      (workout.description && workout.description.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Filter workouts by category
 */
export function filterByCategory(workouts, category) {
  if (!category || category === 'All') return workouts
  return workouts.filter((workout) => workout.category === category)
}

/**
 * Transform wger exercise to our workout format
 */
function transformWgerExercise(exercise, categories) {
  const categoryName = getCategoryName(exercise.category, categories)
  const met = estimateMET(categoryName, exercise)
  const caloriesPerHour = calculateCaloriesPerHour(met)
  const defaultDuration = estimateDefaultDuration(categoryName)

  return {
    id: `wger_${exercise.id}`,
    name: exercise.name || 'Unnamed Exercise',
    category: categoryName,
    intensity: estimateIntensity(met),
    met,
    caloriesPerHour,
    defaultDuration,
    description: stripHTML(exercise.description || ''),
    equipment: exercise.equipment || [],
    muscles: exercise.muscles || [],
    source: 'wger',
  }
}

/**
 * Get category name from category ID
 */
function getCategoryName(categoryId, categories) {
  if (!categoryId || !categories || !categories.length) return 'General'

  const category = categories.find((cat) => cat.id === categoryId)
  if (!category) return 'General'

  // Map wger categories to our categories
  const name = category.name.toLowerCase()
  if (name.includes('cardio') || name.includes('conditioning')) return 'Cardio'
  if (name.includes('strength') || name.includes('power')) return 'Strength'
  if (name.includes('stretch') || name.includes('mobility') || name.includes('flexibility')) return 'Flexibility'
  if (name.includes('sport')) return 'Sports'

  return category.name
}

/**
 * Estimate MET value based on category and exercise details
 */
function estimateMET(category, exercise) {
  const categoryLower = category.toLowerCase()

  // Check exercise name for intensity indicators
  const name = (exercise.name || '').toLowerCase()
  const isHeavy = name.includes('heavy') || name.includes('intense') || name.includes('advanced')
  const isLight = name.includes('light') || name.includes('gentle') || name.includes('beginner')

  let baseMET = CATEGORY_MET_MAP[categoryLower] || CATEGORY_MET_MAP.default

  if (isHeavy) baseMET *= 1.3
  if (isLight) baseMET *= 0.7

  return Math.round(baseMET * 10) / 10
}

/**
 * Calculate calories burned per hour from MET value
 * Formula: Calories/hour = MET × 3.5 × body weight (kg) / 200 × 60
 * Using average body weight of 82 kg (180 lbs)
 */
function calculateCaloriesPerHour(met) {
  const bodyWeightKg = 82
  return Math.round((met * 3.5 * bodyWeightKg) / 200 * 60)
}

/**
 * Estimate intensity level from MET value
 */
function estimateIntensity(met) {
  if (met < 3) return 'Very Light'
  if (met < 5) return 'Light'
  if (met < 7) return 'Moderate'
  if (met < 9) return 'High'
  return 'Very High'
}

/**
 * Estimate default duration based on category
 */
function estimateDefaultDuration(category) {
  const categoryLower = category.toLowerCase()

  if (categoryLower.includes('cardio')) return 45
  if (categoryLower.includes('strength')) return 50
  if (categoryLower.includes('flexibility') || categoryLower.includes('yoga')) return 60
  if (categoryLower.includes('hiit') || categoryLower.includes('interval')) return 30

  return 45
}

/**
 * Strip HTML tags from description
 */
function stripHTML(html) {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 200) // Limit description length
}

/**
 * Extract unique categories from workouts
 */
function extractCategories(workouts) {
  const categories = new Set()
  workouts.forEach((workout) => {
    if (workout.category) categories.add(workout.category)
  })
  return Array.from(categories).sort()
}

/**
 * Calculate calories burned for a specific workout and duration
 */
export function calculateCaloriesBurned(workout, durationMinutes, userWeightLbs = 180) {
  const weightKg = userWeightLbs * 0.453592
  const met = workout.met || 6

  // Calories = MET × weight(kg) × duration(hours)
  const calories = met * weightKg * (durationMinutes / 60)

  return Math.round(calories)
}
