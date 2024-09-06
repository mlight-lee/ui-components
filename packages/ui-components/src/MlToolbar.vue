<template>
  <el-button-group :class="buttonGroupClass">
    <el-tooltip         
      v-for="(item, index) in items"
      :key="item.text"
      :content="buttonTooltip(item)"
    >
      <el-button
        :style="{ width: buttonSize + 'px', height: buttonSize + 'px' }"
        :key="index"
        @click="handleCommand(item.command)"
      >
        <div class="icon-text-wrapper">
          <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
          <el-icon :size="buttonIconSize" v-html="item.icon" />
          <div v-if="isShowButtonText" class="button-text">{{ item.text }}</div>
        </div>
      </el-button>
    </el-tooltip>
  </el-button-group>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface MlButtonData {
  icon: string
  text: string
  command: string
  description: string
}

interface Props {
  items: MlButtonData[]
  size?: 'small' | 'medium'| 'large'
  layout?: 'vertical' | 'horizontal'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'large',
  layout: 'horizontal'
})

const emit = defineEmits({
  click: null
})

const buttonGroupClass = computed(() => {
  return props.layout === 'vertical' ? 'vertical-button-group' : 'horizontal-button-group'
})

const buttonIconSize = computed(() => {
  return (props.size === 'small') ? 20 : 30
})

const buttonSize = computed(() => {
  switch(props.size) {
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
  return (props.size === 'large')
})

const handleCommand = (command: string) => {
  emit('click', command)
}
</script>

<style scoped>
.vertical-button-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.horizontal-button-group {
  display: flex;
  flex-direction: row;
}

.custom-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.icon-text-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.button-text {
  margin-left: 0px;
  margin-top: 8px;
}
</style>
