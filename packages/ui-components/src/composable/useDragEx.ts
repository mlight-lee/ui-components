import { Ref, ref, watch } from 'vue'

import { Orientation, WIDTH_OF_TITLE_BAR } from './types'
import { DragOptions, useDrag } from './useDrag'

/**
 * One extension to `useDrag` to support docking and orientation
 * @param targetRef Input element to drag
 * @param options Input dragging options to customize dragging behaviors
 * @returns Return thefollowing data
 * - isDragging: flag to indicate whether the element is in dragging state
 * - docked: flag to indicate whether the tool palette is docked on the left/right border of the window
 * - orientation: The orientation of the element. For now, 'left' and 'right' are supported.
 * - movement: movement based on the original position of the element
 * - position: new left and top position of the element after dragged
 */
export function useDragEx(
  targetRef: Ref<HTMLElement | null>,
  options: Ref<DragOptions>
) {
  const docked = ref<boolean>(false)
  const orientation = ref<Orientation>('left')
  const { isDragging, movement, position } = useDrag(targetRef, options)

  // Watch movement of tool palette to modify `docked` flag and `orientation` flag when the tool palette
  // is on the left/right border of the window
  watch(movement, newVal => {
    if (newVal && options.value.container) {
      const element = options.value.container as HTMLElement
      const rect = element.getBoundingClientRect()
      if (rect.left <= options.value.leftGap) {
        orientation.value = 'left'
        docked.value = true
      } else if ((window.innerWidth - rect.left - rect.width - WIDTH_OF_TITLE_BAR) <= options.value.rightGap) {
        orientation.value = 'right'
        docked.value = true
      } else {
        docked.value = false
      }
    }
  })

  return {
    docked,
    orientation,
    isDragging,
    movement,
    position
  }
}
