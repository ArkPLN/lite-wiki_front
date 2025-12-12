# Dashboard 概览页面文档

## 页面概述

Dashboard Overview 是用户登录后的默认首页，提供系统概览、快速操作入口和重要信息展示。通过卡片式布局展示文档统计、最近活动、团队动态等关键信息。

## 功能特性

### 1. 欢迎信息
- 个性化欢迎语
- 用户名展示
- 登录时间提示

### 2. 快速统计
- 文档总数
- 团队数量
- 存储使用量
- 活跃度指标

### 3. 最近活动
- 最近编辑的文档
- 最近访问的页面
- 团队动态

### 4. 快捷操作
- 创建新文档
- 创建新团队
- 邀请成员
- 上传文件

### 5. 推荐内容
- 热门文档
- 相关团队
- AI 推荐

## 页面结构

```
Overview
├── Header (顶部区域)
│   ├── 欢迎信息
│   └── 日期时间
├── Quick Stats (快速统计)
│   ├── 文档卡片
│   ├── 团队卡片
│   ├── 存储卡片
│   └── 活跃度卡片
├── Quick Actions (快捷操作)
│   ├── 创建文档
│   ├── 创建团队
│   ├── 邀请成员
│   └── 上传文件
├── Recent Activity (最近活动)
│   ├── 最近编辑
│   ├── 最近访问
│   └── 团队动态
├── Favorites (收藏)
│   └── 收藏列表
├── Storage Usage (存储使用)
│   ├── 使用量图表
│   └── 文件类型分布
└── Recommended (推荐)
    ├── 热门文档
    └── 相关团队
```

## 组件组成

### 主要组件
- **Overview.tsx**: 主页面组件
- **DashboardCard**: 统计卡片组件
- **ActivityItem**: 活动项组件
- **QuickAction**: 快捷操作组件

### 辅助组件
- **FileText, Folder, Users**: 图标组件
- **Clock, Star, TrendingUp**: 状态图标
- **Plus, Search**: 操作图标

## Mock 数据结构

```typescript
interface DashboardStats {
  documentsCount: number;
  teamsCount: number;
  storageUsed: number;
  storageLimit: number;
  activeMembers: number;
  thisWeekActivity: number;
}

interface RecentActivity {
  id: string;
  type: 'edit' | 'view' | 'comment' | 'create';
  title: string;
  documentId?: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}
```

## RESTful API 列表

### 1. 获取 Dashboard 概览数据
```http
GET /api/dashboard/overview
```

**响应示例:**
```json
{
  "stats": {
    "documentsCount": 156,
    "teamsCount": 3,
    "storageUsed": 2.5,
    "storageLimit": 10,
    "activeMembers": 12,
    "thisWeekActivity": 89
  },
  "recentActivity": [
    {
      "id": "1",
      "type": "edit",
      "title": "更新了项目计划",
      "documentId": "doc-123",
      "timestamp": "10 分钟前",
      "user": {
        "name": "张三",
        "avatar": "avatar-url"
      }
    }
  ],
  "favorites": [
    {
      "id": "1",
      "name": "项目规划.md",
      "type": "markdown",
      "location": "/Projects/Alpha",
      "date": "2 天前",
      "tags": ["计划", "重要"]
    }
  ]
}
```

### 2. 获取最近活动
```http
GET /api/dashboard/activities
```

**查询参数:**
```
?limit=20&offset=0&type=all
```

**响应示例:**
```json
{
  "activities": [
    {
      "id": "1",
      "type": "edit",
      "title": "编辑了文档：React 最佳实践",
      "documentId": "doc-456",
      "timestamp": "5 分钟前",
      "user": {
        "name": "李四",
        "avatar": "avatar-url"
      }
    }
  ],
  "total": 156,
  "hasMore": true
}
```

### 3. 获取存储使用情况
```http
GET /api/dashboard/storage
```

**响应示例:**
```json
{
  "used": 2.5,
  "limit": 10,
  "unit": "GB",
  "fileTypes": [
    {
      "type": "markdown",
      "count": 145,
      "size": 1.2,
      "percentage": 48
    },
    {
      "type": "pdf",
      "count": 23,
      "size": 0.8,
      "percentage": 32
    },
    {
      "type": "image",
      "count": 67,
      "size": 0.5,
      "percentage": 20
    }
  ]
}
```

