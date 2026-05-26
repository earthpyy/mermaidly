<template>
  <AppHeader />
  <main
    class="grid min-h-0 flex-1"
    :class="
      editorCollapsed || viewOnly
        ? 'grid-cols-[1fr]'
        : 'grid-cols-[420px_1fr] max-[860px]:grid-cols-[1fr] max-[860px]:grid-rows-[280px_1fr]'
    "
  >
    <EditorPane v-if="!viewOnly" v-show="!editorCollapsed" ref="editorRef" :status="status" />
    <DiagramPane
      ref="diagramRef"
      :svg-output="svgOutput"
      :status="status"
      :error-message="errorMessage"
      :editor-collapsed="editorCollapsed || viewOnly"
      :theme="theme"
      @toggle-editor="toggleEditor"
      @open-share="shareOpen"
      @save="handleSave"
    />
  </main>
  <ShareModal />
  <HelpModal />
  <ToastNotification />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import EditorPane from '@/components/EditorPane.vue'
import DiagramPane from '@/components/DiagramPane.vue'
import ShareModal from '@/components/ShareModal.vue'
import HelpModal from '@/components/HelpModal.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import { useEditor } from '@/composables/useEditor'
import { useTheme } from '@/composables/useTheme'
import { useDiagram } from '@/composables/useDiagram'
import { useShare } from '@/composables/useShare'
import { useExport } from '@/composables/useExport'
import { useHelp } from '@/composables/useHelp'

const editorRef = ref<InstanceType<typeof EditorPane>>()
const diagramRef = ref<InstanceType<typeof DiagramPane>>()

const { theme } = useTheme()
const { code, setCode, initFromStorage } = useEditor()
const { svgOutput, status, errorMessage } = useDiagram(code, theme)
const { open: shareOpen, close: shareClose, loadFromHash } = useShare(code)
const { handleSave } = useExport(theme, code, () => diagramRef.value?.getCanvasElement() ?? null)
const { close: helpClose } = useHelp()

const editorCollapsed = ref(localStorage.getItem('mermaidly-editor-collapsed') === '1')
const viewOnly = ref(false)

function toggleEditor() {
  editorCollapsed.value = !editorCollapsed.value
  localStorage.setItem('mermaidly-editor-collapsed', editorCollapsed.value ? '1' : '0')
  setTimeout(() => diagramRef.value?.fitToScreen(), 180)
}

function onKeyDown(e: KeyboardEvent) {
  const mod = e.metaKey || e.ctrlKey
  if (mod && e.key === 's') {
    e.preventDefault()
    handleSave('png')
  }
  if (mod && e.shiftKey && (e.key === 'c' || e.key === 'C')) {
    e.preventDefault()
    if (svgOutput.value) shareOpen()
  }
  if (e.key === 'Escape') {
    shareClose()
    helpClose()
    editorRef.value?.closeMenus()
    diagramRef.value?.closeMenus()
  }
}

onMounted(() => {
  const hashData = loadFromHash()
  if (hashData) {
    setCode(hashData.code)
    if (hashData.viewOnly) viewOnly.value = true
  } else {
    initFromStorage()
  }
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>
