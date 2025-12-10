# Editor 页面文档

## 页面概述

Editor 是 Lite-Wiki 的核心文档编辑页面，提供富文本 Markdown 编辑器，支持实时预览、版本控制、协作编辑等功能。页面采用左右分栏布局，左侧编辑区，右侧预览区。

## 功能特性

### 1. Markdown 编辑
- 实时编辑
- 语法高亮
- 自动补全
- 快捷键支持
- 行号显示

### 2. 实时预览
- 同步滚动
- Markdown 渲染
- 代码高亮
- 表格渲染
- 数学公式支持

### 3. 版本控制
- 版本历史
- 版本比较
- 版本回滚
- 分支管理

### 4. 协作编辑
- 多人实时编辑
- 光标位置显示
- 用户列表
- 在线状态

### 5. 文档管理
- 保存草稿
- 自动保存
- 锁定文档
- 发布文档

### 6. 工具栏
- 格式化按钮
- 插入链接
- 插入图片
- 插入表格
- 插入代码

### 7. 侧边栏
- 文档大纲
- 文件树
- 版本历史
- 评论列表

## 页面结构

```
Editor
├── Header (顶部工具栏)
│   ├── 返回按钮
│   ├── 文档标题输入
│   ├── 状态指示器
│   └── 操作按钮
│       ├── 保存
│       ├── 发布
│       ├── 分享
│       └── 设置
├── Layout (主体布局)
│   ├── Left Panel (左侧编辑区)
│   │   ├── 工具栏
│   │   ├── Markdown 编辑器
│   │   └── 状态栏
│   ├── Resizer (分隔栏)
│   └── Right Panel (右侧预览区)
│       ├── 预览工具栏
│       └── Markdown 预览
└── Sidebar (侧边栏，可选)
    ├── 大纲
    ├── 文件树
    ├── 版本历史
    └── 评论
```

## 组件组成

### 主要组件
- **Editor.tsx**: 主页面组件
- **MarkdownEditor**: 编辑器组件
- **MarkdownPreview**: 预览组件
- **Toolbar**: 工具栏组件
- **VersionHistory**: 版本历史组件
- **CommentList**: 评论列表组件

### 子组件
- **Edit2, Eye, Save, Share2**: 操作图标
- **History, MessageSquare**: 侧边栏图标
- **Users, Lock**: 协作状态图标

## 文件状态管理

```typescript
interface FileVersion {
  id: string;
  version: number;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  message?: string;
  state: 'working' | 'locked' | 'archived' | 'deprecated';
}

interface EditorState {
  content: string;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved?: string;
  currentVersion?: FileVersion;
  collaborators: Collaborator[];
}
```

## RESTful API 列表

### 1. 获取文档
```http
GET /api/documents/{documentId}
```

**响应示例:**
```json
{
  "id": "doc-123",
  "name": "项目计划",
  "content": "# 项目计划\n\n...",
  "type": "markdown",
  "teamId": "team-456",
  "state": "working",
  "currentVersion": 1,
  "createdAt": "2024-12-01T10:00:00Z",
  "updatedAt": "2024-12-03T15:30:00Z",
  "author": {
    "id": "user-123",
    "name": "张三",
    "avatar": "avatar-url"
  },
  "collaborators": [
    {
      "id": "user-456",
      "name": "李四",
      "avatar": "avatar-url",
      "isOnline": true
    }
  ]
}
```

### 2. 保存文档
```http
PUT /api/documents/{documentId}
```

**请求体:**
```json
{
  "content": "# 新内容\n\n...",
  "message": "更新项目计划",
  "version": 2
}
```

**响应示例:**
```json
{
  "success": true,
  "version": {
    "id": "version-123",
    "version": 2,
    "content": "# 新内容\n\n...",
    "createdAt": "2024-12-03T15:30:00Z",
    "author": {
      "id": "user-123",
      "name": "张三"
    }
  },
  "message": "保存成功"
}
```

### 3. 获取版本历史
```http
GET /api/documents/{documentId}/versions
```

**查询参数:**
```
?limit=20&offset=0
```

**响应示例:**
```json
{
  "versions": [
    {
      "id": "version-123",
      "version": 2,
      "createdAt": "2024-12-03T15:30:00Z",
      "author": {
        "id": "user-123",
        "name": "张三"
      },
      "message": "更新项目计划",
      "state": "working"
    }
  ],
  "total": 15
}
```

### 4. 获取特定版本
```http
GET /api/documents/{documentId}/versions/{versionId}
```

**响应示例:**
```json
{
  "id": "version-123",
  "version": 2,
  "content": "# 项目计划\n\n...",
  "createdAt": "2024-12-03T15:30:00Z",
  "author": {
    "id": "user-123",
    "name": "张三"
  },
  "message": "更新项目计划"
}
```

### 5. 比较版本差异
```http
GET /api/documents/{documentId}/compare
```

**查询参数:**
```
?from=version-1&to=version-2
```

**响应示例:**
```json
{
  "differences": [
    {
      "type": "added",
      "line": 10,
      "content": "新增内容"
    },
    {
      "type": "removed",
      "line": 15,
      "content": "删除内容"
    },
    {
      "type": "modified",
      "line": 20,
      "oldContent": "旧内容",
      "newContent": "新内容"
    }
  ]
}
```

### 6. 回滚到指定版本
```http
POST /api/documents/{documentId}/rollback
```

**请求体:**
```json
{
  "targetVersionId": "version-123",
  "message": "回滚到版本 2"
}
```

