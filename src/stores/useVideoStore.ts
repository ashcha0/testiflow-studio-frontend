import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVideoStore = defineStore('video', () => {
  // 视频生成状态
  const isGenerating = ref(false)
  const progress = ref(0)
  const videoUrl = ref('')
  const scriptContent = ref('')
  
  // 视频生成错误信息
  const error = ref('')
  
  // 开始生成视频
  function startGenerate(script: string) {
    isGenerating.value = true
    progress.value = 0
    error.value = ''
    scriptContent.value = script
    // 这里将来会调用API
  }
  
  // 更新生成进度
  function updateProgress(newProgress: number) {
    progress.value = newProgress
  }
  
  // 生成完成
  function completeGenerate(url: string) {
    isGenerating.value = false
    progress.value = 100
    videoUrl.value = url
  }
  
  // 生成失败
  function failGenerate(errorMessage: string) {
    isGenerating.value = false
    error.value = errorMessage
  }
  
  return {
    isGenerating,
    progress,
    videoUrl,
    scriptContent,
    error,
    startGenerate,
    updateProgress,
    completeGenerate,
    failGenerate
  }
})