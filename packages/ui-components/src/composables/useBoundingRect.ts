import { computed, onMounted, onUnmounted, Ref, ref, watch } from 'vue'

import { WIDTH_OF_TITLE_BAR } from './types'
import { useAutoOpen } from './useAutoOpen'
import { DragOptions } from './useDrag'
import { useDragEx } from './useDragEx'
import { useLastPosAndSize } from './useLastPosAndSize'
import { useLeftPosAndWidth } from './useLeftPosAndWidth'
import { useResize } from './useResize'
import { useTransition } from './useTransition'

/**
 * Get the bounding rect of the tool palette.
 * - If it is the first time to show the tool palette, return the initial size and position from CSS
 * - Otherwise, return the size and postion after resized
 * @param toolPaletteRef Input the tool palette element to get its bounding rect
 * @param titleBarRef Input the title bar element of the tool palette
 * @param collapsed Input flag to indicate whether the tool palette is collapsed
 * @param dragOptions Input dragging options
 * @returns Return the following data.
 * - rect: the bounding rect of the tool palette
 * - orientation: the orientation of the tool palette. For now, 'left' and 'right' are supported.
 * - reversed: flag whether to reverse cllapse icon
 */
export function useBoundingRect(
  toolPaletteRef: Ref<HTMLElement | null>,
  titleBarRef: Ref<HTMLElement | null>,
  collapsed: Ref<boolean>,
  dragOptions: Ref<DragOptions>
) {
  const windowWidth = ref(window.innerWidth)
  const windowHeight = ref(window.innerHeight)
  const { docked, orientation, movement, position, isDragging } = useDragEx(
    toolPaletteRef,
    titleBarRef,
    dragOptions
  )
  // Flag to reverse cllapse icon
  const reversed = computed(() => {
    return orientation.value === 'right'
  })
  const { rect, isResizing } = useResize(
    toolPaletteRef,
    collapsed,
    reversed,
    dragOptions.value.offset
  )
  const { width: toolPaletteWidth, left: toolPaletteLeft } = useLeftPosAndWidth(
    rect,
    isResizing,
    position,
    isDragging
  )
  const { lastTop, lastHeight } = useLastPosAndSize(
    computed(() => rect.value.left),
    computed(() => rect.value.top),
    computed(() => rect.value.width),
    computed(() => rect.value.height)
  )
  const { autoOpened } = useAutoOpen(toolPaletteRef, titleBarRef, collapsed)
  useTransition(toolPaletteRef, reversed, collapsed, autoOpened)

  // Modify the position of this tool palette according to current orientation
  const setTargetPos = (xDelta: number) => {
    if (toolPaletteRef.value) {
      const temp = toolPaletteRef.value.getBoundingClientRect()
      const tempLeft = temp.left + xDelta
      if (reversed.value) {
        rect.value.left = tempLeft

        // If the following conditions are met, decrease the distance between the right side of tool palette and right side of window
        // - the distance between the right side of tool palette and right side of window equal to or greater than 0,
        // - The left side of window overlaps with the left side of tool platte
        const rightOffset = window.innerWidth - temp.width - temp.left
        if (temp.left <= 0 && rightOffset >= 0 && xDelta < 0) {
          rect.value.left = Math.max(0, tempLeft)
        }

        // If window width is too small to contain tool palette, just keep tool palette docked on the right side of window
        if (window.innerWidth - temp.width <= 0) {
          rect.value.left = window.innerWidth - temp.width
        }
      } else {
        // The right side of window overlaps with the right side of tool platte
        if (temp.left + temp.width >= window.innerWidth && xDelta < 0) {
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

  const setLeftPosAndWidth = (shrink: boolean) => {
    if (shrink) {
      rect.value.width = WIDTH_OF_TITLE_BAR
      if (reversed.value && toolPaletteLeft.value && toolPaletteWidth.value) {
        rect.value.left =
          toolPaletteLeft.value + toolPaletteWidth.value - WIDTH_OF_TITLE_BAR
      }
    } else {
      rect.value.width = toolPaletteWidth.value
      if (reversed.value && toolPaletteLeft.value && toolPaletteWidth.value) {
        rect.value.left = toolPaletteLeft.value
      }
    }
  }

  const setDockedHeight = () => {
    if (docked.value) {
      rect.value.top = dragOptions.value.offset.value.top
      rect.value.height =
        window.innerHeight -
        dragOptions.value.offset.value.top -
        dragOptions.value.offset.value.bottom
    } else {
      rect.value.top = lastTop.value
      rect.value.height = lastHeight.value
    }
  }

  watch(docked, () => {
    setDockedHeight()
  })

  // Watch collapsed state. If it is collapsed, store the old width in order to reuse it when expanding the tool palette
  watch(collapsed, newVal => {
    setLeftPosAndWidth(newVal)
  })

  watch(autoOpened, newVal => {
    // `autoOpened` takes effect only if `collapsed` is true.
    if (collapsed.value && !isDragging.value) {
      setLeftPosAndWidth(!newVal)
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

  return { rect, orientation, reversed }
}
