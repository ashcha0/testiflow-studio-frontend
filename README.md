# Testiflow Studio Frontend

## 1. 项目概述

Testiflow Studio Frontend 是一个基于 Vue3 的现代化前端项目，为依案视频智能生成平台提供直观、高效的用户界面。项目采用组件化开发模式，集成了最新的前端技术栈，提供流畅的用户体验和强大的视频生成功能。

## 2. 技术架构

### 2.1 核心技术栈

- **开发框架**: Vue 3
- **构建工具**: Vite
- **状态管理**: Pinia
- **UI框架**: Element Plus
- **路由管理**: Vue Router
- **HTTP客户端**: Axios
- **TypeScript**: 是

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
- vue: ^3.3.0
- element-plus: ^2.3.0
- pinia: ^2.0.0
- axios: ^1.3.0
- vue-router: ^4.0.0

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

### 4.2 生产环境部署

1. 构建项目：
```bash
npm run build
```

2. 预览构建结果：
```bash
npm run preview
```

## 5. 项目配置

### 5.1 环境变量

项目使用以下环境变量文件：
- `.env`: 默认环境变量
- `.env.development`: 开发环境变量
- `.env.production`: 生产环境变量

### 5.2 API配置

在 `.env` 文件中配置后端API地址：
```
VITE_API_BASE_URL=http://localhost:8000
```

## 6. 开发指南

### 6.1 代码规范

- 遵循Vue3组件开发规范
- 使用TypeScript进行类型检查
- 采用ESLint进行代码格式化

### 6.2 组件开发

- 组件放置在 `src/components` 目录
- 页面组件放置在 `src/views` 目录
- 使用组合式API (Composition API)

### 6.3 状态管理

使用Pinia进行状态管理：
- 定义store：`src/stores/`
- 使用组合式API访问store

## 7. 构建与部署

### 7.1 Docker部署

```bash
# 构建镜像
docker build -t testiflow-studio-frontend .

# 运行容器
docker run -d -p 80:80 testiflow-studio-frontend
```

### 7.2 Nginx配置

项目包含基础的nginx.conf配置文件，支持：
- 静态资源服务
- API代理转发
- 路由重写

## 8. 版本说明

### v1.0.0 (2024-03)
- 初始版本发布
- 实现基础的视频生成界面
- 支持历史记录查看
- 集成Element Plus组件库

### v1.1.0 (计划中)
- 优化用户界面交互
- 添加更多自定义配置选项
- 提升视频预览功能

## 9. 常见问题

**Q: 如何修改API地址？**  
A: 在对应环境的.env文件中修改VITE_API_BASE_URL变量。

**Q: 如何添加新的路由？**  
A: 在src/router/index.ts中添加新的路由配置。

**Q: 如何创建新组件？**  
A: 在src/components目录下创建新的.vue文件，使用组合式API编写组件逻辑。

## 10. 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交变更
4. 推送到分支
5. 创建Pull Request

## 11. 许可证

本项目采用 MIT 许可证