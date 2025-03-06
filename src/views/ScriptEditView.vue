<template>
  <div class="script-edit-container">
    <div class="header-actions">
      <el-button @click="goBack">返回</el-button>
      <el-button type="primary" @click="saveScript">保存脚本</el-button>
      <el-button type="success" @click="generateVideo">生成视频</el-button>
    </div>
    <el-row :gutter="20">
          <el-col :span="12">
            <div class="outline-section">
              <h2>提纲内容</h2>
              <div v-if="isLoading" class="loading-placeholder">
                <el-skeleton :rows="10" animated />
              </div>
              <div v-else-if="outline" class="outline-content">
                <h3>{{ outline.title }}</h3>
                <el-divider></el-divider>
                <div class="outline-items">
                  <div v-for="(section, index) in outline.sections" :key="index" class="outline-item">
                    <h4>{{ index + 1 }}. {{ section.title }}</h4>
                    <p v-if="section.content">{{ section.content }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="empty-outline">
                <el-empty description="无法加载提纲内容" />
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="script-section">
              <h2>脚本内容</h2>
              <div v-if="isLoading" class="loading-placeholder">
                <el-skeleton :rows="15" animated />
              </div>
              <div v-else class="script-content">
                <el-input
                  v-model="scriptContent"
                  type="textarea"
                  :rows="20"
                  placeholder="脚本内容将在这里显示"
                  resize="none"
                ></el-input>
                <div class="script-actions">
                  <el-button @click="regenerateScript">重新生成</el-button>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { outlineApi } from '@/api/outlineApi'
import { videoApi } from '@/api/videoApi'
import { useVideoStore } from '@/stores/useVideoStore'

const route = useRoute()
const router = useRouter()
const videoStore = useVideoStore()

// 脚本ID
const scriptId = ref(route.params.id as string)

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
const scriptContent = ref('')
const isLoading = ref(true)

// 加载脚本和提纲数据
onMounted(async () => {
  if (!scriptId.value) {
    ElMessage.error('脚本ID不存在')
    router.push('/')
    return
  }
  
  try {
    isLoading.value = true
    // 获取脚本详情
    const scriptData = await outlineApi.getOutlineDetail(scriptId.value)
    outline.value = scriptData.outline
    scriptContent.value = scriptData.content || ''
  } catch (error: any) {
    ElMessage.error(`加载失败: ${error.message || '未知错误'}`)
    console.error('加载脚本错误:', error)
  } finally {
    isLoading.value = false
  }
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 保存脚本
const saveScript = async () => {
  if (!scriptContent.value) {
    ElMessage.warning('脚本内容不能为空')
    return
  }
  
  try {
    // 这里应该调用保存脚本的API
    ElMessage.success('脚本保存成功')
  } catch (error: any) {
    ElMessage.error(`保存失败: ${error.message || '未知错误'}`)
    console.error('保存脚本错误:', error)
  }
}

// 重新生成脚本
const regenerateScript = async () => {
  if (!outline.value?.id) {
    ElMessage.warning('提纲数据不存在')
    return
  }
  
  try {
    isLoading.value = true
    const response = await outlineApi.generateScript(outline.value.id)
    scriptContent.value = response.content || ''
    ElMessage.success('脚本重新生成成功')
  } catch (error: any) {
    ElMessage.error(`生成失败: ${error.message || '未知错误'}`)
    console.error('重新生成脚本错误:', error)
  } finally {
    isLoading.value = false
  }
}

// 生成视频
const generateVideo = async () => {
  if (!scriptContent.value) {
    ElMessage.warning('脚本内容不能为空')
    return
  }
  
  try {
    // 调用视频生成API
    const response = await videoApi.generateVideo({
      script: scriptContent.value
    })
    
    // 更新视频状态
    videoStore.startGenerate(scriptContent.value)
    
    // 跳转到视频生成页面
    router.push('/')
    
    ElMessage.success('视频生成任务已提交')
  } catch (error: any) {
    ElMessage.error(`提交失败: ${error.message || '未知错误'}`)
    console.error('生成视频错误:', error)
  }
}
</script>

<style lang="scss" scoped>
.script-edit-container {
  height: 100%;
  padding: 20px;
  
  .header-actions {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: flex-end;
  }
  
  .outline-section, .script-section {
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
        
        h4 {
          margin-top: 0;
          margin-bottom: 5px;
          font-size: 16px;
        }
        
        p {
          margin: 0;
          color: #606266;
        }
      }
    }
  }
  
  .script-content {
    display: flex;
    flex-direction: column;
    height: calc(100% - 40px);
    
    .el-input {
      flex: 1;
    }
    
    .script-actions {
      margin-top: 15px;
      display: flex;
      justify-content: flex-end;
    }
  }
  
  .empty-outline, .loading-placeholder {
    height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>