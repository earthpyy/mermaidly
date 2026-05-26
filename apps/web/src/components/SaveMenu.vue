<template>
  <div class="menu-wrap">
    <button class="btn btn-primary" :disabled="disabled" @click.stop="toggleMenu">
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
      <div class="export-theme-toggle">
        <span class="export-theme-label">Export as</span>
        <div class="toggle-pill">
          <button
            class="toggle-option"
            :class="{ active: exportTheme === 'light' }"
            @click.stop="exportTheme = 'light'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5" />
              <path
                d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              />
            </svg>
            Light
          </button>
          <button
            class="toggle-option"
            :class="{ active: exportTheme === 'dark' }"
            @click.stop="exportTheme = 'dark'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            Dark
          </button>
        </div>
      </div>
      <div class="menu-divider"></div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  disabled: boolean
  theme: 'light' | 'dark'
}>()

const open = ref(false)
const exportTheme = ref<'light' | 'dark'>(props.theme)

watch(
  () => props.theme,
  (t) => (exportTheme.value = t),
)

function toggleMenu() {
  open.value = !open.value
  if (open.value) exportTheme.value = props.theme
}

const emit = defineEmits<{
  select: [format: string, exportTheme: 'light' | 'dark']
}>()

function select(format: string) {
  emit('select', format, exportTheme.value)
  open.value = false
}

defineExpose({ close: () => (open.value = false) })
</script>

<style scoped>
.export-theme-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  gap: 8px;
}

.export-theme-label {
  font-size: 12px;
  color: var(--fg-faint);
  white-space: nowrap;
}

.toggle-pill {
  display: flex;
  background: var(--bg-sunken);
  border-radius: var(--radius-sm);
  padding: 2px;
  gap: 2px;
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border: none;
  border-radius: calc(var(--radius-sm) - 2px);
  background: transparent;
  color: var(--fg-faint);
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  transition:
    background 0.12s ease,
    color 0.12s ease;
}

.toggle-option svg {
  width: 12px;
  height: 12px;
}

.toggle-option.active {
  background: var(--bg-elev);
  color: var(--fg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.menu-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 6px;
}
</style>
