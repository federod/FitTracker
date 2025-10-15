<template>
  <section class="card">
    <header class="section-header">
      <span class="section-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19h16"></path>
          <path d="M7 16l3.5-4.5 3 3L20 6"></path>
          <path d="M18 6h3v3"></path>
        </svg>
      </span>
      <div>
        <h2 class="section-title">Progress</h2>
        <p class="section-subtitle">Weight trend overview</p>
      </div>
    </header>
    <canvas ref="chartCanvas" width="820" height="180"></canvas>
    <p class="sub">{{ trendText }}</p>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { DAY_NAMES } from '../data'

const props = defineProps({
  entries: Array
})

const chartCanvas = ref(null)
const trendText = ref('')

onMounted(() => {
  drawChart()
})

watch(() => props.entries, () => {
  drawChart()
}, { deep: true })

function drawChart() {
  if (!chartCanvas.value) return

  const canvas = chartCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const dpr = window.devicePixelRatio || 1

  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr
    canvas.height = height * dpr
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.scale(dpr, dpr)

  const entries = props.entries || []

  if (!entries.length) {
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)'
    ctx.font = '16px system-ui, -apple-system, Segoe UI, sans-serif'
    ctx.fillText('Log a weight to see your weekly trend.', 22, height / 2)
    trendText.value = 'Log a weight to see your weekly trend.'
    return
  }

  const padding = 36
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  const minVal = Math.min(...entries.map((entry) => entry.value))
  const maxVal = Math.max(...entries.map((entry) => entry.value))
  const range = Math.max(maxVal - minVal, 1)
  const step = entries.length > 1 ? chartWidth / (entries.length - 1) : 0
  const points = entries.map((entry, index) => ({
    x: padding + step * index,
    y: padding + chartHeight - ((entry.value - minVal) / range) * chartHeight,
    day: entry.day,
    value: entry.value,
  }))

  // Grid line
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)'
  ctx.lineWidth = 1
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.moveTo(padding, padding + chartHeight / 2)
  ctx.lineTo(width - padding, padding + chartHeight / 2)
  ctx.stroke()
  ctx.setLineDash([])

  // Area fill
  ctx.fillStyle = 'rgba(96, 165, 250, 0.18)'
  ctx.beginPath()
  ctx.moveTo(points[0].x, height - padding)
  points.forEach((point) => {
    ctx.lineTo(point.x, point.y)
  })
  ctx.lineTo(points[points.length - 1].x, height - padding)
  ctx.closePath()
  ctx.fill()

  // Line
  ctx.strokeStyle = 'rgba(96, 165, 250, 0.95)'
  ctx.lineWidth = 2
  ctx.beginPath()
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  })
  ctx.stroke()

  // Points
  ctx.fillStyle = 'rgba(56, 189, 248, 0.95)'
  points.forEach((point) => {
    ctx.beginPath()
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
    ctx.fill()
  })

  trendText.value = buildTrendCopy(entries)
}

function buildTrendCopy(entries) {
  if (!entries.length) {
    return 'Log a weight to see your weekly trend.'
  }
  if (entries.length === 1) {
    const entry = entries[0]
    return `Latest weigh-in: ${entry.value.toFixed(1)} lbs on ${DAY_NAMES[entry.day]}.`
  }
  const first = entries[0]
  const last = entries[entries.length - 1]
  const min = entries.reduce((acc, entry) => (entry.value < acc.value ? entry : acc), entries[0])
  const max = entries.reduce((acc, entry) => (entry.value > acc.value ? entry : acc), entries[0])
  const delta = last.value - first.value
  const sign = delta >= 0 ? '+' : ''
  return `${DAY_NAMES[first.day]} → ${DAY_NAMES[last.day]}: ${sign}${delta.toFixed(1)} lbs. Range: ${min.value.toFixed(1)} – ${max.value.toFixed(1)} lbs.`
}
</script>
