<script setup lang="ts">
import { MlButtonData, MlStatusBar, MlToolbar } from '@mlightcad/ui-components'
import { useFullscreen } from '@vueuse/core'
import { reactive } from 'vue'

import fullScreen from '../svgs/full-screen.svg'

const { toggle } = useFullscreen()

const editSvgIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="M832 512a32 32 0 1 1 64 0v352a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h352a32 32 0 0 1 0 64H192v640h640z"/><path fill="currentColor" d="m469.952 554.24l52.8-7.552L847.104 222.4a32 32 0 1 0-45.248-45.248L477.44 501.44l-7.552 52.8zm422.4-422.4a96 96 0 0 1 0 135.808l-331.84 331.84a32 32 0 0 1-18.112 9.088L436.8 623.68a32 32 0 0 1-36.224-36.224l15.104-105.6a32 32 0 0 1 9.024-18.112l331.904-331.84a96 96 0 0 1 135.744 0z"/></svg>'
const deleteSvgIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32zm448-64v-64H416v64zM224 896h576V256H224zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32m192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32"/></svg>'
const searchSvgIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="m795.904 750.72l124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704a352 352 0 0 0 0 704"/></svg>'

const data = reactive<MlButtonData[]>([
  {
    icon: editSvgIcon,
    text: 'Edit',
    command: 'edit',
    description: 'This is description for edit button'
  },
  {
    icon: deleteSvgIcon,
    text: 'Delete',
    command: 'delete',
    description: 'This is description for delete button'
  },
  {
    icon: searchSvgIcon,
    text: 'Search',
    command: 'search',
    description: 'This is description for search button'
  }
])

const handleCommand = (command: string) => {
  console.log(command)
}
</script>

<template>
  <ml-toolbar
    class="horizontal-toolbar-container"
    :items="data"
    direction="horizontal"
    @click="handleCommand"
  />
  <ml-toolbar
    class="vertical-toolbar-container"
    :items="data"
    direction="vertical"
    size="small"
    @click="handleCommand"
  />
  <ml-status-bar>
    <!-- Left Slot Content -->
    <template #left>
      <el-radio-group v-model="model">
        <el-radio-button value="model">model</el-radio-button>
        <el-radio-button value="layout1">layout 1</el-radio-button>
        <el-radio-button value="layout2">layout 2</el-radio-button>
      </el-radio-group>
    </template>

    <!-- Right Slot Content -->
    <template #right>
      <el-icon :size="15" style="cursor: pointer;" @click="toggle">
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
