<template>
  <section v-if="shouldShow" class="card" :id="`${category}Card`">
    <header class="section-header">
      <span class="section-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <template v-if="category === 'cardio'">
            <path d="m6 12 2.5 2.5L11 11l2 5 2-4 2 2.5"></path>
            <path d="M4 6.5c1.8-2.2 4.4-3.5 8-3.5s6.2 1.3 8 3.5"></path>
          </template>
          <template v-else-if="category === 'kp'">
            <path d="M6.5 20 15 4"></path>
            <path d="m9 4 8.5 16"></path>
            <path d="M4 13h6"></path>
            <path d="M14 11h6"></path>
          </template>
          <template v-else-if="category === 'weights'">
            <path d="M4 9v6"></path>
            <path d="M20 9v6"></path>
            <path d="M7 5v14"></path>
            <path d="M17 5v14"></path>
            <rect x="9" y="9" width="6" height="6" rx="1"></rect>
          </template>
        </svg>
      </span>
      <div>
        <h2 class="section-title">{{ title }}</h2>
        <p class="section-subtitle">{{ subtitle }}</p>
      </div>
    </header>
    <p v-if="planText" class="plan-text">{{ planText }}</p>
    <div class="option-pills" :aria-label="`${category} options`">
      <button
        v-for="option in options"
        :key="option.id"
        type="button"
        class="pill"
        :class="{
          'pill--recommended': recommended.includes(option.id),
          'pill--selected': selectedOption === option.id
        }"
        :aria-pressed="selectedOption === option.id ? 'true' : 'false'"
        :title="getPillTitle(option, recommended)"
        @click="toggleOption(option.id)"
      >
        {{ option.label }}
      </button>
    </div>
    <p v-if="choiceText" class="plan-choice" v-html="choiceText"></p>
    <label class="row">
      <input
        type="checkbox"
        :checked="completed"
        :disabled="!shouldShow"
        @change="$emit('toggle-complete', $event.target.checked)"
      />
      <span class="label">{{ taskLabel }}</span>
    </label>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { WORKOUT_OPTIONS, TASK_LABEL_COPY } from '../data'

const props = defineProps({
  category: String,
  title: String,
  subtitle: String,
  planConfig: Object,
  selectedOption: String,
  completed: Boolean,
  alwaysVisible: Boolean
})

const emit = defineEmits(['toggle-complete', 'select-option', 'clear-option'])

const shouldShow = computed(() => {
  return Boolean(props.planConfig) || props.alwaysVisible
})

const planText = computed(() => {
  if (!props.planConfig) return ''
  return props.planConfig.label
    ? `Focus: ${props.planConfig.label}`
    : 'Focus: Choose what feels right today.'
})

const options = computed(() => WORKOUT_OPTIONS[props.category] || [])

const recommended = computed(() => props.planConfig?.recommended || [])

const taskLabel = computed(() => TASK_LABEL_COPY[props.category] || 'Mark complete')

const choiceText = computed(() => {
  if (!props.planConfig) return ''

  if (props.selectedOption) {
    const option = options.value.find(o => o.id === props.selectedOption)
    return option
      ? `Logged: <strong>${option.label}</strong>`
      : 'Logged: (option not found)'
  }

  if (recommended.value.length) {
    const recLabels = recommended.value
      .map(id => options.value.find(o => o.id === id))
      .filter(Boolean)
      .map(opt => opt.label)

    if (recLabels.length) {
      const strongCopy = recLabels.map(label => `<strong>${label}</strong>`).join(' • ')
      return `Recommended: ${strongCopy}. Tap a chip to log what you chose.`
    }
    return 'Recommended picks are highlighted in blue. Tap a chip to log what you chose.'
  }

  return 'Tap a chip to log what you chose today.'
})

function getPillTitle(option, recommended) {
  let title = ''
  if (recommended.includes(option.id)) {
    title = 'Recommended today'
  }
  if (props.selectedOption === option.id) {
    title = title ? `${title} • Selected` : 'Selected'
  }
  return title
}

function toggleOption(optionId) {
  if (props.selectedOption === optionId) {
    emit('clear-option')
  } else {
    emit('select-option', optionId)
  }
}
</script>
