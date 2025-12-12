# Team 页面文档

## 页面概述

Team 是 Lite-Wiki 的团队协作模块，提供团队论坛、Wiki、成员目录和管理功能。支持团队内部沟通、文档协作、成员管理等功能。包含四个子页面：Forum、TeamWiki、Directory、Management。

## 页面结构

```
Team
├── Header (团队头部)
│   ├── 团队标题
│   ├── 团队描述
│   └── Tab 导航
│       ├── Forum
│       ├── Wiki
│       ├── Directory
│       └── Management
└── Outlet (子页面渲染区)
    ├── Forum (论坛页)
    ├── Wiki (Wiki页)
    ├── Directory (成员目录页)
    └── Management (管理页)
```

## 1. Team 主页面 (Team.tsx)

### 功能特性
- 团队概览
- 标签页导航
- 默认跳转至 Forum

### 路由配置
**路径:** `/dashboard/team`

**子路由:**
```
/dashboard/team/forum          - 论坛
/dashboard/team/wiki           - Wiki
/dashboard/team/directory      - 成员目录
/dashboard/team/management     - 管理
```

### 标签页
```typescript
const tabs = [
  { name: t.team.forum, path: ROUTES.DASHBOARD.TEAM_FORUM, icon: <MessageSquare className="h-4 w-4" /> },
  { name: t.team.wiki, path: ROUTES.DASHBOARD.TEAM_WIKI, icon: <Book className="h-4 w-4" /> },
  { name: t.team.directory, path: ROUTES.DASHBOARD.TEAM_DIRECTORY, icon: <Users className="h-4 w-4" /> },
  { name: t.team.management, path: ROUTES.DASHBOARD.TEAM_MANAGEMENT, icon: <Settings className="h-4 w-4" /> },
];
```

---

## 2. Team Forum 页面 (Forum.tsx)

### 页面概述
团队内部论坛，供团队成员讨论技术问题、分享经验和交流想法。

### 功能特性
- 发表新帖
- 回复帖子
- 点赞互动
- 文件附件
- 搜索筛选
- 热门排行
- 标签分类

### 页面结构
```
Forum
├── Header (论坛头部)
│   ├── 标题和描述
│   └── 操作按钮
│       ├── 搜索框
│       └── 发布帖子
├── Main Content (主内容区)
│   ├── Left Panel (左侧内容)
│   │   ├── Posts List (帖子列表)
│   │   │   ├── 置顶帖子
│   │   │   ├── 普通帖子
│   │   │   └── 分页
│   │   └── Create Post (发帖区)
│   │       ├── 标题输入
│   │       ├── 内容输入
│   │       ├── 标签选择
│   │       └── 发布按钮
│   └── Right Panel (右侧边栏)
│       ├── Team Stats (团队统计)
│       │   ├── 成员数
│       │   ├── 帖子数
│       │   └── 回复数
│       ├── Recent Activity (最近活动)
│       └── Top Contributors (活跃成员)
└── Post Detail (帖子详情页)
    ├── Post Header (帖子头部)
    │   ├── 作者信息
    │   ├── 发布时间
    │   └── 操作按钮
    ├── Post Content (帖子内容)
    ├── Attachments (附件)
    └── Comments (评论区)
```

### RESTful API
```http
GET /api/team/{teamId}/forum/posts
POST /api/team/{teamId}/forum/posts
GET /api/team/{teamId}/forum/posts/{postId}
PUT /api/team/{teamId}/forum/posts/{postId}
DELETE /api/team/{teamId}/forum/posts/{postId}
POST /api/team/{teamId}/forum/posts/{postId}/like
POST /api/team/{teamId}/forum/posts/{postId}/comments
```

---

## 3. Team Wiki 页面 (TeamWiki.tsx)

### 页面概述
团队 Wiki 系统，用于编写和维护团队文档、流程和规范。

### 功能特性
- 页面编辑
- 版本历史
- 目录结构
- 搜索功能
- 权限控制
- 评论讨论

### 页面结构
```
TeamWiki
├── Header (Wiki 头部)
│   ├── 标题和面包屑
│   └── 操作按钮
│       ├── 编辑
│       ├── 历史
│       └── 新建
├── Layout (布局)
│   ├── Sidebar (侧边栏)
│   │   ├── 目录树
│   │   ├── 最近更新
│   │   └── 搜索框
│   └── Content (内容区)
│       ├── Markdown 渲染
│       ├── 目录导航
│       └── 底部操作
└── Edit Mode (编辑模式)
    ├── Editor (编辑器)
    ├── Preview (预览)
    └── Save Actions (保存操作)
```

