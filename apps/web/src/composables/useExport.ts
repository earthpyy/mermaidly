import { type Ref } from 'vue'
import mermaid from 'mermaid'
import { useToast } from '@/composables/useToast'
import { initMermaid } from '@/composables/useDiagram'

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
  svgString: string,
  width: number,
  height: number,
  scale: number,
  isDark: boolean,
): Promise<Blob | null> {
  const cw = Math.ceil(width * scale)
  const ch = Math.ceil(height * scale)

  const img = new Image()
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString)

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

let exportCounter = 0

async function renderForExport(
  code: string,
  exportTheme: 'light' | 'dark',
  siteTheme: string,
): Promise<{ svgString: string; width: number; height: number } | null> {
  initMermaid(exportTheme)
  try {
    const id = `mmd-export-${++exportCounter}`
    const { svg } = await mermaid.render(id, code)
    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;left:-9999px;top:0;visibility:hidden'
    container.innerHTML = svg
    document.body.appendChild(container)
    const svgEl = container.querySelector('svg')!
    const result = {
      svgString: cloneSvgString(svgEl),
      width: (svgEl.viewBox.baseVal && svgEl.viewBox.baseVal.width) || svgEl.clientWidth || 1024,
      height:
        (svgEl.viewBox.baseVal && svgEl.viewBox.baseVal.height) || svgEl.clientHeight || 768,
    }
    container.remove()
    document.querySelectorAll(`[id^="dmmd-export-"], [id="${id}"]`).forEach((el) => el.remove())
    return result
  } catch {
    return null
  } finally {
    document.querySelectorAll('[id^="dmmd-export-"], [id^="mmd-export-"]').forEach((el) => {
      if (!document.getElementById('diagram-canvas')?.contains(el)) el.remove()
    })
    initMermaid(siteTheme)
  }
}

export function useExport(
  theme: Ref<string>,
  code: Ref<string>,
  getCanvas: () => HTMLElement | null,
) {
  const { show } = useToast()

  function getSvg(): SVGSVGElement | null {
    return getSvgElement(getCanvas())
  }

  function getExportSvgData(svgEl: SVGSVGElement) {
    const vb = svgEl.viewBox.baseVal
    return {
      svgString: cloneSvgString(svgEl),
      width: (vb && vb.width) || svgEl.clientWidth || 1024,
      height: (vb && vb.height) || svgEl.clientHeight || 768,
    }
  }

  async function getSvgForExport(exportTheme?: 'light' | 'dark') {
    const needsRerender = exportTheme && exportTheme !== theme.value
    if (needsRerender) {
      return renderForExport(code.value, exportTheme, theme.value)
    }
    const svgEl = getSvg()
    if (!svgEl) return null
    return getExportSvgData(svgEl)
  }

  async function savePng(scale = 1.5, exportTheme?: 'light' | 'dark') {
    const resolvedTheme = exportTheme ?? (theme.value as 'light' | 'dark')
    const data = await getSvgForExport(resolvedTheme)
    if (!data) return
    const isDark = resolvedTheme === 'dark'
    try {
      const blob = await svgToPngBlob(data.svgString, data.width, data.height, scale, isDark)
      if (blob) {
        const suffix = scale > 2 ? '@2x' : ''
        download(blob, `mermaidly-${getTimestamp()}${suffix}.png`)
        show('PNG saved')
      }
    } catch {
      show('Save failed')
    }
  }

  async function saveSvg(exportTheme?: 'light' | 'dark') {
    const data = await getSvgForExport(exportTheme)
    if (!data) return
    const blob = new Blob([data.svgString], { type: 'image/svg+xml' })
    download(blob, `mermaidly-${getTimestamp()}.svg`)
    show('SVG saved')
  }

  async function copySvgCode(exportTheme?: 'light' | 'dark') {
    const data = await getSvgForExport(exportTheme)
    if (!data) return
    try {
      await navigator.clipboard.writeText(data.svgString)
      show('SVG copied')
    } catch {
      show('Copy failed')
    }
  }

  async function handleSave(format: string, exportTheme?: 'light' | 'dark') {
    switch (format) {
      case 'png':
        return savePng(1.5, exportTheme)
      case 'png2x':
        return savePng(3, exportTheme)
      case 'svg':
        return saveSvg(exportTheme)
      case 'copy-svg':
        return copySvgCode(exportTheme)
    }
  }

  return { savePng, saveSvg, copySvgCode, handleSave }
}
