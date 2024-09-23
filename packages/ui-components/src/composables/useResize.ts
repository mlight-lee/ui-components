import { onBeforeUnmount, onMounted, Ref, ref, watch } from 'vue'

import { Offset } from './types'
import { useInitialRect } from './useInitialRect'

/**
 * Resize the specified element when moving mouse to its
 * - right border, bottom border, and right-bottom corner if argument `reverse` is false
 * - or left border, bottom border, and left-bottom corner if argument `reverse` is true
 * @param targetRef Input element to resize
 * @param reverse Input flag to decide where to resize the element
 * @param collapsed Input flag to indicate whether the tool palette is collapsed. If `collapsed` is true,
 * the element can't be resized
 * @param offset Input the minimum distance from the side of the element to the side of the window.
 * If the position of the element `targetRef` is located within the specified offset area, just modify
 * its position to not intersect with the offset area.
 * @param minSize Input minimum size to resize.
 * @returns Return the following data.
 * - width: new width of the element after resized
 * - height: new height of the element after resized
 * - isResizing: flag to indicate whether the element is in resizing state
 */
export function useResize(
  targetRef: Ref<HTMLElement | null>,
  collapsed: Ref<boolean> = ref(false),
  reverse: Ref<boolean> = ref(false),
  offset: Ref<Offset> = ref({ left: 0, right: 0, top: 0, bottom: 0 }),
  minSize: { width: number; height: number } = { width: 20, height: 40 }
) {
  const { initialRect: resizedBoundingRect } = useInitialRect(targetRef, offset)
  const isResizing = ref(false)
  let initialLeft = 0
  let initialWidth = 0
  let initialHeight = 0
  let startX = 0
  let startY = 0
  const resizeThreshold = 5 // Defines the area where resize can be triggered
  const resizeDirection = ref<
    | 'left'
    | 'right'
    | 'bottom'
    | 'right-bottom-corner'
    | 'left-bottom-corner'
    | null
  >(null) // Track the resize direction

  const onMouseMove = (event: MouseEvent) => {
    if (!targetRef.value || collapsed.value) return

    if (!isResizing.value) {
      const rect = targetRef.value.getBoundingClientRect()
      const offsetX = event.clientX - rect.left
      const offsetY = event.clientY - rect.top

      // Check if the mouse is near the borders or the corner
      const nearLeft = offsetX <= resizeThreshold
      const nearRight = offsetX >= rect.width - resizeThreshold
      const nearBottom = offsetY >= rect.height - resizeThreshold

      // Set the resize cursor based on the position
      if (nearLeft && nearBottom && reverse.value) {
        targetRef.value.style.cursor = 'nesw-resize' // Change to bottom-right resize cursor
        resizeDirection.value = 'left-bottom-corner'
      } else if (nearRight && nearBottom && !reverse.value) {
        targetRef.value.style.cursor = 'nwse-resize' // Change to bottom-left resize cursor
        resizeDirection.value = 'right-bottom-corner'
      } else if (nearLeft && reverse.value) {
        targetRef.value.style.cursor = 'ew-resize' // Change to left-side resize cursor
        resizeDirection.value = 'left'
      } else if (nearRight && !reverse.value) {
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
        resizeDirection.value === 'left' ||
        resizeDirection.value === 'left-bottom-corner'
      ) {
        const newWidth = initialWidth - deltaX
        if (newWidth > minSize.width) {
          resizedBoundingRect.value.width = newWidth
          resizedBoundingRect.value.left = initialLeft + deltaX
          targetRef.value.style.left = resizedBoundingRect.value.left + 'px'
          targetRef.value.style.width = resizedBoundingRect.value.width + 'px'
        }
      }
      if (
        resizeDirection.value === 'right' ||
        resizeDirection.value === 'right-bottom-corner'
      ) {
        const newWidth = initialWidth + deltaX
        if (newWidth > minSize.width) {
          resizedBoundingRect.value.width = newWidth
          targetRef.value.style.width = resizedBoundingRect.value.width + 'px'
        }
      }
      if (
        resizeDirection.value === 'bottom' ||
        resizeDirection.value === 'left-bottom-corner' ||
        resizeDirection.value === 'right-bottom-corner'
      ) {
        const newHeight = initialHeight + deltaY
        if (newHeight > minSize.height) {
          resizedBoundingRect.value.height = newHeight
          targetRef.value.style.height = resizedBoundingRect.value.height + 'px'
        }
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
    initialLeft = rect.left

    // Set width and height before resizing starts
    resizedBoundingRect.value.width = initialWidth
    resizedBoundingRect.value.height = initialHeight
    resizedBoundingRect.value.left = rect.left
    resizedBoundingRect.value.top = rect.top

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

  return { rect: resizedBoundingRect, isResizing }
}
