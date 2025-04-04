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

      // 处理content字段，确保它是字符串格式
      let content = response.data.content;

      // 如果content是数组但为空，转换为空字符串
      if (Array.isArray(content) && content.length === 0) {
        content = '';
      }
      // 如果content是非空数组，将其转换为字符串格式
      else if (Array.isArray(content)) {
        // 如果数组中的元素有sections字段，说明是结构化内容
        if (content[0] && content[0].sections) {
          const sections = content[0].sections;
          if (Array.isArray(sections) && sections.length > 0) {
            content = sections[0].content || '';
          } else {
            content = '';
          }
        } else {
          // 尝试将数组转换为字符串
          content = content.map(item => {
            if (typeof item === 'object') {
              return JSON.stringify(item);
            }
            return item;
          }).join('\n');
        }
      }

      return {
        outline_id: response.data.outline_id,
        title: response.data.title,
        content: content,
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