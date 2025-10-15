<template>
  <section class="card card--summary">
    <header class="section-header">
      <span class="section-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      </span>
      <div>
        <h2 class="section-title">Daily Progress</h2>
        <p class="section-subtitle">Keep stacking wins</p>
      </div>
    </header>
    <div class="summary-body">
      <div class="summary-hero" aria-hidden="true">
        <span class="summary-hero__value" :class="{ 'summary-hero__value--pulse': pulse }">
          {{ progress.total ? `${progress.percent}%` : '—' }}
        </span>
        <span class="summary-hero__label">Complete</span>
      </div>
      <div class="summary-meter">
        <div
          class="meter-bar"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="progress.percent"
          :aria-valuetext="progress.total ? `${progress.percent}% complete` : 'No tasks scheduled'"
        >
          <div class="meter-fill" :class="{ 'meter-fill--pulse': pulse }" :style="{ width: progress.total ? `${progress.percent}%` : '0%' }"></div>
        </div>
        <div class="meter-copy">
          <span class="meter-count">
            {{ progress.total ? `${progress.completed}/${progress.total} complete` : 'No tasks scheduled' }}
          </span>
          <span class="meter-percent">{{ progress.total ? `${progress.percent}%` : '—' }}</span>
        </div>
      </div>
    </div>
    <div class="summary-grid" aria-live="polite">
      <template v-if="summaryItems.length">
        <div
          v-for="item in summaryItems"
          :key="item.label"
          class="summary-item"
          :class="{ complete: item.total && item.completed === item.total }"
        >
          <span class="summary-item__label">{{ item.label }}</span>
          <span class="summary-item__value">{{ item.completed }}/{{ item.total }}</span>
        </div>
      </template>
      <div v-else class="summary-item">
        Nothing scheduled for this day. Enjoy the rest!
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  progress: Object,
  summaryItems: Array
})

const pulse = ref(false)

watch(() => props.progress.percent, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    pulse.value = true
    setTimeout(() => {
      pulse.value = false
    }, 450)
  }
})
</script>
