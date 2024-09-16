import { computed, onBeforeUnmount, onMounted, Ref,ref, watch } from 'vue'

export function useResize(
  targetRef: Ref<HTMLElement | null>, 
  minSize: { width: number, height: number } = { width: 20, height: 40}
) {
  const width = ref<number | null>(null)
  const height = ref<number | null>(null)
  const isResizing = ref(false)
  let initialWidth = 0
  let initialHeight = 0
  let startX = 0
  let startY = 0
  const resizeThreshold = 10 // Defines the area where resize can be triggered

  const style = computed(() => {
    return width.value === null && height.value === null
      ? ''
      : { width: width.value + 'px', height: height.value + 'px', transition: '' }
  })

  const onMouseMove = (event: MouseEvent) => {
    if (!isResizing.value || !targetRef.value) return

    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY

    // Update width and height only when resizing starts
    if (width.value !== null && height.value !== null) {
      width.value = Math.max(minSize.width, initialWidth + deltaX)
      height.value = Math.max(minSize.height, initialHeight + deltaY)
    }
  }

  const onMouseDown = (event: MouseEvent) => {
    if (!targetRef.value) return

    const rect = targetRef.value.getBoundingClientRect()
    const offsetX = event.clientX - rect.left
    const offsetY = event.clientY - rect.top

    const nearRight = offsetX >= rect.width - resizeThreshold
    const nearBottom = offsetY >= rect.height - resizeThreshold

    if (nearRight || nearBottom) {
      isResizing.value = true
      startX = event.clientX
      startY = event.clientY
      initialWidth = rect.width
      initialHeight = rect.height

      // Set width and height before resizing starts
      width.value = initialWidth
      height.value = initialHeight

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
  }

  const onMouseUp = () => {
    isResizing.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  const cleanupListeners = () => {
    if (targetRef.value) {
      targetRef.value.removeEventListener('mousedown', onMouseDown)
      targetRef.value.removeEventListener('mousemove', onMouseMove)
    }
    document.removeEventListener('mouseup', onMouseUp)
  }

  const setupListeners = () => {
    if (targetRef.value) {
      targetRef.value.addEventListener('mousedown', onMouseDown)
      targetRef.value.addEventListener('mousemove', onMouseMove)
    }
  }

  onMounted(() => {
    if (targetRef.value) {
      setupListeners()
    }
  })

  onBeforeUnmount(() => {
    cleanupListeners()
  })

  // Watch for changes in the targetRef, to handle cases where v-if makes the element appear/disappear
  watch(targetRef, newVal => {
    if (newVal) {
      setupListeners()
    } else {
      cleanupListeners()
    }
  })

  return { width, height, isResizing, style }
}
