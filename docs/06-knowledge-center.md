# Knowledge Center 页面文档

## 页面概述

Knowledge Center 是 Lite-Wiki 的 AI 知识助手模块，基于 Google Gemini AI 提供智能问答、知识检索和内容分析功能。支持个人知识库和团队知识库两种模式，集成向量数据库实现语义搜索。

## 功能特性

### 1. AI 对话
- 智能问答
- 上下文理解
- 多轮对话
- 实时回复

### 2. 知识库选择
- 个人知识库
- 团队知识库
- 知识库切换

### 3. 高级功能
- 网络搜索
- 深度思考模式
- 多步推理
- 引用来源

### 4. 统计信息
- 向量数量
- 存储使用
- 文件统计
- 类型分布

### 5. 文件索引
- 已索引文件列表
- 文件类型展示
- 索引状态
- 重新索引

### 6. 消息历史
- 对话记录
- 会话管理
- 导出对话

## 页面结构

```
KnowledgeCenter
├── Layout (主体布局)
│   ├── Left Panel (左侧对话区)
│   │   ├── Header (顶部栏)
│   │   │   ├── AI 图标
│   │   │   ├── 标题
│   │   │   └── 副标题
│   │   ├── Chat Messages (消息区)
│   │   │   ├── AI 消息
│   │   │   ├── 用户消息
│   │   │   └── 时间戳
│   │   └── Input Area (输入区)
│   │       ├── Toolbar (工具栏)
│   │       │   ├── KB 选择器
│   │       │   ├── 网络搜索开关
│   │       │   └── 深度思考开关
│   │       └── Text Input (文本输入)
│   │           ├── 文本框
│   │           └── 发送按钮
│   └── Right Panel (右侧统计区)
│       ├── Top Stats (顶部统计)
│       │   ├── Storage Chart (存储图表)
│       │   │   ├── 环形图
│       │   │   └── 使用量显示
│       │   ├── File Distribution (文件分布)
│       │   │   └── 进度条
│       │   ├── General Metrics (通用指标)
│       │   │   ├── 文件数
│       │   │   └── 向量数
│       │   └── Last Updated (更新时间)
│       └── File List (文件列表)
│           ├── Header (列表头部)
│           │   ├── 标题
│           │   └── 添加按钮
│           └── Files (文件项)
│               ├── PDF 文件
│               ├── Markdown 文件
│               └── 处理状态
```

## 数据类型

### Message
```typescript
interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}
```

### IndexedFile
```typescript
interface IndexedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  updated: string;
  status: 'indexed' | 'processing';
}
```

### Stats
```typescript
interface KnowledgeStats {
  totalVectors: string;
  storageUsed: number;
  storageLimit: number;
  lastUpdated: string;
  filesCount: number;
  fileDistribution: {
    type: string;
    count: number;
    color: string;
  }[];
}
```

## RESTful API 列表

### 1. 发送聊天消息
```http
POST /api/knowledge/chat
```

**请求体:**
```json
{
  "message": "如何在 React 中优化性能？",
  "knowledgeBase": "team",
  "webSearchEnabled": true,
  "deepThinkingEnabled": false,
  "history": [
    {
      "role": "user",
      "content": "之前的消息"
    },
    {
      "role": "ai",
      "content": "之前的回复"
    }
  ]
}
```

**响应示例:**
```json
{
  "success": true,
  "message": {
    "id": "msg-123",
    "role": "ai",
    "content": "在 React 中优化性能的方法包括：\n1. 使用 React.memo...",
    "timestamp": "2024-12-03T15:30:00Z",
    "sources": [
      {
        "fileId": "doc-123",
        "fileName": "React 优化指南.md",
        "relevance": 0.95
      }
    ],
    "tokens": 150
  }
}
```

### 2. 获取知识库列表
```http
GET /api/knowledge/bases
```

**响应示例:**
```json
{
  "bases": [
    {
      "id": "personal",
      "name": "个人知识库",
      "description": "我的个人文档",
      "type": "personal",
      "vectorCount": 12500,
      "fileCount": 156
    },
    {
      "id": "team",
      "name": "团队知识库",
      "description": "团队共享文档",
      "type": "team",
      "vectorCount": 45600,
      "fileCount": 234
    }
  ]
}
```

