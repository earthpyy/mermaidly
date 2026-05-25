<template>
  <div class="menu-wrap">
    <button class="btn btn-ghost" title="Load example" @click.stop="open = !open">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      Examples
    </button>
    <div class="menu" :class="{ open }" role="menu">
      <button
        v-for="item in items"
        :key="item.key"
        role="menuitem"
        @click="select(item.key)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const items = [
  { key: 'flow', label: 'Flowchart' },
  { key: 'seq', label: 'Sequence' },
  { key: 'class', label: 'Class diagram' },
  { key: 'state', label: 'State diagram' },
  { key: 'er', label: 'ER diagram' },
  { key: 'gantt', label: 'Gantt chart' },
  { key: 'pie', label: 'Pie chart' },
  { key: 'mind', label: 'Mindmap' },
]

const open = ref(false)

const emit = defineEmits<{
  select: [key: string]
}>()

function select(key: string) {
  emit('select', key)
  open.value = false
}

defineExpose({ close: () => (open.value = false) })
</script>
