import { computed, Ref, ref, watch } from 'vue'

import { Rect } from './types'

/**
 * Get the initial width or resized width of tool palette. The width stored in this function will not change
 * after tool palette expanded or collapsed. So tool palette depends on value returned by this function to 
 * decide width to expand.
 * @param rect Input reference to current position and size of tool palette 
 * @param isResizing Input flag whether the tool palette is resizing
 * @returns Return the initial width or resized width of tool palette.
 */
export function useLeftPosAndWidth(
  rect: Ref<Rect>,
  isResizing: Ref<boolean>
) {
  const width = ref<number | null | undefined>(rect.value.width)

  const resizeWidth = computed(() => rect.value.width)

  // Watch for changes to collapsed state
  watch([resizeWidth, isResizing], ([newWidthVal, newIsResizingVal]) => {
    if (width.value == null) {
      width.value = newWidthVal
    } else if (newIsResizingVal) {
      width.value = newWidthVal
    }
  })

  return { width }
}