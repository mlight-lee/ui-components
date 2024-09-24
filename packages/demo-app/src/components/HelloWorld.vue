<script setup lang="ts">
import { Delete, Edit, Search } from '@element-plus/icons-vue'
import { MlButtonData, MlStatusBar, MlToolBar } from '@mlightcad/ui-components'
import { useFullscreen } from '@vueuse/core'
import { reactive, ref } from 'vue'

import fullScreen from '../svgs/full-screen.svg'

const { toggle } = useFullscreen()

const toolBarData = reactive<MlButtonData[]>([
  {
    icon: Edit,
    text: 'Edit',
    command: 'edit',
    description: 'This is description for edit button'
  },
  {
    icon: Delete,
    text: 'Delete',
    command: 'delete',
    description: 'This is description for delete button'
  },
  {
    icon: Search,
    text: 'Search',
    command: 'search',
    description: 'This is description for search button'
  }
])

const statusBarData = [
  {
    label: 'model',
    value: 'model',
  },
  {
    label: 'layout 1',
    value: 'layout1',
  },
  {
    label: 'layout 2',
    value: 'layout2',
  }
]

const currentModel = ref('model')

const handleCommand = (command: string) => {
  console.log(command)
}
</script>

<template>
  <ml-tool-bar
    class="horizontal-toolbar-container"
    :items="toolBarData"
    direction="horizontal"
    @click="handleCommand"
  />
  <ml-tool-bar
    class="vertical-toolbar-container"
    :items="toolBarData"
    direction="vertical"
    size="small"
    @click="handleCommand"
  />
  <ml-status-bar>
    <!-- Left Slot Content -->
    <template #left>
      <el-segmented v-model="currentModel" :options="statusBarData" />
    </template>

    <!-- Right Slot Content -->
    <template #right>
      <el-icon :size="20" style="cursor: pointer;" @click="toggle">
        <full-screen />
      </el-icon>
    </template>
  </ml-status-bar>
</template>

<style scoped>
.horizontal-toolbar-container {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
}

.vertical-toolbar-container {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
