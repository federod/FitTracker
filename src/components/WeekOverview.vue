<template>
  <section class="card">
    <header class="section-header">
      <span class="section-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7.5 3v3"></path>
          <path d="M16.5 3v3"></path>
          <rect x="3.75" y="5.25" width="16.5" height="15" rx="2"></rect>
          <path d="M3.75 9.75h16.5"></path>
        </svg>
      </span>
      <div>
        <h2 class="section-title">Week at a Glance</h2>
        <p class="section-subtitle">Tap any day to jump</p>
      </div>
    </header>
    <div class="week-grid" aria-live="polite">
      <div
        v-for="day in DAYS"
        :key="day"
        class="week-day"
        :class="{
          active: day === selectedDay,
          complete: progress[day]?.percent === 100 && progress[day]?.total > 0
        }"
        :data-day="day"
        tabindex="0"
        role="button"
        @click="$emit('select-day', day)"
        @keydown="handleKeydown($event, day)"
      >
        <span class="week-day__label">
          {{ day === todayDay ? `${day} • Today` : day }}
        </span>
        <span class="week-day__percent">
          {{ progress[day]?.total ? `${progress[day].percent}% complete` : 'No data yet' }}
        </span>
        <span class="week-day__counts">
          {{ progress[day]?.total ? `${progress[day].completed}/${progress[day].total} tasks` : '' }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { DAYS } from '../data'

defineProps({
  selectedDay: String,
  todayDay: String,
  progress: Object
})

const emit = defineEmits(['select-day'])

function handleKeydown(event, day) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('select-day', day)
  }
}
</script>
