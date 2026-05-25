<template>
  <AppHeader />
  <main
    class="grid min-h-0 flex-1"
    :class="
      editorCollapsed
        ? 'grid-cols-[1fr]'
        : 'grid-cols-[420px_1fr] max-[860px]:grid-cols-[1fr] max-[860px]:grid-rows-[280px_1fr]'
    "
  >
    <EditorPane v-show="!editorCollapsed" ref="editorRef" :status="status" />
    <DiagramPane
      ref="diagramRef"
      :svg-output="svgOutput"
      :status="status"
      :error-message="errorMessage"
      :editor-collapsed="editorCollapsed"
      @toggle-editor="toggleEditor"
      @open-share="() => {}"
      @save="() => {}"
    />
  </main>
  <ToastNotification />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import EditorPane from '@/components/EditorPane.vue'
import DiagramPane from '@/components/DiagramPane.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import { useEditor } from '@/composables/useEditor'
import { useTheme } from '@/composables/useTheme'
import { useDiagram } from '@/composables/useDiagram'

const editorRef = ref<InstanceType<typeof EditorPane>>()
const diagramRef = ref<InstanceType<typeof DiagramPane>>()

const { theme } = useTheme()
const { code } = useEditor()
const { svgOutput, status, errorMessage } = useDiagram(code, theme)

const editorCollapsed = ref(localStorage.getItem('mermaidly-editor-collapsed') === '1')

function toggleEditor() {
  editorCollapsed.value = !editorCollapsed.value
  localStorage.setItem('mermaidly-editor-collapsed', editorCollapsed.value ? '1' : '0')
  setTimeout(() => diagramRef.value?.fitToScreen(), 180)
}
</script>
