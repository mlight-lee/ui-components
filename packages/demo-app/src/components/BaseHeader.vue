<script setup lang="ts">
import { Menu as IconMenu } from '@element-plus/icons-vue'
import {
  MlDropdownMenuItem,
  MlLanguage,
  MlToolPalette
} from '@mlightcad/ui-components'
import { ref } from 'vue'
import { reactive } from 'vue'

import { toggleDark } from '~/composables'

const toolPaletteVisible = ref<boolean>(true)
const data = reactive<MlDropdownMenuItem[]>([
  {
    name: 'en',
    text: 'English'
  },
  {
    name: 'zh',
    text: '中文'
  }
])

const handleToolPalette = () => {
  toolPaletteVisible.value = true
}

const handleClicked = () => {
  console.log('Button clicked!')
}
</script>

<template>
  <el-menu class="el-menu-demo" mode="horizontal">
    <el-menu-item index="1">MlightCAD</el-menu-item>
    <el-menu-item index="2" @click="handleToolPalette">
      <el-icon><icon-menu /></el-icon>
    </el-menu-item>
    <el-menu-item h="full" @click="toggleDark()">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--el-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>
    <el-menu-item>
      <ml-language :languages="data" current="en" />
    </el-menu-item>
  </el-menu>
  <ml-tool-palette
    class="tool-palette"
    v-model="toolPaletteVisible"
    title="Tool Palette Test"
    :top-offset="60"
    :bottom-offset="30"
  >
    <div class="tool-palette-content">
      <el-button @click="handleClicked">Tool Palette Test</el-button>
    </div>
  </ml-tool-palette>
</template>

<style scoped>
.tool-palette {
  position: fixed;
  left: 2px;
  top: 150px;
  width: 300px;
  height: 500px;
}

.tool-palette-content {
  display: flex;
  align-items: center;
}
</style>
