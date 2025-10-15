<template>
  <div class="tabs" role="tablist" aria-label="Choose day">
    <button
      v-for="day in DAYS"
      :key="day"
      type="button"
      class="tab"
      :class="{
        active: day === selectedDay,
        complete: progress[day]?.percent === 100 && progress[day]?.total > 0
      }"
      :data-day="day"
      :data-today="day === todayDay ? 'true' : undefined"
      :aria-pressed="day === selectedDay ? 'true' : 'false'"
      :title="day === todayDay ? 'Today' : undefined"
      @click="$emit('select-day', day)"
    >
      <span>{{ day }}</span>
      <span class="tab-meta" :aria-hidden="progress[day]?.total ? 'false' : 'true'">
        {{ progress[day]?.total ? `${progress[day].percent}%` : '—' }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { DAYS } from '../data'

defineProps({
  selectedDay: String,
  todayDay: String,
  progress: Object
})

defineEmits(['select-day'])
</script>
