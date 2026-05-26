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
        class="flex items-center justify-center gap-1 border-t px-5 py-3 text-[11px]"
        :style="{ borderColor: 'var(--border)', color: 'var(--fg-faint)' }"
      >
        Built by
        <a
          href="https://github.com/earthpyy"
          target="_blank"
          rel="noopener noreferrer"
          class="underline decoration-current/30 underline-offset-2 transition-colors hover:decoration-current/60"
          :style="{ color: 'var(--fg-muted)' }"
          >earthpyy</a
        >
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
