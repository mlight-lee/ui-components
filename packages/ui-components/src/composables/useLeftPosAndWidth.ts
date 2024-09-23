import { computed, Ref, ref, watch } from 'vue'

import { Position, Rect } from './types'

/**
 * Get width and left position of tool palette.
 * - the left position stored in this function is always the one when the tool palette is expanded.
 * - The width stored in this function will not change after tool palette expanded or collapsed.
 * So tool palette depends on value returned by this function to decide width to expand.
 * @param rect Input reference to current position and size of tool palette
 * @param isResizing Input flag whether the tool palette is resizing
 * @param position Input new left and top position of the tool palette after dragged
 * @param isDragging Input flag to indicate whether the tool palette is in dragging state
 * @returns Return the following data.
 * - width: the initial width or resized width of tool palette.
 * - left: the left position of the tool palette assuming it is always expanded
 */
export function useLeftPosAndWidth(
  rect: Ref<Rect>,
  isResizing: Ref<boolean>,
  position: Ref<Position | null>,
  isDragging: Ref<boolean>
) {
  const width = ref<number | null | undefined>(rect.value.width)
  const left = ref<number | null | undefined>(rect.value.left)
  const resizeWidth = computed(() => rect.value.width)
  const resizedLeft = computed(() => rect.value.left)
  const draggedLeft = computed(() => (position.value ? position.value.x : null))

  watch([resizeWidth, resizedLeft], ([newWidthVal, newLeftVal]) => {
    if (width.value == null || left.value == null) {
      width.value = newWidthVal
      left.value = newLeftVal
    } else if (isResizing.value) {
      width.value = newWidthVal
      left.value = newLeftVal
    }
  })

  watch(draggedLeft, newVal => {
    if (isDragging.value && position.value) {
      left.value = newVal
    }
  })

  return { left, width }
}
