const STORAGE_PREFIX = 'fitpal_';
const SETTINGS_KEY = `${STORAGE_PREFIX}settings`;
const DAY_KEY = (dateKey) => `${STORAGE_PREFIX}day_${dateKey}`;
const NOTES_KEY = (dateKey) => `${STORAGE_PREFIX}notes_${dateKey}`;

const DEFAULT_SETTINGS = {
  goals: {
    calories: 2600,
    carbs: 280,
    protein: 190,
    fat: 90,
  },
};

const MEALS = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snacks', label: 'Snacks' },
];

const SAMPLE_RESULTS = [
  {
    label: 'Grilled Chicken Breast',
    brand: 'Sample entry',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    serving: { quantity: 1, unit: 'piece (120g)' },
    source: 'sample',
  },
  {
    label: 'Oatmeal, cooked with water',
    brand: 'Sample entry',
    calories: 158,
    protein: 5.5,
    carbs: 27,
    fat: 3.2,
    serving: { quantity: 1, unit: 'cup' },
    source: 'sample',
  },
  {
    label: 'Greek Yogurt (Nonfat)',
    brand: 'Sample entry',
    calories: 90,
    protein: 17,
    carbs: 6,
    fat: 0,
    serving: { quantity: 1, unit: 'container (170g)' },
    source: 'sample',
  },
  {
    label: 'Almonds',
    brand: 'Sample entry',
    calories: 170,
    protein: 6,
    carbs: 6,
    fat: 15,
    serving: { quantity: 1, unit: 'oz (~23 nuts)' },
    source: 'sample',
  },
  {
    label: 'Protein Shake (Whey, water)',
    brand: 'Sample entry',
    calories: 120,
    protein: 24,
    carbs: 3,
    fat: 2,
    serving: { quantity: 1, unit: 'scoop' },
    source: 'sample',
  },
];

const DEFAULT_WORKOUT_LIBRARY = [
  {
    id: 'run_outdoor',
    name: 'Outdoor Run',
    category: 'Cardio',
    intensity: 'High',
    met: 9.8,
    caloriesPerHour: 750,
    defaultDuration: 45,
    description: 'Steady outdoor run on varied terrain.',
  },
  {
    id: 'run_indoor',
    name: 'Treadmill Run',
    category: 'Cardio',
    intensity: 'Moderate',
    met: 8.5,
    caloriesPerHour: 680,
    defaultDuration: 40,
    description: 'Indoor treadmill session at moderate pace.',
  },
  {
    id: 'cycling_outdoor',
    name: 'Outdoor Cycling',
    category: 'Cardio',
    intensity: 'High',
    met: 8,
    caloriesPerHour: 620,
    defaultDuration: 60,
    description: 'Road cycling with rolling hills.',
  },
  {
    id: 'cycling_indoor',
    name: 'Indoor Cycling',
    category: 'Cardio',
    intensity: 'High',
    met: 7.5,
    caloriesPerHour: 590,
    defaultDuration: 45,
    description: 'Spin bike intervals or steady ride.',
  },
  {
    id: 'hiit',
    name: 'HIIT',
    category: 'Cardio',
    intensity: 'Very High',
    met: 10,
    caloriesPerHour: 820,
    defaultDuration: 30,
    description: 'High-intensity interval training with minimal rest.',
  },
  {
    id: 'strength_full',
    name: 'Strength Training',
    category: 'Strength',
    intensity: 'Moderate',
    met: 6,
    caloriesPerHour: 450,
    defaultDuration: 50,
    description: 'Traditional lifting session with compound movements.',
  },
  {
    id: 'strength_functional',
    name: 'Functional Strength',
    category: 'Strength',
    intensity: 'Moderate',
    met: 6.5,
    caloriesPerHour: 480,
    defaultDuration: 45,
    description: 'Circuit-based strength with sled pushes, kettlebells, carries.',
  },
  {
    id: 'core',
    name: 'Core & Mobility',
    category: 'Mind & Body',
    intensity: 'Light',
    met: 3,
    caloriesPerHour: 220,
    defaultDuration: 30,
    description: 'Focused core work with mobility flows.',
  },
  {
    id: 'yoga_power',
    name: 'Power Yoga',
    category: 'Mind & Body',
    intensity: 'Moderate',
    met: 4.2,
    caloriesPerHour: 320,
    defaultDuration: 60,
    description: 'Vinyasa flow emphasizing strength and flexibility.',
  },
  {
    id: 'pilates',
    name: 'Pilates Reformer/Mat',
    category: 'Mind & Body',
    intensity: 'Light',
    met: 3.5,
    caloriesPerHour: 260,
    defaultDuration: 50,
    description: 'Pilates session focusing on control and alignment.',
  },
  {
    id: 'rowing',
    name: 'Rowing Machine',
    category: 'Cardio',
    intensity: 'High',
    met: 8.5,
    caloriesPerHour: 700,
    defaultDuration: 30,
    description: 'Intervals or steady state rower workout.',
  },
  {
    id: 'swim',
    name: 'Lap Swimming',
    category: 'Cardio',
    intensity: 'High',
    met: 8.3,
    caloriesPerHour: 650,
    defaultDuration: 40,
    description: 'Continuous freestyle swimming in pool.',
  },
  {
    id: 'stair_climb',
    name: 'Stair Climber',
    category: 'Cardio',
    intensity: 'High',
    met: 8.8,
    caloriesPerHour: 720,
    defaultDuration: 30,
    description: 'Stair mill session maintaining consistent pace.',
  },
  {
    id: 'boxing',
    name: 'Boxing / Kickboxing',
    category: 'Cardio',
    intensity: 'Very High',
    met: 9.5,
    caloriesPerHour: 780,
    defaultDuration: 45,
    description: 'Heavy bag or sparring inspired workout.',
  },
  {
    id: 'jumprope',
    name: 'Jump Rope',
    category: 'Cardio',
    intensity: 'High',
    met: 11,
    caloriesPerHour: 900,
    defaultDuration: 20,
    description: 'Intervals or continuous jump rope session.',
  },
  {
    id: 'walk_outdoor',
    name: 'Outdoor Walk',
    category: 'Cardio',
    intensity: 'Light',
    met: 3.5,
    caloriesPerHour: 250,
    defaultDuration: 45,
    description: 'Brisk walk outside.',
  },
  {
    id: 'walk_indoor',
    name: 'Indoor Walk',
    category: 'Cardio',
    intensity: 'Light',
    met: 3,
    caloriesPerHour: 220,
    defaultDuration: 40,
    description: 'Treadmill or track walking session.',
  },
  {
    id: 'hiking',
    name: 'Hiking',
    category: 'Cardio',
    intensity: 'Moderate',
    met: 6.5,
    caloriesPerHour: 500,
    defaultDuration: 90,
    description: 'Outdoor hike with mixed elevation.',
  },
];

