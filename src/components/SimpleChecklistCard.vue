<template>
  <section class="card" :id="cardId">
    <header class="section-header">
      <span class="section-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <slot name="icon"></slot>
        </svg>
      </span>
      <div>
        <h2 class="section-title">{{ title }}</h2>
        <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
      </div>
    </header>
    <label
      v-for="item in items"
      :key="item.id"
      class="row"
      :class="{ 'row--complete': item.checked && !item.disabled }"
    >
      <input
        type="checkbox"
        :checked="item.checked"
        :disabled="item.disabled"
        @change="$emit('toggle', item.id, $event.target.checked)"
      />
      <span class="label">{{ item.label }}</span>
    </label>
  </section>
</template>

<script setup>
defineProps({
  cardId: String,
  title: String,
  subtitle: String,
  items: Array
})

defineEmits(['toggle'])
</script>
