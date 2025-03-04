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
  }
}