const WORKOUT_CATEGORY_PRESETS = {
  Cardio: { met: 8.5, caloriesPerHour: 650, intensity: 'High', defaultDuration: 40 },
  Strength: { met: 6, caloriesPerHour: 480, intensity: 'Moderate', defaultDuration: 45 },
  'Mind & Body': { met: 3.2, caloriesPerHour: 260, intensity: 'Light', defaultDuration: 45 },
  Mobility: { met: 3, caloriesPerHour: 230, intensity: 'Light', defaultDuration: 30 },
};

const elements = {
  meals: {},
  macros: {},
};

const state = {
  selectedDate: formatDate(new Date()),
  activeMeal: null,
  settings: loadSettings(),
  searchCache: new Map(),
  workoutLibrary: {
    status: 'loading',
    items: [],
    categories: [],
    query: '',
    category: 'All',
    map: new Map(),
  },
};

document.addEventListener('DOMContentLoaded', init);

function init() {
  cacheElements();
  bindEvents();
  renderAll();
  renderWorkoutLibrary();
  renderWorkoutFilters();
  loadWorkoutLibrary();
}

function cacheElements() {
  elements.prevDay = document.getElementById('prevDay');
  elements.nextDay = document.getElementById('nextDay');
  elements.jumpToday = document.getElementById('jumpToday');
  elements.topBarDay = document.getElementById('topBarDay');
  elements.topBarDate = document.getElementById('topBarDate');
  elements.summarySubtitle = document.getElementById('summarySubtitle');
  elements.calGoal = document.getElementById('calGoal');
  elements.calFood = document.getElementById('calFood');
  elements.calExercise = document.getElementById('calExercise');
  elements.calRemaining = document.getElementById('calRemaining');
  elements.calorieProgressFill = document.getElementById('calorieProgressFill');
  elements.calorieProgressText = document.getElementById('calorieProgressText');
  elements.macroCarbs = document.getElementById('macroCarbs');
  elements.macroProtein = document.getElementById('macroProtein');
  elements.macroFat = document.getElementById('macroFat');
  elements.macroCarbsFill = document.getElementById('macroCarbsFill');
  elements.macroProteinFill = document.getElementById('macroProteinFill');
  elements.macroFatFill = document.getElementById('macroFatFill');

  MEALS.forEach(({ key }) => {
    elements.meals[key] = {
      subtotal: document.getElementById(`meal-${key}-subtotal`),
      list: document.getElementById(`meal-${key}-list`),
      addButton: document.querySelector(`[data-meal-add="${key}"]`),
      quickButton: document.querySelector(`[data-meal-quick="${key}"]`),
    };
  });

  elements.workoutSubtotal = document.getElementById('workoutSubtotal');
  elements.workoutList = document.getElementById('workoutList');
  elements.toggleWorkoutForm = document.getElementById('toggleWorkoutForm');
  elements.openWorkoutLibrary = document.getElementById('openWorkoutLibrary');
  elements.workoutForm = document.getElementById('workoutForm');
  elements.workoutName = document.getElementById('workoutName');
  elements.workoutDuration = document.getElementById('workoutDuration');
  elements.workoutCalories = document.getElementById('workoutCalories');

  elements.dailyNotes = document.getElementById('dailyNotes');
  elements.saveNotes = document.getElementById('saveNotes');
  elements.clearNotes = document.getElementById('clearNotes');
  elements.notesStatus = document.getElementById('notesStatus');

  elements.foodDrawer = document.getElementById('foodDrawer');
  elements.foodDrawerSubtitle = document.getElementById('foodDrawerSubtitle');
  elements.foodSearchForm = document.getElementById('foodSearchForm');
  elements.foodSearchInput = document.getElementById('foodSearchInput');
  elements.foodSearchStatus = document.getElementById('foodSearchStatus');
  elements.foodResults = document.getElementById('foodResults');
  elements.quickAddSection = document.getElementById('quickAddSection');
  elements.quickAddForm = document.getElementById('quickAddForm');
  elements.quickAddName = document.getElementById('quickAddName');
  elements.quickAddCalories = document.getElementById('quickAddCalories');
  elements.quickAddProtein = document.getElementById('quickAddProtein');
  elements.quickAddCarbs = document.getElementById('quickAddCarbs');
  elements.quickAddFat = document.getElementById('quickAddFat');

  elements.workoutDrawer = document.getElementById('workoutDrawer');
  elements.workoutSearchForm = document.getElementById('workoutSearchForm');
  elements.workoutSearchInput = document.getElementById('workoutSearchInput');
  elements.workoutSearchStatus = document.getElementById('workoutSearchStatus');
  elements.workoutResults = document.getElementById('workoutResults');
  elements.workoutCategoryFilters = document.getElementById('workoutCategoryFilters');

  elements.settingsDrawer = document.getElementById('settingsDrawer');
  elements.openSettings = document.getElementById('openSettings');
  elements.settingsForm = document.getElementById('settingsForm');
  elements.goalCaloriesInput = document.getElementById('goalCaloriesInput');
  elements.goalCarbsInput = document.getElementById('goalCarbsInput');
  elements.goalProteinInput = document.getElementById('goalProteinInput');
  elements.goalFatInput = document.getElementById('goalFatInput');
}

