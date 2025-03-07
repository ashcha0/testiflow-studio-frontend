<template>
  <div class="outline-container">
    <el-row :gutter="20">
          <el-col :span="12">
            <div class="input-section">
              <h2>输入信息</h2>
              <el-form :model="formData" label-position="top">
                <el-form-item label="标题">
                  <el-input v-model="formData.title" placeholder="请输入视频标题"></el-input>
                </el-form-item>
                
                <el-form-item label="主要内容">
                  <el-input
                    v-model="formData.mainContent"
                    type="textarea"
                    :rows="6"
                    placeholder="请输入视频主要内容描述（可选）"
                  ></el-input>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="generateOutline" :loading="isGenerating">生成提纲</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="12">
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
                      <div class="outline-item-actions">
                        <el-button type="text" size="small" @click="editSectionTitle(index)">
                          <el-icon><Edit /></el-icon>
                        </el-button>
                        <el-button type="text" size="small" @click="deleteSection(index)">
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </div>
                    </div>
                    <el-input
                      v-model="section.content"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入章节内容"
                      resize="none"
                    ></el-input>
                  </div>
                </div>
                <div class="outline-add-section">
                  <el-button type="primary" plain @click="addSection" icon="Plus">添加章节</el-button>
                </div>
                <div class="outline-actions">
                  <el-button type="success" @click="generateScript" :disabled="!outline.id">生成脚本</el-button>
                  <el-button @click="saveOutline">保存提纲</el-button>
                </div>
              </div>
              <div v-else class="empty-outline">
                <el-empty description="暂无提纲内容" />
              </div>
            </div>
          </el-col>
        </el-row>
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
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { outlineApi } from '../api/outlineApi'
import { Edit, Delete, Plus } from '@element-plus/icons-vue'

const router = useRouter()

// 表单数据
const formData = reactive({
  title: '',
  mainContent: ''
})

// 提纲数据
interface OutlineSection {
  title: string
  content?: string
}

interface Outline {
  id: string
  title: string
  sections: OutlineSection[]
}

const outline = ref<Outline | null>(null)
const isGenerating = ref(false)

// 编辑章节标题相关
const dialogVisible = ref(false)
const editingSectionTitle = ref('')
const editingSectionIndex = ref(-1)

// 生成提纲
const generateOutline = async () => {
  if (!formData.title) {
    ElMessage.warning('请输入视频标题')
    return
  }
  
  try {
    isGenerating.value = true
    const response = await outlineApi.generateOutline({
      title: formData.title,
      main_content: formData.mainContent || undefined
    })
    
    outline.value = response
    ElMessage.success('提纲生成成功')
  } catch (error: any) {
    ElMessage.error(`提纲生成失败: ${error.message || '未知错误'}`)
    console.error('生成提纲错误:', error)
  } finally {
    isGenerating.value = false
  }
}

// 生成脚本
const generateScript = async () => {
  if (!outline.value?.id) {
    ElMessage.warning('请先生成提纲')
    return
  }
  
  try {
    const response = await outlineApi.generateScript(outline.value.id)
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
  if (!outline.value) {
    ElMessage.warning('没有可保存的提纲')
    return
  }
  
  try {
    const response = await outlineApi.saveOutline({
      title: outline.value.title,
      outline: outline.value.sections
    })
    
    // 更新提纲ID，解除生成脚本按钮的禁用状态
    if (!outline.value.id) {
      outline.value.id = response.file_path || Date.now().toString()
    }
    
    ElMessage.success('提纲已保存')
  } catch (error: any) {
    ElMessage.error(`保存提纲失败: ${error.message || '未知错误'}`)
    console.error('保存提纲错误:', error)
  }
}

// 添加新章节
const addSection = () => {
  if (!outline.value) return
  
  outline.value.sections.push({
    title: `新章节 ${outline.value.sections.length + 1}`,
    content: ''
  })
}

// 编辑章节标题
const editSectionTitle = (index: number) => {
  if (!outline.value) return
  
  editingSectionIndex.value = index
  editingSectionTitle.value = outline.value.sections[index].title
  dialogVisible.value = true
}

// 确认编辑标题
const confirmEditTitle = () => {
  if (!outline.value || editingSectionIndex.value < 0) return
  
  outline.value.sections[editingSectionIndex.value].title = editingSectionTitle.value
  dialogVisible.value = false
}

// 删除章节
const deleteSection = (index: number) => {
  if (!outline.value) return
  
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
      outline.value!.sections.splice(index, 1)
      ElMessage.success('章节已删除')
    })
    .catch(() => {
      // 用户取消删除操作
    })
}
</script>

<style lang="scss" scoped>
.outline-container {
  height: 100%;
  padding: 20px;
  
  .input-section, .outline-section {
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
  
  .empty-outline, .generating-placeholder {
    height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>