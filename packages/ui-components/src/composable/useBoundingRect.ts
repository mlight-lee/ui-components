import {
  computed,
  Ref,
  watch
} from 'vue'

import { Position, WIDTH_OF_TITLE_BAR } from './types'
import { useInitialRect } from './useInitialRect'
import { useResize } from './useResize'

/**
 * Get the bounding rect of the tool palette.
 * - If it is the first time to show the tool palette, return the initial size and position from CSS
 * - Otherwise, return the size and postion after resized
 * @param targetRef Input the tool palette HTML element to get its bounding rect
 * @param reversed Input flag whether to reverse cllapse icon
 * @param collapsed Input flag to indicate whether the tool palette is collapsed
 * @param movement Input dragging movement
 * @returns Return the bounding rect of the tool palette
 */
export function useBoundingRect(
  targetRef: Ref<HTMLElement | null>,
  reversed: Ref<boolean>,
  collapsed: Ref<boolean>,
  movement: Ref<Position>
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

  watch(movement, newVal => {
    if (newVal && targetRef.value) {
      const element = targetRef.value as HTMLElement
      const temp = element.getBoundingClientRect()
      rect.value.left = temp.left
      rect.value.top = temp.top
    }
  })

  return { rect }
}
