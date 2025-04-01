<template>
    <div class="outline-section">
        <h2>提纲预览</h2>
        <div v-if="isGenerating" class="generating-placeholder">
            <el-skeleton :rows="10" animated />
        </div>
        <div v-else-if="outline" class="outline-content">
            <h3>{{ outline.title }}</h3>
            <el-divider></el-divider>
            <div class="outline-items">
                <div v-for="(section, index) in outline.sections" :key="index" class="outline-item">
                    <div class="outline-item-header">
                        <h4>{{ index + 1 }}. {{ section.title }}</h4>
                        <div class="outline-item-actions" v-if="!props.readOnly">
                            <el-button type="text" size="small" @click="editSectionTitle(index)">
                                <el-icon>
                                    <Edit />
                                </el-icon>
                            </el-button>
                            <el-button type="text" size="small" @click="deleteSection(index)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </el-button>
                        </div>
                    </div>
                    <el-input v-if="!props.readOnly" v-model="outline.sections[index].content" type="textarea" :rows="3"
                        placeholder="请输入章节内容" resize="none"></el-input>
                    <div v-else class="section-content">{{ section.content }}</div>
                    <div class="outline-item-actions" style="margin-top: 5px;" v-if="!props.readOnly">
                        <el-button type="primary" size="small" @click="generateSectionContent(index)"
                            :loading="generatingSectionIndex === index">
                            生成正文
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="outline-add-section" v-if="!props.readOnly">
                <el-button type="primary" plain @click="addSection" icon="Plus">添加章节</el-button>
            </div>
            <div class="outline-actions" v-if="!props.readOnly">
                <el-button type="success" @click="generateScript" :disabled="!outline.id">生成脚本</el-button>
                <el-button @click="saveOutline">保存提纲</el-button>
            </div>
        </div>
        <div v-else class="empty-outline">
            <el-empty description="暂无提纲内容" />
        </div>
    </div>

    <!-- 编辑章节标题对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑章节标题" width="30%">
        <el-input v-model="editingSectionTitle" placeholder="请输入章节标题"></el-input>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmEditTitle">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, Plus } from '@element-plus/icons-vue'

// 定义组件接收的属性
interface OutlineSection {
    title: string
    content?: string
}

interface Outline {
    id: string
    title: string
    sections: OutlineSection[]
}

const props = defineProps<{
    outline: Outline | null
    isGenerating: boolean
    generatingSectionIndex: number
    readOnly?: boolean
}>()

// 定义组件发出的事件
const emit = defineEmits<{
    (e: 'generateSectionContent', index: number): void
    (e: 'generateScript'): void
    (e: 'saveOutline'): void
    (e: 'addSection'): void
    (e: 'deleteSection', index: number): void
    (e: 'updateSectionTitle', index: number, title: string): void
}>()

// 编辑章节标题相关
const dialogVisible = ref(false)
const editingSectionTitle = ref('')
const editingSectionIndex = ref(-1)

// 生成章节内容
const generateSectionContent = (index: number) => {
    emit('generateSectionContent', index)
}

// 生成脚本
const generateScript = () => {
    emit('generateScript')
}

// 保存提纲
const saveOutline = () => {
    emit('saveOutline')
}

// 添加新章节
const addSection = () => {
    emit('addSection')
}

// 编辑章节标题
const editSectionTitle = (index: number) => {
    if (!props.outline) return

    editingSectionIndex.value = index
    editingSectionTitle.value = props.outline.sections[index].title
    dialogVisible.value = true
}

// 确认编辑标题
const confirmEditTitle = () => {
    if (!props.outline || editingSectionIndex.value < 0) return

    emit('updateSectionTitle', editingSectionIndex.value, editingSectionTitle.value)
    dialogVisible.value = false
}

// 删除章节
const deleteSection = (index: number) => {
    if (!props.outline) return

    ElMessageBox.confirm(
        '确定要删除这个章节吗？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            emit('deleteSection', index)
            ElMessage.success('章节已删除')
        })
        .catch(() => {
            // 用户取消删除操作
        })
}
</script>

<style lang="scss" scoped>
.outline-section {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
    height: calc(100vh - 150px);
    overflow-y: auto;

    h2 {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 18px;
    }
}

.outline-content {
    h3 {
        font-size: 18px;
        margin-top: 0;
    }

    .outline-items {
        margin-bottom: 20px;

        .outline-item {
            margin-bottom: 15px;

            .outline-item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;

                h4 {
                    margin: 0;
                    font-size: 16px;
                }

                .outline-item-actions {
                    display: flex;
                    gap: 5px;
                }
            }

            p {
                margin: 0;
                color: #606266;
            }
        }
    }

    .outline-add-section {
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
    }

    .outline-actions {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
}

.empty-outline,
.generating-placeholder {
    height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.section-content {
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 4px;
    min-height: 60px;
    white-space: pre-wrap;
    line-height: 1.5;
}
</style>