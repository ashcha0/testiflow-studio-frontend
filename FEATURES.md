# Testiflow Studio Frontend 开发文档

## 技术栈
- Vue 3.3.4 - 前端框架
- TypeScript 5.1.6 - 类型支持
- Vite 4.4.9 - 构建工具
- Element Plus 2.9.5 - UI组件库
- Pinia 2.1.6 - 状态管理
- Vue Router 4.2.4 - 路由管理
- Axios 1.5.0 - HTTP客户端
- SCSS - 样式预处理器

## 项目启动
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

## 已开发功能

### 1. 视频生成工作台 (GenerateView.vue)
- 路由：/
- 功能：主要工作区域，用于视频生成配置和操作
- 中文本地化支持

### 2. 历史记录页面 (HistoryView.vue)
- 路由：/history
- 功能：展示和管理已生成的视频记录

### 3. 全局配置管理 (useConfigStore)
- API密钥管理
- 暗黑模式切换
- 系统配置持久化

### 4. 国际化支持
- Element Plus中文语言包集成
- 系统标题本地化

### 5. API代理配置
- 开发环境代理配置（/api -> http://localhost:5000）
- 生产环境基础URL配置

## 待开发功能

### 1. 用户认证系统
- 登录/注册功能
- 用户权限管理
- 会话管理

### 2. 视频模板管理
- 模板列表展示
- 模板预览
- 模板参数配置

### 3. 视频生成进度
- 实时进度展示
- 状态通知
- 错误处理

### 4. 系统设置
- 更多个性化配置
- 主题定制
- 快捷键支持

### 5. 数据分析
- 使用统计
- 性能监控
- 错误报告

## 开发规范
1. 组件命名使用PascalCase
2. 使用TypeScript强类型
3. 使用Composition API和`<script setup>`
4. 使用SCSS进行样式开发
5. 遵循Element Plus设计规范

## 项目结构
```
src/
├── api/        # API接口
├── assets/     # 静态资源
├── components/ # 公共组件
├── router/     # 路由配置
├── stores/     # 状态管理
├── views/      # 页面视图
└── App.vue     # 根组件
```