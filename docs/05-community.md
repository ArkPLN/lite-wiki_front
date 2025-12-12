# Community 页面文档

## 页面概述

Community 是 Lite-Wiki 的社区模块，提供用户交流、讨论和知识分享平台。支持话题分类、帖子发布、评论互动、用户排名等功能，构建活跃的知识分享生态。

## 功能特性

### 1. 话题管理
- 热门话题展示
- 话题热度排行
- 话题分类筛选
- 关注话题

### 2. 帖子系统
- 发布帖子
- 编辑帖子
- 删除帖子
- 帖子置顶
- 帖子加精

### 3. 互动功能
- 点赞/取消点赞
- 评论回复
- 点赞评论
- 分享帖子
- 举报帖子

### 4. 用户系统
- 用户排名
- 贡献分数
- 用户关注
- 用户资料

### 5. 搜索功能
- 帖子搜索
- 话题搜索
- 用户搜索
- 高级筛选

### 6. AI 助手
- 帖子 AI 摘要
- 智能推荐
- 自动标签
- 内容优化建议

## 页面结构

```
Community
├── Header (顶部导航)
│   ├── 社区标题
│   └── 搜索框
├── Main Content (主内容区)
│   ├── Left Panel (左侧主区域)
│   │   ├── Topics Section (话题区)
│   │   │   ├── 话题卡片列表
│   │   │   └── 查看更多
│   │   ├── Discussions Section (讨论区)
│   │   │   ├── 帖子列表
│   │   │   └── 加载更多
│   │   └── Create Post (发帖区)
│   └── Right Panel (右侧边栏)
│       ├── Trending (热门排行)
│       │   ├── 活跃用户
│       │   └── 热门标签
│       └── Ad Banner (广告位)
├── Post Detail View (帖子详情页)
│   ├── Post Header (帖子头部)
│   │   ├── 作者信息
│   │   ├── 发布时间
│   │   └── 操作按钮
│   ├── Post Content (帖子内容)
│   │   ├── 标题
│   │   ├── 正文
│   │   ├── AI 摘要
│   │   └── 附件
│   ├── Post Actions (帖子操作)
│   │   ├── 点赞
│   │   ├── 评论
│   │   ├── 分享
│   │   └── 举报
│   └── Comments Section (评论区)
│       ├── 评论列表
│       ├── 分页
│       └── 发表评论
├── Topic Detail View (话题详情页)
│   ├── Topic Header (话题头部)
│   │   ├── 话题信息
│   │   ├── 参与者数
│   │   └── 热度指数
│   ├── Quick Post (快速发帖)
│   └── Topic Posts (话题帖子列表)
└── Create/Edit Post (发帖/编辑页)
    ├── Post Form (帖子表单)
    │   ├── 话题选择
    │   ├── 标题输入
    │   ├── 内容输入
    │   ├── 标签输入
    │   └── 附件上传
    └── Publish Actions (发布操作)
```

## 数据类型

### CommunityTopic
```typescript
interface CommunityTopic {
  id: string;
  title: string;
  description: string;
  participants: number;
  hotIndex: number;
  tags: string[];
}
```

### CommunityPost
```typescript
interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  tags: string[];
  likes: number;
  isLiked: boolean;
  comments: number;
  createdAt: string;
  aiSummary?: string;
  views: number;
  hotIndex: number;
  commentsList?: Comment[];
  attachments?: string[];
}
```

### CommunityTrendMember
```typescript
interface CommunityTrendMember {
  id: string;
  name: string;
  avatar: string;
  contributionScore: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}
```

### Comment
```typescript
interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes?: number;
  replies?: Comment[];
}
```

## RESTful API 列表

### 1. 获取话题列表
```http
GET /api/community/topics
```

**查询参数:**
```
?page=1&limit=20&sort=hotIndex
```

**响应示例:**
```json
{
  "topics": [
    {
      "id": "1",
      "title": "React 19 Release",
      "description": "讨论 React 19 的新特性",
      "participants": 1240,
      "hotIndex": 98,
      "tags": ["React", "Frontend"]
    }
  ],
  "total": 50,
  "page": 1,
  "hasMore": true
}
```

### 2. 获取话题详情
```http
GET /api/community/topics/{topicId}
```