### RESTful API
```http
GET /api/team/{teamId}/wiki/pages
POST /api/team/{teamId}/wiki/pages
GET /api/team/{teamId}/wiki/pages/{pageId}
PUT /api/team/{teamId}/wiki/pages/{pageId}
DELETE /api/team/{teamId}/wiki/pages/{pageId}
GET /api/team/{teamId}/wiki/pages/{pageId}/versions
POST /api/team/{teamId}/wiki/pages/{pageId}/revert
GET /api/team/{teamId}/wiki/tree
```

---

## 4. Team Directory 页面 (Directory.tsx)

### 页面概述
团队成员目录，展示所有团队成员信息和联系方式。

### 功能特性
- 成员列表
- 详细信息
- 搜索筛选
- 角色筛选
- 技能标签
- 在线状态

### 页面结构
```
Directory
├── Header (目录头部)
│   ├── 标题和描述
│   └── 操作按钮
│       ├── 搜索框
│       ├── 筛选器
│       └── 导出
├── Main Content (主内容区)
│   ├── Filters (筛选栏)
│   │   ├── 角色筛选
│   │   ├── 技能筛选
│   │   └── 状态筛选
│   └── Members List (成员列表)
│       ├── 网格视图
│       │   └── 成员卡片
│       │       ├── 头像
│       │       ├── 姓名
│       │       ├── 职位
│       │       ├── 技能标签
│       │       └── 在线状态
│       └── 列表视图
│           └── 成员表格
│               ├── 头像
│               ├── 姓名
│               ├── 邮箱
│               ├── 职位
│               ├── 技能
│               └── 最后活跃
└── Member Detail (成员详情)
    ├── Profile (个人资料)
    │   ├── 头像
    │   ├── 基本信息
    │   ├── 简介
    │   └── 技能
    ├── Contributions (贡献)
    │   ├── 文档贡献
    │   ├── 论坛活跃度
    │   └── Wiki 编辑
    └── Contact (联系方式)
        ├── 邮箱
        ├── 电话
        └── 其他联系方式
```

### 数据类型
```typescript
interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  position: string;
  skills: string[];
  bio: string;
  joinedAt: string;
  lastActive: string;
  isOnline: boolean;
  contributions: {
    documents: number;
    forumPosts: number;
    wikiEdits: number;
  };
}
```

### RESTful API
```http
GET /api/team/{teamId}/members
POST /api/team/{teamId}/members/invite
GET /api/team/{teamId}/members/{memberId}
PUT /api/team/{teamId}/members/{memberId}
DELETE /api/team/{teamId}/members/{memberId}
POST /api/team/{teamId}/members/{memberId}/role
GET /api/team/{teamId}/members/search
```

---

## 5. Team Management 页面 (Management.tsx)

### 页面概述
团队管理页面，提供团队设置、权限管理和高级配置功能。

### 功能特性
- 团队设置
- 权限管理
- 成员邀请
- 角色分配
- 审核设置
- 数据导出

### 页面结构
```
Management
├── Header (管理头部)
│   └── 标签导航
│       ├── General (常规设置)
│       ├── Members (成员管理)
│       ├── Roles (角色管理)
│       ├── Security (安全设置)
│       └── Billing (账单)
├── Tabs Content (标签内容)
│   ├── General Tab (常规设置)
│   │   ├── 团队信息
│   │   │   ├── 团队名称
│   │   │   ├── 团队描述
│   │   │   ├── 团队头像
│   │   │   └── 团队类型
│   │   ├── 可见性设置
│   │   │   ├── 公开/私有
│   │   │   └── 成员可见性
│   │   └── 通知设置
│   │       ├── 邮件通知
│   │       └── 推送通知
│   ├── Members Tab (成员管理)
│   │   ├── Pending Invites (待审核邀请)
│   │   ├── Active Members (活跃成员)
│   │   └── Member Actions (成员操作)
│   │       ├── 邀请成员
│   │       ├── 移除成员
│   │       └── 修改角色
│   ├── Roles Tab (角色管理)
│   │   ├── Role List (角色列表)
│   │   │   ├── Owner
│   │   │   ├── Admin
│   │   │   ├── Member
│   │   │   └── Viewer
│   │   └── Permissions (权限矩阵)
│   │       ├── 查看权限
│   │       ├── 编辑权限
│   │       ├── 管理权限
│   │       └── 删除权限
│   ├── Security Tab (安全设置)
│   │   ├── Two-Factor Auth (双因素认证)
│   │   ├── SSO Settings (单点登录)
│   │   ├── API Keys (API 密钥)
│   │   └── Audit Logs (审计日志)
│   └── Billing Tab (账单)
│       ├── Current Plan (当前套餐)
│       ├── Usage (使用情况)
│       ├── Payment Method (支付方式)
│       └── Invoices (发票)
```