function bindEvents() {
  elements.prevDay?.addEventListener('click', () => changeDay(-1));
  elements.nextDay?.addEventListener('click', () => changeDay(1));
  elements.jumpToday?.addEventListener('click', () => {
    state.selectedDate = formatDate(new Date());
    renderAll();
  });

  MEALS.forEach(({ key }) => {
    const mealEls = elements.meals[key];
    mealEls.addButton?.addEventListener('click', () => openFoodDrawer(key, false));
    mealEls.quickButton?.addEventListener('click', () => openFoodDrawer(key, true));
    mealEls.list?.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-remove-entry]');
      if (!button) return;
      removeMealEntry(key, button.dataset.entryId);
    });
  });

  elements.foodSearchForm?.addEventListener('submit', handleFoodSearchSubmit);
  elements.foodResults?.addEventListener('click', handleFoodResultClick);
  elements.quickAddForm?.addEventListener('submit', handleQuickAddSubmit);

  elements.toggleWorkoutForm?.addEventListener('click', () => {
    const isHidden = elements.workoutForm.hasAttribute('hidden');
    toggleWorkoutForm(!isHidden);
  });

  elements.workoutForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    addWorkout();
  });

  elements.openWorkoutLibrary?.addEventListener('click', () => {
    openDrawer('workoutDrawer');
    renderWorkoutLibrary();
    setTimeout(() => {
      elements.workoutSearchInput?.focus({ preventScroll: true });
    }, 160);
  });

  elements.workoutSearchInput?.addEventListener('input', () => {
    state.workoutLibrary.query = elements.workoutSearchInput.value.trim();
    renderWorkoutLibrary();
  });

  elements.workoutSearchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  elements.workoutCategoryFilters?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-workout-category]');
    if (!button) return;
    const category = button.dataset.workoutCategory;
    state.workoutLibrary.category = category;
    renderWorkoutFilters();
    renderWorkoutLibrary();
  });

  elements.workoutResults?.addEventListener('click', handleWorkoutResultAction);

  elements.workoutList?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-remove-workout]');
    if (!button) return;
    removeWorkout(button.dataset.workoutId);
  });

  elements.saveNotes?.addEventListener('click', () => saveNotes());
  elements.clearNotes?.addEventListener('click', () => clearNotes());

  document.querySelectorAll('[data-drawer-close]')
    .forEach((closeBtn) => {
      closeBtn.addEventListener('click', () => {
        closeDrawer(closeBtn.dataset.drawerClose);
      });
    });

  elements.foodDrawer?.addEventListener('click', (event) => {
    if (event.target.dataset.drawerClose === 'foodDrawer') {
      closeDrawer('foodDrawer');
    }
  });

  elements.workoutDrawer?.addEventListener('click', (event) => {
    if (event.target.dataset.drawerClose === 'workoutDrawer') {
      closeDrawer('workoutDrawer');
    }
  });

  elements.settingsDrawer?.addEventListener('click', (event) => {
    if (event.target.dataset.drawerClose === 'settingsDrawer') {
      closeDrawer('settingsDrawer');
    }
  });

  elements.openSettings?.addEventListener('click', () => {
    populateSettingsForm();
    openDrawer('settingsDrawer');
  });

  elements.settingsForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    saveSettingsFromForm();
  });
}

function renderAll() {
  updateTopBar();
  renderSummary();
  renderMeals();
  renderWorkouts();
  renderNotes();
}

function updateTopBar() {
  const label = formatDisplayDate(state.selectedDate);
  const today = formatDate(new Date());
  elements.topBarDate.textContent = label.full;
  elements.topBarDay.textContent = label.relative;
  elements.jumpToday.hidden = state.selectedDate === today;
}

function renderSummary() {
  const dayData = getDayData(state.selectedDate);
  const totals = calculateTotals(dayData);
  const goals = state.settings.goals;

  elements.summarySubtitle.textContent = 'Goal - Food + Exercise = Remaining';
  elements.calGoal.textContent = formatNumber(goals.calories);
  elements.calFood.textContent = formatNumber(totals.food.calories);
  elements.calExercise.textContent = formatNumber(totals.workouts.calories);
  elements.calRemaining.textContent = formatNumber(goals.calories - totals.food.calories + totals.workouts.calories);

  const progress = goals.calories > 0 ? Math.min(100, (totals.food.calories / goals.calories) * 100) : 0;
  elements.calorieProgressFill.style.width = `${progress}%`;
  elements.calorieProgressText.textContent = `${formatNumber(totals.food.calories)} / ${formatNumber(goals.calories)} kcal`;

  updateMacro('carbs', totals.food.carbs, goals.carbs);
  updateMacro('protein', totals.food.protein, goals.protein);
  updateMacro('fat', totals.food.fat, goals.fat);
}

function updateMacro(key, value, goal) {
  const valueEl = elements[`macro${capitalize(key)}`];
  const fillEl = elements[`macro${capitalize(key)}Fill`];
  valueEl.textContent = `${Math.round(value)}g / ${goal}g`;
  const progress = goal > 0 ? Math.min(100, (value / goal) * 100) : 0;
  fillEl.style.width = `${progress}%`;
}

