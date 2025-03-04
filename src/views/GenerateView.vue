<template>
  <div class="generate-container">
    <el-container>
      <el-header>
        <h1>视频生成工作台</h1>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="12">
            <script-editor />
          </el-col>
          <el-col :span="12">
            <video-preview />
          </el-col>
        </el-row>
      </el-main>
    </el-container>
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
  
  .el-header {
    background-color: #f5f7fa;
    padding: 15px;
    display: flex;
    align-items: center;
    
    h1 {
      margin: 0;
      font-size: 20px;
    }
  }
  
  .el-main {
    padding: 20px;
  }
}
</style>