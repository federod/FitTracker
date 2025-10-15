<template>
  <section class="card">
    <header class="section-header">
      <span class="section-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20"></path>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      </span>
      <div>
        <h2 class="section-title">Daily Calorie Tracker</h2>
        <p class="section-subtitle">Track your meals and stay on target</p>
      </div>
    </header>

    <div v-if="dailyTarget" class="calorie-progress">
      <div class="calorie-progress-header">
        <div class="calorie-big">
          <span class="calorie-big__value">{{ consumed }}</span>
          <span class="calorie-big__label">/ {{ dailyTarget }} cal</span>
        </div>
        <div class="calorie-remaining" :class="{ 'calorie-remaining--over': remaining < 0 }">
          <span class="calorie-remaining__value">{{ Math.abs(remaining) }}</span>
          <span class="calorie-remaining__label">{{ remaining >= 0 ? 'Remaining' : 'Over' }}</span>
        </div>
      </div>

      <div class="meter-bar">
        <div
          class="meter-fill"
          :class="{ 'meter-fill--over': consumed > dailyTarget }"
          :style="{ width: `${Math.min((consumed / dailyTarget) * 100, 100)}%` }"
        ></div>
      </div>

      <div class="macros-grid">
        <div class="macro-stat">
          <span class="macro-stat__label">Protein</span>
          <span class="macro-stat__value">{{ totalMacros.protein }}g</span>
        </div>
        <div class="macro-stat">
          <span class="macro-stat__label">Carbs</span>
          <span class="macro-stat__value">{{ totalMacros.carbs }}g</span>
        </div>
        <div class="macro-stat">
          <span class="macro-stat__label">Fat</span>
          <span class="macro-stat__value">{{ totalMacros.fat }}g</span>
        </div>
      </div>
    </div>

    <div v-else class="calorie-setup-prompt">
      <p>Set up your calorie calculator settings above to start tracking.</p>
    </div>

    <div class="meal-form">
      <h3 class="meal-form__title">Add Meal / Food</h3>
      <div class="meal-form__grid">
        <div class="input-group input-group--span-2">
          <label class="input-label">Food Name</label>
          <input
            v-model="newMeal.name"
            type="text"
            placeholder="e.g., Chicken breast"
            @keydown.enter="addMeal"
          />
        </div>
        <div class="input-group">
          <label class="input-label">Calories</label>
          <input
            v-model.number="newMeal.calories"
            type="number"
            placeholder="0"
            @keydown.enter="addMeal"
          />
        </div>
        <div class="input-group">
          <label class="input-label">Protein (g)</label>
          <input
            v-model.number="newMeal.protein"
            type="number"
            step="0.1"
            placeholder="0"
            @keydown.enter="addMeal"
          />
        </div>
        <div class="input-group">
          <label class="input-label">Carbs (g)</label>
          <input
            v-model.number="newMeal.carbs"
            type="number"
            step="0.1"
            placeholder="0"
            @keydown.enter="addMeal"
          />
        </div>
        <div class="input-group">
          <label class="input-label">Fat (g)</label>
          <input
            v-model.number="newMeal.fat"
            type="number"
            step="0.1"
            placeholder="0"
            @keydown.enter="addMeal"
          />
        </div>
      </div>
      <div class="controls controls--compact">
        <button type="button" @click="addMeal">Add Food</button>
        <button type="button" class="secondary" @click="clearForm">Clear Form</button>
      </div>
    </div>

    <div v-if="meals.length" class="meals-list">
      <h3 class="meals-list__title">Today's Meals</h3>
      <div
        v-for="(meal, index) in meals"
        :key="index"
        class="meal-item"
      >
        <div class="meal-item__info">
          <span class="meal-item__name">{{ meal.name }}</span>
          <span class="meal-item__details">
            {{ meal.calories }} cal • P: {{ meal.protein }}g • C: {{ meal.carbs }}g • F: {{ meal.fat }}g
          </span>
        </div>
        <button
          type="button"
          class="meal-item__delete"
          @click="$emit('delete-meal', index)"
          title="Delete meal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  meals: Array,
  dailyTarget: Number
})

const emit = defineEmits(['add-meal', 'delete-meal'])

const newMeal = ref({
  name: '',
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0
})

const consumed = computed(() => {
  return props.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0)
})

const remaining = computed(() => {
  return props.dailyTarget - consumed.value
})

const totalMacros = computed(() => {
  return props.meals.reduce((totals, meal) => ({
    protein: totals.protein + (meal.protein || 0),
    carbs: totals.carbs + (meal.carbs || 0),
    fat: totals.fat + (meal.fat || 0)
  }), { protein: 0, carbs: 0, fat: 0 })
})

function addMeal() {
  if (!newMeal.value.name || !newMeal.value.calories) {
    alert('Please enter at least a food name and calories.')
    return
  }

  emit('add-meal', { ...newMeal.value })
  clearForm()
}

function clearForm() {
  newMeal.value = {
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  }
}
</script>

<style scoped>
.calorie-progress {
  padding: 20px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(15, 23, 42, 0.8));
  border: 1px solid rgba(96, 165, 250, 0.3);
  margin-bottom: 20px;
}

.calorie-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
}

.calorie-big {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.calorie-big__value {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--sky);
  letter-spacing: -0.03em;
}

.calorie-big__label {
  font-size: 1.1rem;
  color: rgba(226, 232, 240, 0.7);
}

.calorie-remaining {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.calorie-remaining__value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--good);
  letter-spacing: -0.02em;
}

.calorie-remaining--over .calorie-remaining__value {
  color: var(--danger);
}

.calorie-remaining__label {
  font-size: 0.85rem;
  color: rgba(226, 232, 240, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.meter-bar {
  margin-bottom: 16px;
}

.meter-fill--over {
  background: linear-gradient(135deg, var(--danger), #ef4444);
}

.macros-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.macro-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.macro-stat__label {
  font-size: 0.8rem;
  color: rgba(226, 232, 240, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.macro-stat__value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
}

.calorie-setup-prompt {
  padding: 20px;
  text-align: center;
  color: var(--muted);
  border: 1px dashed rgba(148, 163, 184, 0.3);
  border-radius: 12px;
  margin-bottom: 20px;
}

.meal-form {
  margin-bottom: 20px;
  padding: 18px;
  border-radius: 14px;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.meal-form__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 14px 0;
}

.meal-form__grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  margin-bottom: 12px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group--span-2 {
  grid-column: span 2;
}

.input-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
}

.input-group input {
  width: 100%;
  padding: 9px 11px;
  border-radius: 9px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: #0b1220;
  color: var(--text);
  font-size: 0.92rem;
}

.meals-list {
  margin-top: 20px;
}

.meals-list__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 12px 0;
}

.meal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  margin-bottom: 8px;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.meal-item:hover {
  border-color: rgba(96, 165, 250, 0.35);
  background: rgba(30, 41, 59, 0.6);
}

.meal-item__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.meal-item__name {
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--text);
}

.meal-item__details {
  font-size: 0.82rem;
  color: var(--muted);
}

.meal-item__delete {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  background: rgba(248, 113, 113, 0.15);
  color: var(--danger);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
}

.meal-item__delete:hover {
  background: rgba(248, 113, 113, 0.25);
  transform: scale(1.05);
}

.meal-item__delete svg {
  width: 16px;
  height: 16px;
}

@media (max-width: 640px) {
  .meal-form__grid {
    grid-template-columns: 1fr;
  }

  .input-group--span-2 {
    grid-column: span 1;
  }

  .calorie-progress-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .calorie-remaining {
    align-items: flex-start;
  }
}
</style>
