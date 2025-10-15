<template>
  <main class="wrap">
    <header class="app-header">
      <h1>Federico's Fitness Tracker</h1>
      <p class="sub">{{ subtitle }}</p>
      <DayTabs
        :selected-day="selectedDay"
        :today-day="todayDay"
        :progress="dayProgressMap"
        @select-day="handleSelectDay"
      />
      <div class="controls">
        <button class="secondary" type="button" @click="handleResetDay">Reset Day</button>
        <button class="secondary" type="button" @click="handleResetAll">Reset All</button>
      </div>
      <div v-if="bannerMessage" class="banner" role="status">{{ bannerMessage }}</div>
    </header>

    <DailySummary :progress="currentProgress" :summary-items="summaryItems" />

    <WeekOverview
      :selected-day="selectedDay"
      :today-day="todayDay"
      :progress="dayProgressMap"
      @select-day="handleSelectDay"
    />

    <WorkoutCard
      category="cardio"
      title="Cardio"
      subtitle="Pick what hits best today"
      :plan-config="PLAN.cardio[selectedDay]"
      :selected-option="getOptionSelection(selectedDay, 'cardio')"
      :completed="checkboxStates.cardio_cb"
      :always-visible="true"
      @toggle-complete="toggleCheckbox('cardio_cb', $event)"
      @select-option="setOptionSelection(selectedDay, 'cardio', $event)"
      @clear-option="clearOptionSelection(selectedDay, 'cardio')"
    />

    <WorkoutCard
      category="kp"
      title="KOT / Plyos"
      subtitle="Mobility & power choices"
      :plan-config="PLAN.kp[selectedDay]"
      :selected-option="getOptionSelection(selectedDay, 'kp')"
      :completed="checkboxStates.kp_cb"
      @toggle-complete="toggleCheckbox('kp_cb', $event)"
      @select-option="setOptionSelection(selectedDay, 'kp', $event)"
      @clear-option="clearOptionSelection(selectedDay, 'kp')"
    />

    <WorkoutCard
      category="weights"
      title="Weights"
      subtitle="Choose your lift block"
      :plan-config="PLAN.weights[selectedDay]"
      :selected-option="getOptionSelection(selectedDay, 'weights')"
      :completed="checkboxStates.weights_cb"
      @toggle-complete="toggleCheckbox('weights_cb', $event)"
      @select-option="setOptionSelection(selectedDay, 'weights', $event)"
      @clear-option="clearOptionSelection(selectedDay, 'weights')"
    />

    <SimpleChecklistCard
      card-id="absCard"
      title="Abs (every 2 days)"
      :items="[{ id: 'abs_cb', label: 'Abs / Core work', checked: checkboxStates.abs_cb, disabled: false }]"
      @toggle="toggleCheckbox"
    >
      <template #icon>
        <rect x="5" y="4" width="14" height="16" rx="3"></rect>
        <path d="M12 8v8"></path>
        <path d="M8 12h8"></path>
      </template>
    </SimpleChecklistCard>

    <SimpleChecklistCard
      card-id="recoveryCard"
      title="Stretch • Roll • Recover"
      subtitle="Reset and recharge"
      :items="recoveryItems"
      @toggle="toggleCheckbox"
    >
      <template #icon>
        <path d="M12 21c4.5-2.5 8-6.7 8-11a8 8 0 1 0-16 0c0 4.3 3.5 8.5 8 11Z"></path>
        <path d="M9.5 11.5 12 14l3-3"></path>
      </template>
    </SimpleChecklistCard>

    <SimpleChecklistCard
      card-id="nutritionCard"
      title="Nutrition & Hydration"
      subtitle="Fuel with intention"
      :items="nutritionItems"
      @toggle="toggleCheckbox"
    >
      <template #icon>
        <path d="M18 2v6a6 6 0 1 1-12 0V2"></path>
        <path d="M6 11a6 6 0 0 0 12 0"></path>
        <path d="M12 17v5"></path>
      </template>
    </SimpleChecklistCard>

    <NotesCard
      v-model:notes="notesInput"
      :status="notesStatus"
      @save="handleSaveNotes"
      @clear="handleClearNotes"
    />

    <WeightCard
      v-model:weight="weightInput"
      :last-weigh-in="lastWeighIn"
      @save="handleSaveWeight"
      @delete="handleDeleteWeight"
    />

    <ProgressChart :entries="weightEntries" />
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useFitnessTracker } from './composables/useFitnessTracker'
import { PLAN, DAYS, DAY_NAMES, CHECKBOX_IDS, SECTION_GROUPS } from './data'
import DayTabs from './components/DayTabs.vue'
import DailySummary from './components/DailySummary.vue'
import WeekOverview from './components/WeekOverview.vue'
import WorkoutCard from './components/WorkoutCard.vue'
import SimpleChecklistCard from './components/SimpleChecklistCard.vue'
import NotesCard from './components/NotesCard.vue'
import WeightCard from './components/WeightCard.vue'
import ProgressChart from './components/ProgressChart.vue'

