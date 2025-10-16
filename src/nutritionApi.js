// API Ninjas Nutrition API service

const API_KEY = 'ZEv05ridT7tMOUpzxPE+ig==QaSVIhQpIQ4wNiJ9';
const BASE_URL = 'https://api.api-ninjas.com/v1/nutrition';

/**
 * Search for nutrition information using natural language
 * @param {string} query - Natural language query (e.g., "1lb brisket and fries", "grilled chicken breast")
 * @returns {Promise<Array>} Array of nutrition data objects
 */
export async function searchNutrition(query) {
  if (!query || !query.trim()) {
    throw new Error('Query is required');
  }

  try {
    const response = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // The API returns an array of food items with their nutrition data
    // Normalize the data to match our app's format
    return data.map((item, index) => normalizeNutritionData(item, index));
  } catch (error) {
    console.error('Nutrition API error:', error);
    throw error;
  }
}

/**
 * Normalize API Ninjas nutrition data to app format
 * @param {object} item - Raw nutrition data from API
 * @param {number} index - Index for generating unique IDs
 * @returns {object} Normalized nutrition data
 */
function normalizeNutritionData(item, index) {
  // Extract values, handling premium-only fields
  const calories = parseNutritionValue(item.calories);
  const protein = parseNutritionValue(item.protein_g);
  const carbs = parseNutritionValue(item.carbohydrates_total_g);
  const fat = parseNutritionValue(item.fat_total_g);
  const servingSize = parseNutritionValue(item.serving_size_g);

  // If calories are not available (premium only), calculate from macros
  // Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
  let calculatedCalories = calories;
  if (calories === 0 || isNaN(calories)) {
    calculatedCalories = Math.round((protein * 4) + (carbs * 4) + (fat * 9));
  }

  // If serving size not available, assume 100g
  const finalServingSize = servingSize > 0 ? servingSize : 100;

  // If protein is premium-only, estimate from calories and other macros
  let finalProtein = protein;
  if (protein === 0 || isNaN(protein)) {
    // Rough estimate: assume protein is 25% of remaining calories after fat and carbs
    const remainingCals = calculatedCalories - (carbs * 4) - (fat * 9);
    finalProtein = Math.max(0, remainingCals / 4);
  }

  return {
    label: item.name || 'Unknown food',
    brand: 'API Ninjas',
    calories: Math.round(calculatedCalories),
    protein: roundToOne(finalProtein),
    carbs: roundToOne(carbs),
    fat: roundToOne(fat),
    serving: {
      quantity: roundToOne(finalServingSize),
      unit: 'g',
    },
    // Additional nutrition data available from API
    fiber: roundToOne(parseNutritionValue(item.fiber_g)),
    sugar: roundToOne(parseNutritionValue(item.sugar_g)),
    sodium: Math.round(parseNutritionValue(item.sodium_mg)),
    potassium: Math.round(parseNutritionValue(item.potassium_mg)),
    cholesterol: Math.round(parseNutritionValue(item.cholesterol_mg)),
    saturatedFat: roundToOne(parseNutritionValue(item.fat_saturated_g)),
    source: 'api-ninjas',
    isPremiumLimited: calories === 0 || typeof item.calories === 'string',
  };
}

/**
 * Parse nutrition value, handling premium-only restrictions
 * @param {any} value - Value from API (may be number or "Only available for premium subscribers")
 * @returns {number} Parsed number or 0
 */
function parseNutritionValue(value) {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' && !value.includes('premium')) {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/**
 * Round to one decimal place
 * @param {number} value
 * @returns {number}
 */
function roundToOne(value) {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}
