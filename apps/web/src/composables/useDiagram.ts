import { ref, watch, type Ref } from 'vue'
import mermaid from 'mermaid'

let renderCounter = 0

export function getMermaidThemeConfig(theme: string) {
  if (theme === 'dark') {
    return {
      theme: 'dark' as const,
      themeVariables: {
        background: 'transparent',
        primaryColor: '#1f1e1c',
        primaryTextColor: '#f5f4f1',
        primaryBorderColor: '#34322f',
        lineColor: '#5c5b56',
        secondaryColor: '#161614',
        tertiaryColor: '#0c0c0b',
      },
    }
  }
  return {
    theme: 'default' as const,
    themeVariables: {
      background: 'transparent',
      primaryColor: '#ffffff',
      primaryTextColor: '#0a0a0a',
      primaryBorderColor: '#d4d2cd',
      lineColor: '#6b6b67',
      secondaryColor: '#f4f3f1',
      tertiaryColor: '#fafaf9',
    },
  }
}

export function initMermaid(theme: string) {
  const themeConfig = getMermaidThemeConfig(theme)
  mermaid.initialize({
    startOnLoad: false,
    ...themeConfig,
    securityLevel: 'loose',
    fontFamily: 'Geist, system-ui, sans-serif',
    flowchart: { curve: 'basis', padding: 16 },
  })
}

export function useDiagram(code: Ref<string>, theme: Ref<string>) {
  const svgOutput = ref('')
  const status = ref<'idle' | 'rendering' | 'ok' | 'error'>('idle')
  const errorMessage = ref('')

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  initMermaid(theme.value)

  async function render() {
    const src = code.value.trim()
    if (!src) {
      svgOutput.value = ''
      status.value = 'idle'
      errorMessage.value = ''
      return
    }

    status.value = 'rendering'
    const id = `mmd-${++renderCounter}`

    try {
      await mermaid.parse(src)
      const { svg } = await mermaid.render(id, src)
      svgOutput.value = svg
      status.value = 'ok'
      errorMessage.value = ''
    } catch (err) {
      document.querySelectorAll('[id^="dmermaid-"], [id^="mmd-"]').forEach((el) => {
        if (!document.getElementById('diagram-canvas')?.contains(el)) el.remove()
      })
      svgOutput.value = ''
      status.value = 'error'
      errorMessage.value = err instanceof Error ? err.message : String(err)
    }
  }

  function scheduleRender(delay = 300) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(render, delay)
  }

  watch(code, () => scheduleRender(300))

  watch(theme, () => {
    initMermaid(theme.value)
    scheduleRender(0)
  })

  function rerender() {
    scheduleRender(0)
  }

  return { svgOutput, status, errorMessage, rerender }
}
