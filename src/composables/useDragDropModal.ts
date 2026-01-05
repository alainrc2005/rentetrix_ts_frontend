import { nextTick } from 'vue'

export default async function useDragDropModal(element: string) {
  await nextTick()
  const target: HTMLElement | null = document.querySelector(element)

  function onDrag(e: MouseEvent): void {
    if (target !== null) {
      const originalStyles = globalThis.getComputedStyle(target)
      target.style.left = `${Number.parseInt(originalStyles.left, 10) + e.movementX}px`
      target.style.top = `${Number.parseInt(originalStyles.top, 10) + e.movementY}px`
    }
  }

  function onLetGo(): void {
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', onLetGo)
  }

  function onGrab(): void {
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', onLetGo)
  }

  return {
    onGrab
  }
}
