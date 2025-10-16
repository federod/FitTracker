// Workout API integration using API Ninjas
// API docs: https://api-ninjas.com/api/exercises
// Calories Burned API: https://api-ninjas.com/api/caloriesburned

const API_BASE_URL = 'https://api.api-ninjas.com/v1'
const API_KEY = import.meta.env.VITE_API_NINJAS_KEY
const CACHE_DURATION = 1000 * 60 * 60 * 24 // 24 hours

// Fallback workout database in case API is unavailable
export const FALLBACK_WORKOUTS = [
  {
    id: 'run_outdoor',
    name: 'Outdoor Running',
    type: 'cardio',
    muscle: 'legs',
    equipment: 'none',
    difficulty: 'intermediate',
    category: 'Cardio',
    intensity: 'High',
    met: 9.8,
    caloriesPerHour: 750,
    defaultDuration: 45,
    instructions: 'Steady outdoor run on varied terrain.',
  },
  {
    id: 'run_treadmill',
    name: 'Treadmill Running',
    type: 'cardio',
    muscle: 'legs',
    equipment: 'machine',
    difficulty: 'beginner',
    category: 'Cardio',
    intensity: 'Moderate',
    met: 8.5,
    caloriesPerHour: 680,
    defaultDuration: 40,
    instructions: 'Indoor treadmill session at moderate pace.',
  },
  {
    id: 'cycling',
    name: 'Cycling',
    type: 'cardio',
    muscle: 'legs',
    equipment: 'machine',
    difficulty: 'intermediate',
    category: 'Cardio',
    intensity: 'High',
    met: 8,
    caloriesPerHour: 620,
    defaultDuration: 60,
    instructions: 'Road cycling or stationary bike.',
  },
  {
    id: 'strength_training',
    name: 'Strength Training',
    type: 'strength',
    muscle: 'chest',
    equipment: 'barbell',
    difficulty: 'intermediate',
    category: 'Strength',
    intensity: 'Moderate',
    met: 6,
    caloriesPerHour: 450,
    defaultDuration: 50,
    instructions: 'Weight lifting and resistance training.',
  },
  {
    id: 'yoga',
    name: 'Yoga',
    type: 'stretching',
    muscle: 'abdominals',
    equipment: 'none',
    difficulty: 'beginner',
    category: 'Mind & Body',
    intensity: 'Light',
    met: 3,
    caloriesPerHour: 240,
    defaultDuration: 60,
    instructions: 'Flexibility and mindfulness practice.',
  },
  {
    id: 'swimming',
    name: 'Swimming',
    type: 'cardio',
    muscle: 'chest',
    equipment: 'none',
    difficulty: 'intermediate',
    category: 'Cardio',
    intensity: 'High',
    met: 8.3,
    caloriesPerHour: 650,
    defaultDuration: 40,
    instructions: 'Lap swimming.',
  },
  {
    id: 'walking',
    name: 'Walking',
    type: 'cardio',
    muscle: 'legs',
    equipment: 'none',
    difficulty: 'beginner',
    category: 'Cardio',
    intensity: 'Light',
    met: 3.5,
    caloriesPerHour: 250,
    defaultDuration: 45,
    instructions: 'Brisk walking.',
  },
]

// Category to MET value mapping (Metabolic Equivalent of Task)
const TYPE_MET_MAP = {
  cardio: 8.5,
  strength: 6,
  olympic_weightlifting: 6,
  powerlifting: 7,
  plyometrics: 8,
  stretching: 3,
  strongman: 7.5,
  default: 6,
}

// Cache for API responses
const cache = {
  exercises: null,
  categories: null,
  timestamp: null,
}

/**
 * Make authenticated request to API Ninjas
 */