### RESTful API
```http
GET /api/team/{teamId}/settings
PUT /api/team/{teamId}/settings
GET /api/team/{teamId}/members/pending
POST /api/team/{teamId}/members/approve
POST /api/team/{teamId}/members/reject
GET /api/team/{teamId}/roles
POST /api/team/{teamId}/roles
PUT /api/team/{teamId}/roles/{roleId}
DELETE /api/team/{teamId}/roles/{roleId}
GET /api/team/{teamId}/audit-logs
GET /api/team/{teamId}/billing
POST /api/team/{teamId}/billing/payment-method
```

---

## 团队数据模型

### Team
```typescript
interface Team {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  type: 'public' | 'private';
  owner: {
    id: string;
    name: string;
    email: string;
  };
  members: TeamMember[];
  settings: {
    allowMemberInvite: boolean;
    requireApproval: boolean;
    defaultRole: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### TeamPost
```typescript
interface TeamPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  teamId: string;
  isPinned: boolean;
  tags: string[];
  likes: number;
  isLiked: boolean;
  comments: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}
```

### TeamPage (Wiki)
```typescript
interface TeamPage {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  teamId: string;
  parentId?: string;
  path: string;
  version: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## 依赖常量

```typescript
ROUTES.DASHBOARD.TEAM = '/dashboard/team'
ROUTES.DASHBOARD.TEAM_FORUM = '/dashboard/team/forum'
ROUTES.DASHBOARD.TEAM_WIKI = '/dashboard/team/wiki'
ROUTES.DASHBOARD.TEAM_DIRECTORY = '/dashboard/team/directory'
ROUTES.DASHBOARD.TEAM_MANAGEMENT = '/dashboard/team/management'
```

---

## 权限体系

### 角色定义
- **Owner**: 团队所有者，拥有所有权限
- **Admin**: 管理员，可以管理团队设置和成员
- **Member**: 成员，可以创建和编辑内容
- **Viewer**: 查看者，只能查看内容

### 权限矩阵
| 权限 | Owner | Admin | Member | Viewer |
|------|-------|-------|--------|--------|
| 查看团队 | ✓ | ✓ | ✓ | ✓ |
| 编辑团队信息 | ✓ | ✓ | ✗ | ✗ |
| 邀请成员 | ✓ | ✓ | 可选 | ✗ |
| 移除成员 | ✓ | ✓ | ✗ | ✗ |
| 管理角色 | ✓ | ✓ | ✗ | ✗ |
| 发布帖子 | ✓ | ✓ | ✓ | ✗ |
| 编辑帖子 | ✓ | ✓ | 仅自己 | ✗ |
| 删除帖子 | ✓ | ✓ | 仅自己 | ✗ |
| 编辑 Wiki | ✓ | ✓ | ✓ | ✗ |
| 管理 Wiki | ✓ | ✓ | ✗ | ✗ |

---

## 性能优化

1. **分页加载**: 论坛帖子分页
2. **虚拟滚动**: 成员列表优化
3. **缓存**: Wiki 页面缓存
4. **懒加载**: 图片懒加载
5. **搜索防抖**: 输入防抖
6. **CDN**: 静态资源加速

---

## 安全注意事项

1. **权限验证**: 所有操作权限检查
2. **输入过滤**: XSS 防护
3. **CSRF 保护**: 令牌验证
4. **文件上传**: 病毒扫描
5. **审计日志**: 操作记录
6. **数据加密**: 敏感数据加密

---

## 国际化支持

### 翻译键示例
```typescript
t.team.header
t.team.subHeader
t.team.forum
t.team.wiki
t.team.directory
t.team.management
t.team.likes
t.team.actions
t.team.replyPlaceholder
t.team.postComment
```

---

## 未来扩展

1. 团队分析报表
2. 集成第三方工具
3. 自动化工作流
4. 团队标签系统
5. 项目管理集成
6. 视频会议集成
7. 团队文化建设工具
8. 知识地图
