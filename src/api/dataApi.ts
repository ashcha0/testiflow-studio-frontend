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
    }
}