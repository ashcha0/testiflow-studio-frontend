# Testiflow Studio Frontend 开发文档

## 1. 项目概述

Testiflow Studio Frontend 是一个基于Vue 3的视频生成工具前端项目，旨在提供一个直观、高效的视频内容创作平台。该项目支持从文案编辑、提纲生成到最终视频渲染的全流程操作，并提供历史记录管理功能。

### 1.1 项目目标

- 提供简洁易用的视频生成工作台
- 支持文案编辑和视频预览
- 实现视频生成进度实时展示
- 提供历史记录管理功能
- 支持多语言和暗黑模式等个性化配置

## 2. 技术架构

### 2.1 技术栈

- **前端框架**: Vue 3.3.4
- **类型支持**: TypeScript 5.1.6
- **构建工具**: Vite 4.4.9
- **UI组件库**: Element Plus 2.9.5
- **状态管理**: Pinia 2.1.6
- **路由管理**: Vue Router 4.2.4
- **HTTP客户端**: Axios 1.5.0
- **样式预处理器**: SCSS

### 2.2 项目结构

```
src/
├── api/        # API接口
│   ├── dataApi.ts      # 数据展示相关API
│   ├── outlineApi.ts   # 提纲生成相关API
│   ├── scriptApi.ts    # 脚本生成相关API
│   └── videoApi.ts     # 视频生成相关API
├── assets/     # 静态资源
│   └── styles/         # 全局样式文件
├── components/ # 公共组件
│   ├── Layout/         # 布局组件
│   ├── OutlinePreview/ # 提纲预览组件
│   ├── ScriptEditor/   # 脚本编辑器组件
│   └── VideoPreview/   # 视频预览组件
├── router/     # 路由配置
│   └── index.ts        # 路由定义文件
├── stores/     # 状态管理
│   ├── useConfigStore.ts # 配置状态管理
│   └── useVideoStore.ts  # 视频状态管理
├── views/      # 页面视图
│   ├── DataView.vue      # 数据展示页面
│   ├── GenerateView.vue  # 视频生成工作台
│   ├── HistoryView.vue   # 历史记录页面
│   ├── OutlineView.vue   # 提纲生成页面
│   ├── ScriptEditView.vue # 脚本编辑页面
│   └── ScriptView.vue    # 脚本管理页面
└── App.vue     # 根组件
└── main.ts     # 入口文件
```

## 3. 功能模块详解

### 3.1 视频生成工作台 (GenerateView.vue)

视频生成工作台是应用的核心功能页面，集成了脚本编辑器和视频预览两个主要组件。

#### 3.1.1 脚本编辑器 (ScriptEditor)

脚本编辑器组件提供了以下功能：

- 主题、关键词、时长和风格等参数配置
- 文案内容编辑与预览
- 一键生成文案功能
- 文案保存功能

实现细节：
- 使用Element Plus表单组件进行参数配置
- 支持关键词的动态添加和删除
- 通过API调用生成文案内容
- 与VideoStore集成，共享文案内容

#### 3.1.2 视频预览 (VideoPreview)

视频预览组件提供了以下功能：

- 基于当前文案生成视频
- 视频生成进度实时展示
- 视频播放控制
- 错误信息展示

实现细节：
- 使用HTML5 video元素播放视频
- 通过轮询API获取视频生成进度
- 使用Element Plus进度条组件展示生成状态
- 集成错误处理和提示

### 3.2 历史记录页面 (HistoryView.vue)

历史记录页面展示用户已生成的视频列表，支持查看和删除操作。

功能特点：
- 使用Element Plus表格组件展示历史记录
- 支持按创建时间排序
- 提供状态标签区分成功和失败的生成任务
- 支持查看详情和删除操作

### 3.3 全局配置管理 (useConfigStore)

全局配置管理模块负责处理系统级配置，包括：

- API密钥管理与持久化
- 暗黑模式切换
- API基础URL配置

实现细节：
- 使用Pinia进行状态管理
- 利用localStorage实现配置持久化
- 提供配置初始化和更新方法

### 3.4 视频状态管理 (useVideoStore)

视频状态管理模块负责处理视频生成相关的状态：

- 视频生成状态跟踪
- 生成进度管理
- 文案内容共享
- 错误信息管理

