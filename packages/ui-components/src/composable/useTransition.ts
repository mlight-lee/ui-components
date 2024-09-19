import { onBeforeUnmount, onMounted, Ref, watch } from 'vue'

/**
 * Add and clean transition style for the specified element
 * @param toolPaletteRef Input tool palette to add & clean transition style
 * @param reversed Input flag whether to reverse cllapse icon
 * @param collapsed Input flag to indicate whether the element is collapsed
 */
export function useTransition(
  toolPaletteRef: Ref<HTMLElement | null>,
  reversed: Ref<boolean>,
  collapsed: Ref<boolean>,
  autoOpened: Ref<boolean>
) {
  const addTransition = () => {
    if (toolPaletteRef.value) {
      const element = toolPaletteRef.value as HTMLElement
      if (reversed.value) {
        element.style.transition = 'width 0.3s ease-out, left 0.3s ease-out'
      } else {
        element.style.transition = 'width 0.3s ease'
      }
    }
  }

  const cleanTransition = () => {
    if (toolPaletteRef.value) {
      // Here you can clean up or reset the style after transition
      toolPaletteRef.value.style.transition = '' // Reset any inline transitions
    }
  }

  const cleanupListeners = () => {
    if (toolPaletteRef.value) {
      toolPaletteRef.value.removeEventListener('transitionend', cleanTransition)
    }
  }

  const setupListeners = () => {
    if (toolPaletteRef.value) {
      toolPaletteRef.value.addEventListener('transitionend', cleanTransition)
    }
  }

  // Attach and remove the transitionend event listener
  onMounted(() => {
    if (toolPaletteRef.value) {
      toolPaletteRef.value.addEventListener('transitionend', cleanTransition)
    }
  })

  onBeforeUnmount(() => {
    if (toolPaletteRef.value) {
      toolPaletteRef.value.removeEventListener('transitionend', cleanTransition)
    }
  })

  // Watch for changes in the targetRef, to handle cases where v-if makes the element appear/disappear
  watch(toolPaletteRef, newVal => {
    if (newVal) {
      setupListeners()
    } else {
      cleanupListeners()
    }
  })

  watch(collapsed, () => {
    addTransition()
  })

  watch(autoOpened, () => {
    addTransition()
  })
}
