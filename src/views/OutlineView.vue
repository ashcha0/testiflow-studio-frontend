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
              <el-input v-model="formData.mainContent" type="textarea" :rows="6"
                placeholder="请输入视频主要内容描述（可选）"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="generateOutline" :loading="isGenerating">生成提纲</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="12">
        <OutlinePreview :outline="outline" :isGenerating="isGenerating" :generatingSectionIndex="generatingSectionIndex"
          @generateSectionContent="generateSectionContent" @generateScript="generateScript" @saveOutline="saveOutline"
          @addSection="addSection" @deleteSection="deleteSection" @updateSectionTitle="updateSectionTitle" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { outlineApi } from '../api/outlineApi'
import OutlinePreview from '../components/OutlinePreview/index.vue'

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

// 生成章节内容相关
const generatingSectionIndex = ref(-1)

// 生成章节内容
const generateSectionContent = async (index: number) => {
  if (!outline.value || !outline.value.sections[index]) {
    ElMessage.warning('章节信息不存在')
    return
  }

  const section = outline.value.sections[index]
  if (!section.title) {
    ElMessage.warning('章节标题不能为空')
    return
  }

  try {
    generatingSectionIndex.value = index
    const response = await outlineApi.generateSectionContent(section.title)

    if (response && response.content) {
      outline.value.sections[index].content = response.content
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

// 更新章节标题
const updateSectionTitle = (index: number, title: string) => {
  if (!outline.value) return

  outline.value.sections[index].title = title
}

// 删除章节
const deleteSection = (index: number) => {
  if (!outline.value) return

  outline.value.sections.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.outline-container {
  height: 100%;
  padding: 20px;

  .input-section {
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
}
</style>