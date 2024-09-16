<template>
  <el-dropdown @command="handleCommand">
    <el-icon size="30" class="ml-dropdown-icon">
      <svg
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
        width="1.2em"
        height="1.2em"
        data-v-63d067da=""
      >
        <path
          fill="currentColor"
          d="m18.5 10l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10h2zM10 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.62 6.301a14.864 14.864 0 0 0 2.336 1.707l-.751 1.878A17.015 17.015 0 0 1 9 13.725a16.676 16.676 0 0 1-6.201 3.548l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18.078 18.078 0 0 1 4.767 8h2.24A16.032 16.032 0 0 0 9 10.877a16.165 16.165 0 0 0 2.91-4.876L2 6V4h6V2h2zm7.5 10.885L16.253 16h2.492L17.5 12.885z"
        ></path>
      </svg>
    </el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in filteredItems"
          :key="item.text"
          :command="item.name"
        >
          {{ item.text }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Data to descibe dropdown menu item
 */
export interface MlDropdownMenuItem {
  /**
   * Key of the dropdown menu item
   */
  name: string
  /**
   * Text shown in dropdown menu item
   */
  text: string
}

/**
 * Properties of MlDropdown component
 */
interface Props {
  /**
   * Dropdown icon represented by one SVG string
   */
  icon: string
  /**
   * An array of avaiable language
   */
  items: MlDropdownMenuItem[]
  /**
   * Key of the current selected dropdown menu item
   */
  current?: string
}

const props = withDefaults(defineProps<Props>(), {
  current: undefined
})

const emit = defineEmits({
  click: null
})

// Filter out the current item
const filteredItems = computed(() => {
  return props.items.filter(item => item.name !== props.current)
})

const handleCommand = (command: string) => {
  emit('click', command)
}
</script>

<style scoped>
.ml-dropdown-icon {
  outline: none;
  border: none;
}

.ml-dropdown-icon:hover {
  outline: none;
  border: none;
}
</style>
