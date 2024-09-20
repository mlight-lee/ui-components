import { onMounted, onUnmounted, Ref, ref, watch } from 'vue'

import { Gap, Position, WIDTH_OF_TITLE_BAR } from './types'
import { useAutoOpen } from './useAutoOpen'
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
 * @param gap Input the minimum distance from the side of the element to the side of the window.
 * If the position of the element `targetRef` is located within the specified gap area, just modify
 * its position to not intersect with the gap area.
 * @returns Return the bounding rect of the tool palette
 */
export function useBoundingRect(
  toolPaletteRef: Ref<HTMLElement | null>,
  titleBarRef: Ref<HTMLElement | null>,
  reversed: Ref<boolean>,
  collapsed: Ref<boolean>,
  movement: Ref<Position>,
  gap: Ref<Gap> = ref({ left: 0, right: 0, top: 0, bottom: 0 })
) {
  const windowWidth = ref(window.innerWidth)
  const windowHeight = ref(window.innerHeight)
  const { rect } = useResize(toolPaletteRef, collapsed, reversed, gap)
  const { autoOpened } = useAutoOpen(toolPaletteRef, titleBarRef, collapsed)
  useTransition(toolPaletteRef, reversed, collapsed, autoOpened)

  // Modify the position of this tool palette according to current orientation
  const setTargetPos = (xDelta: number) => {
    if (toolPaletteRef.value) {
      const temp = toolPaletteRef.value.getBoundingClientRect()
      const tempLeft = temp.left + xDelta
      if (reversed.value) {
        rect.value.left = tempLeft

        // If the following conditions are met, decrease the gap between the right side of tool palette and right side of window
        // - the gap between the right side of tool palette and right side of window equal to or greater than 0, 
        // - The left side of window overlaps with the left side of tool platte
        const rightGap = window.innerWidth - temp.width - temp.left
        if (temp.left <= 0 && rightGap >= 0 && xDelta < 0) {
          rect.value.left = Math.max(0, tempLeft)
        }

        // If window width is too small to contain tool palette, just keep tool palette docked on the right side of window
        if (window.innerWidth - temp.width <= 0) {
          rect.value.left = window.innerWidth - temp.width
        }
      } else {
        // The right side of window overlaps with the right side of tool platte
        if (((temp.left + temp.width) >= window.innerWidth) && xDelta < 0) {
          rect.value.left = Math.max(0, tempLeft)
        }
      }
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
