import axios from 'axios'
import { useConfigStore } from '../stores/useConfigStore'

const configStore = useConfigStore()

interface GenerateOutlineParams {
  title: string
  main_content?: string
}

export interface OutlineSection {
  title: string
  content?: string
}

export const outlineApi = {
  // 生成提纲
  generateOutline: async (params: GenerateOutlineParams) => {
    const response = await axios.post('/api/generate/outline', params, {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  },

  // 保存提纲
  saveOutline: async (outline: { title: string, outline: OutlineSection[] }) => {
    const response = await axios.post('/api/outline/save', outline, {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  },

  // 生成脚本
  generateScript: async (outlineId: string, options?: any) => {
    const response = await axios.post(`/api/generate/script/${outlineId}`, options, {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  },

  // 获取提纲历史
  getOutlineHistory: async () => {
    const response = await axios.get('/api/outline/history', {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  },

  // 获取提纲详情
  getOutlineDetail: async (outlineId: string) => {
    const response = await axios.get(`/api/outline/${outlineId}`, {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  }
}