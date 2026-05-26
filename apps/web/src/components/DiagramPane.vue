<template>
  <section
    class="flex min-h-0 min-w-0 flex-col"
    :style="{ background: 'var(--bg)' }"
    aria-label="Rendered diagram"
  >
    <!-- Toolbar -->
    <div
      class="flex h-11 shrink-0 items-center justify-between gap-2 border-b px-4"
      :style="{ background: 'var(--bg-elev)', borderColor: 'var(--border)' }"
    >
      <div class="flex items-center gap-1.5">
        <button
          class="btn btn-ghost btn-icon"
          title="Zoom out"
          :disabled="!hasOutput"
          @click="zoomOut"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
            <path d="M8 11h6" />
          </svg>
        </button>
        <span
          class="min-w-[42px] text-center text-xs"
          :style="{ fontFamily: '\'Geist Mono\', monospace', color: 'var(--fg-muted)' }"
        >
          {{ zoomPercent }}
        </span>
        <button
          class="btn btn-ghost btn-icon"
          title="Zoom in"
          :disabled="!hasOutput"
          @click="zoomIn"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
            <path d="M11 8v6" />
            <path d="M8 11h6" />
          </svg>
        </button>
        <button
          class="btn btn-ghost btn-icon"
          :title="editorCollapsed ? 'Expand code panel' : 'Collapse code panel'"
          :aria-label="editorCollapsed ? 'Expand code panel' : 'Collapse code panel'"
          :aria-pressed="editorCollapsed"
          :style="
            editorCollapsed ? { color: 'var(--accent)', background: 'var(--accent-soft)' } : {}
          "
          @click="$emit('toggleEditor')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
      </div>
      <div class="flex items-center gap-1.5">
        <button class="btn" :disabled="!hasOutput" @click="$emit('openShare')">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </button>
        <SaveMenu ref="saveMenuRef" :disabled="!hasOutput" @select="(f) => $emit('save', f)" />
      </div>
    </div>

    <!-- Stage -->
    <div
      ref="stageRef"
      class="diagram-stage"
      :class="{ 'grid place-items-center': !hasOutput }"
      @wheel="handleWheel"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    >
      <!-- Empty state -->
      <div v-if="status === 'idle' && !hasOutput" class="max-w-[360px] p-6 text-center">
        <div
          class="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl border"
          :style="{
            background: 'var(--bg-elev)',
            borderColor: 'var(--border)',
            color: 'var(--fg-muted)',
          }"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        <h3 class="mb-1.5 text-[15px] font-medium" :style="{ color: 'var(--fg)' }">
          No diagram yet
        </h3>
        <p class="text-[13px] leading-relaxed" :style="{ color: 'var(--fg-muted)' }">
          Paste your Mermaid code on the left to render it here.
        </p>
      </div>

      <!-- Error state -->
      <div
        v-else-if="status === 'error'"
        class="grid place-items-center"
        style="position: absolute; inset: 0"
      >
        <div class="max-w-[360px] p-6 text-center">
          <div
            class="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl border"
            :style="{ borderColor: 'var(--danger)', color: 'var(--danger)' }"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
          <h3 class="mb-1.5 text-[15px] font-medium" :style="{ color: 'var(--fg)' }">
            Couldn't render
          </h3>
          <p class="text-[13px] leading-relaxed" :style="{ color: 'var(--fg-muted)' }">
            There's a syntax issue in your Mermaid code.
          </p>
          <pre
            class="mt-3 max-h-[140px] overflow-auto whitespace-pre-wrap break-words rounded-[var(--radius-sm)] border p-[10px_12px] text-left text-[11.5px]"
            :style="{
              fontFamily: '\'Geist Mono\', monospace',
              background: 'var(--bg-sunken)',
              borderColor: 'var(--border)',
              color: 'var(--danger)',
            }"
            >{{ errorMessage }}</pre
          >
        </div>
      </div>

      <!-- Rendered diagram -->
      <div
        v-show="hasOutput"
        id="diagram-canvas"
        ref="canvasRef"
        class="diagram-canvas"
        v-html="svgOutput"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import SaveMenu from '@/components/SaveMenu.vue'
import { useZoom } from '@/composables/useZoom'

const props = defineProps<{
  svgOutput: string
  status: 'idle' | 'rendering' | 'ok' | 'error'
  errorMessage: string
  editorCollapsed: boolean
}>()

defineEmits<{
  toggleEditor: []
  openShare: []
  save: [format: string]
}>()

const stageRef = ref<HTMLElement>()
const canvasRef = ref<HTMLElement>()
const saveMenuRef = ref<InstanceType<typeof SaveMenu>>()

const {
  zoom,
  zoomIn,
  zoomOut,
  fitToScreen,
  applyTransform,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
} = useZoom()

const hasOutput = computed(() => props.svgOutput.length > 0)
const zoomPercent = computed(() => Math.round(zoom.value * 100) + '%')

watch(
  () => props.svgOutput,
  async (val) => {
    if (val) {
      await nextTick()
      fitToScreen()
      if (canvasRef.value) applyTransform(canvasRef.value)
    }
  },
)

watch(zoom, () => {
  if (canvasRef.value) applyTransform(canvasRef.value)
})

function handleWheel(e: WheelEvent) {
  if (!hasOutput.value || !stageRef.value) return
  onWheel(e, stageRef.value)
  if (canvasRef.value) applyTransform(canvasRef.value)
}

function handleMouseDown(e: MouseEvent) {
  if (!hasOutput.value) return
  onMouseDown(e)
  if (stageRef.value) stageRef.value.style.cursor = 'grabbing'
}

function handleMouseMove(e: MouseEvent) {
  if (!canvasRef.value) return
  onMouseMove(e, canvasRef.value)
}

function handleMouseUp() {
  if (!canvasRef.value) return
  onMouseUp(canvasRef.value)
  if (stageRef.value) stageRef.value.style.cursor = ''
}

defineExpose({
  closeMenus: () => saveMenuRef.value?.close(),
  getCanvasElement: () => canvasRef.value,
  fitToScreen: () => {
    fitToScreen()
    if (canvasRef.value) applyTransform(canvasRef.value)
  },
})
</script>
