# Library 页面文档

## 页面概述

Library 是 Lite-Wiki 的文档库模块，提供收藏、最近访问和回收站功能。帮助用户快速找到和管理重要文档，支持搜索、筛选和批量操作。

## 页面结构

```
Library
├── Favorites (收藏页面)
├── Recent (最近访问页面)
└── Trash (回收站页面)
```

---

## 1. Favorites 页面 (Favorites.tsx)

### 页面概述
收藏页面用于管理用户标记为重要的文档和文件夹，方便快速访问。

### 功能特性
- 收藏文档列表
- 添加/取消收藏
- 搜索筛选
- 标签管理
- 批量操作
- 排序功能

### 页面结构
```
Favorites
├── Header (页面头部)
│   ├── 标题和描述
│   └── 操作按钮
│       └── 添加收藏
├── Search Filter (搜索筛选栏)
│   ├── 搜索框
│   ├── 日期筛选
│   ├── 标签筛选
│   └── 模式切换 (模糊/精确)
├── Favorites List (收藏列表)
│   ├── Table Header (表格头部)
│   │   ├── 文档名称
│   │   ├── 位置
│   │   ├── 添加日期
│   │   └── 操作
│   └── List Items (列表项)
│       ├── 文件/文件夹图标
│       ├── 名称和标签
│       ├── 路径
│       ├── 添加日期
│       └── 操作按钮
│           ├── 编辑
│           └── 取消收藏
└── Empty State (空状态)
    └── 添加收藏引导
```

### Mock 数据
```typescript
const MOCK_FAVORITES: DashboardItem[] = [
  {
    id: '1',
    name: 'Product Roadmap 2024',
    type: 'markdown',
    location: '/Engineering/Planning',
    date: '2 days ago',
    isoDate: '2024-12-01',
    tags: ['Planning', 'Q1']
  },
  {
    id: '2',
    name: 'Design Assets',
    type: 'folder',
    location: '/Design/Assets',
    date: '1 week ago',
    isoDate: '2024-11-26',
    tags: ['Design']
  }
];
```

### RESTful API
```http
GET /api/favorites
POST /api/favorites
DELETE /api/favorites/{favoriteId}
PUT /api/favorites/{favoriteId}
GET /api/favorites/search
```

### 组件依赖
- **SearchFilterBar**: 搜索筛选栏
- **FilePickerModal**: 文件选择器
- **EditItemModal**: 编辑项目模态框

---

## 2. Recent 页面 (Recent.tsx)

### 页面概述
最近访问页面显示用户最近查看或编辑的文档和文件夹，按时间倒序排列。

### 功能特性
- 最近访问列表
- 自动记录访问历史
- 搜索筛选
- 移除记录
- 手动添加
- 分组显示

### 页面结构
```
Recent
├── Header (页面头部)
│   ├── 标题和描述
│   └── 操作按钮
│       └── 添加最近
├── Search Filter (搜索筛选栏)
│   ├── 搜索框
│   ├── 日期筛选
│   ├── 标签筛选
│   └── 模式切换
├── Recent List (最近列表)
│   ├── Table Header (表格头部)
│   │   ├── 文档名称
│   │   ├── 位置
│   │   ├── 最后访问
│   │   └── 操作
│   └── List Items (列表项)
│       ├── 文件/文件夹图标
│       ├── 名称和类型
│       ├── 路径
│       ├── 访问时间
│       └── 操作按钮
│           ├── 编辑
│           └── 移除
└── Empty State (空状态)
    └── 使用引导
```

### Mock 数据
```typescript
const MOCK_RECENT: DashboardItem[] = [
  {
    id: '1',
    name: 'Weekly Sync Notes - Q1',
    type: 'markdown',
    location: '/Meeting Notes',
    date: '2 hours ago',
    isoDate: '2024-12-03',
    tags: ['Meeting']
  },
  {
    id: '2',
    name: 'Project Requirements',
    type: 'markdown',
    location: '/Projects/Alpha',
    date: '5 hours ago',
    isoDate: '2024-12-03',
    tags: []
  }
];
```