function renderMeals() {
  const dayData = getDayData(state.selectedDate);
  MEALS.forEach(({ key }) => {
    const mealData = dayData.meals[key] || [];
    const mealEls = elements.meals[key];
    mealEls.list.innerHTML = '';

    if (!mealData.length) {
      const empty = document.createElement('li');
      empty.className = 'empty-state';
      empty.textContent = 'No foods logged yet.';
      mealEls.list.appendChild(empty);
    } else {
      mealData.forEach((entry) => {
        mealEls.list.appendChild(renderFoodEntry(entry));
      });
    }

    const subtotal = mealData.reduce((sum, entry) => sum + (entry.calories || 0), 0);
    mealEls.subtotal.textContent = `${formatNumber(subtotal)} kcal`;
  });
}

function renderFoodEntry(entry) {
  const li = document.createElement('li');
  li.className = 'log-item';
  li.innerHTML = `
    <div class="log-item__meta">
      <p class="log-item__title">${sanitize(entry.label)}</p>
      <p class="log-item__details">${renderFoodDetails(entry)}</p>
    </div>
    <div class="log-item__actions">
      <span class="log-item__calories">${formatNumber(entry.calories)} kcal</span>
      <button class="ghost-button" type="button" data-remove-entry data-entry-id="${entry.id}">Remove</button>
    </div>
  `;
  return li;
}

function renderFoodDetails(entry) {
  const parts = [];
  if (entry.brand) {
    parts.push(entry.brand);
  }
  if (entry.serving && entry.serving.quantity) {
    parts.push(`${entry.serving.quantity}${entry.serving.unit ? ` ${entry.serving.unit}` : ''}`);
  }
  const macroParts = [];
  if (typeof entry.protein === 'number') macroParts.push(`P${Math.round(entry.protein)}`);
  if (typeof entry.carbs === 'number') macroParts.push(`C${Math.round(entry.carbs)}`);
  if (typeof entry.fat === 'number') macroParts.push(`F${Math.round(entry.fat)}`);
  if (macroParts.length) {
    parts.push(macroParts.join(' • '));
  }
  return parts.join(' • ');
}

function renderWorkoutLibrary() {
  if (!elements.workoutResults || !elements.workoutSearchStatus) return;
  const library = state.workoutLibrary;

  if (library.status === 'loading') {
    elements.workoutSearchStatus.textContent = 'Loading workouts...';
    elements.workoutResults.innerHTML = '';
    return;
  }

  if (!library.items.length) {
    elements.workoutSearchStatus.textContent = library.status === 'fallback'
      ? 'Using built-in workouts. Add manually for now.'
      : 'No workouts available yet.';
    elements.workoutResults.innerHTML = '';
    return;
  }

  const query = library.query.toLowerCase();
  const matchesQuery = (workout) => !query
    || workout.name.toLowerCase().includes(query)
    || (workout.category && workout.category.toLowerCase().includes(query));
  const matchesCategory = (workout) => library.category === 'All'
    || workout.category === library.category;

  const filtered = library.items.filter((workout) => matchesQuery(workout) && matchesCategory(workout));

  if (!filtered.length) {
    elements.workoutSearchStatus.textContent = library.status === 'fallback'
      ? 'No workouts match. Using built-in library fallback.'
      : 'No workouts match your search.';
    elements.workoutResults.innerHTML = '<li class="empty-state">Try another keyword or category.</li>';
    return;
  }

  const suffix = library.status === 'fallback' ? ' • Using built-in library.' : '';
  elements.workoutSearchStatus.textContent = `Showing ${filtered.length} of ${library.items.length} workouts${suffix}`;
  elements.workoutResults.innerHTML = '';

  filtered.forEach((workout) => {
    elements.workoutResults.appendChild(renderWorkoutLibraryItem(workout));
  });
}

function renderWorkoutLibraryItem(workout) {
  const li = document.createElement('li');
  li.className = 'result-item';
  li.dataset.workoutId = workout.id;
  const duration = workout.defaultDuration || 30;
  const perHour = workout.caloriesPerHour || 400;
  const estCalories = Math.round((perHour / 60) * duration);
  li.innerHTML = `
    <div class="result-item__row result-item__row--stack">
      <div>
        <h3 class="result-item__title">${sanitize(workout.name)}</h3>
        <p class="result-item__meta">${sanitize(workout.category || 'Other')} • ${sanitize(workout.intensity || 'Moderate')} intensity</p>
        <div class="pill-list">
          <span class="pill">${perHour} kcal / hr</span>
          ${workout.met ? `<span class="pill">MET ${roundToOne(workout.met)}</span>` : ''}
          <span class="pill">Default ${duration} min ≈ ${estCalories} kcal</span>
        </div>
        ${workout.description ? `<p class="result-item__meta">${sanitize(workout.description)}</p>` : ''}
      </div>
      <div class="result-item__actions result-item__actions--stack">
        <label class="form__field">
          <span>Duration (min)</span>
          <input type="number" min="5" step="5" value="${duration}" data-duration-input />
        </label>
        <button class="primary-button" type="button" data-log-workout data-workout-id="${workout.id}">Log workout</button>
      </div>
    </div>
  `;
  return li;
}

function renderWorkoutFilters() {
  if (!elements.workoutCategoryFilters) return;
  const categories = state.workoutLibrary.categories.length
    ? state.workoutLibrary.categories
    : ['All'];
  elements.workoutCategoryFilters.innerHTML = '';
  categories.forEach((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-chip';
    button.dataset.workoutCategory = category;
    button.setAttribute('aria-pressed', category === state.workoutLibrary.category ? 'true' : 'false');
    button.textContent = category;
    elements.workoutCategoryFilters.appendChild(button);
  });
}

