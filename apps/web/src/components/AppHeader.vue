<template>
  <header
    class="z-10 flex h-14 shrink-0 items-center justify-between border-b px-5"
    :style="{
      background: 'var(--bg-elev)',
      borderColor: 'var(--border)',
    }"
  >
    <div class="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
      <div
        class="grid h-[26px] w-[26px] place-items-center rounded-[7px] text-[13px] font-bold text-white shadow-[var(--shadow-sm)]"
        style="background: linear-gradient(135deg, var(--accent), oklch(0.7 0.1 220))"
        aria-hidden="true"
      >
        m
      </div>
      <span :style="{ color: 'var(--fg)' }">mermaidly</span>
      <span
        class="ml-1 border-l pl-2.5 text-[13px] font-normal max-[640px]:hidden"
        :style="{ color: 'var(--fg-muted)', borderColor: 'var(--border)' }"
      >
        render mermaid, instantly
      </span>
    </div>
    <div class="flex items-center gap-1.5">
      <button class="btn btn-ghost" title="Help" aria-label="Help">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </button>
      <button
        class="btn btn-icon"
        title="Toggle theme"
        aria-label="Toggle theme"
        @click="toggle"
      >
        <svg
          v-if="theme === 'light'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { theme, toggle } = useTheme()
</script>
