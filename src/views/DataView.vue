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

        <!-- 提纲详情对话框 -->
        <el-dialog v-model="dialogVisible" title="提纲详情" width="60%" destroy-on-close>
            <OutlinePreview :outline="currentOutline" :isGenerating="false"
                :generatingSectionIndex="generatingSectionIndex" v-if="currentOutline"
                @generateSectionContent="generateSectionContent" @generateScript="generateScript"
                @saveOutline="saveOutline" @addSection="addSection" @deleteSection="deleteSection"
                @updateSectionTitle="updateSectionTitle" />
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { dataApi } from '../api/dataApi'
import { outlineApi } from '../api/outlineApi'
import { ElMessage, ElMessageBox } from 'element-plus'
import OutlinePreview from '../components/OutlinePreview/index.vue'
import router from '../router'

export default defineComponent({
    name: 'DataView',
    components: {
        OutlinePreview
    },
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

        // 对话框显示状态
        const dialogVisible = ref(false)
        // 当前查看的提纲数据
        const currentOutline = ref(null)

        // 生成章节内容相关
        const generatingSectionIndex = ref(-1)

        const handleViewDetail = async (row: any) => {
            try {
                const detail = await dataApi.getDataById(row.id)

                // 将API返回的数据转换为OutlinePreview组件所需的格式
                currentOutline.value = {
                    id: row.id,
                    title: detail.title,
                    sections: detail.outline.map((item: any) => ({
                        title: item.title,
                        content: item.content
                    }))
                }

                // 显示对话框
                dialogVisible.value = true
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    ElMessage.error('请求的资源不存在')
                } else {
                    ElMessage.error('获取详情失败')
                }
                console.error(error)
            }
        }

        // 生成章节内容
        const generateSectionContent = async (index: number) => {
            if (!currentOutline.value || !currentOutline.value.sections[index]) {
                ElMessage.warning('章节信息不存在')
                return
            }

            const section = currentOutline.value.sections[index]
            if (!section.title) {
                ElMessage.warning('章节标题不能为空')
                return
            }

            try {
                generatingSectionIndex.value = index
                const response = await outlineApi.generateSectionContent(section.title)

                if (response && response.content) {
                    currentOutline.value.sections[index].content = response.content
                    ElMessage.success('章节内容生成成功')
                } else {
                    ElMessage.warning('生成内容为空，请重试')
                }
            } catch (error: any) {
                ElMessage.error(`生成章节内容失败: ${error.message || '未知错误'}`)
                console.error('生成章节内容错误:', error)

            } finally {
                generatingSectionIndex.value = -1
            }
        }

        // 生成脚本
        const generateScript = async () => {
            if (!currentOutline.value?.id) {
                ElMessage.warning('请先生成提纲')
                return
            }

            try {
                const response = await outlineApi.generateScript(currentOutline.value.id)
                ElMessage.success('脚本生成成功')
                // 跳转到脚本编辑页面
                router.push({
                    name: 'script-edit',
                    params: { id: response.id }
                })
            } catch (error: any) {
                ElMessage.error(`脚本生成失败: ${error.message || '未知错误'}`)
                console.error('生成脚本错误:', error)
            }
        }

        // 保存提纲
        const saveOutline = async () => {
            if (!currentOutline.value) {
                ElMessage.warning('没有可保存的提纲')
                return
            }

            try {
                // 调用API保存提纲到数据库
                const outlineData = {
                    id: currentOutline.value.id, // 添加ID字段，用于后端判断是更新还是创建
                    title: currentOutline.value.title,
                    outline: currentOutline.value.sections.map(section => ({
                        title: section.title,
                        content: section.content || ''
                    }))
                }

                // 使用outlineApi保存提纲数据
                await outlineApi.saveOutline(outlineData)

                ElMessage.success('提纲已保存')
                // 关闭对话框
                dialogVisible.value = false
                // 刷新数据列表
                fetchData()
            } catch (error: any) {
                ElMessage.error(`保存提纲失败: ${error.message || '未知错误'}`)
                console.error('保存提纲错误:', error)
            }
        }

        // 添加新章节
        const addSection = () => {
            if (!currentOutline.value) return

            currentOutline.value.sections.push({
                title: `新章节 ${currentOutline.value.sections.length + 1}`,
                content: ''
            })
        }

        // 更新章节标题
        const updateSectionTitle = (index: number, title: string) => {
            if (!currentOutline.value) return

            currentOutline.value.sections[index].title = title
        }

        // 删除章节
        const deleteSection = (index: number) => {
            if (!currentOutline.value) return

            currentOutline.value.sections.splice(index, 1)
        }

        return {
            tableData,
            currentPage,
            pageSize,
            total,
            dialogVisible,
            currentOutline,
            generatingSectionIndex,
            handleSizeChange,
            handleCurrentChange,
            handleViewDetail,
            generateSectionContent,
            generateScript,
            saveOutline,
            addSection,
            updateSectionTitle,
            deleteSection
        }
    }
})
</script>

<style scoped>
.data-view {
    padding: 20px;
}
</style>