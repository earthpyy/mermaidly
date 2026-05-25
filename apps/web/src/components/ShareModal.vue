<template>
  <div
    class="modal-backdrop"
    :class="{ open: isOpen }"
    role="dialog"
    aria-modal="true"
    aria-labelledby="share-title"
    @click.self="close"
  >
    <div class="modal-card">
      <div
        class="flex items-center justify-between border-b px-5 pb-3.5 pt-[18px]"
        :style="{ borderColor: 'var(--border)' }"
      >
        <h2 id="share-title" class="m-0 text-[15px] font-semibold tracking-tight">Share diagram</h2>
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
      <div class="flex flex-col gap-4 px-5 py-[18px]">
        <!-- Link type toggle -->
        <div>
          <label class="mb-1.5 block text-xs font-medium" :style="{ color: 'var(--fg-muted)' }">
            Link type
          </label>
          <div
            class="flex gap-0.5 rounded-[var(--radius-sm)] border p-[3px]"
            :style="{ background: 'var(--bg-sunken)', borderColor: 'var(--border)' }"
            role="radiogroup"
          >
            <label
              v-for="opt in typeOptions"
              :key="opt.value"
              class="flex-1 cursor-pointer rounded-[5px] py-[7px] text-center text-xs font-medium transition-all duration-100"
              :style="
                shareType === opt.value
                  ? {
                      background: 'var(--bg-elev)',
                      color: 'var(--fg)',
                      boxShadow: 'var(--shadow-sm)',
                    }
                  : { color: 'var(--fg-muted)' }
              "
            >
              <input
                v-model="shareType"
                type="radio"
                name="shareType"
                :value="opt.value"
                class="hidden"
              />
              {{ opt.label }}
            </label>
          </div>
        </div>

        <!-- Link field -->
        <div>
          <label class="mb-1.5 block text-xs font-medium" :style="{ color: 'var(--fg-muted)' }">
            {{ shareLinkLabel }}
          </label>
          <div class="flex gap-1.5">
            <input
              ref="linkInputRef"
              type="text"
              :value="shareUrl"
              readonly
              class="h-9 min-w-0 flex-1 rounded-[var(--radius-sm)] border px-2.5 text-xs outline-none"
              :style="{
                fontFamily: '\'Geist Mono\', monospace',
                background: 'var(--bg-sunken)',
                borderColor: 'var(--border)',
                color: 'var(--fg)',
              }"
              @click="($event.target as HTMLInputElement).select()"
              @focus="($event.target as HTMLInputElement).select()"
            />
            <button class="btn btn-primary" @click="copyLink">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              Copy
            </button>
          </div>
          <div
            class="mt-1.5 flex justify-between text-[11.5px]"
            :style="{ color: 'var(--fg-faint)' }"
          >
            <span>{{ shareDescription }}</span>
            <span :style="{ fontFamily: '\'Geist Mono\', monospace' }">{{ encodedSize }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useShare } from '@/composables/useShare'
import { useEditor } from '@/composables/useEditor'

const { code } = useEditor()
const {
  shareType,
  shareUrl,
  encodedSize,
  shareDescription,
  shareLinkLabel,
  isOpen,
  copyLink,
  close,
} = useShare(code)

const linkInputRef = ref<HTMLInputElement>()

const typeOptions = [
  { value: 'direct' as const, label: 'Direct link' },
  { value: 'readonly' as const, label: 'View only' },
]
</script>
