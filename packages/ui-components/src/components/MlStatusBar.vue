<template>
  <div class="ml-status-bar">
    <div class="ml-status-bar-left">
      <!-- Slot for left-aligned components -->
      <slot name="left"></slot>
    </div>
    <div class="ml-status-bar-right">
      <!-- Slot for right-aligned components -->
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.ml-status-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--el-fill-color);
  box-sizing: border-box;
  border: 1px solid var(--el-border-color);
}

.ml-status-bar-left,
.ml-status-bar-right {
  display: flex;
  align-items: center;
}

.ml-status-bar-left > * {
  margin-right: 10px;
}

.ml-status-bar-right > * {
  margin-left: 10px;
}
</style>
