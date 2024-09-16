<template>
  <div class="resizable-dialog" ref="resizableElement" :style="style">
    Resizable Box
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useResize } from '../composable/useResize'

const resizableElement = ref(null)
const { style } = useResize(resizableElement)
</script>

<style>
.resizable-dialog {
  border: 1px solid;
  width: 200px; /* Initial width set in CSS */
  height: 100px; /* Initial height set in CSS */
  overflow: hidden;
}
</style>
