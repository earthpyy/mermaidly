<template>
  <AppHeader />
  <main
    class="grid min-h-0 flex-1 grid-cols-[420px_1fr] max-[860px]:grid-cols-[1fr] max-[860px]:grid-rows-[280px_1fr]"
  >
    <EditorPane status="idle" />
    <div
      class="grid place-items-center text-[13px]"
      :style="{ color: 'var(--fg-muted)', background: 'var(--bg)' }"
    >
      Diagram pane coming next
    </div>
  </main>
  <ToastNotification />
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import EditorPane from '@/components/EditorPane.vue'
import ToastNotification from '@/components/ToastNotification.vue'
</script>
