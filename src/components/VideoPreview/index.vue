<template>
  <div class="video-preview-container">
    <div class="preview-header">
      <h2>视频预览</h2>
      <div class="preview-actions">
        <el-button type="primary" @click="generateVideo" :loading="videoStore.isGenerating" :disabled="!videoStore.scriptContent">生成视频</el-button>
      </div>
    </div>
    
    <div class="preview-content" v-if="videoStore.videoUrl">
      <video 
        controls 
        class="video-player"
        :src="videoStore.videoUrl"
      ></video>
    </div>
    
    <div class="preview-placeholder" v-else>
      <el-empty description="暂无视频，请先生成文案并点击生成视频" v-if="!videoStore.isGenerating"></el-empty>
      <div class="generating-status" v-else>
        <el-progress type="circle" :percentage="videoStore.progress"></el-progress>
        <p class="status-text">视频生成中，请稍候...</p>
      </div>
    </div>
    
    <div class="preview-error" v-if="videoStore.error">
      <el-alert
        title="生成失败"
        type="error"
        :description="videoStore.error"
        show-icon
      ></el-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useVideoStore } from '@/stores/useVideoStore'
import { videoApi } from '@/api/videoApi'

const videoStore = useVideoStore()

// 生成视频
const generateVideo = async () => {
  if (!videoStore.scriptContent) {
    ElMessage.warning('请先生成文案内容')
    return
  }
  
  try {
    videoStore.startGenerate(videoStore.scriptContent)
    
    // 调用生成视频API
    const result = await videoApi.generateVideo({
      script: videoStore.scriptContent
    })
    
    // 获取任务ID并开始轮询状态
    if (result.taskId) {
      pollTaskStatus(result.taskId)
    } else {
      videoStore.failGenerate('生成任务创建失败')
    }
  } catch (error) {
    videoStore.failGenerate('视频生成请求失败')
    console.error('生成视频错误:', error)
  }
}

// 轮询任务状态
const pollTaskStatus = async (taskId: string) => {
  try {
    const result = await videoApi.getTaskStatus(taskId)
    
    // 更新进度
    if (result.status === 'processing') {
      // 假设后端返回的进度在0-100之间
      videoStore.updateProgress(50) // 这里简化处理，实际应该使用后端返回的进度
      
      // 继续轮询
      setTimeout(() => pollTaskStatus(taskId), 2000)
    } else if (result.status === 'completed' && result.url) {
      // 生成完成
      videoStore.completeGenerate(result.url)
      ElMessage.success('视频生成成功')
    } else if (result.status === 'failed') {
      // 生成失败
      videoStore.failGenerate(result.error || '未知错误')
      ElMessage.error('视频生成失败')
    } else {
      // 继续轮询
      setTimeout(() => pollTaskStatus(taskId), 2000)
    }
  } catch (error) {
    videoStore.failGenerate('获取任务状态失败')
    console.error('轮询任务状态错误:', error)
  }
}
</script>

<style lang="scss" scoped>
.video-preview-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  
  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
      font-size: 18px;
    }
  }
  
  .preview-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    
    .video-player {
      max-width: 100%;
      max-height: 100%;
      border-radius: 4px;
    }
  }
  
  .preview-placeholder {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .generating-status {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .status-text {
        margin-top: 16px;
        color: #606266;
      }
    }
  }
  
  .preview-error {
    margin-top: 16px;
  }
}
</style>