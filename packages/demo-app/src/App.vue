<template>
  <el-config-provider namespace="ep">
    <BaseHeader />
    <div class="flex main-container">
      <div w="full" py="4">
        <HelloWorld />
      </div>
    </div>
  </el-config-provider>
</template>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 3px);
}
</style>
