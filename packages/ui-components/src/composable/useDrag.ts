import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  Ref,
  ref,
  watch
} from 'vue'

/**
 * Options to use `useDrag`
 */
export interface DragOptions {
  /**
   * The minimum distance from the left border of the element to the left border of the window
   */
  min: number
  /**
   * The minimum distance from the left border of the element to the right border of the window
   */
  max: number
  /**
   * The container HTML element. Its left and top attributes will be modified when mouse is moving.
   */
  container: HTMLElement | null
}

/**
 * Drag `targetRef` element to move it
 * @param targetRef Input element to drag
 * @returns Return thefollowing data
 * - isDragging: flag to indicate whether the element is in dragging state
 * - movement: movement based on the original position of the element
 */
export function useDrag(
  targetRef: Ref<HTMLElement | null>,
  options?: Ref<DragOptions>
) {
  const isDragging = ref(false)
  const position = ref({ x: 0, y: 0 })
  const initialPosition = ref({ x: 0, y: 0 }) // Initial CSS position
  const movement = computed(() => {
    return {
      x: position.value.x - initialPosition.value.x,
      y: position.value.y - initialPosition.value.y
    }
  })
  let frameId: number | null = null

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
    if (isDragging.value && frameId === null) {
      frameId = requestAnimationFrame(() => {
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const element = targetRef.value as HTMLElement
        const elementWidth = element.offsetWidth
        const elementHeight = element.offsetHeight

        const newX = position.value.x + e.movementX
        const newY = position.value.y + e.movementY

        position.value.x = Math.max(
          options ? options.value.min : 0,
          Math.min(newX, viewportWidth - elementWidth - 1)
        )
        position.value.x = Math.min(
          options ? options.value.max : 0,
          position.value.x
        )
        position.value.y = Math.max(
          0,
          Math.min(newY, viewportHeight - elementHeight - 1)
        )

        // Update values of left and top attributes of container element
        if (options?.value.container) {
          const container = options?.value.container
          // const rect = container.getBoundingClientRect()
          container.style.left = position.value.x + 'px'
          container.style.top = position.value.y + 'px'
        }
        frameId = null // Reset for the next frame
      })
    }
  }

  const onMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
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
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
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
