<template>
  <el-icon :size="iconSize" @click="handleClicked">
    <component :is="icon" />
  </el-icon>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import arrowLeft from '../svgs/arrow-left.svg'
import arrowRight from '../svgs/arrow-right.svg'

/**
 * Properties of MlCllapse component
 */
interface Props {
  /**
   * Size of collapse icon
   */
  size?: number
  /**
   * Flag whether to reverse left/right direction of icon
   */
  reverse?: boolean
}

interface Events {
  /**
   * Trigger this event when collapse icon state changed.
   * @param isCollapsed New collapse icon state
   */
  (e: 'change', isCollapsed: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 18,
  reverse: false
})
const isCollapsed = defineModel({ default: true })
const emit = defineEmits<Events>()

const icon = computed(() => {
  if (props.reverse) {
    return isCollapsed.value ? arrowLeft : arrowRight
  } else {
    return isCollapsed.value ? arrowRight : arrowLeft
  }
})

// Icon size
const iconSize = computed(() => {
  return `${props.size}px`
})

const handleClicked = () => {
  emit('change', isCollapsed.value)
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped></style>
