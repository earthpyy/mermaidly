import { ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const stored = localStorage.getItem('mermaidly-theme') as Theme | null
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const theme = ref<Theme>(stored || (prefersDark ? 'dark' : 'light'))

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem('mermaidly-theme', t)
}

applyTheme(theme.value)

watch(theme, applyTheme)

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggle }
}
