<template>
  <div class="menu-wrap">
    <button class="btn btn-primary" :disabled="disabled" @click.stop="open = !open">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Save
    </button>
    <div class="menu" :class="{ open }" role="menu">
      <button role="menuitem" @click="select('png')">
        PNG image <span class="kbd">.png</span>
      </button>
      <button role="menuitem" @click="select('png2x')">
        PNG (2× retina) <span class="kbd">.png</span>
      </button>
      <button role="menuitem" @click="select('svg')">
        SVG vector <span class="kbd">.svg</span>
      </button>
      <button role="menuitem" @click="select('copy-svg')">Copy SVG code</button>
      <button role="menuitem" @click="select('copy-img')">Copy as image</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  disabled: boolean
}>()

const open = ref(false)

const emit = defineEmits<{
  select: [format: string]
}>()

function select(format: string) {
  emit('select', format)
  open.value = false
}

defineExpose({ close: () => (open.value = false) })
</script>
