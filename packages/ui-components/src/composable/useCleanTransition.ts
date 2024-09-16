import {
  onBeforeUnmount,
  onMounted,
  Ref,
} from 'vue'

export function useCleanTransition(targetRef: Ref<HTMLElement | null>) {
  // Clean transition logic
  function cleanTransition() {
    if (targetRef.value) {
      // Here you can clean up or reset the style after transition
      targetRef.value.style.transition = '' // Reset any inline transitions
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
}
