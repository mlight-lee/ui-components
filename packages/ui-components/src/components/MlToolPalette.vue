<template>
  <div
    :style="[transitionStyle, style]"
    class="ml-tool-palette-dialog"
    v-if="visible"
  >
    <div class="ml-tool-palette-dialog-layout">
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
          @change="handleCollapsed"
        />
        <span class="ml-tool-palette-title">{{ props.title }}</span>
      </div>
      <div ref="resizableElement" class="ml-tool-palette-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { useDrag } from '../composable/useDrag'
import { useResize } from '../composable/useResize'
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
   * The location of title bar.
   * - left: title bar is at the left border of the dialog
   * - left: title bar is at the right border of the dialog
   */
  direction?: 'left' | 'right'
  width?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  direction: 'left',
  width: 300
})
const visible = defineModel({ default: true })

const widthOfTitleBar = 20
const collapsed = ref<boolean>(false)
const titleBarElement = ref<HTMLElement | null>(null)

const { movement } = useDrag(titleBarElement)
const resizableElement = ref(null)
const { style } = useResize(resizableElement)

// Width of the dialog when collapsed
const collapsedWidth = computed(() => {
  return `${widthOfTitleBar}px`
})

// Width of the dialog when collapsed
const expandedWidth = computed(() => {
  return `${props.width}px`
})

// Styles for collapsed and expanded dialog
const transitionStyle = computed(() => {
  // Adjust position and transition for collapsing/expanding
  return collapsed.value
    ? {
        width: collapsedWidth.value,
        transition: 'width 0.3s',
        transform: `translate(${movement.value.x}px, ${movement.value.y}px)`
      }
    : {
        width: expandedWidth.value,
        transition: 'width 0.3s',
        transform: `translate(${movement.value.x}px, ${movement.value.y}px)`
      }
})

const handleCollapsed = (value: boolean) => {
  collapsed.value = value
}

const handleClose = () => {
  visible.value = false
}
</script>

<style scoped>
.ml-tool-palette-dialog {
  cursor: default;
  width: 300px;
  min-width: var(--collapsed-width);
  height: 150px;
  position: absolute;
  border: 1px solid;
  border-radius: 4px;
  resize: both;
}

.ml-tool-palette-dialog-icon {
  border-bottom: 1px solid;
}

.ml-tool-palette-dialog-layout {
  display: flex;
  height: 100%;
  resize: both;
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
  flex-grow: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  overflow: hidden; /* Hides content when width becomes 0 */
}
</style>
