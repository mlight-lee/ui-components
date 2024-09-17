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
 * Drag `targetRef` element to move `elementToMove` element
 * @param targetRef Input element to drag
 * @param elementToMove Input element to move when dragging. If not specified, `targetRef` will be the 
 * element to move.
 * @returns Return thefollowing data
 * - position: new position of `elementToMove` element
 * - movement: movement based on the original position of `elementToMove` element
 * - isDragging: dragging state
 */
export function useDrag(
  targetRef: Ref<HTMLElement | null>, 
  elementToMove: Ref<HTMLElement | null> = ref(null)
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
          0,
          Math.min(newX, viewportWidth - elementWidth - 1)
        )
        position.value.y = Math.max(
          0,
          Math.min(newY, viewportHeight - elementHeight - 1)
        )
        frameId = null // Reset for the next frame

        // Move the element
        const temp = elementToMove.value || element
        const rect = temp.getBoundingClientRect()
        temp.style.left = rect.left + e.movementX + 'px'
        temp.style.top = rect.top + e.movementY + 'px'
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
        addEventListeners()
      })
    } else {
      removeEventListeners()
    }
  })

  return {
    isDragging,
    movement
  }
}
