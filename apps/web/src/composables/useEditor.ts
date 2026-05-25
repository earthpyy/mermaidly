import { ref, computed, watch } from 'vue'
import { EXAMPLES } from '@/data/examples'
import { useToast } from '@/composables/useToast'

const code = ref('')

const loaded = localStorage.getItem('mermaidly-code')
if (loaded) code.value = loaded

export function useEditor() {
  const { show } = useToast()
  const charCount = computed(() => code.value.length)

  watch(code, (val) => {
    try {
      localStorage.setItem('mermaidly-code', val)
    } catch {}
  })

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText()
      if (!text) {
        show('Clipboard is empty')
        return
      }
      code.value = text
      show('Pasted')
    } catch {
      show('Clipboard access denied — paste manually')
    }
  }

  function loadExample(key: string) {
    const ex = EXAMPLES[key]
    if (ex) code.value = ex
  }

  function clear() {
    code.value = ''
  }

  return { code, charCount, pasteFromClipboard, loadExample, clear }
}