**响应示例:**
```json
{
  "success": true,
  "newVersion": {
    "id": "version-456",
    "version": 3,
    "content": "回滚后的内容",
    "createdAt": "2024-12-03T15:35:00Z"
  }
}
```

### 7. 锁定文档
```http
POST /api/documents/{documentId}/lock
```

**请求体:**
```json
{
  "reason": "正在编辑"
}
```

**响应示例:**
```json
{
  "success": true,
  "lock": {
    "userId": "user-123",
    "lockedAt": "2024-12-03T15:30:00Z",
    "expiresAt": "2024-12-03T16:30:00Z"
  }
}
```

### 8. 解锁文档
```http
DELETE /api/documents/{documentId}/lock
```

**响应示例:**
```json
{
  "success": true,
  "message": "文档已解锁"
}
```

### 9. 发布文档
```http
POST /api/documents/{documentId}/publish
```

**请求体:**
```json
{
  "visibility": "team",
  "message": "正式发布"
}
```

**响应示例:**
```json
{
  "success": true,
  "publishedAt": "2024-12-03T15:40:00Z",
  "url": "/documents/doc-123"
}
```

### 10. 获取协作者列表
```http
GET /api/documents/{documentId}/collaborators
```

**响应示例:**
```json
{
  "collaborators": [
    {
      "id": "user-123",
      "name": "张三",
      "avatar": "avatar-url",
      "role": "owner",
      "isOnline": true,
      "lastActivity": "2024-12-03T15:30:00Z"
    }
  ]
}
```

### 11. 邀请协作者
```http
POST /api/documents/{documentId}/collaborators
```

**请求体:**
```json
{
  "userId": "user-456",
  "role": "editor"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "协作者已添加"
}
```

### 12. 添加评论
```http
POST /api/documents/{documentId}/comments
```

**请求体:**
```json
{
  "content": "建议修改这部分内容",
  "line": 25,
  "selection": {
    "start": 100,
    "end": 150
  }
}
```

**响应示例:**
```json
{
  "success": true,
  "comment": {
    "id": "comment-123",
    "content": "建议修改这部分内容",
    "line": 25,
    "author": {
      "id": "user-123",
      "name": "张三"
    },
    "createdAt": "2024-12-03T15:30:00Z",
    "resolved": false
  }
}
```

### 13. 解决评论
```http
PUT /api/documents/{documentId}/comments/{commentId}
```

**请求体:**
```json
{
  "resolved": true
}
```

### 14. 自动保存
```http
POST /api/documents/{documentId}/autosave
```

**请求体:**
```json
{
  "content": "# 自动保存的内容",
  "timestamp": "2024-12-03T15:30:00Z"
}
```

**响应示例:**
```json
{
  "success": true,
  "savedAt": "2024-12-03T15:30:00Z"
}
```

### 15. 导出文档
```http
GET /api/documents/{documentId}/export
```

**查询参数:**
```
?format=pdf|html|markdown
```

**响应示例:**
```json
{
  "success": true,
  "downloadUrl": "https://cdn.example.com/exports/doc-123.pdf",
  "expiresAt": "2024-12-10T15:30:00Z"
}
```

## 实时协作 (WebSocket)

### 连接协作会话
```javascript
const ws = new WebSocket(`ws://api.example.com/ws/editor/${documentId}`);

// 发送编辑内容
ws.send(JSON.stringify({
  type: 'edit',
  userId: 'user-123',
  content: '编辑内容',
  timestamp: Date.now()
}));

// 接收其他用户编辑
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'edit') {
    // 应用其他用户的编辑
  }
};
```

### 光标位置同步
```javascript
// 发送光标位置
ws.send(JSON.stringify({
  type: 'cursor',
  userId: 'user-123',
  position: { line: 10, column: 5 }
}));

// 接收光标位置
{
  "type": "cursor",
  "userId": "user-456",
  "userName": "李四",
  "position": { "line": 15, "column": 10 },
  "color": "#FF5722"
}
```

## 路由配置

**路径:** `/dashboard/editor/:documentId?`

**父路由:** DashboardLayout

**子路由:** 无

## 依赖常量

```typescript
ROUTES.DASHBOARD.DOCUMENTS = '/dashboard/documents'
ROUTES.DASHBOARD.OVERVIEW = '/dashboard/overview'
```

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl/Cmd + S | 保存 |
| Ctrl/Cmd + Z | 撤销 |
| Ctrl/Cmd + Y | 重做 |
| Ctrl/Cmd + B | 粗体 |
| Ctrl/Cmd + I | 斜体 |
| Ctrl/Cmd + K | 插入链接 |
| Ctrl/Cmd + / | 显示帮助 |

## 性能优化

1. **防抖保存**: 输入停止 2 秒后自动保存
2. **虚拟滚动**: 大文档性能优化
3. **懒加载**: 预览组件懒加载
4. **缓存**: 编辑内容本地缓存
5. **分块同步**: 大文件分块传输

## 错误处理

### 常见错误
- 网络断开
- 保存失败
- 冲突检测
- 权限不足
- 文档不存在

### 处理策略
- 自动重连
- 本地草稿恢复
- 冲突解决提示
- 错误提示
- 重试机制

## 安全注意事项

1. **XSS 防护**: 内容转义
2. **CSRF 保护**: 令牌验证
3. **权限控制**: 基于角色的访问控制
4. **内容审核**: 敏感词过滤
5. **版本控制**: 防止恶意回滚

## 未来扩展

1. 富文本编辑器
2. 思维导图
3. 图表插入
4. AI 写作助手
5. 语音输入
6. 手写识别
7. 多媒体嵌入
8. 幻灯片模式
