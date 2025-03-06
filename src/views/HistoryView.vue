<template>
  <div class="history-container">
    <el-table :data="historyList" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" width="180" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'">
            {{ scope.row.status === 'success' ? '成功' : '失败' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="viewDetail(scope.row)">查看</el-button>
          <el-button size="small" type="danger" @click="deleteItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface HistoryItem {
  id: number
  title: string
  createTime: string
  status: 'success' | 'fail'
}

const historyList = ref<HistoryItem[]>([
  {
    id: 1,
    title: '示例视频1',
    createTime: '2023-08-15 10:30:00',
    status: 'success'
  },
  {
    id: 2,
    title: '示例视频2',
    createTime: '2023-08-16 14:20:00',
    status: 'fail'
  }
])

const viewDetail = (item: HistoryItem) => {
  console.log('查看详情', item)
}

const deleteItem = (item: HistoryItem) => {
  console.log('删除项目', item)
}
</script>

<style lang="scss" scoped>
.history-container {
  height: 100%;
  padding: 20px;
}
</style>