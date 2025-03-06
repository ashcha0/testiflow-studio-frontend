<template>
  <div class="generate-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <script-editor />
      </el-col>
      <el-col :span="12">
        <video-preview />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import ScriptEditor from '@/components/ScriptEditor/index.vue'
import VideoPreview from '@/components/VideoPreview/index.vue'
import { useVideoStore } from '@/stores/useVideoStore'

const videoStore = useVideoStore()
</script>

<style lang="scss" scoped>
.generate-container {
  height: 100%;
  padding: 20px;
}
</style>