async function loadWorkoutLibrary(forceRefresh = false) {
  if (state.workoutLibrary.status === 'loading' && !forceRefresh) return;
  state.workoutLibrary.status = 'loading';
  renderWorkoutLibrary();

  if (forceRefresh) {
    state.workoutLibrary.query = '';
    if (elements.workoutSearchInput) {
      elements.workoutSearchInput.value = '';
    }
    state.workoutLibrary.category = 'All';
  }

  let items = null;
  try {
    items = await fetchWgerExercises();
    state.workoutLibrary.status = 'ready';
  } catch (error) {
    console.warn('Workout library fetch failed', error);
    items = DEFAULT_WORKOUT_LIBRARY;
    state.workoutLibrary.status = 'fallback';
  }

  const normalized = items.map((item, index) => normalizeWorkout(item, index));
  state.workoutLibrary.items = normalized;
  state.workoutLibrary.map = new Map(normalized.map((item) => [item.id, item]));
  const categories = Array.from(new Set(normalized.map((item) => item.category || 'Other'))).sort();
  state.workoutLibrary.categories = ['All', ...categories];
  if (!state.workoutLibrary.categories.includes(state.workoutLibrary.category)) {
    state.workoutLibrary.category = 'All';
  }
  renderWorkoutFilters();
  renderWorkoutLibrary();
}

async function fetchWgerExercises() {
  const workouts = [];
  let nextUrl = 'https://wger.de/api/v2/exerciseinfo/?language=2&limit=200&status=2';
  const seen = new Set();
  while (nextUrl && workouts.length < 500) {
    const response = await fetch(nextUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const results = Array.isArray(payload.results) ? payload.results : [];
    results.forEach((exercise) => {
      if (!exercise || !exercise.name) return;
      if (exercise.language !== 2) return;
      if (seen.has(exercise.id)) return;
      seen.add(exercise.id);
      const prepared = prepareWgerExercise(exercise);
      if (prepared) {
        workouts.push(prepared);
      }
    });
    nextUrl = payload.next;
  }
  return workouts;
}

function prepareWgerExercise(exercise) {
  const rawCategory = exercise.category?.name || 'Other';
  const category = mapWgerCategory(rawCategory);
  const preset = WORKOUT_CATEGORY_PRESETS[category] || WORKOUT_CATEGORY_PRESETS.Strength;
  const equipmentNames = Array.isArray(exercise.equipment)
    ? exercise.equipment.map((item) => item?.name).filter(Boolean)
    : [];
  const descriptionParts = [];
  if (exercise.description) descriptionParts.push(stripHtml(exercise.description));
  if (exercise.description_plain) descriptionParts.push(stripHtml(exercise.description_plain));
  if (equipmentNames.length) descriptionParts.push(`Equipment: ${equipmentNames.join(', ')}`);
  const description = descriptionParts.join(' ').trim();
  return {
    id: `wger_${exercise.id}`,
    name: exercise.name.trim(),
    category,
    intensity: preset.intensity,
    met: preset.met,
    caloriesPerHour: preset.caloriesPerHour,
    defaultDuration: preset.defaultDuration,
    description,
  };
}

function mapWgerCategory(name) {
  const normalized = (name || '').toLowerCase();
  if (['cardio', 'plyometrics', 'aerobics'].includes(normalized)) return 'Cardio';
  if (['stretching', 'yoga', 'pilates'].includes(normalized)) return 'Mind & Body';
  if (['rehabilitation', 'mobility'].includes(normalized)) return 'Mobility';
  return 'Strength';
}

function stripHtml(value) {
  if (!value) return '';
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeWorkout(entry, index) {
  const id = entry.id || `workout_${index}`;
  const met = Number.parseFloat(entry.met) || null;
  let caloriesPerHour = Number.parseFloat(entry.caloriesPerHour);
  if (!Number.isFinite(caloriesPerHour) || caloriesPerHour <= 0) {
    if (met) {
      // approximate using 82kg (180lb) baseline
      caloriesPerHour = Math.round((met * 3.5 * 82) / 200 * 60);
    } else {
      caloriesPerHour = 400;
    }
  } else {
    caloriesPerHour = Math.round(caloriesPerHour);
  }
  const defaultDuration = Number.parseFloat(entry.defaultDuration);
  return {
    id,
    name: entry.name || 'Workout',
    category: entry.category || 'Other',
    intensity: entry.intensity || 'Moderate',
    met,
    caloriesPerHour,
    defaultDuration: Number.isFinite(defaultDuration) && defaultDuration > 0 ? Math.round(defaultDuration) : 30,
    description: entry.description || '',
  };
}

function handleWorkoutResultAction(event) {
  const button = event.target.closest('button[data-log-workout]');
  if (!button) return;
  const workoutId = button.dataset.workoutId;
  const workout = state.workoutLibrary.map.get(workoutId);
  if (!workout) return;
  const container = button.closest('.result-item');
  const durationInput = container?.querySelector('[data-duration-input]');
  const duration = Math.max(5, Math.round(Number.parseFloat(durationInput?.value) || workout.defaultDuration || 30));
  logWorkoutFromLibrary(workout, duration);
}

function logWorkoutFromLibrary(workout, duration) {
  const calories = Math.round((workout.caloriesPerHour / 60) * duration);
  const entry = {
    id: generateId(),
    name: workout.name,
    duration,
    calories,
    source: 'library',
    catalogId: workout.id,
    category: workout.category,
    intensity: workout.intensity,
    met: workout.met,
  };
  appendWorkout(entry);
  elements.workoutSearchStatus.textContent = `Logged ${workout.name} for ${duration} min (${calories} kcal).`;
}

function renderWorkouts() {
  const dayData = getDayData(state.selectedDate);
  const workouts = dayData.workouts || [];
  elements.workoutList.innerHTML = '';

  if (!workouts.length) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'No workouts logged yet.';
    elements.workoutList.appendChild(empty);
  } else {
    workouts.forEach((workout) => {
      elements.workoutList.appendChild(renderWorkoutEntry(workout));
    });
  }

  const totalCalories = workouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);
  elements.workoutSubtotal.textContent = `${formatNumber(totalCalories)} kcal burned`;
}

