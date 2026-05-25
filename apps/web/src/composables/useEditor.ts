import { ref, computed, watch } from 'vue'
import { EXAMPLES } from '@/data/examples'
import { useToast } from '@/composables/useToast'

const code = ref('')
let initialized = false

export function useEditor() {
  const { show } = useToast()
  const charCount = computed(() => code.value.length)

  watch(code, (val) => {
    try {
      localStorage.setItem('mermaidly-code', val)
    } catch {}
  })

  function initFromStorage() {
    if (initialized) return
    initialized = true
    const stored = localStorage.getItem('mermaidly-code')
    if (stored) code.value = stored
  }

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

  function setCode(val: string) {
    code.value = val
  }

  return { code, charCount, pasteFromClipboard, loadExample, clear, setCode, initFromStorage }
}
