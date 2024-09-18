import {
  onBeforeUnmount,
  onMounted,
  Ref,
  watch
} from 'vue'

/**
 * Clean transition style in the specified element after trainsition is done
 * @param targetRef Input element to clean its transition style
 */
export function useTransition(targetRef: Ref<HTMLElement | null>) {
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
}