function renderWorkoutEntry(workout) {
  const li = document.createElement('li');
  li.className = 'log-item';
  li.dataset.workoutId = workout.id;
  const detailParts = [];
  if (workout.duration) detailParts.push(`${workout.duration} min`);
  detailParts.push(`${formatNumber(workout.calories)} kcal`);
  if (workout.category) detailParts.push(sanitize(workout.category));
  if (workout.intensity) detailParts.push(`${sanitize(workout.intensity)} intensity`);
  if (workout.source) {
    const sourceLabel = workout.source === 'library' ? 'Library' : capitalize(workout.source);
    detailParts.push(sanitize(sourceLabel));
  }
  li.innerHTML = `
    <div class="log-item__meta">
      <p class="log-item__title">${sanitize(workout.name)}</p>
      <p class="log-item__details">${detailParts.join(' • ')}</p>
    </div>
    <div class="log-item__actions">
      <button class="ghost-button" type="button" data-remove-workout data-workout-id="${workout.id}">Remove</button>
    </div>
  `;
  return li;
}

function renderNotes() {
  const note = localStorage.getItem(NOTES_KEY(state.selectedDate)) || '';
  elements.dailyNotes.value = note;
  elements.notesStatus.textContent = note ? 'Saved.' : 'No notes yet.';
}

function changeDay(offset) {
  const currentDate = toLocalDate(state.selectedDate);
  currentDate.setDate(currentDate.getDate() + offset);
  state.selectedDate = formatDate(currentDate);
  renderAll();
}

function getDayData(dateKey) {
  const raw = localStorage.getItem(DAY_KEY(dateKey));
  if (!raw) {
    return {
      meals: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      },
      workouts: [],
    };
  }
  try {
    const parsed = JSON.parse(raw);
    parsed.meals = parsed.meals || { breakfast: [], lunch: [], dinner: [], snacks: [] };
    parsed.workouts = parsed.workouts || [];
    return parsed;
  } catch (error) {
    console.warn('Unable to parse stored day data', error);
    return {
      meals: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      },
      workouts: [],
    };
  }
}

function saveDayData(dateKey, data) {
  localStorage.setItem(DAY_KEY(dateKey), JSON.stringify(data));
}

function calculateTotals(dayData) {
  const totals = {
    food: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
    workouts: {
      calories: 0,
    },
  };

  MEALS.forEach(({ key }) => {
    (dayData.meals[key] || []).forEach((entry) => {
      totals.food.calories += entry.calories || 0;
      totals.food.protein += entry.protein || 0;
      totals.food.carbs += entry.carbs || 0;
      totals.food.fat += entry.fat || 0;
    });
  });

  (dayData.workouts || []).forEach((workout) => {
    totals.workouts.calories += workout.calories || 0;
  });

  return totals;
}

function removeMealEntry(mealKey, entryId) {
  const dayData = getDayData(state.selectedDate);
  dayData.meals[mealKey] = dayData.meals[mealKey].filter((entry) => entry.id !== entryId);
  saveDayData(state.selectedDate, dayData);
  renderSummary();
  renderMeals();
}

function addMealEntry(mealKey, entry) {
  const dayData = getDayData(state.selectedDate);
  dayData.meals[mealKey].push(entry);
  saveDayData(state.selectedDate, dayData);
  renderSummary();
  renderMeals();
}

function appendWorkout(workout) {
  const dayData = getDayData(state.selectedDate);
  dayData.workouts.push(workout);
  saveDayData(state.selectedDate, dayData);
  renderSummary();
  renderWorkouts();
}

function addWorkout() {
  const name = elements.workoutName.value.trim();
  const duration = Number.parseInt(elements.workoutDuration.value, 10) || 0;
  const calories = Number.parseInt(elements.workoutCalories.value, 10) || 0;
  if (!name) {
    alert('Enter a workout name.');
    return;
  }
  const workout = {
    id: generateId(),
    name,
    duration,
    calories,
    source: 'manual',
  };
  appendWorkout(workout);
  elements.workoutForm.reset();
  toggleWorkoutForm(false);
}

function removeWorkout(workoutId) {
  const dayData = getDayData(state.selectedDate);
  dayData.workouts = dayData.workouts.filter((workout) => workout.id !== workoutId);
  saveDayData(state.selectedDate, dayData);
  renderSummary();
  renderWorkouts();
}

function toggleWorkoutForm(show) {
  if (show) {
    elements.workoutForm.removeAttribute('hidden');
    elements.toggleWorkoutForm.textContent = 'Close quick log';
  } else {
    elements.workoutForm.setAttribute('hidden', '');
    elements.toggleWorkoutForm.textContent = 'Quick log';
  }
}

function saveNotes() {
  const value = elements.dailyNotes.value.trim();
  if (!value) {
    localStorage.removeItem(NOTES_KEY(state.selectedDate));
    elements.notesStatus.textContent = 'Notes cleared.';
    return;
  }
  localStorage.setItem(NOTES_KEY(state.selectedDate), value);
  elements.notesStatus.textContent = 'Saved just now.';
}

function clearNotes() {
  elements.dailyNotes.value = '';
  localStorage.removeItem(NOTES_KEY(state.selectedDate));
  elements.notesStatus.textContent = 'Notes cleared.';
}

function openFoodDrawer(mealKey, quickAdd) {
  state.activeMeal = mealKey;
  elements.foodDrawerSubtitle.textContent = quickAdd
    ? `Quick add to ${capitalize(mealKey)}.`
    : `Searching OpenFoodFacts and logging under ${capitalize(mealKey)}.`;
  if (quickAdd) {
    elements.quickAddSection.setAttribute('open', '');
    elements.foodSearchInput.value = '';
    elements.foodResults.innerHTML = '';
    elements.foodSearchStatus.textContent = 'Using quick add. Add calories manually below.';
  } else {
    elements.quickAddSection.removeAttribute('open');
    elements.foodSearchStatus.textContent = 'Enter a food to begin.';
  }
  elements.quickAddForm?.reset();
  openDrawer('foodDrawer');
  if (!quickAdd) {
    setTimeout(() => {
      elements.foodSearchInput?.focus({ preventScroll: true });
    }, 160);
  }
}

