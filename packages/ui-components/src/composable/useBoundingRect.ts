import { computed, onMounted, onUnmounted, Ref, ref, watch } from 'vue'

import { Position, WIDTH_OF_TITLE_BAR } from './types'
import { useAutoOpen } from './useAutoOpen'
import { useInitialRect } from './useInitialRect'
import { useResize } from './useResize'
import { useTransition } from './useTransition'

/**
 * Get the bounding rect of the tool palette.
 * - If it is the first time to show the tool palette, return the initial size and position from CSS
 * - Otherwise, return the size and postion after resized
 * @param toolPaletteRef Input the tool palette element to get its bounding rect
 * @param titleBarRef Input the title bar element of the tool palette
 * @param reversed Input flag whether to reverse cllapse icon
 * @param collapsed Input flag to indicate whether the tool palette is collapsed
 * @param movement Input dragging movement
 * @returns Return the bounding rect of the tool palette
 */
export function useBoundingRect(
  toolPaletteRef: Ref<HTMLElement | null>,
  titleBarRef: Ref<HTMLElement | null>,
  reversed: Ref<boolean>,
  collapsed: Ref<boolean>,
  movement: Ref<Position>
) {
  const windowWidth = ref(window.innerWidth)
  const windowHeight = ref(window.innerHeight)
  const { initialRect } = useInitialRect(toolPaletteRef)
  const { rect: resizedRect } = useResize(toolPaletteRef, collapsed, reversed)
  const { autoOpened } = useAutoOpen(toolPaletteRef, titleBarRef, collapsed)
  useTransition(toolPaletteRef, reversed, collapsed, autoOpened)

  const rect = computed(() => {
    return resizedRect.value.width && resizedRect.value.height
      ? resizedRect.value
      : initialRect.value
  })

  // Modify the position of this tool palette according to current orientation
  const setTargetPos = (xDelta: number) => {
    if (toolPaletteRef.value && reversed.value) {
      const rect = toolPaletteRef.value.getBoundingClientRect()
      toolPaletteRef.value.style.left = rect.left + xDelta + 'px'
    }
  }

  const updateWindowSize = () => {
    const xDelta = window.innerWidth - windowWidth.value
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
    setTargetPos(xDelta)
  }

  onMounted(() => {
    window.addEventListener('resize', updateWindowSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWindowSize)
  })

  let oldWidth: number | null | undefined = null
  const collapse = (collapse: boolean, resetOldWidth: boolean = true) => {
    if (collapse) {
      if (resetOldWidth) oldWidth = rect.value.width
      rect.value.width = WIDTH_OF_TITLE_BAR
      if (reversed.value && rect.value.left && oldWidth) {
        rect.value.left = rect.value.left + oldWidth - WIDTH_OF_TITLE_BAR
      }
    } else {
      rect.value.width = oldWidth
      if (reversed.value && rect.value.left && oldWidth) {
        rect.value.left = rect.value.left - oldWidth + WIDTH_OF_TITLE_BAR
      }
      if (resetOldWidth) oldWidth = null
    }
  }

  // Watch collapsed state. If it is collapsed, store the old width in order to reuse it when expanding the tool palette
  watch(collapsed, newVal => {
    collapse(newVal, true)
  })

  watch(autoOpened, newVal => {
    // `autoOpened` takes effect only if `collapsed` is true.
    if (collapsed.value) {
      collapse(!newVal, false)
    }
  })

  watch(movement, newVal => {
    if (newVal && toolPaletteRef.value) {
      const element = toolPaletteRef.value as HTMLElement
      const temp = element.getBoundingClientRect()
      rect.value.left = temp.left
      rect.value.top = temp.top
    }
  })

  return { rect }
}