### RESTful API
```http
GET /api/recent
POST /api/recent
DELETE /api/recent/{itemId}
PUT /api/recent/{itemId}
GET /api/recent/search
GET /api/recent/tracking
```

---

## 3. Trash 页面 (Trash.tsx)

### 页面概述
回收站页面显示已删除的文档和文件夹，在一定时间内可以恢复或永久删除。

### 功能特性
- 已删除项目列表
- 恢复项目
- 永久删除
- 清空回收站
- 批量操作
- 剩余天数显示

### 页面结构
```
Trash
├── Header (页面头部)
│   ├── 标题和描述
│   └── 操作按钮
│       ├── 添加到回收站
│       └── 清空回收站
├── Search Filter (搜索筛选栏)
│   ├── 搜索框
│   ├── 日期筛选
│   ├── 标签筛选
│   └── 模式切换
├── Trash List (回收站列表)
│   ├── Table Header (表格头部)
│   │   ├── 文档名称
│   │   ├── 位置
│   │   ├── 删除日期
│   │   └── 操作
│   └── List Items (列表项)
│       ├── 灰化图标
│       ├── 删除线名称
│       ├── 路径
│       ├── 删除日期
│       ├── 剩余天数
│       └── 操作按钮
│           ├── 编辑
│           ├── 恢复
│           └── 永久删除
└── Empty State (空状态)
    └── 使用引导
```

### Mock 数据
```typescript
const MOCK_TRASH: DashboardItem[] = [
  {
    id: '1',
    name: 'Old Drafts',
    type: 'folder',
    location: '/Personal',
    date: 'Yesterday',
    isoDate: '2024-12-02',
    tags: ['Draft'],
    meta: { daysLeft: 29 }
  },
  {
    id: '2',
    name: 'Meeting Notes - Jan',
    type: 'markdown',
    location: '/Meeting Notes',
    date: '3 days ago',
    isoDate: '2024-11-30',
    tags: [],
    meta: { daysLeft: 27 }
  }
];
```

### RESTful API
```http
GET /api/trash
POST /api/trash/restore/{itemId}
DELETE /api/trash/permanent/{itemId}
POST /api/trash/empty
POST /api/trash/batch-restore
DELETE /api/trash/batch-delete
GET /api/trash/search
```

---

## 通用数据结构

### DashboardItem
```typescript
interface DashboardItem {
  id: string;
  name: string;
  type: 'markdown' | 'text' | 'folder';
  location: string;
  date: string;
  isoDate: string;
  tags: string[];
  meta?: {
    daysLeft?: number;
  };
}
```

### SearchParams
```typescript
interface SearchParams {
  query: string;
  date: string;
  tag: string;
  mode: 'blur' | 'accurate';
}
```

---

## 共享组件

### SearchFilterBar
```typescript
interface SearchFilterBarProps {
  availableTags: string[];
  onSearch: (params: SearchParams) => void;
}
```

### FilePickerModal
```typescript
interface FilePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (node: FileNode, path: string) => void;
}
```

### EditItemModal
```typescript
interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: DashboardItem;
  onSave: (id: string, newName: string, newTags: string[]) => void;
}
```

---

## RESTful API 详细说明

### Favorites API

#### 1. 获取收藏列表
```http
GET /api/favorites
```

**查询参数:**
```
?page=1&limit=20&search=&tag=&date=
```

**响应示例:**
```json
{
  "favorites": [
    {
      "id": "1",
      "name": "Product Roadmap 2024",
      "type": "markdown",
      "location": "/Engineering/Planning",
      "dateAdded": "2024-12-01T10:00:00Z",
      "tags": ["Planning", "Q1"]
    }
  ],
  "total": 15,
  "page": 1
}
```

#### 2. 添加收藏
```http
POST /api/favorites
```

**请求体:**
```json
{
  "name": "Document Name",
  "type": "markdown",
  "location": "/path/to/document",
  "tags": ["tag1", "tag2"]
}
```

#### 3. 移除收藏
```http
DELETE /api/favorites/{favoriteId}
```

#### 4. 更新收藏项
```http
PUT /api/favorites/{favoriteId}
```

