import { onBeforeUnmount, onMounted, Ref, ref, watch } from 'vue'

export function useResize(
  targetRef: Ref<HTMLElement | null>,
  minSize: { width: number; height: number } = { width: 20, height: 40 }
) {
  const width = ref<number | null>(null)
  const height = ref<number | null>(null)
  const isResizing = ref(false)
  let initialWidth = 0
  let initialHeight = 0
  let startX = 0
  let startY = 0
  const resizeThreshold = 5 // Defines the area where resize can be triggered
  const resizeDirection = ref<'right' | 'bottom' | 'corner' | null>(null) // Track the resize direction

  const onMouseMove = (event: MouseEvent) => {
    if (!targetRef.value) return

    if (!isResizing.value) {
      const rect = targetRef.value.getBoundingClientRect()
      const offsetX = event.clientX - rect.left
      const offsetY = event.clientY - rect.top

      // Check if the mouse is near the borders or the corner
      const nearRight = offsetX >= rect.width - resizeThreshold
      const nearBottom = offsetY >= rect.height - resizeThreshold

      // Set the resize cursor based on the position
      if (nearRight && nearBottom) {
        targetRef.value.style.cursor = 'nwse-resize' // Change to bottom-right resize cursor
        resizeDirection.value = 'corner'
      } else if (nearRight) {
        targetRef.value.style.cursor = 'ew-resize' // Change to right-side resize cursor
        resizeDirection.value = 'right'
      } else if (nearBottom) {
        targetRef.value.style.cursor = 'ns-resize' // Change to bottom-side resize cursor
        resizeDirection.value = 'bottom'
      } else {
        targetRef.value.style.cursor = '' // Reset cursor if not near the edges
        resizeDirection.value = null
      }
    } else {
      // While resizing, update dimensions based on the direction
      const deltaX = event.clientX - startX
      const deltaY = event.clientY - startY

      if (
        resizeDirection.value === 'right' ||
        resizeDirection.value === 'corner'
      ) {
        width.value = Math.max(minSize.width, initialWidth + deltaX)
        targetRef.value.style.width = width.value+ 'px'
        targetRef.value.style.transition = ''
      }
      if (
        resizeDirection.value === 'bottom' ||
        resizeDirection.value === 'corner'
      ) {
        height.value = Math.max(minSize.height, initialHeight + deltaY)
        targetRef.value.style.height = height.value+ 'px'
        targetRef.value.style.transition = ''
      }
    }
  }

  const onMouseDown = (event: MouseEvent) => {
    if (!targetRef.value || !resizeDirection.value) return

    const rect = targetRef.value.getBoundingClientRect()
    startX = event.clientX
    startY = event.clientY
    initialWidth = rect.width
    initialHeight = rect.height

    // Set width and height before resizing starts
    width.value = initialWidth
    height.value = initialHeight

    isResizing.value = true

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const onMouseUp = () => {
    isResizing.value = false
    resizeDirection.value = null

    // Reset the cursor to default after resizing
    if (targetRef.value) {
      targetRef.value.style.cursor = ''
    }

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

  return { width, height, isResizing }
}
