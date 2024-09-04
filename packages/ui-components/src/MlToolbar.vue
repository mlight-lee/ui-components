<template>
  <el-row>
    <el-col :span="24">
      <el-button-group>
        <el-button
          :style="{ width: width + 'px', height: height + 'px' }"
          v-for="(item, index) in items"
          :key="index"
          :size="item.size"
          @click="handleCommand(item.command)"
        >
          <div class="icon-text-wrapper">
            <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
            <el-icon size="30" v-html="item.icon" />
            <div class="button-text">{{ item.text }}</div>
          </div>
        </el-button>
      </el-button-group>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
export interface MlButtonData {
  icon: string
  size: 'default' | 'large' | 'small'
  text: string
  command: string
}

interface Props {
  items: MlButtonData[]
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 70,
  height: 70
})

if (props.height <= 60) {
  console.warn(
    'It is better to set height to value greater than 60 to get good experience.'
  )
}
if (props.width <= 60) {
  console.warn(
    'It is better to set width to value greater than 60 to get good experience.'
  )
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'edit':
      console.log('Edit command executed')
      break
    case 'delete':
      console.log('Delete command executed')
      break
    case 'search':
      console.log('Search command executed')
      break
    default:
      console.log('Unknown command:', command)
      break
  }
}
</script>

<style scoped>
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