**请求体:**
```json
{
  "name": "New Name",
  "tags": ["new-tag"]
}
```

### Recent API

#### 1. 获取最近访问
```http
GET /api/recent
```

**查询参数:**
```
?page=1&limit=50&days=30
```

**响应示例:**
```json
{
  "recent": [
    {
      "id": "1",
      "name": "Weekly Sync Notes",
      "type": "markdown",
      "location": "/Meeting Notes",
      "lastAccessed": "2024-12-03T10:00:00Z",
      "tags": ["Meeting"]
    }
  ],
  "total": 25
}
```

#### 2. 添加最近访问记录
```http
POST /api/recent
```

**请求体:**
```json
{
  "documentId": "doc-123",
  "action": "view" | "edit"
}
```

#### 3. 移除访问记录
```http
DELETE /api/recent/{itemId}
```

### Trash API

#### 1. 获取回收站
```http
GET /api/trash
```

**查询参数:**
```
?page=1&limit=20&before=2024-12-01
```

**响应示例:**
```json
{
  "trash": [
    {
      "id": "1",
      "name": "Old Drafts",
      "type": "folder",
      "location": "/Personal",
      "deletedAt": "2024-12-02T10:00:00Z",
      "tags": ["Draft"],
      "daysLeft": 28
    }
  ],
  "total": 10
}
```

#### 2. 恢复项目
```http
POST /api/trash/restore/{itemId}
```

#### 3. 永久删除
```http
DELETE /api/trash/permanent/{itemId}
```

#### 4. 清空回收站
```http
POST /api/trash/empty
```

#### 5. 批量恢复
```http
POST /api/trash/batch-restore
```

**请求体:**
```json
{
  "items": ["1", "2", "3"]
}
```

#### 6. 批量删除
```http
DELETE /api/trash/batch-delete
```

---

## 路由配置

```typescript
ROUTES.DASHBOARD.FAVORITES = '/dashboard/favorites'
ROUTES.DASHBOARD.RECENT = '/dashboard/recent'
ROUTES.DASHBOARD.TRASH = '/dashboard/trash'
```

---

## 依赖常量

```typescript
ROUTES.DASHBOARD.LIBRARY = '/dashboard/library'
ROUTES.DASHBOARD.OVERVIEW = '/dashboard/overview'
ROUTES.DASHBOARD.DOCUMENTS = '/dashboard/documents'
```

---

## 过滤逻辑

### 搜索过滤
```typescript
const filteredItems = items.filter(item => {
  // 1. 名称匹配
  let nameMatch = true;
  if (searchParams.query) {
    if (searchParams.mode === 'accurate') {
      nameMatch = item.name.toLowerCase() === searchParams.query.toLowerCase();
    } else {
      nameMatch = item.name.toLowerCase().includes(searchParams.query.toLowerCase());
    }
  }

  // 2. 日期匹配
  let dateMatch = true;
  if (searchParams.date) {
    dateMatch = item.isoDate === searchParams.date;
  }

  // 3. 标签匹配
  let tagMatch = true;
  if (searchParams.tag) {
    tagMatch = item.tags.includes(searchParams.tag);
  }

  return nameMatch && dateMatch && tagMatch;
});
```

---

## 性能优化

1. **分页加载**: 大量数据分页
2. **虚拟滚动**: 长列表优化
3. **防抖搜索**: 搜索输入防抖
4. **缓存**: 本地缓存筛选结果
5. **懒加载**: 标签和图标懒加载

---

## 错误处理

### 常见错误
- 网络错误
- 权限不足
- 项目不存在
- 操作失败

### 处理策略
- 错误提示
- 重试机制
- 降级显示
- 日志记录

---

## 安全注意事项

1. **权限验证**: 操作权限检查
2. **数据恢复**: 防止未授权恢复
3. **永久删除**: 二次确认
4. **批量操作**: 谨慎处理
5. **审计日志**: 操作记录

---

## 未来扩展

1. 智能推荐
2. 收藏夹分组
3. 访问统计
4. 标签云
5. 快捷键支持
6. 离线缓存
7. 导出功能
8. 高级搜索
9. 自动分类
10. 使用趋势分析