function handleFoodSearchSubmit(event) {
  event.preventDefault();
  const query = elements.foodSearchInput.value.trim();
  if (!query) {
    elements.foodSearchStatus.textContent = 'Enter a food name to search.';
    return;
  }
  performFoodSearch(query);
}

async function performFoodSearch(query) {
  elements.foodSearchStatus.textContent = 'Searching OpenFoodFacts...';
  elements.foodResults.innerHTML = '';
  state.searchCache.clear();

  const endpoint = new URL('https://world.openfoodfacts.org/cgi/search.pl');
  endpoint.searchParams.set('search_terms', query);
  endpoint.searchParams.set('search_simple', '1');
  endpoint.searchParams.set('action', 'process');
  endpoint.searchParams.set('json', '1');
  endpoint.searchParams.set('page_size', '20');

  try {
    const response = await fetch(endpoint.toString(), { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const payload = await response.json();
    const products = Array.isArray(payload.products) ? payload.products : [];
    const results = products
      .map((product) => simplifyOpenFoodFactsProduct(product))
      .filter(Boolean);
    if (!results.length) {
      elements.foodSearchStatus.textContent = 'No matches on OpenFoodFacts. Try another search or quick add manually.';
      return;
    }
    renderFoodResults(results, false);
    elements.foodSearchStatus.textContent = `Showing ${results.length} result${results.length === 1 ? '' : 's'} from OpenFoodFacts.`;
  } catch (error) {
    console.warn('Food search failed', error);
    elements.foodSearchStatus.textContent = 'OpenFoodFacts unavailable. Showing demo foods instead.';
    renderFoodResults(SAMPLE_RESULTS, true);
  }
}

function simplifyOpenFoodFactsProduct(product) {
  if (!product) return null;
  const label = product.product_name || product.generic_name || product.brands || product.ingredients_text || 'Food item';
  const brand = product.brands ? product.brands.split(',')[0].trim() : (product.manufacturing_places || 'OpenFoodFacts');
  const nutriments = product.nutriments || {};

  const calories = extractKcal(nutriments);
  const protein = extractMacro(nutriments, 'proteins');
  const carbs = extractMacro(nutriments, 'carbohydrates');
  const fat = extractMacro(nutriments, 'fat');

  const serving = parseServing(product);

  return {
    label,
    brand,
    calories,
    protein,
    carbs,
    fat,
    serving,
    source: 'openfoodfacts',
  };
}

function extractKcal(nutriments) {
  const kcalKeys = ['energy-kcal_serving', 'energy-kcal_100g', 'energy-kcal_value', 'energy-kcal'];
  const kJKeys = ['energy_serving', 'energy_100g', 'energy'];
  let value = firstNumeric(nutriments, kcalKeys);
  if (value !== null) return Math.round(value);
  const kJ = firstNumeric(nutriments, kJKeys);
  if (kJ !== null) {
    return Math.round(kJ / 4.184);
  }
  return 0;
}

function extractMacro(nutriments, key) {
  const value = firstNumeric(nutriments, [`${key}_serving`, `${key}_100g`, key]);
  return value !== null ? roundToOne(value) : 0;
}

function firstNumeric(object, keys) {
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(object, key)) continue;
    const value = Number.parseFloat(object[key]);
    if (Number.isFinite(value)) {
      return value;
    }
  }
  return null;
}

function parseServing(product) {
  const quantityValue = Number.parseFloat(product.serving_quantity);
  const servingSize = product.serving_size;
  if (Number.isFinite(quantityValue) && product.serving_quantity_unit) {
    return {
      quantity: roundToOne(quantityValue),
      unit: product.serving_quantity_unit,
    };
  }
  if (servingSize && typeof servingSize === 'string') {
    const match = servingSize.match(/([\d.,]+)\s*([a-zA-Z]+)/);
    if (match) {
      const quantity = Number.parseFloat(match[1].replace(',', '.'));
      if (Number.isFinite(quantity)) {
        return {
          quantity: roundToOne(quantity),
          unit: match[2],
        };
      }
    }
    return {
      quantity: 1,
      unit: servingSize.trim(),
    };
  }
  return {
    quantity: 1,
    unit: 'serving',
  };
}

function renderFoodResults(results, isFallback) {
  elements.foodResults.innerHTML = '';
  state.searchCache.clear();

  results.forEach((result) => {
    const id = generateId();
    state.searchCache.set(id, result);
    const item = document.createElement('li');
    item.className = 'result-item';
    item.dataset.resultId = id;
    item.innerHTML = `
      <div class="result-item__row">
        <div>
          <h3 class="result-item__title">${sanitize(result.label)}</h3>
          <p class="result-item__meta">${sanitize(result.brand || 'Generic')}</p>
          <div class="pill-list">
            <span class="pill">${Math.round(result.calories)} kcal</span>
            <span class="pill">P ${Math.round(result.protein)}g</span>
            <span class="pill">C ${Math.round(result.carbs)}g</span>
            <span class="pill">F ${Math.round(result.fat)}g</span>
          </div>
          <p class="result-item__meta">${result.serving.quantity} ${sanitize(result.serving.unit)}</p>
        </div>
        <div class="result-item__actions">
          <label class="form__field">
            <span>Servings</span>
            <input type="number" min="0.25" step="0.25" value="1" data-serving-input />
          </label>
          <button class="primary-button" type="button" data-add-food data-result-id="${id}">Log</button>
        </div>
      </div>
    `;
    elements.foodResults.appendChild(item);
  });

  if (isFallback && !results.length) {
    const item = document.createElement('li');
    item.className = 'empty-state';
    item.textContent = 'No demo foods available.';
    elements.foodResults.appendChild(item);
  }
}

