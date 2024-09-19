import { onBeforeUnmount, onMounted, Ref, watch } from 'vue'

/**
 * Add and clean transition style for the specified element
 * @param targetRef Input element to add and clean transition style
 * @param reversed Input flag whether to reverse cllapse icon
 * @param collapsed Input flag to indicate whether the element is collapsed
 */
export function useTransition(
  targetRef: Ref<HTMLElement | null>,
  reversed: Ref<boolean>,
  collapsed: Ref<boolean>,
) {
  // Clean transition logic
  function cleanTransition() {
    if (targetRef.value) {
      // Here you can clean up or reset the style after transition
      targetRef.value.style.transition = '' // Reset any inline transitions
    }
  }

  const cleanupListeners = () => {
    if (targetRef.value) {
      targetRef.value.removeEventListener('transitionend', cleanTransition)
    }
  }

  const setupListeners = () => {
    if (targetRef.value) {
      targetRef.value.addEventListener('transitionend', cleanTransition)
    }
  }

  // Attach and remove the transitionend event listener
  onMounted(() => {
    if (targetRef.value) {
      targetRef.value.addEventListener('transitionend', cleanTransition)
    }
  })

  onBeforeUnmount(() => {
    if (targetRef.value) {
      targetRef.value.removeEventListener('transitionend', cleanTransition)
    }
  })

  // Watch for changes in the targetRef, to handle cases where v-if makes the element appear/disappear
  watch(targetRef, newVal => {
    if (newVal) {
      setupListeners()
    } else {
      cleanupListeners()
    }
  })

  // Add transition style
  watch(collapsed, () => {
    if (targetRef.value) {
      const element = targetRef.value as HTMLElement
      if (reversed.value) {
        element.style.transition = 'width 0.3s ease-out, left 0.3s ease-out'
      } else {
        element.style.transition = 'width 0.3s ease'
      }
    }
  })
}
