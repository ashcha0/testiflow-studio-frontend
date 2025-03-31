<template>
    <div class="data-view">
        <h1>数据展示</h1>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="ID" width="180" />
            <el-table-column prop="title" label="标题" width="180" />
            <el-table-column prop="created_at" label="创建时间" width="180" />
            <el-table-column prop="updated_at" label="更新时间" width="180" />
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="total" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { dataApi } from '../api/dataApi'

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

        return {
            tableData,
            currentPage,
            pageSize,
            total,
            handleSizeChange,
            handleCurrentChange
        }
    }
})
</script>

<style scoped>
.data-view {
    padding: 20px;
}
</style>