**响应示例:**
```json
{
  "id": "1",
  "title": "React 19 Release",
  "description": "讨论 React 19 的新特性",
  "participants": 1240,
  "hotIndex": 98,
  "tags": ["React", "Frontend"],
  "createdAt": "2024-12-01T10:00:00Z",
  "moderators": [
    {
      "id": "user-123",
      "name": "管理员",
      "avatar": "avatar-url"
    }
  ]
}
```

### 3. 获取帖子列表
```http
GET /api/community/posts
```

**查询参数:**
```
?page=1&limit=20&sort=hotIndex&topicId=1
```

**响应示例:**
```json
{
  "posts": [
    {
      "id": "1",
      "title": "如何优化 vector search 性能？",
      "content": "我在使用 1M+  embeddings 时遇到延迟问题...",
      "author": {
        "name": "David Kim",
        "avatar": "avatar-url",
        "role": "Data Scientist"
      },
      "tags": ["Vector DB", "Performance", "AI"],
      "likes": 45,
      "isLiked": false,
      "comments": 12,
      "createdAt": "2 小时前",
      "aiSummary": "用户咨询向量数据库优化策略",
      "views": 340,
      "hotIndex": 95
    }
  ],
  "total": 156
}
```

### 4. 获取帖子详情
```http
GET /api/community/posts/{postId}
```

**响应示例:**
```json
{
  "id": "1",
  "title": "如何优化 vector search 性能？",
  "content": "我在使用 1M+  embeddings 时遇到延迟问题...",
  "author": {
    "name": "David Kim",
    "avatar": "avatar-url",
    "role": "Data Scientist"
  },
  "tags": ["Vector DB", "Performance", "AI"],
  "likes": 45,
  "isLiked": false,
  "comments": 12,
  "createdAt": "2024-12-03T10:00:00Z",
  "aiSummary": "用户咨询向量数据库优化策略",
  "views": 340,
  "hotIndex": 95,
  "commentsList": [
    {
      "id": "c1",
      "author": "Sarah Chen",
      "content": "HNSW 索引通常查询更快但占用更多内存",
      "timestamp": "1 小时前",
      "likes": 5
    }
  ]
}
```

### 5. 创建帖子
```http
POST /api/community/posts
```

**请求体:**
```json
{
  "title": "新帖子标题",
  "content": "帖子内容",
  "topicId": "1",
  "tags": ["标签1", "标签2"],
  "attachments": ["file1.pdf", "file2.md"]
}
```

**响应示例:**
```json
{
  "success": true,
  "post": {
    "id": "post-123",
    "title": "新帖子标题",
    "url": "/community/posts/post-123"
  },
  "message": "帖子发布成功"
}
```

### 6. 更新帖子
```http
PUT /api/community/posts/{postId}
```

**请求体:**
```json
{
  "title": "更新后的标题",
  "content": "更新后的内容",
  "tags": ["新标签"]
}
```

### 7. 删除帖子
```http
DELETE /api/community/posts/{postId}
```

**响应示例:**
```json
{
  "success": true,
  "message": "帖子已删除"
}
```

### 8. 点赞/取消点赞帖子
```http
POST /api/community/posts/{postId}/like
```

**响应示例:**
```json
{
  "success": true,
  "isLiked": true,
  "likesCount": 46
}
```

### 9. 关注/取消关注用户
```http
POST /api/community/users/{userId}/follow
```

**响应示例:**
```json
{
  "success": true,
  "isFollowing": true
}
```

### 10. 获取用户排行榜
```http
GET /api/community/trending
```

**响应示例:**
```json
{
  "members": [
    {
      "id": "1",
      "name": "Sarah Chen",
      "avatar": "avatar-url",
      "contributionScore": 1250,
      "rank": 1,
      "trend": "up"
    }
  ]
}
```

### 11. 获取热门标签
```http
GET /api/community/tags/popular
```

**响应示例:**
```json
{
  "tags": [
    {
      "name": "React",
      "count": 234,
      "trend": "up"
    },
    {
      "name": "AI",
      "count": 189,
      "trend": "stable"
    }
  ]
}
```

### 12. 添加评论
```http
POST /api/community/posts/{postId}/comments
```

**请求体:**
```json
{
  "content": "评论内容",
  "parentId": "comment-123"
}
```

