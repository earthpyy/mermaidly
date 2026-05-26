<template>
  <div
    class="modal-backdrop"
    :class="{ open: isOpen }"
    role="dialog"
    aria-modal="true"
    aria-labelledby="help-title"
    @click.self="close"
  >
    <div class="modal-card">
      <div
        class="flex items-center justify-between border-b px-5 pb-3.5 pt-[18px]"
        :style="{ borderColor: 'var(--border)' }"
      >
        <h2 id="help-title" class="m-0 text-[15px] font-semibold tracking-tight">
          About mermaidly
        </h2>
        <button class="btn btn-ghost btn-icon" aria-label="Close" @click="close">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      <div class="flex flex-col gap-5 px-5 py-[18px]">
        <p class="m-0 text-[13px] leading-relaxed" :style="{ color: 'var(--fg-muted)' }">
          A fast, minimal tool for rendering
          <a
            href="https://mermaid.js.org"
            target="_blank"
            rel="noopener noreferrer"
            :style="{ color: 'var(--accent)' }"
            >Mermaid</a
          >
          diagrams. Paste your code, see the result instantly — no setup needed.
        </p>

        <!-- How to use -->
        <div>
          <h3
            class="mb-2 text-[11px] font-semibold uppercase tracking-wider"
            :style="{ color: 'var(--fg-muted)' }"
          >
            How to use
          </h3>
          <ul
            class="m-0 flex list-none flex-col gap-1.5 p-0 text-[13px]"
            :style="{ color: 'var(--fg)' }"
          >
            <li class="flex items-start gap-2">
              <span class="mt-px shrink-0" :style="{ color: 'var(--fg-faint)' }">1.</span>
              Paste or type Mermaid code in the editor panel
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-px shrink-0" :style="{ color: 'var(--fg-faint)' }">2.</span>
              The diagram renders automatically as you type
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-px shrink-0" :style="{ color: 'var(--fg-faint)' }">3.</span>
              Export as PNG/SVG, or share a link with others
            </li>
          </ul>
        </div>

        <!-- Keyboard shortcuts -->
        <div>
          <h3
            class="mb-2 text-[11px] font-semibold uppercase tracking-wider"
            :style="{ color: 'var(--fg-muted)' }"
          >
            Keyboard shortcuts
          </h3>
          <div class="flex flex-col gap-1">
            <div
              v-for="shortcut in shortcuts"
              :key="shortcut.label"
              class="flex items-center justify-between rounded-[var(--radius-sm)] px-2.5 py-[6px]"
              :style="{ background: 'var(--bg-sunken)' }"
            >
              <span class="text-[13px]" :style="{ color: 'var(--fg)' }">{{ shortcut.label }}</span>
              <kbd
                class="rounded-[4px] border px-[6px] py-[2px] text-[11px]"
                :style="{
                  fontFamily: '\'Geist Mono\', monospace',
                  background: 'var(--bg-elev)',
                  borderColor: 'var(--border)',
                  color: 'var(--fg-muted)',
                }"
              >
                {{ shortcut.keys }}
              </kbd>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div>
          <h3
            class="mb-2 text-[11px] font-semibold uppercase tracking-wider"
            :style="{ color: 'var(--fg-muted)' }"
          >
            Tips
          </h3>
          <ul
            class="m-0 flex list-none flex-col gap-1.5 p-0 text-[13px]"
            :style="{ color: 'var(--fg-muted)' }"
          >
            <li>⌘ + Scroll to zoom in/out on the diagram</li>
            <li>Click and drag to pan around</li>
            <li>Use "View only" links to share read-only diagrams</li>
          </ul>
        </div>
      </div>
      <div
        class="border-t px-5 py-3 text-center text-[11px]"
        :style="{ borderColor: 'var(--border)', color: 'var(--fg-faint)' }"
      >
        <p class="m-0 mb-2">
          This site is not affiliated with or endorsed by the
          <a
            href="https://mermaid.js.org"
            target="_blank"
            rel="noopener noreferrer"
            class="underline decoration-current/30 underline-offset-2 transition-colors hover:decoration-current/60"
            :style="{ color: 'var(--fg-muted)' }"
            >Mermaid</a
          >
          project.
        </p>
        <div class="flex items-center justify-center gap-1">
        Built by
        <a
          href="https://github.com/earthpyy"
          target="_blank"
          rel="noopener noreferrer"
          class="underline decoration-current/30 underline-offset-2 transition-colors hover:decoration-current/60"
          :style="{ color: 'var(--fg-muted)' }"
          >earthpyy</a
        >
        +
        <a
          href="https://claude.ai/code"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 underline decoration-current/30 underline-offset-2 transition-colors hover:decoration-current/60"
          :style="{ color: 'var(--fg-muted)' }"
          title="Claude Code"
        >
          <svg width="14" height="14" viewBox="0 0 100 100" fill="hsl(14.8, 63.1%, 59.6%)">
            <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
          </svg>
          Claude Code
        </a>
        &middot;
        <a
          href="https://github.com/earthpyy/mermaidly"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 underline decoration-current/30 underline-offset-2 transition-colors hover:decoration-current/60"
          :style="{ color: 'var(--fg-muted)' }"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          GitHub
        </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHelp } from '@/composables/useHelp'

const { isOpen, close } = useHelp()

const isMac = computed(() => navigator.platform.toUpperCase().includes('MAC'))
const mod = computed(() => (isMac.value ? '⌘' : 'Ctrl'))

const shortcuts = computed(() => [
  { label: 'Save as PNG', keys: `${mod.value} + S` },
  { label: 'Share diagram', keys: `${mod.value} + Shift + C` },
  { label: 'Close modal / menu', keys: 'Esc' },
])
</script>
