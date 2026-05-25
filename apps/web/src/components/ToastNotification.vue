<template>
  <div
    role="status"
    aria-live="polite"
    class="pointer-events-none fixed bottom-6 left-1/2 z-[2000] flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium opacity-0 shadow-[var(--shadow-lg)] transition-all duration-200"
    :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-5'"
    :style="{ background: 'var(--fg)', color: 'var(--bg)' }"
  >
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
    <span>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { message, visible } = useToast()
</script>
