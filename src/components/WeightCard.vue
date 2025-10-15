<template>
  <section class="card">
    <header class="section-header">
      <span class="section-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="3" width="16" height="18" rx="3"></rect>
          <path d="M12 7v4"></path>
          <circle cx="12" cy="14" r="2.3"></circle>
        </svg>
      </span>
      <div>
        <h2 class="section-title">Friday Weigh-In</h2>
        <p class="section-subtitle">Log once a week</p>
      </div>
    </header>
    <input
      type="number"
      step="0.1"
      :value="weight"
      placeholder="Enter weight (lbs)"
      @input="$emit('update:weight', $event.target.value)"
      @keydown.enter="$emit('save')"
    />
    <div class="controls controls--compact">
      <button type="button" @click="$emit('save')">Save</button>
      <button type="button" class="secondary" @click="$emit('delete')">Delete</button>
    </div>
    <p class="sub">{{ lastWeighIn }}</p>
  </section>
</template>

<script setup>
defineProps({
  weight: [String, Number],
  lastWeighIn: String
})

defineEmits(['update:weight', 'save', 'delete'])
</script>