const {
  selectedDay,
  todayDay,
  setDay,
  getDateForDay,
  storageKeyFor,
  isTaskActiveForDay,
  computeDayProgress,
  getOptionSelection,
  setOptionSelection,
  clearOptionSelection,
  parseStoredPayload,
  getWeightEntries,
  getLatestWeightEntry,
  formatTime,
  formatRelative,
  resetDay,
  resetAll,
  noteKey,
  weightKey,
} = useFitnessTracker()

// Reactive state for checkboxes
const checkboxStates = ref({})

// Notes state
const notesInput = ref('')
const notesStatus = ref('No notes yet.')

// Weight state
const weightInput = ref('')
const lastWeighIn = ref('No weigh-ins saved yet.')
const weightEntries = ref([])

// Computed
const subtitle = computed(() => {
  const targetDate = getDateForDay(selectedDay.value)
  const prefix = selectedDay.value === todayDay.value ? 'Today' : 'Viewing'
  const formatter = new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric' })
  return `${prefix}: ${DAY_NAMES[selectedDay.value]} • ${formatter.format(targetDate)}`
})

const currentProgress = computed(() => computeDayProgress(selectedDay.value))

const dayProgressMap = computed(() => {
  const map = {}
  DAYS.forEach(day => {
    map[day] = computeDayProgress(day)
  })
  return map
})

const summaryItems = computed(() => {
  const items = []
  SECTION_GROUPS.forEach((section) => {
    const activeIds = section.ids.filter((taskId) => isTaskActiveForDay(taskId, selectedDay.value))
    if (!activeIds.length) return
    const completed = activeIds.filter((taskId) =>
      localStorage.getItem(storageKeyFor(selectedDay.value, taskId)) === '1'
    ).length
    items.push({
      label: section.label,
      completed,
      total: activeIds.length
    })
  })
  return items
})

const bannerMessage = computed(() => {
  const plan = {
    cardio: PLAN.cardio[selectedDay.value],
    kp: PLAN.kp[selectedDay.value],
    weights: PLAN.weights[selectedDay.value],
  }

  const messages = []
  const weightsLabel = plan.weights?.label ?? ''
  const cardioLabel = plan.cardio?.label ?? ''
  const kpLabel = plan.kp?.label ?? ''

  if (weightsLabel) {
    messages.push('Weights day: Stretch before lifting and use compression after training.')
  } else if (cardioLabel && /rest day/i.test(cardioLabel)) {
    messages.push('Active rest: Keep it light, focus on mobility, and get outside for a walk.')
  } else if (cardioLabel) {
    messages.push('Cardio focus: Compression first, then stretch after 10–15 minutes.')
  }

  if (kpLabel && kpLabel.toLowerCase().includes('plyos')) {
    messages.push('Plyo session: Add extra warm-up and land softly — quality over quantity.')
  }

  return messages.join(' ')
})

const recoveryItems = computed(() => [
  { id: 'stretch_cb', label: 'Stretching — 10–15 min', checked: checkboxStates.value.stretch_cb, disabled: false },
  { id: 'compress_cb', label: 'Compression boots — 10–20 min', checked: checkboxStates.value.compress_cb, disabled: false },
  { id: 'roll_cb', label: 'Foam roll tibialis / calves / quads', checked: checkboxStates.value.roll_cb, disabled: false },
  { id: 'biofreeze_cb', label: 'Biofreeze (if sore)', checked: checkboxStates.value.biofreeze_cb, disabled: false },
  { id: 'sleep_cb', label: 'Sleep 7–8 hours', checked: checkboxStates.value.sleep_cb, disabled: false },
])

