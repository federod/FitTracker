import { ref, computed, watch } from 'vue'
import { PLAN, DAYS, DAY_NAMES, CHECKBOX_IDS, SECTION_GROUPS } from '../data'

const STORAGE_PREFIX = 'fittracker_'
const LAST_DAY_KEY = `${STORAGE_PREFIX}last_day`
const NOTES_PREFIX = `${STORAGE_PREFIX}note_`

export function useFitnessTracker() {
  // State
  const selectedDay = ref(getInitialDay())

  // Computed
  const todayDay = computed(() => getTodayDay())

  // Helper functions
  function getTodayDay() {
    return DAYS[getIsoDayIndex(new Date())]
  }

  function getIsoDayIndex(date) {
    return (date.getDay() + 6) % 7
  }

  function getInitialDay() {
    const stored = localStorage.getItem(LAST_DAY_KEY)
    if (stored && DAYS.includes(stored)) {
      return stored
    }
    return getTodayDay()
  }

  function getDateForDay(day) {
    const today = new Date()
    const todayIndex = getIsoDayIndex(today)
    const targetIndex = DAYS.indexOf(day)
    const diff = targetIndex - todayIndex
    const target = new Date(today)
    target.setDate(today.getDate() + diff)
    return target
  }

  function storageKeyFor(day, id) {
    return `${STORAGE_PREFIX}${day}_${id}`
  }

  function optionKey(day, category) {
    return `${STORAGE_PREFIX}${day}_${category}_choice`
  }

  function weightKey(day) {
    return `${STORAGE_PREFIX}w_${day}`
  }

  function noteKey(day) {
    return `${NOTES_PREFIX}${day}`
  }

  function isTaskActiveForDay(id, day) {
    if (id === 'kp_cb') {
      return Boolean(PLAN.kp[day])
    }
    if (id === 'weights_cb') {
      return Boolean(PLAN.weights[day])
    }
    return true
  }

  function computeDayProgress(day) {
    const activeIds = CHECKBOX_IDS.filter((id) => isTaskActiveForDay(id, day))
    const completed = activeIds.filter((id) => localStorage.getItem(storageKeyFor(day, id)) === '1').length
    const total = activeIds.length
    const percent = total ? Math.round((completed / total) * 100) : 0
    return { completed, total, percent }
  }

  function getOptionSelection(day, category) {
    return localStorage.getItem(optionKey(day, category))
  }

  function setOptionSelection(day, category, optionId) {
    localStorage.setItem(optionKey(day, category), optionId)
  }

  function clearOptionSelection(day, category) {
    localStorage.removeItem(optionKey(day, category))
  }

  function parseStoredPayload(raw) {
    if (!raw) return null
    const trimmed = raw.trim()
    if (!trimmed) return null
    if (trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (parsed && typeof parsed.value !== 'undefined') {
          return parsed
        }
      } catch (error) {
        console.warn('Unable to parse stored payload', error)
        return null
      }
    }
    const numeric = Number.parseFloat(trimmed)
    if (!Number.isFinite(numeric)) {
      return null
    }
    return { value: numeric }
  }

  function getWeightEntries() {
    return DAYS.map((day) => {
      const parsed = parseStoredPayload(localStorage.getItem(weightKey(day)))
      if (!parsed || typeof parsed.value !== 'number') {
        return null
      }
      return { day, value: parsed.value, ts: parsed.ts ?? null }
    }).filter(Boolean)
  }

  function getLatestWeightEntry() {
    const entries = getWeightEntries()
    if (!entries.length) return null
    const withTimestamps = entries.filter((entry) => entry.ts)
    if (withTimestamps.length) {
      return withTimestamps.sort((a, b) => b.ts - a.ts)[0]
    }
    return entries[entries.length - 1]
  }

  function formatTime(timestamp) {
    try {
      return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(timestamp))
    } catch (error) {
      return ''
    }
  }

  function formatRelative(timestamp) {
    const RELATIVE_FORMAT = typeof Intl.RelativeTimeFormat === 'undefined'
      ? null
      : new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

    if (!RELATIVE_FORMAT) {
      return 'recently'
    }
    const diffMs = timestamp - Date.now()
    const diffSeconds = Math.round(diffMs / 1000)
    const absSeconds = Math.abs(diffSeconds)
    if (absSeconds < 60) {
      return RELATIVE_FORMAT.format(Math.round(diffSeconds), 'second')
    }
    const diffMinutes = Math.round(diffSeconds / 60)
    if (Math.abs(diffMinutes) < 60) {
      return RELATIVE_FORMAT.format(diffMinutes, 'minute')
    }
    const diffHours = Math.round(diffMinutes / 60)
    if (Math.abs(diffHours) < 24) {
      return RELATIVE_FORMAT.format(diffHours, 'hour')
    }
    const diffDays = Math.round(diffHours / 24)
    return RELATIVE_FORMAT.format(diffDays, 'day')
  }

  function setDay(day) {
    selectedDay.value = day
    localStorage.setItem(LAST_DAY_KEY, day)
  }

  function resetDay(day) {
    CHECKBOX_IDS.forEach((id) => {
      localStorage.removeItem(storageKeyFor(day, id))
    })
    localStorage.removeItem(noteKey(day))
    const categories = ['cardio', 'kp', 'weights']
    categories.forEach((category) => clearOptionSelection(day, category))
  }

  function resetAll() {
    DAYS.forEach((day) => {
      CHECKBOX_IDS.forEach((id) => localStorage.removeItem(storageKeyFor(day, id)))
      localStorage.removeItem(noteKey(day))
      localStorage.removeItem(weightKey(day))
      const categories = ['cardio', 'kp', 'weights']
      categories.forEach((category) => clearOptionSelection(day, category))
    })
    localStorage.removeItem(LAST_DAY_KEY)
    selectedDay.value = getTodayDay()
  }

  return {
    selectedDay,
    todayDay,
    setDay,
    getDateForDay,
    storageKeyFor,
    optionKey,
    weightKey,
    noteKey,
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
  }
}
