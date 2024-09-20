import { Ref, ref, watch } from 'vue'

export function useLastPosAndSize(
  currentLeft: Ref<number | null | undefined>,
  currentTop: Ref<number | null | undefined>,
  currentWidth: Ref<number | null | undefined>,
  currentHeight: Ref<number | null | undefined>
) {
  // Last saved position and size
  const lastLeft = ref<number | null | undefined>(null)
  const lastTop = ref<number | null | undefined>(null)
  const lastWidth = ref<number | null | undefined>(null)
  const lastHeight = ref<number | null | undefined>(null)

  // Watch for changes in current position and size and update last saved values
  watch(currentLeft, (_newLeft, oldLeft) => {
    lastLeft.value = oldLeft
  })
  watch(currentTop, (_newTop, oldTop) => {
    lastTop.value = oldTop
  })
  watch(currentWidth, (_newWidth, oldWidth) => {
    lastWidth.value = oldWidth
  })
  watch(currentHeight, (_newHeight, oldHeight) => {
    lastHeight.value = oldHeight
  })

  return {
    lastLeft,
    lastTop,
    lastWidth,
    lastHeight
  }
}