实现细节：
- 使用Pinia进行状态管理
- 提供状态更新方法
- 与视频生成API集成

### 3.5 路由管理

系统实现了以下路由：

- `/` - 视频生成工作台
- `/history` - 历史记录页面
- `/outline` - 提纲生成页面
- `/script/:id` - 脚本编辑页面
- `/data` - 数据展示页面
- `/scripts` - 脚本管理页面

路由配置特点：
- 使用懒加载提高性能
- 配置页面标题
- 实现全局路由守卫

## 4. API接口说明

### 4.1 视频生成API (videoApi.ts)

#### 4.1.1 生成视频

```typescript
generateVideo(params: GenerateVideoParams): Promise<GenerateVideoResponse>
```

- 请求方法：POST
- 请求路径：/api/video/generate
- 请求参数：
  - script: 文案内容
  - options: 可选配置（分辨率、格式等）
- 响应数据：
  - taskId: 任务ID
  - status: 任务状态
  - url: 视频URL（完成时）
  - error: 错误信息（失败时）

#### 4.1.2 获取任务状态

```typescript
getTaskStatus(taskId: string): Promise<GenerateVideoResponse>
```

- 请求方法：GET
- 请求路径：/api/video/task/{taskId}
- 响应数据：同生成视频接口

#### 4.1.3 获取历史记录

```typescript
getHistory(): Promise<any>
```

- 请求方法：GET
- 请求路径：/api/video/history

#### 4.1.4 删除历史记录

```typescript
deleteHistory(taskId: string): Promise<any>
```

- 请求方法：DELETE
- 请求路径：/api/video/history/{taskId}

### 4.2 认证方式

所有API请求需要在HTTP头部包含认证信息：

```
Authorization: Bearer {apiKey}
```

其中`{apiKey}`为用户的API密钥，通过ConfigStore管理。

## 5. 开发指南

### 5.1 环境搭建

1. 安装依赖
```bash
npm install
```

2. 开发环境启动
```bash
npm run dev
```
项目将在 http://localhost:3000 启动

3. 生产环境构建
```bash
npm run build
```

### 5.2 开发规范

1. 组件命名使用PascalCase
2. 使用TypeScript强类型
3. 使用Composition API和`<script setup>`
4. 使用SCSS进行样式开发
5. 遵循Element Plus设计规范

### 5.3 状态管理最佳实践

1. 使用Pinia进行状态管理
2. 将全局状态分离为独立的store
3. 使用组合式API风格定义store
4. 对需要持久化的状态使用localStorage

### 5.4 组件开发指南

1. 组件应遵循单一职责原则
2. 使用props进行组件间通信
3. 使用emit定义组件事件
4. 复杂组件应拆分为多个子组件
5. 使用TypeScript定义接口和类型

### 5.5 API调用最佳实践

1. 所有API调用应集中在api目录下
2. 使用TypeScript定义请求和响应类型
3. 统一处理API错误
4. 使用拦截器添加认证信息

## 6. 待开发功能

### 6.1 用户认证系统
- 登录/注册功能
- 用户权限管理
- 会话管理

### 6.2 视频模板管理
- 模板列表展示
- 模板预览
- 模板参数配置

### 6.3 视频生成进度
- 实时进度展示
- 状态通知
- 错误处理

### 6.4 系统设置
- 更多个性化配置
- 主题定制
- 快捷键支持

### 6.5 数据分析
- 使用统计
- 性能监控
- 错误报告

## 7. 贡献指南

1. 创建功能分支进行开发
2. 提交前进行代码格式化
3. 编写单元测试
4. 提交Pull Request进行代码审查
5. 合并到主分支前确保CI通过

## 8. 常见问题

### 8.1 API密钥配置

API密钥可以通过以下方式配置：
1. 在登录后自动获取
2. 在系统设置中手动输入
3. 通过环境变量配置（开发环境）

### 8.2 开发环境代理

开发环境已配置API代理，所有`/api`请求将转发到`http://localhost:5000`。

### 8.3 生产环境部署

生产环境部署可以使用以下方式：
1. 静态文件部署（Nginx）
2. Docker容器部署
3. 云服务部署（如Vercel、Netlify等）