<template>
  <div class="script-edit-container">
    <div class="header-actions">
      <el-button @click="goBack">返回</el-button>
      <el-button type="primary" @click="saveScript">保存脚本</el-button>
      <el-button type="success" @click="generateVideo">生成视频</el-button>
      //TODO:outline的标题没有存储在数据库的scripts表单中，需要修改数据库结构
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { outlineApi } from '../api/outlineApi'
import { videoApi } from '../api/videoApi'
import { useVideoStore } from '../stores/useVideoStore'
import { scriptApi } from '../api/scriptApi'


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
    
    // 获取提纲详情
    try {
      console.log('开始获取提纲详情，scriptId:', scriptId.value)
      const outlineResponse = await outlineApi.getOutlineDetail(scriptId.value)
      console.log('提纲详情API响应:', outlineResponse)
      
      // 尝试从响应中提取outline数据
      let outlineData = outlineResponse
      
      // 检查响应结构并提取数据
      if (!outlineData) {
        throw new Error('提纲数据为空')
      }
      
      // 检查是否有data包装
      if (outlineData.data && typeof outlineData.data === 'object') {
        console.log('从data字段提取数据')
        outlineData = outlineData.data
      }
      
      // 检查是否有outline包装
      if (outlineData.outline && Array.isArray(outlineData.outline)) {
        console.log('从outline字段提取数组数据')
        // 创建一个符合Outline接口的对象
        outline.value = {
          id: scriptId.value,
          title: outlineData.title || '未命名提纲',
          sections: outlineData.outline.map((section: any) => ({
            title: section.title || '',
            content: section.content || ''
          }))
        }
      } else if (outlineData.outline && typeof outlineData.outline === 'object') {
        console.log('从outline字段提取对象数据')
        outline.value = outlineData.outline
      } else if (outlineData.id && outlineData.title && Array.isArray(outlineData.sections)) {
        // 直接使用顶层数据
        console.log('使用顶层数据作为outline')
        outline.value = outlineData
      } else if (Array.isArray(outlineData)) {
        // 处理直接返回数组的情况
        console.log('处理直接返回的数组数据')
        outline.value = {
          id: scriptId.value,
          title: '未命名提纲',
          sections: outlineData.map((section: any) => ({
            title: section.title || '',
            content: section.content || ''
          }))
        }
      } else {
        throw new Error('无法识别的提纲数据结构')
      }
      
      console.log('最终提取的outline数据:', outline.value)
    } catch (outlineError) {
      console.error('获取提纲详情错误:', outlineError)
      ElMessage.error(`获取提纲失败: ${outlineError.message || '未知错误'}`)
    }
    
    // 获取脚本内容
    try {
      console.log('开始获取脚本内容，scriptId:', scriptId.value)
      let scriptData = null;
      
      try {
        // 直接通过ID获取脚本，后端会尝试将ID作为script_id或outline_id查询
        const scriptResponse = await scriptApi.getScriptById(scriptId.value)
        console.log('脚本内容API响应:', scriptResponse)
        scriptData = scriptResponse
        
        // 检查响应结构
        if (!scriptData) {
          throw new Error('脚本数据为空')
        }
        
        // 检查是否有data包装
        if (scriptData.data && typeof scriptData.data === 'object') {
          console.log('从data字段提取脚本数据')
          scriptData = scriptData.data
        }
        
        // 处理content字段
        if (scriptData.content === undefined || scriptData.content === null) {
          scriptContent.value = ''
          console.warn('脚本内容为空')
        } else if (typeof scriptData.content === 'string') {
          // 直接使用字符串内容
          scriptContent.value = scriptData.content
        } else if (typeof scriptData.content === 'object') {
          // 处理对象或数组类型的content
          console.log('脚本内容是对象类型，尝试转换为字符串:', scriptData.content)
          
          if (Array.isArray(scriptData.content)) {
            if (scriptData.content.length === 0) {
              scriptContent.value = ''
            } else if (scriptData.content.length > 0 && typeof scriptData.content[0] === 'object') {
              // 处理对象数组
              if (scriptData.content[0].sections) {
                const sections = scriptData.content[0].sections
                if (Array.isArray(sections) && sections.length > 0) {
                  scriptContent.value = sections[0].content || ''
                } else {
                  scriptContent.value = ''
                }
              } else {
                // 将对象数组转换为字符串
                scriptContent.value = scriptData.content.map(item => 
                  typeof item === 'object' ? JSON.stringify(item) : String(item)
                ).join('\n')
              }
            } else {
              // 简单数组，直接连接
              scriptContent.value = scriptData.content.map(String).join('\n')
            }
          } else {
            // 非数组对象，转为JSON字符串
            scriptContent.value = JSON.stringify(scriptData.content, null, 2)
          }
        } else {
          // 其他类型转为字符串
          scriptContent.value = String(scriptData.content)
        }
        
        console.log('设置脚本内容成功，长度:', scriptContent.value.length)
        if (scriptContent.value.length > 0) {
          console.log('脚本内容前100个字符:', scriptContent.value.substring(0, 100))
        } else {
          console.log('脚本内容为空')
        }
      } catch (error) {
        // 如果获取脚本内容失败（例如404错误），使用空字符串作为默认值
        console.warn('获取脚本内容失败，使用空字符串作为默认值:', error)
        scriptContent.value = ''
        // 显示提示信息，告知用户这是一个新脚本
        ElMessage.info('这是一个新脚本，请编写内容后保存')
        // 不抛出异常，允许用户创建新脚本
      }
    } catch (scriptError) {
      console.error('获取脚本内容错误:', scriptError)
      scriptContent.value = ''
      ElMessage.error(`获取脚本内容失败: ${scriptError.message || '未知错误'}`)
    }
  } catch (error) {
    ElMessage.error(`加载失败: ${error.message || '未知错误'}`)
    console.error('加载脚本错误:', error)
  } finally {
    isLoading.value = false
    // 确认数据绑定状态
    console.log('加载完成，数据状态:', {
      'outline存在': !!outline.value,
      'outline标题': outline.value?.title,
      'outline章节数': outline.value?.sections?.length,
      'scriptContent长度': scriptContent.value.length,
      'isLoading': isLoading.value
    })
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
  
  if (!outline.value?.title) {
    ElMessage.warning('提纲标题不能为空')
    return
  }
  
  // 使用scriptId作为outline_id，确保即使在API返回的数据结构不完整的情况下也能保存
  const outlineId = outline.value?.id || scriptId.value
  
  if (!outlineId) {
    ElMessage.warning('提纲ID不存在')
    return
  }
  
  try {
    console.log('保存脚本，参数:', {
      scriptContent: scriptContent.value.substring(0, 50) + '...',
      title: outline.value.title,
      outlineId
    })
    // 调用保存脚本的API，传递outline_id参数
    await scriptApi.saveScript(scriptContent.value, outline.value.title, outlineId)
    ElMessage.success('脚本保存成功')
    
    // 如果是新创建的脚本，保存后更新URL中的ID参数
    if (scriptId.value !== outlineId) {
      scriptId.value = outlineId
      // 更新路由，但不重新加载页面
      router.replace({ name: route.name, params: { id: outlineId } })
    }
  } catch (error: any) {
    ElMessage.error(`保存失败: ${error.message || '未知错误'}`)
    console.error('保存脚本错误:', error)
  }
}

// 重新生成脚本
const regenerateScript = async () => {
  // 使用scriptId作为outline_id，确保即使在API返回的数据结构不完整的情况下也能重新生成
  const outlineId = outline.value?.id || scriptId.value
  
  if (!outlineId) {
    ElMessage.warning('提纲数据不存在')
    return
  }
  
  try {
    isLoading.value = true
    console.log('开始重新生成脚本，outlineId:', outlineId)
    
    // 构建生成脚本的选项
    const options = {
      title: outline.value?.title || ''
    }
    
    // 如果有提纲章节，添加到选项中
    if (outline.value?.sections && outline.value.sections.length > 0) {
      options.sections = outline.value.sections
    }
    
    const response = await outlineApi.generateScript(outlineId, options)
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