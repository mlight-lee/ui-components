import {
  computed,
  Ref,
  ref
} from 'vue'

import { Rect } from './types'
import { useInitialRect } from './useInitialRect'

/**
 * Get the bounding rect of the specified element.
 * - If it is the first time to show this element, return the initial size and position from CSS
 * - Otherwise, return the last size and postion when the element is closed
 * @param targetRef Input element to get its bounding rect
 * @returns Return the bounding rect of the element
 */
export function useRect(targetRef: Ref<HTMLElement | null>) {
  const { initialRect } = useInitialRect(targetRef)
  // The last size and postion when the `targetRef` disappears
  const lastRect = ref<Rect | null>(null)

  const rect = computed(() => {
    return lastRect.value ? lastRect.value : initialRect.value
  })

  return { rect }
}
