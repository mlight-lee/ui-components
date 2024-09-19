import { onMounted, onUnmounted, Ref, ref,watch } from 'vue'

/**
 * Roll open and closed when the mouse moves across the tool palette. It takes effect only if `collapsed` is true.
 * @param toolPaletteRef Input the tool palette element
 * @param titleBarRef Input the title bar element of the tool palette
 * @return Return flag whether to open or close the tool palette
 */
export function useAutoOpen(
  toolPaletteRef: Ref<HTMLElement | null>,
  titleBarRef: Ref<HTMLElement | null>,
  collapsed: Ref<boolean>
) {
  // Flag to indicate whether the tool palette is opened automatically. 
  // It is valid only if `collapsed` is true.
  const autoOpened = ref(false)

  const hideToolPaletteAsNeeded = (e: MouseEvent) => {
    if (collapsed.value && toolPaletteRef.value) {
      const rect = toolPaletteRef.value.getBoundingClientRect()
      const isOutside =
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
      autoOpened.value = !isOutside
    }
  }

  const showToolPalette = () => {
    if (collapsed.value) autoOpened.value = true
  }

  const addEventListeners = () => {
    if (titleBarRef.value) {
      titleBarRef.value.addEventListener('mousemove', showToolPalette)
    }
    if (toolPaletteRef.value) {
      toolPaletteRef.value.addEventListener('mousemove', showToolPalette)
    }
  }

  const removeEventListeners = () => {
    if (titleBarRef.value) {
      titleBarRef.value.removeEventListener('mousemove', showToolPalette)
    }
    if (toolPaletteRef.value) {
      toolPaletteRef.value.removeEventListener('mousemove', showToolPalette)
    }
  }

  onMounted(() => {
    window.addEventListener('mousemove', hideToolPaletteAsNeeded)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', hideToolPaletteAsNeeded)
  })

  // If the tool palette is collpased, autoOpen must be 'false'.
  watch(collapsed, newVal => {
    if (newVal) {
      autoOpened.value = false
    }
  })

  // Watch for changes in the toolPaletteRef, to handle cases where v-if makes the element appear/disappear
  watch(toolPaletteRef, newVal => {
    if (newVal) {
      addEventListeners()
    } else {
      removeEventListeners()
    }
  })

  return { autoOpened }
}
