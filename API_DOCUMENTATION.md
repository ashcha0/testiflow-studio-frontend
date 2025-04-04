# TestiFlow Studio 接口文档

## 目录

- [通用说明](#通用说明)
- [数据展示模块](#数据展示模块)
- [提纲生成模块](#提纲生成模块)
- [脚本生成模块](#脚本生成模块)
- [视频生成模块](#视频生成模块)

## 通用说明

### 基础URL

所有API请求的基础URL为：`/api`

### 认证方式

所有API请求需要在HTTP头部包含认证信息：

```
Authorization: Bearer {apiKey}
```

其中`{apiKey}`为用户的API密钥。

### 响应格式

所有API响应均为JSON格式，具体结构根据接口不同而变化。

### 错误码

| 状态码 | 说明 |
| ----- | ---- |
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权或授权失败 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 数据展示模块

### 获取数据列表

获取系统数据列表。

- **URL**: `/api/data/list`
- **方法**: GET
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| ----- | ---- | ---- | ---- |
| page | number | 是 | 页码，从1开始 |
| size | number | 是 | 每页数据条数 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "items": [
      {
        "id": "1",
        "name": "数据名称",
        "value": "数据值"
      }
    ]
  }
}
```

## 提纲生成模块

### 生成提纲

根据标题和主要内容生成视频提纲。

- **URL**: `/api/generate/outline`
- **方法**: POST
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| ----- | ---- | ---- | ---- |
| title | string | 是 | 视频标题 |
| main_content | string | 否 | 主要内容描述 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "outline_id": "12345",
    "title": "视频标题",
    "outline": [
      {
        "title": "章节1标题",
        "content": "章节1内容描述"
      },
      {
        "title": "章节2标题",
        "content": "章节2内容描述"
      }
    ]
  }
}
```

### 保存提纲

保存生成的提纲。

- **URL**: `/api/outline/save`
- **方法**: POST
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| ----- | ---- | ---- | ---- |
| title | string | 是 | 提纲标题 |
| outline | array | 是 | 提纲内容，包含章节标题和内容 |

- **请求示例**:

```json
{
  "title": "视频标题",
  "outline": [
    {
      "title": "章节1标题",
      "content": "章节1内容描述"
    },
    {
      "title": "章节2标题",
      "content": "章节2内容描述"
    }
  ]
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "outline_id": "12345"
  }
}
```

### 生成脚本

根据提纲ID生成完整脚本。

- **URL**: `/api/generate/script/{outlineId}`
- **方法**: POST
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| ----- | ---- | ---- | ---- |
| outlineId | string | 是 | 提纲ID（URL路径参数） |
| options | object | 否 | 脚本生成选项 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "script_id": "67890",
    "content": "完整脚本内容"
  }
}
```

### 获取提纲历史

获取用户的提纲生成历史记录。

- **URL**: `/api/outline/history`
- **方法**: GET
- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": "12345",
        "title": "提纲标题",
        "created_at": "2023-01-01T12:00:00Z"
      }
    ]
  }
}
```

### 获取提纲详情

根据提纲ID获取提纲详情。

- **URL**: `/api/outline/{outlineId}`
- **方法**: GET
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| ----- | ---- | ---- | ---- |
| outlineId | string | 是 | 提纲ID（URL路径参数） |

- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "12345",
    "title": "提纲标题",
    "outline": [
      {
        "title": "章节1标题",
        "content": "章节1内容描述"
      },
      {
        "title": "章节2标题",
        "content": "章节2内容描述"
      }
    ],
    "created_at": "2023-01-01T12:00:00Z"
  }
}
```

### 生成章节内容

根据章节标题生成详细内容。

- **URL**: `/api/generate/section`
- **方法**: POST
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| ----- | ---- | ---- | ---- |
| title | string | 是 | 章节标题 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": "生成的章节详细内容"
  }
}
```

## 脚本生成模块

### 获取脚本列表

获取系统中的脚本列表，支持分页查询。

- **URL**: `/api/script/list`
- **方法**: GET
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| ----- | ---- | ---- | ---- |
| page | number | 是 | 页码，从1开始 |
| size | number | 是 | 每页记录数 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "script_001",
      "title": "产品介绍视频脚本",
      "created_at": "2023-06-01T10:00:00Z",
      "updated_at": "2023-06-02T15:30:00Z"
    },
    {
      "id": "script_002",
      "title": "使用教程视频脚本",
      "created_at": "2023-06-03T09:15:00Z",
      "updated_at": "2023-06-03T14:20:00Z"
    }
  ],
  "total": 25
}
```

### 获取脚本详情

根据脚本ID获取脚本的详细信息。

- **URL**: `/api/script/{id}`
- **方法**: GET
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| ----- | ---- | ---- | ---- |
| id | string | 是 | 脚本ID（URL路径参数） |

- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "script_001",
    "title": "产品介绍视频脚本",
    "content": "开场白：大家好，欢迎来到我们的产品介绍...\n第一部分：产品功能概述...\n第二部分：核心优势...",
    "created_at": "2023-06-01T10:00:00Z",
    "updated_at": "2023-06-02T15:30:00Z"
  }
}
```

