<template>
  <div
    ref="toolPaletteElement"
    :style="[resizedStyle]"
    class="ml-tool-palette-dialog"
    v-if="visible"
  >
    <div class="ml-tool-palette-dialog-layout" :class="orientation">
      <div ref="titleBarElement" class="ml-tool-palette-title-bar" :style="titleBarBorderStyle">
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
import { computed, ref } from 'vue'

import { WIDTH_OF_TITLE_BAR } from '../composables/types'
import { useBoundingRect } from '../composables/useBoundingRect'
import { DragOptions } from '../composables/useDrag'
import MlCollapse from './MlCollapse.vue'

/**
 * Properties of MlToolPalette component
 */
interface Props {
  /**
   * The title of tool palette dialog
   */
  title?: string
  /**
   * The minimum distance from the left side of the tool palette to the left side of the window
   */
  leftOffset?: number
  /**
   * The minimum distance from the right side of the tool palette to the right side of the window
   */
  rightOffset?: number
  /**
   * The minimum distance from the top side of the tool palette to the top side of the window
   */
  topOffset?: number
  /**
   * The minimum distance from the bottom side of the tool palette to the bottom side of the window
   */
  bottomOffset?: number
}

interface Events {
  /**
   * Trigger this event when the tool palette closed.
   * @param pos The left and top position of the tool palette before closed
   */
  (e: 'close', pos: { x: number; y: number }): void
}

// Attributes of tool palette component
const props = withDefaults(defineProps<Props>(), {
  title: '',
  leftOffset: 0,
  rightOffset: 0,
  topOffset: 0,
  bottomOffset: 0
})
// Flag to control whether the tool palette is visible
const visible = defineModel({ default: true })
const emit = defineEmits<Events>()

// This varible is used in CSS
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const collapsedWidth = WIDTH_OF_TITLE_BAR
// Flag to indicate whether the tool palette is collapsed
const collapsed = ref<boolean>(false)
// Referernce to title bar HTML element of tool palette
const titleBarElement = ref<HTMLElement | null>(null)
// Reference to tool palette HTML element
const toolPaletteElement = ref<HTMLElement | null>(null)

const dragOptions = computed<DragOptions>(() => {
  return {
    offset: ref({
      left: props.leftOffset,
      right: props.rightOffset,
      top: props.topOffset,
      bottom: props.bottomOffset
    })
  }
})
const {
  rect: toolPaletteRect,
  orientation,
  reversed
} = useBoundingRect(toolPaletteElement, titleBarElement, collapsed, dragOptions)

// Resized style
const resizedStyle = computed(() => {
  return {
    left: `${toolPaletteRect.value.left}px`,
    top: `${toolPaletteRect.value.top}px`,
    width: `${toolPaletteRect.value.width}px`,
    height: `${toolPaletteRect.value.height}px`
  }
})

const titleBarBorderStyle = computed(() => {
  return reversed.value ? {
    borderLeft: '1px solid var(--el-border-color)',
    borderRight: null
  } : {
    borderLeft: null,
    borderRight: '1px solid var(--el-border-color)'
  }
})

const handleClose = () => {
  visible.value = false
  const element = toolPaletteElement.value
  emit('close', {
    x: element ? element.clientLeft : 0,
    y: element ? element.clientTop : 0
  })
}
</script>

<style scoped>
.ml-tool-palette-dialog {
  cursor: default;
  width: 300px;
  min-width: var(--collapsed-width);
  position: fixed;
  box-sizing: border-box;
  border: 1px solid var(--el-border-color);
}

.ml-tool-palette-dialog-icon {
  border-bottom: 1px solid var(--el-border-color);
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
  background-color: var(--el-fill-color);
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
  user-select: none; /* Prevent text selection */
  flex-grow: 1;
  display: flex;
  justify-content: space-around;
  background-color: var(--el-fill-color);
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