function handleFoodResultClick(event) {
  const addButton = event.target.closest('button[data-add-food]');
  if (!addButton) return;
  const resultId = addButton.dataset.resultId;
  const result = state.searchCache.get(resultId);
  if (!result) return;
  const servingInput = addButton.closest('.result-item').querySelector('[data-serving-input]');
  const servings = servingInput ? Number.parseFloat(servingInput.value) || 1 : 1;
  logFoodFromResult(result, servings);
}

function logFoodFromResult(result, servings) {
  if (!state.activeMeal) {
    alert('Select a meal first.');
    return;
  }
  const multiplier = Math.max(servings, 0);
  const entry = {
    id: generateId(),
    label: result.label,
    brand: result.brand,
    calories: Math.round(result.calories * multiplier),
    protein: roundToOne(result.protein * multiplier),
    carbs: roundToOne(result.carbs * multiplier),
    fat: roundToOne(result.fat * multiplier),
    serving: {
      quantity: roundToOne(result.serving.quantity * multiplier),
      unit: result.serving.unit,
    },
    source: result.source || 'openfoodfacts',
  };
  addMealEntry(state.activeMeal, entry);
  elements.foodSearchStatus.textContent = `Logged ${entry.label} to ${capitalize(state.activeMeal)}.`;
}

function handleQuickAddSubmit(event) {
  event.preventDefault();
  if (!state.activeMeal) {
    alert('Select a meal first.');
    return;
  }
  const name = elements.quickAddName.value.trim();
  const calories = Number.parseFloat(elements.quickAddCalories.value) || 0;
  if (!name || !calories) {
    alert('Enter at least a name and calories for quick add.');
    return;
  }
  const entry = {
    id: generateId(),
    label: name,
    brand: 'Quick add',
    calories: Math.round(calories),
    protein: Number.parseFloat(elements.quickAddProtein.value) || 0,
    carbs: Number.parseFloat(elements.quickAddCarbs.value) || 0,
    fat: Number.parseFloat(elements.quickAddFat.value) || 0,
    serving: {
      quantity: 1,
      unit: 'serving',
    },
    source: 'manual',
  };
  addMealEntry(state.activeMeal, entry);
  elements.quickAddForm.reset();
  elements.foodSearchStatus.textContent = `Quick added ${entry.label} to ${capitalize(state.activeMeal)}.`;
}

function openDrawer(id) {
  const drawer = document.getElementById(id);
  if (!drawer) return;
  drawer.hidden = false;
  requestAnimationFrame(() => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  });
}

function closeDrawer(id) {
  const drawer = document.getElementById(id);
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  setTimeout(() => {
    drawer.hidden = true;
    if (!document.querySelector('.drawer.is-open')) {
      document.body.classList.remove('no-scroll');
    }
  }, 180);
}

function populateSettingsForm() {
  const { goals } = state.settings;
  elements.goalCaloriesInput.value = goals.calories;
  elements.goalCarbsInput.value = goals.carbs;
  elements.goalProteinInput.value = goals.protein;
  elements.goalFatInput.value = goals.fat;
}

function saveSettingsFromForm() {
  const calories = Number.parseInt(elements.goalCaloriesInput.value, 10) || DEFAULT_SETTINGS.goals.calories;
  const carbs = Number.parseInt(elements.goalCarbsInput.value, 10) || DEFAULT_SETTINGS.goals.carbs;
  const protein = Number.parseInt(elements.goalProteinInput.value, 10) || DEFAULT_SETTINGS.goals.protein;
  const fat = Number.parseInt(elements.goalFatInput.value, 10) || DEFAULT_SETTINGS.goals.fat;
  state.settings.goals = { calories, carbs, protein, fat };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  closeDrawer('settingsDrawer');
  renderSummary();
}

function loadSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return cloneDefaultSettings();
  try {
    const parsed = JSON.parse(raw);
    return {
      goals: {
        calories: parsed?.goals?.calories ?? DEFAULT_SETTINGS.goals.calories,
        carbs: parsed?.goals?.carbs ?? DEFAULT_SETTINGS.goals.carbs,
        protein: parsed?.goals?.protein ?? DEFAULT_SETTINGS.goals.protein,
        fat: parsed?.goals?.fat ?? DEFAULT_SETTINGS.goals.fat,
      },
    };
  } catch (error) {
    console.warn('Unable to parse stored settings', error);
    return cloneDefaultSettings();
  }
}

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function formatNumber(value) {
  return Math.round(value);
}

function roundToOne(value) {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

function toLocalDate(value) {
  if (typeof value === 'string') {
    const parts = value.split('-').map((part) => Number.parseInt(part, 10));
    if (parts.length === 3 && parts.every(Number.isFinite)) {
      const [year, month, day] = parts;
      return new Date(year, month - 1, day);
    }
  }
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDate(date) {
  const d = toLocalDate(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateKey) {
  const d = toLocalDate(dateKey);
  const formatter = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  const full = formatter.format(d);
  const todayKey = formatDate(new Date());
  const yesterdayKey = formatDate(Date.now() - 86400000);
  const tomorrowKey = formatDate(Date.now() + 86400000);
  let relative = full.split(',')[0];
  if (dateKey === todayKey) relative = 'Today';
  else if (dateKey === yesterdayKey) relative = 'Yesterday';
  else if (dateKey === tomorrowKey) relative = 'Tomorrow';
  return { full, relative };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sanitize(value) {
  if (!value) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
  };
  return value.replace(/[&<>"']/g, (char) => map[char]);
}

function cloneDefaultSettings() {
  return typeof structuredClone === 'function'
    ? structuredClone(DEFAULT_SETTINGS)
    : JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}
