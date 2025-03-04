<template>
  <div class="script-editor-container">
    <div class="editor-header">
      <h2>文案编辑器</h2>
      <div class="editor-actions">
        <el-button type="primary" @click="generateScript" :loading="isGenerating">生成文案</el-button>
        <el-button @click="saveScript" :disabled="!scriptContent">保存文案</el-button>
      </div>
    </div>
    
    <div class="editor-form">
      <el-form :model="formData" label-position="top">
        <el-form-item label="主题">
          <el-input v-model="formData.topic" placeholder="请输入视频主题"></el-input>
        </el-form-item>
        
        <el-form-item label="关键词">
          <el-tag
            v-for="(tag, index) in formData.keywords"
            :key="index"
            closable
            @close="removeKeyword(index)"
            class="keyword-tag"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="keywordInputRef"
            v-model="inputValue"
            class="keyword-input"
            size="small"
            @keyup.enter="addKeyword"
            @blur="addKeyword"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">
            + 添加关键词
          </el-button>
        </el-form-item>
        
        <el-form-item label="时长(秒)">
          <el-slider v-model="formData.duration" :min="30" :max="300" :step="10" show-input></el-slider>
        </el-form-item>
        
        <el-form-item label="风格">
          <el-radio-group v-model="formData.style">
            <el-radio label="formal">正式</el-radio>
            <el-radio label="casual">日常</el-radio>
            <el-radio label="humorous">幽默</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="editor-content">
      <el-input
        v-model="scriptContent"
        type="textarea"
        :rows="10"
        placeholder="文案内容将在这里显示"
      ></el-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { scriptApi } from '@/api/scriptApi'
import { useVideoStore } from '@/stores/useVideoStore'

const videoStore = useVideoStore()

// 表单数据
const formData = reactive({
  topic: '',
  keywords: [] as string[],
  duration: 60,
  style: 'casual' as 'formal' | 'casual' | 'humorous'
})

// 文案内容
const scriptContent = ref('')
const isGenerating = ref(false)

// 关键词输入相关
const inputVisible = ref(false)
const inputValue = ref('')
const keywordInputRef = ref<HTMLInputElement | null>(null)

// 显示关键词输入框
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    keywordInputRef.value?.focus()
  })
}

// 添加关键词
const addKeyword = () => {
  if (inputValue.value) {
    formData.keywords.push(inputValue.value)
    inputValue.value = ''
  }
  inputVisible.value = false
}

// 移除关键词
const removeKeyword = (index: number) => {
  formData.keywords.splice(index, 1)
}

// 生成文案
const generateScript = async () => {
  if (!formData.topic) {
    ElMessage.warning('请输入视频主题')
    return
  }
  
  try {
    isGenerating.value = true
    const result = await scriptApi.generateScript({
      topic: formData.topic,
      keywords: formData.keywords,
      duration: formData.duration,
      style: formData.style
    })
    
    scriptContent.value = result.content
    ElMessage.success('文案生成成功')
    
    // 更新视频生成状态
    videoStore.scriptContent = scriptContent.value
  } catch (error) {
    ElMessage.error('文案生成失败，请重试')
    console.error('生成文案错误:', error)
  } finally {
    isGenerating.value = false
  }
}

// 保存文案
const saveScript = async () => {
  if (!scriptContent.value) {
    ElMessage.warning('请先生成文案内容')
    return
  }
  
  try {
    await scriptApi.saveScript(scriptContent.value, formData.topic)
    ElMessage.success('文案保存成功')
  } catch (error) {
    ElMessage.error('文案保存失败，请重试')
    console.error('保存文案错误:', error)
  }
}
</script>

<style lang="scss" scoped>
.script-editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  
  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
      font-size: 18px;
    }
    
    .editor-actions {
      display: flex;
      gap: 10px;
    }
  }
  
  .editor-form {
    margin-bottom: 20px;
  }
  
  .editor-content {
    flex: 1;
    overflow: auto;
  }
  
  .keyword-tag {
    margin-right: 6px;
    margin-bottom: 6px;
  }
  
  .keyword-input {
    width: 100px;
    margin-right: 6px;
    vertical-align: bottom;
  }
}
</style>