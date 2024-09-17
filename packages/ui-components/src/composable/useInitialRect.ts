import {
  nextTick,
  onMounted,
  Ref,
  ref,
  watch
} from 'vue'

interface Rect {
  left?: number | null
  top?: number | null
  width?: number | null
  height?: number | null
}

/**
 * Get initial size and position from CSS
 */
export function useInitialRect(targetRef: Ref<HTMLElement | null>) {
  // Initial CSS size and position
  const initialRect = ref<Rect>({})
  let isIntialized = false

  const setInitialPosition = () => {
    if (!isIntialized && targetRef.value) {
      const rect = targetRef.value.getBoundingClientRect()
      initialRect.value.left = rect.left
      initialRect.value.top = rect.top
      initialRect.value.width = rect.width
      initialRect.value.height = rect.height
      isIntialized = true
    }
  }

  onMounted(() => {
    if (targetRef.value) {
      nextTick(() => {
        // Set initial size and position from CSS
        setInitialPosition()
      })
    }
  })

  // Watch for changes in the targetRef, to handle cases where v-if makes the element appear/disappear
  watch(targetRef, newVal => {
    if (newVal) {
      nextTick(() => {
        // Set initial size and position from CSS
        setInitialPosition()
      })
    }
  })

  return {
    isIntialized,
    initialRect
  }
}
