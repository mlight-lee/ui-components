<template>
  <el-button-group :class="buttonGroupClass">
    <el-tooltip
      v-for="(item, index) in items"
      :key="item.text"
      :content="buttonTooltip(item)"
      :hide-after="0"
    >
      <el-button
        class="ml-toolbar-button"
        :style="{ width: buttonSize + 'px', height: buttonSize + 'px' }"
        :key="index"
        @click="handleCommand(item.command)"
      >
        <div>
          <el-icon :size="buttonIconSize">
            <component :is="item.icon" />
          </el-icon>
          <div v-if="isShowButtonText" class="ml-toolbar-button-text">
            {{ item.text }}
          </div>
        </div>
      </el-button>
    </el-tooltip>
  </el-button-group>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { MlIconType } from './types'

/**
 * Data to descibe button appearance
 */
export interface MlButtonData {
  /**
   * Icon represented by one vue component
   */
  icon: MlIconType
  /**
   * Text shown below icon
   */
  text: string
  /**
   * Command string which will be passed to click event as event arguments
   */
  command: string
  /**
   * Tooltips content when hover
   */
  description?: string
}

/**
 * Properties of MlToolBar component
 */
interface Props {
  /**
   * An array of button data
   */
  items: MlButtonData[]
  /**
   * Button size.
   * - small: 30px
   * - medium: 50px
   * - large: 70px
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Layout type.
   * - vertical: arrange button vertically
   * - horizontal: arrange button horizontally
   */
  direction?: 'vertical' | 'horizontal'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'large',
  layout: 'horizontal'
})

const emit = defineEmits({
  click: null
})

const buttonGroupClass = computed(() => {
  return props.direction === 'vertical'
    ? 'ml-vertical-toolbar-button-group'
    : 'ml-horizontal-toolbar-button-group'
})

const buttonIconSize = computed(() => {
  return props.size === 'small' ? 20 : 30
})

const buttonSize = computed(() => {
  switch (props.size) {
    case 'small':
      return 30
    case 'medium':
      return 50
  }
  return 70
})

const buttonTooltip = (item: MlButtonData) => {
  return item.description ? item.description : item.text
}

const isShowButtonText = computed(() => {
  return props.size === 'large'
})

const handleCommand = (command: string) => {
  emit('click', command)
}
</script>

<style scoped>
.ml-vertical-toolbar-button-group {
  display: flex;
  flex-direction: column;
}

.ml-horizontal-toolbar-button-group {
  display: flex;
  flex-direction: row;
}

.ml-toolbar-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.ml-toolbar-button-text {
  margin-left: 0px;
  margin-top: 5px;
}
</style>
