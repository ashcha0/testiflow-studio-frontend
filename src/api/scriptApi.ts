import axios from 'axios'
import { useConfigStore } from '../stores/useConfigStore'

const configStore = useConfigStore()

interface GenerateScriptParams {
  topic: string
  keywords?: string[]
  duration?: number
  style?: 'formal' | 'casual' | 'humorous'
}

interface ScriptTemplate {
  id: string
  name: string
  description: string
  content: string
}

interface GetScriptListParams {
  page: number
  size: number
}

export const scriptApi = {
  // 生成文案
  generateScript: async (params: GenerateScriptParams) => {
    const response = await axios.post('/api/script/generate', params, {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  },

  // 获取文案模板列表
  getTemplates: async () => {
    const response = await axios.get('/api/script/templates', {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  },

  // 根据ID获取模板
  getTemplateById: async (templateId: string): Promise<ScriptTemplate> => {
    const response = await axios.get(`/api/script/templates/${templateId}`, {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  },

  // 保存文案
  saveScript: async (scriptContent: string, title: string) => {
    const response = await axios.post('/api/script/save', {
      content: scriptContent,
      title: title
    }, {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  },

  // 获取脚本列表
  getScriptList: async (params: GetScriptListParams) => {
    const response = await axios.get('/api/script/list', {
      params,
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  },

  // 根据ID获取脚本详情
  getScriptById: async (id: string) => {
    try {
      const response = await axios.get(`/api/script/${id}`, {
        headers: {
          'Authorization': `Bearer ${configStore.apiKey}`
        }
      })
      return {
        outline_id: response.data.outline_id,
        title: response.data.title,
        content: response.data.content,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          throw new Error('服务器内部错误，请稍后再试')
        }
        throw error
      }
      throw error
    }
  }
}