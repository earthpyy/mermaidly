import { type Ref } from 'vue'
import { useToast } from '@/composables/useToast'

function getTimestamp(): string {
  return new Date().toISOString().slice(0, 10)
}

function getSvgElement(canvasEl: HTMLElement | null): SVGSVGElement | null {
  return canvasEl?.querySelector('svg') ?? null
}

function cloneSvgString(svgEl: SVGSVGElement): string {
  const clone = svgEl.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  const vb = svgEl.viewBox.baseVal
  const w = (vb && vb.width) || svgEl.clientWidth || 1024
  const h = (vb && vb.height) || svgEl.clientHeight || 768
  clone.setAttribute('width', String(w))
  clone.setAttribute('height', String(h))

  return new XMLSerializer().serializeToString(clone)
}

async function svgToPngBlob(
  svgEl: SVGSVGElement,
  scale: number,
  isDark: boolean,
): Promise<Blob | null> {
  const str = cloneSvgString(svgEl)
  const vb = svgEl.viewBox.baseVal
  const w = (vb && vb.width) || svgEl.clientWidth || 1024
  const h = (vb && vb.height) || svgEl.clientHeight || 768
  const cw = Math.ceil(w * scale)
  const ch = Math.ceil(h * scale)

  const img = new Image()
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(str)

  await new Promise<void>((res, rej) => {
    img.onload = () => res()
    img.onerror = rej
    img.src = url
  })

  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = isDark ? '#0c0c0b' : '#ffffff'
  ctx.fillRect(0, 0, cw, ch)
  ctx.drawImage(img, 0, 0, cw, ch)

  return new Promise((res) => canvas.toBlob(res as BlobCallback, 'image/png'))
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function useExport(theme: Ref<string>, getCanvas: () => HTMLElement | null) {
  const { show } = useToast()

  function getSvg(): SVGSVGElement | null {
    return getSvgElement(getCanvas())
  }

  async function savePng(scale = 1.5) {
    const svgEl = getSvg()
    if (!svgEl) return
    try {
      const blob = await svgToPngBlob(svgEl, scale, theme.value === 'dark')
      if (blob) {
        const suffix = scale > 2 ? '@2x' : ''
        download(blob, `mermaidly-${getTimestamp()}${suffix}.png`)
        show('PNG saved')
      }
    } catch {
      show('Save failed')
    }
  }

  function saveSvg() {
    const svgEl = getSvg()
    if (!svgEl) return
    const blob = new Blob([cloneSvgString(svgEl)], { type: 'image/svg+xml' })
    download(blob, `mermaidly-${getTimestamp()}.svg`)
    show('SVG saved')
  }

  async function copySvgCode() {
    const svgEl = getSvg()
    if (!svgEl) return
    try {
      await navigator.clipboard.writeText(cloneSvgString(svgEl))
      show('SVG copied')
    } catch {
      show('Copy failed')
    }
  }

  async function handleSave(format: string) {
    switch (format) {
      case 'png':
        return savePng(1.5)
      case 'png2x':
        return savePng(3)
      case 'svg':
        return saveSvg()
      case 'copy-svg':
        return copySvgCode()
    }
  }

  return { savePng, saveSvg, copySvgCode, handleSave }
}
