<template>
  <section class="card">
    <header class="section-header">
      <span class="section-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6v6l4 2"></path>
        </svg>
      </span>
      <div>
        <h2 class="section-title">Calorie Calculator Settings</h2>
        <p class="section-subtitle">Set your profile for accurate calorie tracking</p>
      </div>
    </header>

    <div class="settings-grid">
      <div class="input-group">
        <label class="input-label">Height (inches)</label>
        <input
          type="number"
          step="0.5"
          :value="settings.height"
          placeholder="e.g., 70"
          @input="updateSetting('height', $event.target.value)"
        />
      </div>

      <div class="input-group">
        <label class="input-label">Age (years)</label>
        <input
          type="number"
          :value="settings.age"
          placeholder="e.g., 30"
          @input="updateSetting('age', $event.target.value)"
        />
      </div>

      <div class="input-group">
        <label class="input-label">Sex</label>
        <select :value="settings.sex" @change="updateSetting('sex', $event.target.value)">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div class="input-group">
        <label class="input-label">Activity Level</label>
        <select :value="settings.activityLevel" @change="updateSetting('activityLevel', $event.target.value)">
          <option value="1.2">Sedentary (little to no exercise)</option>
          <option value="1.375">Lightly Active (1-3 days/week)</option>
          <option value="1.55">Moderately Active (3-5 days/week)</option>
          <option value="1.725">Very Active (6-7 days/week)</option>
          <option value="1.9">Extremely Active (2x per day)</option>
        </select>
      </div>

      <div class="input-group">
        <label class="input-label">Goal</label>
        <select :value="settings.goal" @change="updateSetting('goal', $event.target.value)">
          <option value="lose">Lose Weight (-500 cal/day)</option>
          <option value="maintain">Maintain Weight</option>
          <option value="gain">Gain Weight (+500 cal/day)</option>
        </select>
      </div>
    </div>

    <div v-if="calorieData.bmr" class="calorie-summary">
      <div class="calorie-stat">
        <span class="calorie-stat__label">BMR (Basal Metabolic Rate)</span>
        <span class="calorie-stat__value">{{ calorieData.bmr }} cal</span>
      </div>
      <div class="calorie-stat">
        <span class="calorie-stat__label">TDEE (Total Daily Energy)</span>
        <span class="calorie-stat__value">{{ calorieData.tdee }} cal</span>
      </div>
      <div class="calorie-stat calorie-stat--highlight">
        <span class="calorie-stat__label">Daily Target</span>
        <span class="calorie-stat__value">{{ calorieData.target }} cal</span>
      </div>
    </div>

    <div class="controls controls--compact">
      <button type="button" @click="$emit('save')">Save Settings</button>
      <button type="button" class="secondary" @click="$emit('reset')">Reset</button>
    </div>
    <p class="sub">{{ status }}</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  settings: Object,
  currentWeight: Number,
  status: String
})

const emit = defineEmits(['update-setting', 'save', 'reset'])

const calorieData = computed(() => {
  const { height, age, sex, activityLevel, goal } = props.settings
  const weight = props.currentWeight

  if (!height || !age || !weight) {
    return { bmr: null, tdee: null, target: null }
  }

  // Mifflin-St Jeor Equation for BMR
  let bmr
  if (sex === 'male') {
    // BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
    bmr = (10 * weight * 0.453592) + (6.25 * height * 2.54) - (5 * age) + 5
  } else {
    // BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161
    bmr = (10 * weight * 0.453592) + (6.25 * height * 2.54) - (5 * age) - 161
  }

  bmr = Math.round(bmr)

  // Calculate TDEE (Total Daily Energy Expenditure)
  const tdee = Math.round(bmr * parseFloat(activityLevel))

  // Calculate target based on goal
  let target = tdee
  if (goal === 'lose') {
    target = tdee - 500
  } else if (goal === 'gain') {
    target = tdee + 500
  }

  return { bmr, tdee, target }
})

function updateSetting(key, value) {
  emit('update-setting', key, value)
}
</script>

<style scoped>
.settings-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.01em;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: #0b1220;
  color: var(--text);
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.25);
}

.input-group select {
  cursor: pointer;
}

.calorie-summary {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 14px;
  background: rgba(37, 99, 235, 0.12);
  border: 1px solid rgba(96, 165, 250, 0.3);
}

.calorie-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.calorie-stat__label {
  font-size: 0.82rem;
  color: rgba(226, 232, 240, 0.75);
  letter-spacing: 0.01em;
}

.calorie-stat__value {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--sky);
  letter-spacing: -0.02em;
}

.calorie-stat--highlight .calorie-stat__value {
  font-size: 1.5rem;
  color: #bbf7d0;
}
</style>