async function apiRequest(endpoint, params = {}) {
  const url = new URL(`${API_BASE_URL}${endpoint}`)
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key])
    }
  })

  const response = await fetch(url, {
    headers: {
      'X-Api-Key': API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch exercises from API Ninjas
 * Can filter by: name, type, muscle, difficulty
 */
export async function fetchWorkouts(filters = {}) {
  // Check cache first (only if no specific filters)
  if (
    !Object.keys(filters).length &&
    cache.exercises &&
    cache.timestamp &&
    Date.now() - cache.timestamp < CACHE_DURATION
  ) {
    return { workouts: cache.exercises, categories: cache.categories, source: 'cache' }
  }

  try {
    // Fetch exercises from API Ninjas
    // Note: Free tier returns up to 5 exercises per request
    // We'll make multiple requests to build a comprehensive library
    const exercisePromises = []

    // Fetch exercises by muscle group to get variety
    const muscleGroups = [
      'abdominals',
      'biceps',
      'chest',
      'glutes',
      'hamstrings',
      'quadriceps',
      'triceps',
      'calves',
      'lower_back',
      'middle_back',
      'lats',
      'shoulders',
      'traps',
      'forearms',
    ]

    // If specific filters provided, use them
    if (Object.keys(filters).length) {
      exercisePromises.push(apiRequest('/exercises', filters))
    } else {
      // Otherwise fetch diverse set of exercises
      muscleGroups.forEach((muscle) => {
        exercisePromises.push(apiRequest('/exercises', { muscle, offset: 0 }))
      })
    }

    const results = await Promise.all(exercisePromises)
    const allExercises = results.flat()

    // Remove duplicates based on name
    const uniqueExercises = Array.from(
      new Map(allExercises.map((ex) => [ex.name.toLowerCase(), ex])).values()
    )

    // Transform exercises to our format
    const workouts = uniqueExercises.map((exercise) => transformApiNinjasExercise(exercise))

    // Update cache only if fetching all exercises
    if (!Object.keys(filters).length) {
      cache.exercises = workouts
      cache.categories = extractCategories(workouts)
      cache.timestamp = Date.now()
    }

    return {
      workouts,
      categories: extractCategories(workouts),
      source: 'api',
    }
  } catch (error) {
    console.error('Failed to fetch workouts from API Ninjas:', error)

    // Return fallback workouts
    return {
      workouts: FALLBACK_WORKOUTS,
      categories: ['Cardio', 'Strength', 'Mind & Body'],
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
      workout.type.toLowerCase().includes(lowerQuery) ||
      (workout.muscle && workout.muscle.toLowerCase().includes(lowerQuery)) ||
      (workout.instructions && workout.instructions.toLowerCase().includes(lowerQuery))
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
 * Transform API Ninjas exercise to our workout format
 */
function transformApiNinjasExercise(exercise) {
  const category = mapTypeToCategory(exercise.type)
  const met = estimateMET(exercise.type, exercise.difficulty)
  const caloriesPerHour = calculateCaloriesPerHour(met)
  const defaultDuration = estimateDefaultDuration(exercise.type)

  return {
    id: `apininjas_${exercise.name.toLowerCase().replace(/\s+/g, '_')}`,
    name: exercise.name,
    type: exercise.type,
    muscle: exercise.muscle,
    equipment: exercise.equipment,
    difficulty: exercise.difficulty,
    category,
    intensity: estimateIntensity(met),
    met,
    caloriesPerHour,
    defaultDuration,
    instructions: exercise.instructions,
    source: 'api-ninjas',
  }
}

/**
 * Map API Ninjas exercise type to our category
 */
function mapTypeToCategory(type) {
  const typeMap = {
    cardio: 'Cardio',
    strength: 'Strength',
    olympic_weightlifting: 'Strength',
    powerlifting: 'Strength',
    plyometrics: 'Cardio',
    stretching: 'Mind & Body',
    strongman: 'Strength',
  }

  return typeMap[type] || 'General'
}

/**
 * Estimate MET value based on type and difficulty
 */
function estimateMET(type, difficulty) {
  let baseMET = TYPE_MET_MAP[type] || TYPE_MET_MAP.default

  // Adjust for difficulty
  switch (difficulty) {
    case 'beginner':
      baseMET *= 0.8
      break
    case 'intermediate':
      baseMET *= 1.0
      break
    case 'expert':
      baseMET *= 1.3
      break
  }

  return Math.round(baseMET * 10) / 10
}

/**
 * Calculate calories burned per hour from MET value
 * Formula: Calories/hour = MET × 3.5 × body weight (kg) / 200 × 60
 * Using average body weight of 82 kg (180 lbs)
 */
function calculateCaloriesPerHour(met) {
  const bodyWeightKg = 82
  return Math.round(((met * 3.5 * bodyWeightKg) / 200) * 60)
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
 * Estimate default duration based on type
 */
function estimateDefaultDuration(type) {
  const durationMap = {
    cardio: 45,
    strength: 50,
    olympic_weightlifting: 60,
    powerlifting: 60,
    plyometrics: 30,
    stretching: 60,
    strongman: 45,
  }

  return durationMap[type] || 45
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
 * Calculate calories burned for a specific workout and duration using API Ninjas
 * Falls back to manual calculation if API fails
 */
export async function calculateCaloriesBurned(workout, durationMinutes, userWeightLbs = 180) {
  try {
    // Try to get accurate calorie data from API Ninjas Calories Burned API
    const result = await apiRequest('/caloriesburned', {
      activity: workout.name,
      weight: userWeightLbs,
      duration: durationMinutes,
    })

    if (result && result.length > 0) {
      return Math.round(result[0].total_calories)
    }
  } catch (error) {
    console.warn('Could not fetch calories from API, using manual calculation:', error)
  }

  // Fallback to manual calculation
  const weightKg = userWeightLbs * 0.453592
  const met = workout.met || 6

  // Calories = MET × weight(kg) × duration(hours)
  const calories = met * weightKg * (durationMinutes / 60)

  return Math.round(calories)
}

/**
 * Get list of all available activities from Calories Burned API
 */
export async function getAvailableActivities() {
  try {
    const activities = await apiRequest('/caloriesburnedactivities')
    return activities
  } catch (error) {
    console.error('Failed to fetch available activities:', error)
    return []
  }
}
