import { ref } from 'vue'

export function useZoom() {
  const zoom = ref(1)
  const panX = ref(0)
  const panY = ref(0)

  let isPanning = false
  let startX = 0
  let startY = 0

  function applyTransform(el: HTMLElement) {
    el.style.transform = `translate(${panX.value}px, ${panY.value}px) scale(${zoom.value})`
  }

  function setZoom(z: number, originX?: number, originY?: number) {
    const old = zoom.value
    zoom.value = Math.max(0.2, Math.min(4, z))
    if (originX !== undefined && originY !== undefined) {
      const ratio = zoom.value / old
      panX.value = originX - (originX - panX.value) * ratio
      panY.value = originY - (originY - panY.value) * ratio
    }
  }

  function zoomIn() {
    setZoom(zoom.value * 1.2)
  }

  function zoomOut() {
    setZoom(zoom.value / 1.2)
  }

  function fitToScreen() {
    zoom.value = 1
    panX.value = 0
    panY.value = 0
  }

  function onWheel(e: WheelEvent, stageEl: HTMLElement) {
    if (!e.ctrlKey && !e.metaKey) return
    e.preventDefault()
    const rect = stageEl.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setZoom(zoom.value * (e.deltaY > 0 ? 0.92 : 1.08), x, y)
  }

  function onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return
    isPanning = true
    startX = e.clientX - panX.value
    startY = e.clientY - panY.value
  }

  function onMouseMove(e: MouseEvent, canvasEl: HTMLElement) {
    if (!isPanning) return
    panX.value = e.clientX - startX
    panY.value = e.clientY - startY
    canvasEl.style.transition = 'none'
    applyTransform(canvasEl)
  }

  function onMouseUp(canvasEl: HTMLElement) {
    if (!isPanning) return
    isPanning = false
    canvasEl.style.transition = ''
  }

  return {
    zoom,
    panX,
    panY,
    zoomIn,
    zoomOut,
    setZoom,
    fitToScreen,
    applyTransform,
    onWheel,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    isPanning: () => isPanning,
  }
}
