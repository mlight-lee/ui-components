import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  Ref,
  ref,
  watch
} from 'vue'

import { Position } from './types'

/**
 * Options to use `useDrag`
 */
export interface DragOptions {
  /**
   * The minimum distance from the left border of the element to the left border of the window
   */
  leftGap: number
  /**
   * The minimum distance from the right border of the element to the right border of the window
   */
  rightGap: number
  /**
   * The container HTML element. Its left and top attributes will be modified when mouse is moving.
   */
  container: HTMLElement | null
}

/**
 * Drag `targetRef` element to move it
 * @param targetRef Input element to drag
 * @param options Input dragging options to customize dragging behaviors
 * @returns Return thefollowing data
 * - isDragging: flag to indicate whether the element is in dragging state
 * - movement: movement based on the original position of the element
 * - position: new left and top position of the element after dragged
 */
export function useDrag(
  targetRef: Ref<HTMLElement | null>,
  options?: Ref<DragOptions>
) {
  const isDragging = ref(false)
  const position = ref<Position>({ x: 0, y: 0 })
  const initialPosition = ref<Position>({ x: 0, y: 0 }) // Initial CSS position
  const movement = computed(() => {
    return {
      x: position.value.x - initialPosition.value.x,
      y: position.value.y - initialPosition.value.y
    }
  })

  const setInitialPosition = () => {
    if (targetRef.value) {
      const rect = targetRef.value.getBoundingClientRect()
      initialPosition.value.x = rect.left
      initialPosition.value.y = rect.top
      position.value.x = rect.left
      position.value.y = rect.top
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

  const onMouseDown = () => {
    isDragging.value = true
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = (e: MouseEvent) => {
    if (isDragging.value) {
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const element = targetRef.value as HTMLElement
        const elementWidth = element.offsetWidth
        const elementHeight = element.offsetHeight

        const newX = position.value.x + e.movementX
        const newY = position.value.y + e.movementY

        position.value.x = Math.max(
          options ? options.value.leftGap : 0,
          Math.min(newX, viewportWidth - elementWidth)
        )
        const containerWidth = options && options.value.container ? options.value.container.clientWidth : 0
        const distanceToRightBorder = viewportWidth - containerWidth - elementWidth
        position.value.x = Math.min(
          options ? (distanceToRightBorder - options.value.rightGap) : distanceToRightBorder,
          position.value.x
        )
        position.value.y = Math.max(
          0,
          Math.min(newY, viewportHeight - elementHeight)
        )

        // Update values of left and top attributes of container element
        if (options?.value.container) {
          const container = options?.value.container
          // const rect = container.getBoundingClientRect()
          container.style.left = position.value.x + 'px'
          container.style.top = position.value.y + 'px'
        }
    }
  }

  const onMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  onMounted(() => {
    if (targetRef.value) {
      nextTick(() => {
        setInitialPosition() // Set initial position from CSS
        addEventListeners()
      })
    }
  })

  onUnmounted(() => {
    if (targetRef.value) {
      setInitialPosition() // Re-calculate the position when the component becomes visible
      targetRef.value.removeEventListener('mousedown', onMouseDown)
    }
  })

  // Watch for changes in the targetRef, to handle cases where v-if makes the element appear/disappear
  watch(targetRef, newVal => {
    if (newVal) {
      nextTick(() => {
        setInitialPosition() // Set initial position from CSS
        addEventListeners()
      })
    } else {
      removeEventListeners()
    }
  })

  return {
    isDragging,
    movement,
    position
  }
}