### 删除脚本

根据脚本ID删除指定脚本。

- **URL**: `/api/script/{id}`
- **方法**: DELETE
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| ----- | ---- | ---- | ---- |
| id | string | 是 | 脚本ID（URL路径参数） |

- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 生成文案

根据主题和关键词生成文案。

- **URL**: `/api/script/generate`
- **方法**: POST
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| ----- | ---- | ---- | ---- |
| topic | string | 是 | 文案主题 |
| keywords | array | 否 | 关键词列表 |
| duration | number | 否 | 预期时长（秒） |
| style | string | 否 | 文案风格，可选值：formal（正式）、casual（随意）、humorous（幽默） |

- **请求示例**:

```json
{
  "topic": "人工智能应用",
  "keywords": ["机器学习", "深度学习", "自然语言处理"],
  "duration": 300,
  "style": "formal"
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "script_id": "67890",
    "content": "生成的文案内容"
  }
}
```

### 获取文案模板列表

获取系统预设的文案模板列表。

- **URL**: `/api/script/templates`
- **方法**: GET
- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "templates": [
      {
        "id": "1",
        "name": "产品介绍模板",
        "description": "适用于产品功能介绍的模板"
      },
      {
        "id": "2",
        "name": "教学视频模板",
        "description": "适用于教学内容的模板"
      }
    ]
  }
}
```

### 根据ID获取模板

根据模板ID获取模板详情。

- **URL**: `/api/script/templates/{templateId}`
- **方法**: GET
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| ----- | ---- | ---- | ---- |
| templateId | string | 是 | 模板ID（URL路径参数） |

- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "1",
    "name": "产品介绍模板",
    "description": "适用于产品功能介绍的模板",
    "content": "模板内容，包含占位符和格式指导"
  }
}
```

### 保存文案

保存生成的文案。

- **URL**: `/api/script/save`
- **方法**: POST
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| ----- | ---- | ---- | ---- |
| content | string | 是 | 文案内容 |
| title | string | 是 | 文案标题 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "script_id": "67890"
  }
}
```

## 视频生成模块

### 生成视频

根据脚本生成视频。

- **URL**: `/api/video/generate`
- **方法**: POST
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| ----- | ---- | ---- | ---- |
| script | string | 是 | 视频脚本内容 |
| options | object | 否 | 视频生成选项 |
| options.resolution | string | 否 | 视频分辨率，如 "1080p" |
| options.format | string | 否 | 视频格式，如 "mp4" |

- **请求示例**:

```json
{
  "script": "视频脚本内容...",
  "options": {
    "resolution": "1080p",
    "format": "mp4"
  }
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "taskId": "task123",
    "status": "pending"
  }
}
```

### 获取生成任务状态

获取视频生成任务的当前状态。

- **URL**: `/api/video/task/{taskId}`
- **方法**: GET
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| ----- | ---- | ---- | ---- |
| taskId | string | 是 | 任务ID（URL路径参数） |

- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "taskId": "task123",
    "status": "completed",
    "url": "https://example.com/videos/video123.mp4",
    "progress": 100
  }
}
```

或者，如果任务失败：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "taskId": "task123",
    "status": "failed",
    "error": "生成失败的原因描述"
  }
}
```

### 获取历史记录

获取用户的视频生成历史记录。

- **URL**: `/api/video/history`
- **方法**: GET
- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "taskId": "task123",
        "title": "视频标题",
        "status": "completed",
        "created_at": "2023-01-01T12:00:00Z",
        "url": "https://example.com/videos/video123.mp4"
      },
      {
        "taskId": "task124",
        "title": "视频标题2",
        "status": "failed",
        "created_at": "2023-01-02T12:00:00Z",
        "error": "生成失败的原因描述"
      }
    ]
  }
}
```

### 删除历史记录

删除指定的视频生成历史记录。

- **URL**: `/api/video/history/{taskId}`
- **方法**: DELETE
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
| ----- | ---- | ---- | ---- |
| taskId | string | 是 | 任务ID（URL路径参数） |

- **响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```