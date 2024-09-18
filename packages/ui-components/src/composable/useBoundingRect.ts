import {
  computed,
  Ref,
  watch
} from 'vue'

import { useInitialRect } from './useInitialRect'
import { useResize } from './useResize'

// Width of the title bar of the tool palette
export const WIDTH_OF_TITLE_BAR = 20

/**
 * Get the bounding rect of the specified element.
 * - If it is the first time to show this element, return the initial size and position from CSS
 * - Otherwise, return the size and postion after resized
 * @param targetRef Input the tool palette HTML element to get its bounding rect
 * @param reversed Input flag to indicate whether the tool palette is collapsed
 * @returns Return the bounding rect of the element
 */
export function useBoundingRect(
  targetRef: Ref<HTMLElement | null>,
  reversed: Ref<boolean>,
  collapsed: Ref<boolean>
) {
  const { initialRect } = useInitialRect(targetRef)
  const { rect: resizedRect } = useResize(targetRef, reversed)

  const rect = computed(() => {
    return (resizedRect.value.width && resizedRect.value.height) ? resizedRect.value : initialRect.value
  })

  // Watch collapsed state. If it is collapsed, store the old width in order to reuse it when expanding the tool palette
  let oldWidth: number | null | undefined = null
  watch(collapsed, newVal => {
    if (newVal) {
      oldWidth = rect.value.width
      rect.value.width = WIDTH_OF_TITLE_BAR
    } else {
      rect.value.width = oldWidth
      oldWidth = null
    }
  })

  return { rect }
}
