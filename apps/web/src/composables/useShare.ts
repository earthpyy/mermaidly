import { ref, computed, type Ref } from 'vue'
import { useToast } from '@/composables/useToast'

// Base URL of the short-link API worker. Falls back to localhost in dev; if
// unset in production the app degrades gracefully to inline (self-contained) links.
const API_BASE =
  import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? 'http://localhost:8787' : '')

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
// Shorten by default; users can opt out for a self-contained inline link.
const shorten = ref(true)
const isShortening = ref(false)
// Cached short link, tied to the exact inline payload it was minted for so it
// is reused while the diagram/mode is unchanged and discarded when they change.
const shortLink = ref<{ url: string; payload: string } | null>(null)

export function useShare(code: Ref<string>) {
  const { show } = useToast()

  const inlineUrl = computed(() => {
    const encoded = encodeCode(code.value)
    const base = location.origin + location.pathname
    if (shareType.value === 'readonly') {
      return `${base}#view=${encoded}`
    }
    return `${base}#code=${encoded}`
  })

  const shareUrl = computed(() => {
    if (shorten.value && shortLink.value && shortLink.value.payload === inlineUrl.value) {
      return shortLink.value.url
    }
    return inlineUrl.value
  })

  const encodedSize = computed(() => {
    const len = shareUrl.value.length
    const kb = (len / 1024).toFixed(1)
    return `${len} chars · ${kb} KB`
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

  // Mint a short link for the current diagram/mode if shortening is enabled and
  // we don't already have a fresh one. Silently falls back to the inline link.
  async function ensureShortened(): Promise<void> {
    if (!shorten.value || !API_BASE) return
    const payload = inlineUrl.value
    if (shortLink.value && shortLink.value.payload === payload) return
    isShortening.value = true
    try {
      const res = await fetch(`${API_BASE}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.value, viewOnly: shareType.value === 'readonly' }),
      })
      if (!res.ok) throw new Error(`shorten failed: ${res.status}`)
      const { id } = (await res.json()) as { id: string }
      shortLink.value = { url: `${location.origin}${location.pathname}#s=${id}`, payload }
    } catch {
      // Leave shortLink untouched; shareUrl will use the inline link.
    } finally {
      isShortening.value = false
    }
  }

  async function copyLink() {
    await ensureShortened()
    try {
      await navigator.clipboard.writeText(shareUrl.value)
      show('Link copied')
    } catch {
      show('Copy failed')
    }
  }

  async function loadFromHash(): Promise<{ code: string; viewOnly: boolean } | null> {
    const hash = location.hash.slice(1)
    if (!hash) return null
    const params = new URLSearchParams(hash)

    const shortId = params.get('s')
    if (shortId) {
      if (!API_BASE) return null
      try {
        const res = await fetch(`${API_BASE}/s/${encodeURIComponent(shortId)}`)
        if (!res.ok) {
          show(
            res.status === 404
              ? 'This link has expired or no longer exists'
              : 'Could not load link',
          )
          return null
        }
        const data = (await res.json()) as { code: string; viewOnly?: boolean }
        return { code: data.code, viewOnly: !!data.viewOnly }
      } catch {
        show('Could not load shared link')
        return null
      }
    }

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
    void ensureShortened()
  }

  function close() {
    isOpen.value = false
  }

  return {
    shareType,
    shorten,
    isShortening,
    shareUrl,
    encodedSize,
    shareDescription,
    shareLinkLabel,
    isOpen,
    copyLink,
    ensureShortened,
    loadFromHash,
    open,
    close,
  }
}
