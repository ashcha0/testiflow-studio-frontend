<template>
    <div class="data-view">
        <h1>数据展示</h1>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="ID" width="180" />
            <el-table-column prop="title" label="标题" width="180" />
            <el-table-column prop="created_at" label="创建时间" width="180" />
            <el-table-column prop="updated_at" label="更新时间" width="180" />
            <el-table-column label="操作" width="120">
                <template #default="scope">
                    <el-button size="small" type="primary" @click="handleViewDetail(scope.row)">
                        查看详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="total" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { dataApi } from '../api/dataApi'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
    name: 'DataView',
    setup() {
        const tableData = ref([])
        const currentPage = ref(1)
        const pageSize = ref(10)
        const total = ref(0)

        const fetchData = async () => {
            try {
                const res = await dataApi.getDataList({
                    page: currentPage.value,
                    size: pageSize.value
                })
                tableData.value = res.data
                total.value = res.total
            } catch (error) {
                console.error(error)
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

        const handleViewDetail = async (row: any) => {
            try {
                const detail = await dataApi.getDataById(row.id)
                ElMessageBox.alert(
                    `<div>
                            <h3>${detail.title}</h3>
                            <p>创建时间: ${detail.createdAt}</p>
                            <ul>
                                ${detail.outline.map((item: any) =>
                        `<li>
                                        <strong>${item.title}</strong>
                                        <p>${item.content}</p>
                                    </li>`
                    ).join('')}
                            </ul>
                        </div>`,
                    '提纲详情',
                    {
                        dangerouslyUseHTMLString: true
                    }
                )
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    ElMessage.error('请求的资源不存在')
                } else {
                    ElMessage.error('获取详情失败')
                }
                console.error(error)
            }
        }

        return {
            tableData,
            currentPage,
            pageSize,
            total,
            handleSizeChange,
            handleCurrentChange,
            handleViewDetail,
        }
    }
})
</script>

<style scoped>
.data-view {
    padding: 20px;
}
</style>