<template>
  <section class="card">
    <header class="section-header">
      <span class="section-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2h9A3.5 3.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H8.8a1.5 1.5 0 0 1-1.06-.44l-3.3-3.3A1.5 1.5 0 0 1 4 15.15Z"></path>
          <path d="M8 6h8"></path>
          <path d="M8 10h5"></path>
        </svg>
      </span>
      <div>
        <h2 class="section-title">Notes &amp; Wins</h2>
        <p class="section-subtitle">Reflect &amp; prep for tomorrow</p>
      </div>
    </header>
    <textarea
      :value="notes"
      rows="4"
      placeholder="How did today feel? Any soreness, wins, or reminders for tomorrow?"
      @input="$emit('update:notes', $event.target.value)"
    ></textarea>
    <div class="controls controls--compact">
      <button type="button" @click="$emit('save')">Save Notes</button>
      <button type="button" class="secondary" @click="$emit('clear')">Clear</button>
    </div>
    <p class="sub">{{ status }}</p>
  </section>
</template>

<script setup>
defineProps({
  notes: String,
  status: String
})

defineEmits(['update:notes', 'save', 'clear'])
</script>
