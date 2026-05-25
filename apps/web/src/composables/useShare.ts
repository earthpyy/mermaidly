import { ref, computed, type Ref } from 'vue'
import { useToast } from '@/composables/useToast'

function encodeCode(src: string): string {
  const bytes = new TextEncoder().encode(src)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decodeCode(s: string): string | null {
  try {
    s = s.replace(/-/g, '+').replace(/_/g, '/')
    while (s.length % 4) s += '='
    const bin = atob(s)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return new TextDecoder().decode(bytes)
  } catch {
    return null
  }
}

const shareType = ref<'direct' | 'readonly'>('direct')
const isOpen = ref(false)

export function useShare(code: Ref<string>) {
  const { show } = useToast()

  const shareUrl = computed(() => {
    const encoded = encodeCode(code.value)
    const base = location.origin + location.pathname
    if (shareType.value === 'readonly') {
      return `${base}#view=${encoded}`
    }
    return `${base}#code=${encoded}`
  })

  const encodedSize = computed(() => {
    const encoded = encodeCode(code.value)
    const kb = (encoded.length / 1024).toFixed(1)
    return `${encoded.length} chars · ${kb} KB`
  })

  const shareDescription = computed(() => {
    if (shareType.value === 'readonly') {
      return 'Diagram only — code editor stays hidden.'
    }
    return 'Recipients can edit the code after opening.'
  })

  const shareLinkLabel = computed(() => {
    return shareType.value === 'readonly' ? 'View-only link' : 'Editable link'
  })

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl.value)
      show('Link copied')
    } catch {
      show('Copy failed')
    }
  }

  function loadFromHash(): { code: string; viewOnly: boolean } | null {
    const hash = location.hash.slice(1)
    if (!hash) return null
    const params = new URLSearchParams(hash)
    const codeParam = params.get('code')
    const viewParam = params.get('view')
    const encoded = codeParam || viewParam
    if (!encoded) return null
    const decoded = decodeCode(encoded)
    if (decoded === null) return null
    return { code: decoded, viewOnly: !!viewParam }
  }

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return {
    shareType,
    shareUrl,
    encodedSize,
    shareDescription,
    shareLinkLabel,
    isOpen,
    copyLink,
    loadFromHash,
    open,
    close,
  }
}
