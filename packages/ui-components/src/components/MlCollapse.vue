<template>
  <div>
    <el-icon v-if="!isCollapsed" :size="iconSize" @click="handleCollapsed">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="M609.408 149.376L277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0a30.59 30.59 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.59 30.59 0 0 0 0-42.688a29.12 29.12 0 0 0-41.728 0"/></svg>
    </el-icon>
    <el-icon v-if="isCollapsed" :size="iconSize" @click="handleExpanded">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="M340.864 149.312a30.59 30.59 0 0 0 0 42.752L652.736 512L340.864 831.872a30.59 30.59 0 0 0 0 42.752a29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"/></svg>
    </el-icon>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

/**
 * Properties of MlCllapse component
 */
interface Props {
  /**
   * Size of collapse icon
   */
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 18,
})
const isCollapsed = defineModel({ default: true })
const emit = defineEmits({
  change: null
})

// Icon size
const iconSize = computed(() => {
  return `${props.size}px`
})

const handleCollapsed = () => {
  isCollapsed.value = true
  emit('change', true)
}

const handleExpanded = () => {
  isCollapsed.value = false
  emit('change', false)
}
</script>

<style scoped>
</style>
