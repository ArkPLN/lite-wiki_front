# Portal 页面文档

## 页面概述

Portal 是 Lite-Wiki 的入口页面，作为着陆页展示产品特性，引导用户注册或登录。页面采用响应式设计，提供清晰的导航路径和价值主张展示。

## 功能特性

### 1. 产品特性展示
- **知识组织**: 智能分类和标签系统
- **AI 辅助**: 智能搜索和内容推荐
- **团队协作**: 多人实时编辑和评论
- **可视化图表**: 存储使用情况直观展示

### 2. 用户交互
- 点击 "开始" 进入注册页面
- 点击 "了解更多" 查看产品详情
- 点击 "登录" 进入登录页面
- 支持一键匿名登录

### 3. 响应式布局
- 移动端适配
- 平板端优化
- 桌面端完整展示

## 页面结构

```
Portal
├── Header (导航栏)
│   ├── Logo
│   ├── "登录" 按钮
│   └── "注册" 按钮
├── Hero Section (主要展示区)
│   ├── Logo 图标
│   ├── 主标题: "轻量级智能知识库"
│   ├── 副标题: "专为学生团体和初创团队设计"
│   └── 行动按钮
│       ├── "开始" - 进入注册
│       └── "了解更多" - 滚动到特性区
├── Features Section (特性展示)
│   ├── 知识组织卡片
│   ├── AI 辅助卡片
│   └── 团队协作卡片
└── Footer (页脚)
```

## 组件组成

### 主要组件
- **Portal.tsx**: 主页面组件
- **Hero Section**: 主要展示区域
- **Features Section**: 特性卡片区域
- **Button**: 通用按钮组件

### 关键样式类
- `animate-fade-in`: 页面淡入动画
- `bg-gradient-to-r from-indigo-600 to-purple-600`: 渐变背景
- `bg-white/10`: 半透明白色背景
- `hover:bg-white/20`: 悬停效果

## RESTful API 列表

### 1. 获取产品信息
```http
GET /api/portal/product-info
```

**响应示例:**
```json
{
  "title": "轻量级智能知识库",
  "subtitle": "专为学生团体和初创团队设计",
  "features": [
    {
      "title": "智能知识组织",
      "description": "让信息井然有序",
      "icon": "layout"
    },
    {
      "title": "AI 智能助手",
      "description": "让学习更高效",
      "icon": "bot"
    },
    {
      "title": "团队协作空间",
      "description": "让知识共享更便捷",
      "icon": "users"
    }
  ]
}
```

### 2. 获取统计数据
```http
GET /api/portal/stats
```

**响应示例:**
```json
{
  "activeUsers": 12345,
  "documentsCount": 67890,
  "teamsCount": 1234,
  "storageUsed": "2.5TB"
}
```

### 3. 匿名登录
```http
POST /api/auth/anonymous-login
```

**请求体:**
```json
{
  "deviceInfo": "string"
}
```

**响应示例:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "Guest User",
    "role": "anonymous"
  }
}
```

### 4. 用户注册
```http
POST /api/auth/register
```

**请求体:**
```json
{
  "email": "user@example.com",
  "password": "password",
  "name": "User Name",
  "role": "user"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "注册成功",
  "userId": "user-id"
}
```

### 5. 用户登录
```http
POST /api/auth/login
```

**请求体:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**响应示例:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### 6. 发送密码重置邮件
```http
POST /api/auth/forgot-password
```

**请求体:**
```json
{
  "email": "user@example.com"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "重置密码邮件已发送"
}
```

## 路由配置

**路径:** `/`

**父路由:** 无

**子路由:** 无

## 依赖的常量

```typescript
ROUTES.PORTAL = '/'
ROUTES.LOGIN = '/login'
ROUTES.REGISTER = '/register'
ROUTES.ANONYMOUS_LOGIN = '/anonymous-login'
ROUTES.FORGOT_PASSWORD = '/forgot-password'
ROUTES.DASHBOARD.OVERVIEW = '/dashboard/overview'
```

## 依赖的服务

- **useLanguage**: 国际化支持
- **useNavigate**: 路由导航
- **Button 组件**: 按钮 UI 组件

## 注意事项

1. **国际化**: 支持中英双语显示
2. **匿名登录**: 提供免注册体验
3. **SEO 优化**: 页面 meta 信息需要完善
4. **加载优化**: 图片懒加载
5. **动画效果**: 页面加载动画需要优化性能

## 未来扩展

1. 添加产品演示视频
2. 添加客户案例展示
3. 添加实时用户统计
4. 添加多语言支持
5. 添加主题切换功能
