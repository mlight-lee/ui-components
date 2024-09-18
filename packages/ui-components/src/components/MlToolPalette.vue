<template>
  <div
    ref="toolPaletteElement" 
    :style="[resizedStyle]"
    class="ml-tool-palette-dialog"
    v-if="visible"
  >
    <div class="ml-tool-palette-dialog-layout" :class="orientation">
      <div ref="titleBarElement" class="ml-tool-palette-title-bar">
        <el-icon
          :size="18"
          class="ml-tool-palette-dialog-icon"
          @click="handleClose"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 1024 1024"
          >
            <path
              fill="currentColor"
              d="M764.288 214.592L512 466.88L259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512L214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
            />
          </svg>
        </el-icon>
        <ml-collapse
          class="ml-tool-palette-dialog-icon"
          v-model="collapsed"
          :reverse="reversed"
          @change="handleCollapsed"
        />
        <span class="ml-tool-palette-title">{{ props.title }}</span>
      </div>
      <div class="ml-tool-palette-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

import { useBoundingRect } from '../composable/useBoundingRect'
import { DragOptions, useDrag } from '../composable/useDrag'
import { useTransition } from '../composable/useTransition'
import { useWindowSize } from '../composable/useWindowSize'
import MlCollapse from './MlCollapse.vue'


type TitleBarOrientation = 'left' | 'right'

/**
 * Properties of MlToolPalette component
 */
interface Props {
  /**
   * The title of tool palette dialog
   */
  title?: string
  /**
   * The initial position of the tool palette.
   */
  pos?: { x: number, y: number} 
}

interface Events {
  /**
   * Trigger this event when closing the tool palette.
   * @param pos The left and top position of the tool palette before closed
   */
  (e: 'close', pos: { x: number, y: number }): void
}

// Attributes of tool palette component
const props = withDefaults(defineProps<Props>(), {
  title: '',
  orientation: 'left'
})
// Flag to control whether the tool palette is visible
const visible = defineModel({ default: true })
const emit = defineEmits<Events>()

// Flag to indicate whether the tool palette is collapsed
const collapsed = ref<boolean>(false)
// Flag to indicate whether the tool palette is docked on the left/right border of the window
const docked = ref<boolean>(false)
// The orientation of the title bar. For now, 'left' and 'right' are supported.
const orientation = ref<TitleBarOrientation>('left')
// Referernce to title bar HTML element of tool palette
const titleBarElement = ref<HTMLElement | null>(null)
// Reference to tool palette HTML element
const toolPaletteElement = ref<HTMLElement | null>(null)

// Flag to reverse cllapse icon
const reversed = computed(() => {
  return orientation.value === 'right'
})

// Get current window size
const { windowWidth } = useWindowSize()

// Maximum left position of right border of the tool palette
const maxLeftOfToolPalette = computed(() => {
  return windowWidth.value - (toolPaletteRect.value.width || 0)
})
const dragOptions = computed<DragOptions>(() => {
  return {
    min: 0,
    max: maxLeftOfToolPalette.value,
    container: toolPaletteElement.value
  }
})
const { movement } = useDrag(titleBarElement, dragOptions)
const { rect: toolPaletteRect } = useBoundingRect(toolPaletteElement, reversed, collapsed, movement)

useTransition(toolPaletteElement)

// Resized style
const resizedStyle = computed(() => {
  return {
    left: `${toolPaletteRect.value.left}px`,
    top: `${toolPaletteRect.value.top}px`,
    width: `${toolPaletteRect.value.width}px`, 
    height: docked.value ? '100%' : `${toolPaletteRect.value.height}px` 
  }
})

const handleCollapsed = (value: boolean) => {
  collapsed.value = value
  if (toolPaletteElement.value) {
    const element = toolPaletteElement.value as HTMLElement
    element.style.transition = 'width 0.3s ease'
  }
}

const handleClose = () => {
  visible.value = false
  const element = toolPaletteElement.value
  emit('close', { 
    x: element ? element.clientLeft : 0,
    y: element ? element.clientTop : 0,
  })
}

// Watch movement of tool palette to modify `docked` flag and `orientation` flag when the tool palette
// is on the left/right border of the window
watch(movement, newVal => {
  if (newVal && toolPaletteElement.value) {
    const element = toolPaletteElement.value as HTMLElement
    const rect = element.getBoundingClientRect()
    if (rect.left <= dragOptions.value.min) {
      orientation.value = 'left'
      docked.value = true
    } else if (rect.left >= dragOptions.value.max) {
      orientation.value = 'right'
      docked.value = true
    } else {
      docked.value = false
    }
  }
})
</script>

<style scoped>
.ml-tool-palette-dialog {
  cursor: default;
  width: 300px;
  min-width: var(--collapsed-width);
  position: absolute;
  border: 1px solid;
  border-radius: 4px;
}

.ml-tool-palette-dialog-icon {
  border-bottom: 1px solid;
}

.ml-tool-palette-dialog-layout {
  display: flex;
  height: 100%;
}

.ml-tool-palette-title-bar {
  width: var(--collapsed-width);
  display: flex;
  justify-content: left;
  align-items: center;
  cursor: move; /* Draggable cursor on the left part */
  writing-mode: vertical-rl; /* Vertically align the text */
  text-align: center;
  border: 1px;
}

.ml-tool-palette-title {
  pointer-events: none; /* Prevents the text from interfering with mousedown */
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: small;
  user-select: none; /* Prevent text selection */
  white-space: nowrap; /* Prevent text from wrapping to the next line */
  overflow: hidden; /* Hide the overflowing text */
  text-overflow: ellipsis; /* Show three dots (...) for overflowing text */
}

.ml-tool-palette-content {
  pointer-events: none; /* Prevents the text from interfering with mousedown */
  user-select: none; /* Prevent text selection */
  flex-grow: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  overflow: hidden; /* Hides content when width becomes 0 */
}

/* When direction is 'left' */
.ml-tool-palette-dialog-layout.left .ml-tool-palette-title-bar {
  order: 1;
}

.ml-tool-palette-dialog-layout.left .ml-tool-palette-content {
  order: 2;
}

/* When direction is 'right' */
.ml-tool-palette-dialog-layout.right .ml-tool-palette-title-bar {
  order: 2;
}

.ml-tool-palette-dialog-layout.right .ml-tool-palette-content {
  order: 1;
}
</style>
