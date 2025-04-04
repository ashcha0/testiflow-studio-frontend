<template>
  <div class="layout-container">
    <el-container class="layout-main">
      <el-aside width="220px" class="layout-aside">
        <div class="logo-container">
          <h1 class="logo-title">TestiFlow Studio</h1>
        </div>
        <el-menu :default-active="activeMenu" class="layout-menu" router background-color="#304156" text-color="#bfcbd9"
          active-text-color="#409EFF">
          <el-menu-item index="/">
            <el-icon>
              <VideoPlay />
            </el-icon>
            <span>视频生成工作台</span>
          </el-menu-item>
          <el-menu-item index="/outline">
            <el-icon>
              <Document />
            </el-icon>
            <span>视频提纲生成</span>
          </el-menu-item>
          <el-menu-item index="/history">
            <el-icon>
              <List />
            </el-icon>
            <span>生成历史</span>
          </el-menu-item>
          <el-menu-item index="/data">
            <el-icon>
              <DataLine />
            </el-icon>
            <span>数据展示</span>
          </el-menu-item>
          <el-menu-item index="/scripts">
            <el-icon>
              <Files />
            </el-icon>
            <span>脚本管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container class="layout-content">
        <el-header class="layout-header">
          <div class="header-title">
            <h2>{{ currentTitle }}</h2>
          </div>
          <div class="header-actions">
            <!-- 可以添加用户头像、设置按钮等 -->
          </div>
        </el-header>
        <el-main class="layout-main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Document, List, VideoPlay, Files, DataLine } from '@element-plus/icons-vue'

const route = useRoute()

// 当前激活的菜单项
const activeMenu = computed(() => {
  return route.path
})

// 当前页面标题
const currentTitle = computed(() => {
  return route.meta.title || '首页'
})
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  width: 100%;

  .layout-main {
    height: 100%;
  }

  .layout-aside {
    background-color: #304156;
    color: #fff;
    overflow: hidden;

    .logo-container {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #263445;

      .logo-title {
        margin: 0;
        font-size: 18px;
        color: #fff;
      }
    }

    .layout-menu {
      border-right: none;
    }
  }

  .layout-content {
    background-color: #f0f2f5;

    .layout-header {
      background-color: #fff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;

      .header-title {
        h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
      }
    }

    .layout-main-content {
      padding: 20px;
      height: calc(100vh - 60px);
      overflow-y: auto;
    }
  }
}
</style>