### 4. 获取收藏列表
```http
GET /api/dashboard/favorites
```

**响应示例:**
```json
{
  "favorites": [
    {
      "id": "1",
      "name": "API 文档",
      "type": "markdown",
      "location": "/Engineering",
      "dateAdded": "2024-12-01",
      "tags": ["API", "重要"]
    }
  ]
}
```

### 5. 获取推荐内容
```http
GET /api/dashboard/recommended
```

**响应示例:**
```json
{
  "documents": [
    {
      "id": "1",
      "title": "React 性能优化指南",
      "description": "如何优化 React 应用的性能",
      "views": 1234,
      "likes": 89
    }
  ],
  "teams": [
    {
      "id": "1",
      "name": "前端开发团队",
      "members": 12,
      "isMember": true
    }
  ]
}
```

### 6. 创建新文档
```http
POST /api/documents
```

**请求体:**
```json
{
  "name": "新文档",
  "type": "markdown",
  "content": "",
  "teamId": "team-123"
}
```

**响应示例:**
```json
{
  "success": true,
  "document": {
    "id": "doc-789",
    "name": "新文档",
    "url": "/dashboard/editor/doc-789"
  }
}
```

### 7. 创建新团队
```http
POST /api/teams
```

**请求体:**
```json
{
  "name": "新团队",
  "description": "团队描述",
  "isPrivate": false
}
```

**响应示例:**
```json
{
  "success": true,
  "team": {
    "id": "team-456",
    "name": "新团队",
    "url": "/dashboard/team/team-456"
  }
}
```

### 8. 邀请成员
```http
POST /api/teams/{teamId}/invite
```

**请求体:**
```json
{
  "email": "user@example.com",
  "role": "member"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "邀请已发送"
}
```

### 9. 上传文件
```http
POST /api/files/upload
```

**请求体:** (multipart/form-data)
```
file: [binary data]
teamId: team-123
folder: /Documents
```

**响应示例:**
```json
{
  "success": true,
  "file": {
    "id": "file-123",
    "name": "document.pdf",
    "url": "file-url",
    "size": 1024000
  }
}
```

## 路由配置

**路径:** `/dashboard/overview`

**父路由:** DashboardLayout

**子路由:** 无

## 依赖常量

```typescript
ROUTES.DASHBOARD.OVERVIEW = '/dashboard/overview'
ROUTES.DASHBOARD.DOCUMENTS = '/dashboard/documents'
ROUTES.DASHBOARD.TEAM = '/dashboard/team'
ROUTES.DASHBOARD.FAVORITES = '/dashboard/favorites'
ROUTES.DASHBOARD.RECENT = '/dashboard/recent'
```

## 状态管理

### 本地状态
```typescript
const [stats, setStats] = useState<DashboardStats>({
  documentsCount: 0,
  teamsCount: 0,
  storageUsed: 0,
  storageLimit: 10,
  activeMembers: 0,
  thisWeekActivity: 0
});

const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
const [favorites, setFavorites] = useState<DashboardItem[]>([]);
const [isLoading, setIsLoading] = useState(true);
```

## 性能优化

1. **数据缓存**: 使用 React Query 或 SWR 缓存 API 数据
2. **懒加载**: 活动列表懒加载
3. **骨架屏**: 加载时显示骨架屏
4. **数据分页**: 活动列表分页加载
5. **防抖**: 搜索输入防抖

## 错误处理

### 常见错误
- 网络错误
- 权限不足
- 数据加载失败
- 用户未登录

### 错误处理策略
```typescript
try {
  const data = await fetchDashboardData();
  setStats(data.stats);
} catch (error) {
  setError('加载数据失败');
  // 显示重试按钮
}
```

## 响应式设计

### 断点设置
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### 布局适配
- Mobile: 单列布局
- Tablet: 2 列布局
- Desktop: 3-4 列布局

## 交互设计

### 动画效果
- 页面淡入动画
- 卡片悬停效果
- 数字滚动动画
- 图表动画

### 反馈机制
- 按钮点击反馈
- 操作成功提示
- 加载状态指示
- 错误提示

## 未来扩展

1. 添加自定义仪表板
2. 添加数据导出功能
3. 添加实时通知
4. 添加活动筛选
5. 添加时间段选择
6. 添加自定义 Widget
7. 添加图表钻取
8. 添加数据比较
