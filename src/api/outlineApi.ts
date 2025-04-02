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
  saveOutline: async (outline: { id?: string, title: string, outline: OutlineSection[] }) => {
    const response = await axios.post('/api/outline/save', outline, {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  },

  // 生成脚本
  generateScript: async (outlineId: string, options: any = {}) => {
    // 确保options是一个有效的对象，并包含必要的字段
    const requestBody = {
      // 先设置基本字段
      outline_id: outlineId,
      // 从options中提取特定字段，如果不存在则使用默认值
      sections: options.sections || [],
      title: options.title || '',
      raw_content: options.raw_content || ''
    };

    // 删除已处理的特定字段，避免重复
    const { sections, title, raw_content, ...restOptions } = options;

    // 合并其他选项
    Object.assign(requestBody, restOptions);

    const response = await axios.post(`/api/generate/script/${outlineId}`, requestBody, {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`,
        'Content-Type': 'application/json'
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
  },

  // 生成章节内容
  generateSectionContent: async (sectionTitle: string) => {
    const response = await axios.post('/api/generate/section', { title: sectionTitle }, {
      headers: {
        'Authorization': `Bearer ${configStore.apiKey}`
      }
    })
    return response.data
  }
}