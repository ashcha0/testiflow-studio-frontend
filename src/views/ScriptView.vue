<template>
    <div class="script-view">
        <h1>脚本管理</h1>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="ID" width="180" />
            <el-table-column prop="outline_id" label="ID" width="180" />
            //todo:outline的标题没有存储在数据库的scripts表单中，需要修改数据库结构
            <el-table-column prop="title" label="标题" width="180" />
            <el-table-column prop="created_at" label="创建时间" width="180" />
            <el-table-column prop="updated_at" label="更新时间" width="180" />
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-button size="small" type="primary" @click="handleViewDetail(scope.row)">
                        查看详情
                    </el-button>
                    <el-button size="small" type="success" @click="handleEdit(scope.row)">
                        编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="total" />

        <!-- 脚本详情对话框 -->
        <el-dialog v-model="dialogVisible" title="脚本详情" width="60%" destroy-on-close>
            <div v-if="currentScript">
                <h2>{{ currentScript.title || '无标题' }}</h2>
                <el-divider></el-divider>
                <div class="script-content">
                    <pre v-if="currentScript.content">{{ currentScript.content }}</pre>
                    <div v-else class="empty-content">暂无内容</div>
                </div>
            </div>
            <div v-else class="loading-content">
                <el-empty description="无法加载脚本内容"></el-empty>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { scriptApi } from '../api/scriptApi'
import { ElMessage } from 'element-plus'
import router from '../router'

export default defineComponent({
    name: 'ScriptView',
    setup() {
        const tableData = ref([])
        const currentPage = ref(1)
        const pageSize = ref(10)
        const total = ref(0)

        const fetchData = async () => {
            try {
                const res = await scriptApi.getScriptList({
                    page: currentPage.value,
                    size: pageSize.value
                })
                tableData.value = res.data
                total.value = res.total
            } catch (error) {
                console.error(error)
                ElMessage.error('获取脚本列表失败')
            }
        }

        const handleSizeChange = (val: number) => {
            pageSize.value = val
            fetchData()
        }

        const handleCurrentChange = (val: number) => {
            currentPage.value = val
            fetchData()
        }

        fetchData()

        // 对话框显示状态
        const dialogVisible = ref(false)
        // 当前查看的脚本数据
        interface Script {
            id: string;
            title: string;
            content: string;
            created_at: string;
            updated_at: string;
        }
        
        const currentScript = ref<Script | null>(null)

        const handleViewDetail = async (row: any) => {
            try {
                const detail = await scriptApi.getScriptById(row.id)
                // 处理可能不完整的数据
                if (!detail) {
                    throw new Error('获取脚本数据失败')
                }
                
                // 处理content字段，确保空数组或"[]"字符串被视为空内容
                let content = detail.content;
                if (Array.isArray(content) && content.length === 0) {
                    content = '';
                } else if (content === '[]') {
                    content = '';
                }
                
                // 确保数据字段存在，如果不存在则提供默认值
                currentScript.value = {
                    id: detail.outline_id || row.id,
                    title: detail.title || '无标题',
                    content: content || '暂无内容',
                    created_at: detail.created_at || row.created_at || '',
                    updated_at: detail.updated_at || row.updated_at || ''
                }
                dialogVisible.value = true
            } catch (error: unknown) {
                if ((error as any)?.response && (error as any).response.status === 404) {
                    ElMessage.error('请求的资源不存在')
                } else {
                    ElMessage.error('获取详情失败')
                }
                console.error(error)
            }
        }

        const handleEdit = (row: any) => {
            router.push({
                name: 'script-edit',
                params: { id: row.outline_id }
            })
        }

        return {
            tableData,
            currentPage,
            pageSize,
            total,
            dialogVisible,
            currentScript,
            handleSizeChange,
            handleCurrentChange,
            handleViewDetail,
            handleEdit
        }
    }
})
</script>

<style scoped>
.script-view {
    padding: 20px;
}

.script-content {
    background-color: #f5f7fa;
    padding: 15px;
    border-radius: 4px;
    max-height: 400px;
    overflow-y: auto;
}

.script-content pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    margin: 0;
    font-family: 'Courier New', Courier, monospace;
}

.empty-content {
    color: #909399;
    text-align: center;
    padding: 20px 0;
}

.loading-content {
    padding: 30px 0;
}
</style>