### 3. 获取知识库统计
```http
GET /api/knowledge/stats/{baseId}
```

**响应示例:**
```json
{
  "totalVectors": "1.2M",
  "storageUsed": 450,
  "storageLimit": 1024,
  "lastUpdated": "2 小时前",
  "filesCount": 124,
  "fileDistribution": [
    {
      "type": "PDF",
      "count": 45,
      "color": "#ef4444"
    },
    {
      "type": "Markdown",
      "count": 55,
      "color": "#3b82f6"
    }
  ]
}
```

### 4. 获取已索引文件
```http
GET /api/knowledge/files/{baseId}
```

**查询参数:**
```
?page=1&limit=50&type=all
```

**响应示例:**
```json
{
  "files": [
    {
      "id": "1",
      "name": "Project_Alpha_Specs.pdf",
      "type": "PDF",
      "size": "2.4MB",
      "updated": "2h ago",
      "status": "indexed"
    }
  ],
  "total": 124,
  "page": 1
}
```

### 5. 上传并索引文件
```http
POST /api/knowledge/files/upload
```

**请求体:** (multipart/form-data)
```
file: [binary data]
baseId: team
```

**响应示例:**
```json
{
  "success": true,
  "file": {
    "id": "file-123",
    "name": "document.pdf",
    "status": "processing",
    "estimatedTime": "5 minutes"
  }
}
```

### 6. 重新索引文件
```http
POST /api/knowledge/files/{fileId}/reindex
```

### 7. 删除索引文件
```http
DELETE /api/knowledge/files/{fileId}
```

### 8. 获取对话历史
```http
GET /api/knowledge/conversations
```

**响应示例:**
```json
{
  "conversations": [
    {
      "id": "conv-123",
      "title": "React 性能优化",
      "messagesCount": 12,
      "lastMessageAt": "2024-12-03T15:30:00Z",
      "knowledgeBase": "team"
    }
  ]
}
```

### 9. 创建新对话
```http
POST /api/knowledge/conversations
```

**请求体:**
```json
{
  "title": "新对话",
  "knowledgeBase": "personal"
}
```

**响应示例:**
```json
{
  "success": true,
  "conversation": {
    "id": "conv-456",
    "title": "新对话",
    "knowledgeBase": "personal"
  }
}
```

### 10. 获取对话详情
```http
GET /api/knowledge/conversations/{conversationId}
```

**响应示例:**
```json
{
  "id": "conv-123",
  "title": "React 性能优化",
  "messages": [
    {
      "id": "msg-1",
      "role": "user",
      "content": "如何在 React 中优化性能？",
      "timestamp": "2024-12-03T15:00:00Z"
    },
    {
      "id": "msg-2",
      "role": "ai",
      "content": "在 React 中优化性能的方法包括...",
      "timestamp": "2024-12-03T15:00:05Z"
    }
  ],
  "knowledgeBase": "team"
}
```

### 11. 删除对话
```http
DELETE /api/knowledge/conversations/{conversationId}
```

### 12. 导出对话
```http
GET /api/knowledge/conversations/{conversationId}/export
```

**查询参数:**
```
?format=pdf|markdown|json
```

**响应示例:**
```json
{
  "success": true,
  "downloadUrl": "https://cdn.example.com/exports/conversation-123.pdf",
  "expiresAt": "2024-12-10T15:30:00Z"
}
```

### 13. 搜索知识库
```http
POST /api/knowledge/search
```

**请求体:**
```json
{
  "query": "React hooks",
  "baseId": "team",
  "limit": 10,
  "minRelevance": 0.7
}
```

**响应示例:**
```json
{
  "results": [
    {
      "fileId": "doc-123",
      "fileName": "React Hooks 指南.md",
      "content": "React Hooks 是 React 16.8 引入的新特性...",
      "relevance": 0.95,
      "page": 5,
      "highlight": "<mark>React Hooks</mark> 是..."
    }
  ]
}
```

### 14. 获取系统状态
```http
GET /api/knowledge/system-status
```

**响应示例:**
```json
{
  "status": "healthy",
  "vectorDatabase": {
    "status": "connected",
    "documents": 50000,
    "vectors": 2500000
  },
  "aiService": {
    "status": "connected",
    "model": "gemini-pro",
    "latency": 150
  }
}
```

