# Testiflow Studio Frontend 用户手册

## 1. 项目概述

Testiflow Studio Frontend 是一个基于 Vue3 的现代化前端项目，为依案视频智能生成平台提供直观、高效的用户界面。项目采用组件化开发模式，集成了最新的前端技术栈，提供流畅的用户体验和强大的视频生成功能。

本平台支持视频提纲生成、脚本编辑、视频自动生成等核心功能，旨在简化视频内容创作流程，提高创作效率。通过直观的界面和智能化的工具，用户可以快速完成从创意到成品视频的全过程。

## 2. 技术架构

### 2.1 核心技术栈

- **开发框架**: Vue 3.3.4
- **构建工具**: Vite 4.4.9
- **状态管理**: Pinia 2.1.6
- **UI框架**: Element Plus 2.9.5
- **路由管理**: Vue Router 4.2.4
- **HTTP客户端**: Axios 1.5.0
- **TypeScript**: 5.1.6
- **样式预处理器**: SCSS

### 2.2 项目结构

```plaintext
testiflow-studio-frontend/
├── src/                    # 源代码目录
│   ├── api/               # API接口定义
│   ├── assets/            # 静态资源
│   ├── components/        # 公共组件
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理
│   ├── views/             # 页面组件
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── public/                # 公共资源
├── .env                   # 环境变量
└── vite.config.ts        # Vite配置
```

## 3. 环境要求与依赖管理

### 3.1 运行环境

- Node.js 16.0 或更高版本
- npm 7.0 或更高版本

### 3.2 依赖安装

```bash
# 安装项目依赖
npm install
```

主要依赖包：
- vue: ^3.3.4
- element-plus: ^2.9.5
- pinia: ^2.1.6
- axios: ^1.5.0
- vue-router: ^4.2.4
- @vueuse/core: ^12.8.2
- vue-draggable-next: ^2.2.1

## 4. 快速开始

### 4.1 开发环境配置

1. 克隆项目：
```bash
git clone [项目地址]
cd testiflow-studio-frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```
项目将在 http://localhost:3000 启动

### 4.2 生产环境部署

1. 构建项目：
```bash
npm run build
```

2. 预览构建结果：
```bash
npm run preview
```

## 5. 功能模块介绍

### 5.1 视频生成工作台

- **路径**: `/`
- **组件**: `GenerateView.vue`
- **功能**: 主要工作区域，集成了脚本编辑器和视频预览功能，用于视频生成配置和操作
- **使用方法**: 
  1. 在左侧脚本编辑区编写或粘贴视频脚本
  2. 点击生成按钮开始视频生成
  3. 在右侧预览区查看生成结果

### 5.2 历史记录页面

- **路径**: `/history`
- **组件**: `HistoryView.vue`
- **功能**: 展示和管理已生成的视频记录
- **使用方法**: 
  1. 查看历史生成记录
  2. 点击记录可查看详情或重新编辑

### 5.3 视频提纲生成

- **路径**: `/outline`
- **组件**: `OutlineView.vue`
- **功能**: 根据用户输入的标题和主要内容，自动生成视频提纲
- **使用方法**: 
  1. 输入视频标题和主要内容
  2. 点击生成按钮获取提纲
  3. 可编辑和调整生成的提纲
  4. 点击保存或直接生成脚本

### 5.4 脚本编辑

- **路径**: `/script/:id`
- **组件**: `ScriptEditView.vue`
- **功能**: 编辑视频脚本内容，支持从提纲自动生成脚本
- **使用方法**: 
  1. 编辑脚本内容
  2. 设置脚本参数
  3. 保存或直接生成视频

### 5.5 数据展示

- **路径**: `/data`
- **组件**: `DataView.vue`
- **功能**: 展示系统数据，支持分页查询
- **使用方法**: 
  1. 浏览数据列表
  2. 使用分页控件浏览更多数据

## 6. 系统配置

### 6.1 API密钥配置

系统使用API密钥进行身份验证，您需要设置有效的API密钥才能使用所有功能：

1. 在系统设置中找到API密钥配置选项
2. 输入您的API密钥
3. 系统会自动保存并使用该密钥进行后续请求

### 6.2 暗黑模式

系统支持明亮和暗黑两种显示模式：

1. 点击界面右上角的主题切换按钮
2. 系统会记住您的偏好设置

## 7. 常见问题

### 7.1 视频生成失败

如果视频生成失败，请检查：

1. API密钥是否正确设置
2. 网络连接是否正常
3. 脚本内容是否符合要求
4. 查看控制台错误信息以获取更多详情

### 7.2 页面加载缓慢

如果页面加载缓慢，可以尝试：

1. 检查网络连接
2. 清除浏览器缓存
3. 确保您的设备满足系统要求

## 8. 联系与支持

如需技术支持或有任何问题，请联系：

- 技术支持邮箱：support@testiflow.com
- 官方网站：https://testiflow.com
- 文档中心：https://docs.testiflow.com