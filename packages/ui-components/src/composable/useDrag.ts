import {
  computed,
  onMounted,
  onUnmounted,
  Ref,
  ref,
  watch
} from 'vue'

import { Offset, Position } from './types'

/**
 * Options to use `useDrag`
 */
export interface DragOptions {
  /**
   * The minimum distance from the side of the element to the side of the window. If the position of the 
   * element `targetRef` is located in the specified offset area, just modify its position to not intersect
   * with the offset area.
   */
  offset: Ref<Offset>
}

/**
 * Drag `targetRef` element to move it
 * @param targetRef Input element to drag
 * @param dragElementRef If it isn't null, `targetRef` can be dragged only if
 * start dragging from this element.
 * @param options Input dragging options to customize dragging behaviors
 * @returns Return the following data
 * - isDragging: flag to indicate whether the element is in dragging state
 * - movement: movement based on the original position of the element
 * - position: new left and top position of the element after dragged
 */
export function useDrag(
  targetRef: Ref<HTMLElement | null>,
  dragElementRef?: Ref<HTMLElement | null>,
  options?: Ref<DragOptions>
) {
  const isDragging = ref(false)
  // The position of `targetRef` when mouse click is moving and moved
  const position = ref<Position | null>(null)
  // The initial position of `targetRef` from css
  const initialPosition = ref<Position | null>(null)
  // The mouse position when mouse click down
  const mouseStartPos = { x: 0, y: 0 }
  const movement = computed(() => {
    return (position.value == null || initialPosition.value == null) ?
      { x: 0, y: 0 } :
      {
        x: position.value.x - initialPosition.value.x,
        y: position.value.y - initialPosition.value.y
      }
  })

  const setInitialPosition = () => {
    if (targetRef.value) {
      const rect = targetRef.value.getBoundingClientRect()
      initialPosition.value = {
        x: rect.left,
        y: rect.top
      }
      position.value = {
        x: rect.left,
        y: rect.top
      }
    }
  }

  const addEventListeners = () => {
    if (targetRef.value) {
      targetRef.value.addEventListener('mousedown', onMouseDown)
    }
  }

  const removeEventListeners = () => {
    if (targetRef.value) {
      targetRef.value.removeEventListener('mousedown', onMouseDown)
    }
  }

  const onMouseDown = (event: MouseEvent) => {
    if (targetRef.value == null) return

    // If draElementRef is specified, check whether mouse clicks on `dragElementRef`
    if (dragElementRef && dragElementRef.value) {
      const rect = dragElementRef.value.getBoundingClientRect()
      const isOutside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      if (isOutside) return
    }

    isDragging.value = true
    mouseStartPos.x = event.clientX
    mouseStartPos.y = event.clientY

    setInitialPosition()
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = (e: MouseEvent) => {
    if (isDragging.value && initialPosition.value && position.value) {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const element = targetRef.value as HTMLElement
      const rect = element.getBoundingClientRect()
      const elementWidth = rect.width
      const elementHeight = rect.height

      const newX = initialPosition.value.x + (e.clientX - mouseStartPos.x)
      const newY = initialPosition.value.y + (e.clientY - mouseStartPos.y)

      // Set left/right position according to offset constraints in dragging options
      position.value.x = Math.max(
        options ? options.value.offset.value.left : 0,
        newX
      )
      const distanceToRightBorder = viewportWidth - elementWidth
      position.value.x = Math.min(
        options
          ? distanceToRightBorder - options.value.offset.value.right
          : distanceToRightBorder,
        position.value.x
      )

      // Set top/bottom position according to offset constraints in dragging options
      position.value.y = Math.max(
        options ? options.value.offset.value.top : 0,
        Math.min(newY, viewportHeight - elementHeight)
      )
      const distanceToBottomBorder = viewportHeight - elementHeight
      position.value.y = Math.min(
          options
            ? distanceToBottomBorder - options.value.offset.value.bottom
            : distanceToBottomBorder,
          position.value.y
        )

      // Update values of left and top attributes of container element
      element.style.left = position.value.x + 'px'
      element.style.top = position.value.y + 'px'
    }
  }

  const onMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  onMounted(() => {
    if (targetRef.value) {
      setInitialPosition() // Set initial position from CSS
      addEventListeners()
    }
  })

  onUnmounted(() => {
    if (targetRef.value) {
      targetRef.value.removeEventListener('mousedown', onMouseDown)
    }
  })

  // Watch for changes in the targetRef, to handle cases where v-if makes the element appear/disappear
  watch(targetRef, newVal => {
    if (newVal) {
      setInitialPosition() // Set initial position from CSS
      addEventListeners()
    } else {
      removeEventListeners()
    }
  })

  return {
    isDragging,
    movement,
    position: position
  }
}