const nutritionItems = computed(() => [
  { id: 'coffee_cb', label: 'Coffee + ¼ cup half & half + Monk Fruit + Stevia (≤ 5)', checked: checkboxStates.value.coffee_cb, disabled: false },
  { id: 'water_cb', label: 'Water (≥ 3 liters)', checked: checkboxStates.value.water_cb, disabled: false },
  { id: 'lmnt_cb', label: 'LMNT electrolytes (1 packet)', checked: checkboxStates.value.lmnt_cb, disabled: false },
  { id: 'shake_cb', label: 'Carnivor protein shake (1–2 scoops)', checked: checkboxStates.value.shake_cb, disabled: false },
  { id: 'meal1_cb', label: 'Meal 1: 8 eggs + 5 sausages + 2 tbsp butter', checked: checkboxStates.value.meal1_cb, disabled: false },
  { id: 'meal2_cb', label: 'Meal 2: steak (1.0–1.2 lb) or 3–4 chicken thighs + 2–3 eggs + 2 tbsp butter', checked: checkboxStates.value.meal2_cb, disabled: false },
  { id: 'snack_cb', label: 'Snack: pork rinds (¼ bag) or 3 mozzarella sticks', checked: checkboxStates.value.snack_cb, disabled: false },
])

// Methods
function loadCheckboxes() {
  CHECKBOX_IDS.forEach((id) => {
    const active = isTaskActiveForDay(id, selectedDay.value)
    if (!active) {
      checkboxStates.value[id] = false
      localStorage.removeItem(storageKeyFor(selectedDay.value, id))
    } else {
      const stored = localStorage.getItem(storageKeyFor(selectedDay.value, id))
      checkboxStates.value[id] = stored === '1'
    }
  })
}

function toggleCheckbox(id, checked) {
  checkboxStates.value[id] = checked
  localStorage.setItem(storageKeyFor(selectedDay.value, id), checked ? '1' : '0')
}

function handleSelectDay(day) {
  if (selectedDay.value === day) return
  setDay(day)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function loadNotes() {
  const stored = localStorage.getItem(noteKey(selectedDay.value))
  const parsed = parseStoredPayload(stored)
  notesInput.value = parsed ? parsed.value : ''
  if (!parsed) {
    notesStatus.value = 'No notes yet.'
  } else if (parsed.ts) {
    notesStatus.value = `Saved ${formatRelative(parsed.ts)} (${formatTime(parsed.ts)})`
  } else {
    notesStatus.value = 'Saved.'
  }
}

function handleSaveNotes() {
  const value = notesInput.value
  if (!value.trim()) {
    localStorage.removeItem(noteKey(selectedDay.value))
    notesStatus.value = 'Notes cleared.'
    notesInput.value = ''
    return
  }
  localStorage.setItem(noteKey(selectedDay.value), JSON.stringify({ value, ts: Date.now() }))
  notesStatus.value = 'Saved just now.'
}

function handleClearNotes() {
  localStorage.removeItem(noteKey(selectedDay.value))
  notesInput.value = ''
  notesStatus.value = 'Notes cleared.'
}

function loadWeight() {
  const current = parseStoredPayload(localStorage.getItem(weightKey(selectedDay.value)))
  weightInput.value = current && typeof current.value === 'number' ? current.value : ''

  const latest = getLatestWeightEntry()
  if (!latest) {
    lastWeighIn.value = 'No weigh-ins saved yet.'
  } else {
    const dayName = DAY_NAMES[latest.day]
    if (latest.ts) {
      lastWeighIn.value = `Last saved: ${latest.value.toFixed(1)} lbs on ${dayName} • ${formatTime(latest.ts)}`
    } else {
      lastWeighIn.value = `Last saved: ${latest.value.toFixed(1)} lbs on ${dayName}`
    }
  }

  weightEntries.value = getWeightEntries()
}

function handleSaveWeight() {
  const raw = weightInput.value.toString().trim()
  if (!raw) {
    alert('Enter a weight before saving.')
    return
  }
  const value = Number.parseFloat(raw)
  if (!Number.isFinite(value)) {
    alert('Please enter a valid number.')
    return
  }
  localStorage.setItem(weightKey(selectedDay.value), JSON.stringify({ value, ts: Date.now() }))
  loadWeight()
}

function handleDeleteWeight() {
  localStorage.removeItem(weightKey(selectedDay.value))
  loadWeight()
}

function handleResetDay() {
  if (!confirm(`Reset ${DAY_NAMES[selectedDay.value]}?`)) return
  resetDay(selectedDay.value)
  loadCheckboxes()
  loadNotes()
}

function handleResetAll() {
  if (!confirm('Reset ALL data?')) return
  resetAll()
  loadCheckboxes()
  loadNotes()
  loadWeight()
}

// Watchers
watch(selectedDay, () => {
  loadCheckboxes()
  loadNotes()
  loadWeight()
})

watch(notesInput, () => {
  if (notesStatus.value !== 'Saved just now.' && notesInput.value) {
    notesStatus.value = 'Unsaved changes'
  }
})

// Lifecycle
onMounted(() => {
  loadCheckboxes()
  loadNotes()
  loadWeight()
})
</script>
