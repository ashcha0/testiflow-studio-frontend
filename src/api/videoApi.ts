import axios from 'axios'
import { useConfigStore } from '../stores/useConfigStore'

const configStore = useConfigStore()

interface GenerateVideoParams {
  script: string
  options?: {
    resolution?: string
    format?: string
  }
}

interface GenerateVideoResponse {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  url?: string
  error?: string
}

export const videoApi = {
  // 生成视频
  generateVideo: async (params: GenerateVideoParams): Promise<GenerateVideoResponse> => {
    const response = await axios.post('/api/video/generate', params, {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  },

  // 获取生成任务状态
  getTaskStatus: async (taskId: string): Promise<GenerateVideoResponse> => {
    const response = await axios.get(`/api/video/task/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  },

  // 获取历史记录
  getHistory: async () => {
    const response = await axios.get('/api/video/history', {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  },

  // 删除历史记录
  deleteHistory: async (taskId: string) => {
    const response = await axios.delete(`/api/video/history/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  }
}