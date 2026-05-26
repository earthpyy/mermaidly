<template>
  <section
    class="flex min-w-0 flex-col border-r max-[860px]:border-b max-[860px]:border-r-0"
    :style="{ background: 'var(--bg-elev)', borderColor: 'var(--border)' }"
    aria-label="Mermaid code editor"
  >
    <!-- Header -->
    <div
      class="flex h-11 shrink-0 items-center justify-between border-b px-4"
      :style="{ borderColor: 'var(--border)' }"
    >
      <div
        class="text-xs font-medium uppercase tracking-wide"
        :style="{ color: 'var(--fg-muted)' }"
      >
        Mermaid Code
      </div>
      <div class="flex gap-1">
        <button class="btn btn-ghost" title="Paste from clipboard" @click="pasteFromClipboard">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          </svg>
          Paste
        </button>
        <button
          class="btn btn-ghost btn-icon btn-danger-hover"
          title="Clear"
          :disabled="code.length === 0"
          @click="clear"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Editor -->
    <div class="relative min-h-0 flex-1">
      <textarea
        ref="textareaRef"
        v-model="code"
        spellcheck="false"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        placeholder="Paste your Mermaid code here…"
        class="h-full w-full resize-none border-none bg-transparent p-[18px_20px] text-[13px] leading-[1.65] outline-none"
        :style="{
          fontFamily: '\'Geist Mono\', ui-monospace, monospace',
          color: 'var(--fg)',
          tabSize: 2,
        }"
      />
      <!-- Empty state overlay -->
      <div
        v-if="code.length === 0"
        class="pointer-events-none absolute inset-0 flex flex-col items-center gap-4 px-5 pt-[60px] transition-opacity duration-200"
      >
        <h3 class="m-0 text-sm font-medium" :style="{ color: 'var(--fg)' }">
          Paste your Mermaid code
        </h3>
        <p class="m-0 max-w-[280px] text-center text-[13px]" :style="{ color: 'var(--fg-muted)' }">
          It'll render automatically. Or grab an example to get started.
        </p>
        <div class="pointer-events-auto flex flex-wrap justify-center gap-2">
          <button class="btn btn-primary" @click="pasteFromClipboard">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            </svg>
            Paste from clipboard
          </button>
          <button class="btn" @click="loadExample('flow')">Try an example</button>
        </div>
      </div>
    </div>

    <!-- Status bar -->
    <div
      class="flex h-7 shrink-0 items-center justify-between border-t px-4 text-[11px]"
      :style="{ borderColor: 'var(--border)', color: 'var(--fg-muted)' }"
    >
      <div class="flex items-center">
        <span
          class="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
          :style="{ background: statusDotColor }"
        />
        {{ statusText }}
      </div>
      <div :style="{ fontFamily: '\'Geist Mono\', monospace' }">{{ charCount }} chars</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEditor } from '@/composables/useEditor'

const props = defineProps<{
  status: 'idle' | 'rendering' | 'ok' | 'error'
}>()

const { code, charCount, pasteFromClipboard, loadExample, clear } = useEditor()
const textareaRef = ref<HTMLTextAreaElement>()

const statusText = computed(() => {
  switch (props.status) {
    case 'idle':
      return 'Ready'
    case 'rendering':
      return 'Rendering…'
    case 'ok':
      return 'Rendered'
    case 'error':
      return 'Syntax error'
  }
})

const statusDotColor = computed(() => {
  switch (props.status) {
    case 'error':
      return 'var(--danger)'
    case 'idle':
      return 'var(--fg-faint)'
    default:
      return 'var(--accent)'
  }
})

defineExpose({
  focus: () => textareaRef.value?.focus(),
  closeMenus: () => {},
})
</script>