**响应示例:**
```json
{
  "success": true,
  "comment": {
    "id": "comment-456",
    "content": "评论内容",
    "author": {
      "id": "user-123",
      "name": "用户名"
    },
    "createdAt": "2024-12-03T15:30:00Z"
  }
}
```

### 13. 点赞评论
```http
POST /api/community/comments/{commentId}/like
```

### 14. 举报帖子
```http
POST /api/community/posts/{postId}/report
```

**请求体:**
```json
{
  "reason": "垃圾信息",
  "description": "详细说明"
}
```

### 15. 生成 AI 摘要
```http
POST /api/community/posts/{postId}/ai-summary
```

**响应示例:**
```json
{
  "success": true,
  "summary": "用户咨询向量数据库优化策略，比较了 HNSW 和 IVF 索引方法",
  "keywords": ["向量数据库", "性能优化", "索引"]
}
```

### 16. 搜索帖子
```http
GET /api/community/search
```

**查询参数:**
```
?q=React&tags=Frontend&author=user-123&page=1&limit=20
```

**响应示例:**
```json
{
  "posts": [...],
  "total": 45,
  "page": 1,
  "suggestions": ["React 18", "React Native"]
}
```

### 17. 分享帖子
```http
POST /api/community/posts/{postId}/share
```

**请求体:**
```json
{
  "platform": "wechat|weibo|link"
}
```

**响应示例:**
```json
{
  "success": true,
  "shareUrl": "https://example.com/community/posts/123"
}
```

### 18. 获取帖子统计
```http
GET /api/community/posts/{postId}/stats
```

**响应示例:**
```json
{
  "views": 340,
  "likes": 45,
  "comments": 12,
  "shares": 8,
  "trendingScore": 95
}
```

## 路由配置

**路径:** `/dashboard/community`

**父路由:** DashboardLayout

**子路由:** 无

## 依赖常量

```typescript
ROUTES.DASHBOARD.COMMUNITY = '/dashboard/community'
ROUTES.DASHBOARD.KNOWLEDGE = '/dashboard/knowledge'
ROUTES.DASHBOARD.TEAM = '/dashboard/team'
```

## Mock 数据

### MOCK_TOPICS
```typescript
const MOCK_TOPICS = [
  {
    id: '1',
    title: 'React 19 Release',
    description: '讨论 React 19 的新特性',
    participants: 1240,
    hotIndex: 98,
    tags: ['React', 'Frontend']
  }
];
```

### MOCK_COMMUNITY_POSTS
```typescript
const MOCK_COMMUNITY_POSTS = [
  {
    id: '1',
    title: '如何优化 vector search 性能？',
    content: '我在使用 1M+ embeddings 时遇到延迟问题...',
    author: {
      name: 'David Kim',
      avatar: 'avatar-url',
      role: 'Data Scientist'
    },
    tags: ['Vector DB', 'Performance', 'AI'],
    likes: 45,
    isLiked: false,
    comments: 12,
    createdAt: '2 小时前',
    aiSummary: '用户咨询向量数据库优化策略',
    views: 340,
    hotIndex: 95
  }
];
```

## 性能优化

1. **分页加载**: 帖子列表分页
2. **虚拟滚动**: 长列表优化
3. **图片懒加载**: 头像和附件懒加载
4. **缓存**: 话题和帖子缓存
5. **防抖搜索**: 搜索输入防抖
6. **预加载**: 详情页预加载

## 错误处理

### 常见错误
- 网络错误
- 权限不足
- 内容违规
- 帖子不存在
- 评论失败

### 处理策略
- 错误提示
- 重试机制
- 降级显示
- 离线缓存

## 权限控制

### 用户角色
- **visitor**: 只能浏览
- **user**: 可以发帖和评论
- **moderator**: 可以管理帖子
- **admin**: 全部权限

### 权限检查
- 发帖权限
- 编辑权限
- 删除权限
- 管理权限

## 安全注意事项

1. **XSS 防护**: 内容转义
2. **CSRF 保护**: 令牌验证
3. **内容审核**: 敏感词过滤
4. **防刷**: 频率限制
5. **隐私保护**: 匿名选项

## 未来扩展

1. 私信功能
2. 直播讨论
3. 知识竞赛
4. 专家问答
5. 话题订阅
6. 内容推荐算法
7. 多媒体支持
8. 实时通知