### 15. 配置 AI 参数
```http
PUT /api/knowledge/settings
```

**请求体:**
```json
{
  "defaultModel": "gemini-pro",
  "temperature": 0.7,
  "maxTokens": 2048,
  "webSearchEnabled": true,
  "deepThinkingEnabled": false
}
```

### 16. 获取模型列表
```http
GET /api/knowledge/models
```

**响应示例:**
```json
{
  "models": [
    {
      "id": "gemini-pro",
      "name": "Gemini Pro",
      "description": "高性能通用模型",
      "maxTokens": 32768
    },
    {
      "id": "gemini-pro-vision",
      "name": "Gemini Pro Vision",
      "description": "支持图像理解",
      "maxTokens": 16384
    }
  ]
}
```

## 环境配置

### API 密钥
需要在 `.env.local` 中配置：
```env
GEMINI_API_KEY=your_api_key_here
```

### Vite 配置
```typescript
export default defineConfig({
  define: {
    'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY)
  }
});
```

## 组件组成

### 主要组件
- **KnowledgeCenter.tsx**: 主页面组件
- **StorageChart**: 存储图表组件
- **DistributionChart**: 分布图表组件

### 图标组件
- **BrainCircuit**: AI 图标
- **Bot**: 机器人图标
- **Database**: 数据库图标
- **HardDrive**: 存储图标

## Mock 数据

### 默认消息
```typescript
const defaultMessage: Message = {
  id: '1',
  role: 'ai',
  content: 'Hello! I am your knowledge base assistant. I can help you find information within your documents or search the web for external context.',
  timestamp: 'Just now'
};
```

### 统计数据
```typescript
const stats = {
  totalVectors: '1.2M',
  storageUsed: 450,
  storageLimit: 1024,
  lastUpdated: '2 hours ago',
  filesCount: 124,
  fileDistribution: [
    { type: 'PDF', count: 45, color: '#ef4444' },
    { type: 'Markdown', count: 55, color: '#3b82f6' },
    { type: 'Docs', count: 15, color: '#2563eb' },
    { type: 'Other', count: 9, color: '#9ca3af' }
  ]
};
```

## 路由配置

**路径:** `/dashboard/knowledge`

**父路由:** DashboardLayout

**子路由:** 无

## 依赖常量

```typescript
ROUTES.DASHBOARD.KNOWLEDGE = '/dashboard/knowledge'
ROUTES.DASHBOARD.OVERVIEW = '/dashboard/overview'
```

## 国际化支持

### 翻译键
```typescript
t.knowledge.title
t.knowledge.subtitle
t.knowledge.personalBase
t.knowledge.teamBase
t.knowledge.webSearch
t.knowledge.deepThinking
t.knowledge.chatPlaceholder
t.knowledge.statsTitle
t.knowledge.filesIndexed
t.knowledge.vectorCount
t.knowledge.lastUpdated
t.knowledge.indexedFilesTitle
t.knowledge.uploadNew
```

## 性能优化

1. **消息流式传输**: SSE 或 WebSocket
2. **结果缓存**: 搜索结果缓存
3. **懒加载**: 文件列表懒加载
4. **分页**: 大量数据分页
5. **防抖**: 搜索输入防抖
6. **预加载**: 预测性加载

## 错误处理

### 常见错误
- API 密钥无效
- 网络错误
- 请求超时
- 配额超限
- 内容违规

### 处理策略
- 错误提示
- 重试机制
- 降级方案
- 离线提示

## 安全注意事项

1. **API 密钥保护**: 服务器端代理
2. **内容审核**: 敏感内容过滤
3. **访问控制**: 基于角色的访问
4. **数据加密**: 传输和存储加密
5. **审计日志**: 操作记录

## 成本优化

1. **Token 限制**: 设置最大 Token 数
2. **缓存**: 减少重复请求
3. **批量处理**: 合并请求
4. **优先级队列**: 重要请求优先
5. **使用统计**: 监控 API 调用

## 未来扩展

1. 多模型支持
2. 自定义知识库
3. 知识图谱
4. 语音交互
5. 图像理解
6. 多语言支持
7. 知识抽取
8. 自动摘要
9. 智能推荐
10. 协作标注
