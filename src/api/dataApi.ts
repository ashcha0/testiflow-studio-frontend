import axios from 'axios'
import { useConfigStore } from '../stores/useConfigStore'

const configStore = useConfigStore()

interface GetDataListParams {
    page: number
    size: number
}

export interface DataItem {
    id: string
    name: string
    value: string
}

export const dataApi = {
    // 获取数据列表
    getDataList: async (params: GetDataListParams) => {
        const response = await axios.get('/api/data/list', {
            params,
            headers: {
                'Authorization': `Bearer ${configStore.apiKey}`
            }
        })
        return response.data
    },
    getDataById: async (id: string) => {
        try {
            const response = await axios.get(`/api/outline/${id}`, {
                headers: {
                    'Authorization': `Bearer ${configStore.apiKey}`
                }
            })
            return {
                title: response.data.title,
                outline: response.data.outline,
                createdAt: response.data.created_at
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