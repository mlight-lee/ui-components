import { onMounted, Ref, ref, watch } from 'vue'

import { Offset, Rect } from './types'

/**
 * Get initial size and position from CSS
 * @param targetRef Input element to get its initial size and position from CSS
 * @param offset Input the minimum distance from the side of the element to the side of the window.
 * If the position of the element `targetRef` is located within the specified offset area, just modify
 * its position to not intersect with the offset area.
 * @returns Return the following data
 * - initialRect: the initial size and position of the element
 * - isIntialized: flag to indicate whether the size and position of the element is initialized
 */
export function useInitialRect(
  targetRef: Ref<HTMLElement | null>,
  offset: Ref<Offset> = ref({ left: 0, right: 0, top: 0, bottom: 0 })
) {
  // Initial CSS size and position
  const initialRect = ref<Rect>({})
  let isIntialized = false

  const setInitialPosition = () => {
    if (!isIntialized && targetRef.value) {
      const rect = targetRef.value.getBoundingClientRect()
      initialRect.value.left = Math.max(rect.left, offset.value.left) 
      initialRect.value.top = Math.max(rect.top, offset.value.top) 
      initialRect.value.width = rect.width 
      initialRect.value.height = rect.height
      isIntialized = true
    }
  }

  onMounted(() => {
    if (targetRef.value) {
      setInitialPosition()
    }
  })

  // Watch for changes in the targetRef, to handle cases where v-if makes the element appear/disappear
  watch(targetRef, newVal => {
    if (newVal) {
      setInitialPosition()
    }
  })

  return {
    isIntialized,
    initialRect
  }
}
