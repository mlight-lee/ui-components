import { Ref, ref, watch } from 'vue'

import { Orientation } from './types'
import { DragOptions, useDrag } from './useDrag'

/**
 * One extension to `useDrag` to support docking and orientation
 * @param targetRef Input element to drag
 * @param dragElementRef If it isn't null, `targetRef` can be dragged only if
 * start dragging from this element.
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
  dragElementRef: Ref<HTMLElement | null>,
  options: Ref<DragOptions>
) {
  const docked = ref<boolean>(false)
  const orientation = ref<Orientation>('left')
  const { isDragging, movement, position } = useDrag(targetRef, dragElementRef, options)

  // Watch movement of tool palette to modify `docked` flag and `orientation` flag when the tool palette
  // is on the left/right border of the window
  watch(movement, newVal => {
    if (newVal && targetRef.value) {
      const element = targetRef.value
      const rect = element.getBoundingClientRect()
      if (rect.left <= options.value.gap.value.left) {
        orientation.value = 'left'
        docked.value = true
      } else if (
        window.innerWidth - rect.left - rect.width <=
        options.value.gap.value.right
      ) {
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
