<template>
  <div class="app-container">
    <el-config-provider :locale="zhCn" :size="'default'" :button="{ autoInsertSpace: true }" :message="{ max: 3 }">
      <router-view />
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// App根组件
</script>

<style lang="scss">
.app-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>