# Welcome 页面文档

## 页面概述

Welcome 是用户登录后的欢迎页面，提供新用户引导和功能介绍。通过精美的卡片设计和直观的导航，帮助用户快速了解 Lite-Wiki 的核心功能并引导用户进入相应模块。

## 功能特性

### 1. 个性化欢迎
- 欢迎标题
- 用户角色显示
- 动态问候语

### 2. 功能卡片展示
- 工作台入口
- AI 助手入口
- 团队协作入口

### 3. 快速导航
- 跳转到工作台
- 跳转到 AI 助手
- 跳转到团队空间
- 进入概览页面

### 4. 视觉设计
- 渐变背景
- 图标动画
- 悬停效果
- 响应式布局

## 页面结构

```
Welcome
├── Hero Section (主要展示区)
│   ├── Icon (图标)
│   │   └── User 图标
│   ├── Title (标题)
│   │   └── 欢迎标题
│   ├── Subtitle (副标题)
│   │   └── 欢迎副标题
│   └── Role Badge (角色徽章)
│       └── 用户角色标签
├── Feature Cards (功能卡片区)
│   ├── Card 1 (工作台卡片)
│   │   ├── Icon (布局图标)
│   │   ├── Title (标题)
│   │   ├── Description (描述)
│   │   └── Button (按钮)
│   │       └── "Go to Workbench"
│   ├── Card 2 (AI 助手卡片)
│   │   ├── Icon (机器人图标)
│   │   ├── Title (标题)
│   │   ├── Description (描述)
│   │   └── Button (按钮)
│   │       └── "Ask AI"
│   └── Card 3 (团队协作卡片)
│       ├── Icon (用户图标)
│       ├── Title (标题)
│       ├── Description (描述)
│       └── Button (按钮)
│           └── "View Team"
└── CTA Section (行动号召区)
    └── Get Started Button (开始按钮)
```

## 组件组成

### 主要组件
- **Welcome.tsx**: 主页面组件
- **HeroSection**: 主要展示区域
- **FeatureCards**: 功能卡片区域
- **CTASection**: 行动号召区域

### 图标组件
- **User**: 用户图标
- **Layout**: 布局图标
- **Bot**: 机器人图标
- **Users**: 用户组图标
- **ArrowRight**: 右箭头图标

### 依赖组件
- **useLanguage**: 国际化支持
- **useNavigate**: 路由导航
- **Button**: 按钮组件

## Mock 数据

### 用户信息
```typescript
const MOCK_USER = {
  name: 'Alex Zhang',
  email: 'alex@example.com',
  role: 'user',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
};
```

### 功能卡片配置
```typescript
const featureCards = [
  {
    id: 'workbench',
    icon: <Layout className="h-6 w-6" />,
    title: '智能工作台',
    description: '文档管理、团队协作、智能搜索',
    buttonText: 'Go to Workbench',
    route: ROUTES.DASHBOARD.DOCUMENTS,
    color: 'blue'
  },
  {
    id: 'ai-assistant',
    icon: <Bot className="h-6 w-6" />,
    title: 'AI 智能助手',
    description: '让学习更高效',
    buttonText: 'Ask AI',
    route: ROUTES.DASHBOARD.KNOWLEDGE,
    color: 'purple'
  },
  {
    id: 'team',
    icon: <Users className="h-6 w-6" />,
    title: '团队协作空间',
    description: '让知识共享更便捷',
    buttonText: 'View Team',
    route: ROUTES.DASHBOARD.TEAM,
    color: 'green'
  }
];
```

## 样式设计

### 卡片样式
```css
/* 基础卡片样式 */
background: white;
border: 1px solid #e5e7eb;
border-radius: 12px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
transition: all 0.3s ease;

/* 悬停效果 */
hover: {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: primary-200;
  transform: translateY(-2px);
}
```

### 颜色主题
```typescript
const colorThemes = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    hoverBg: 'hover:bg-blue-600',
    hoverText: 'hover:text-white',
    borderHover: 'hover:border-blue-200'
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    hoverBg: 'hover:bg-purple-600',
    hoverText: 'hover:text-white',
    borderHover: 'hover:border-purple-200'
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    hoverBg: 'hover:bg-green-600',
    hoverText: 'hover:text-white',
    borderHover: 'hover:border-green-200'
  }
};
```

## 路由配置

**路径:** `/dashboard/welcome`

**父路由:** DashboardLayout

**子路由:** 无

## 依赖常量

```typescript
ROUTES.DASHBOARD.WELCOME = '/dashboard/welcome'
ROUTES.DASHBOARD.DOCUMENTS = '/dashboard/documents'
ROUTES.DASHBOARD.KNOWLEDGE = '/dashboard/knowledge'
ROUTES.DASHBOARD.TEAM = '/dashboard/team'
ROUTES.DASHBOARD.OVERVIEW = '/dashboard/overview'
```

## 导航流程

### 跳转逻辑
1. **工作台卡片** → `/dashboard/documents` (文档编辑器)
2. **AI 助手卡片** → `/dashboard/knowledge` (知识中心)
3. **团队协作卡片** → `/dashboard/team` (团队空间)
4. **开始按钮** → `/dashboard/overview` (概览页面)

### 条件导航
- 新用户: 显示 Welcome 页面
- 老用户: 可选显示或直接跳转到 Overview
- 匿名用户: 限制部分功能

## 动画效果

### 页面动画
```css
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 卡片动画
```css
.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### 图标动画
```css
.icon-hover {
  transition: all 0.3s ease;
}

.icon-hover:hover {
  transform: scale(1.1);
}
```

## 响应式设计

### 断点设置
- **Mobile** (< 768px): 单列布局
- **Tablet** (768px - 1024px): 两列布局
- **Desktop** (> 1024px): 三列布局

### 布局适配
```typescript
const responsiveClasses = {
  mobile: 'grid-cols-1',
  tablet: 'grid-cols-1 md:grid-cols-2',
  desktop: 'grid-cols-1 md:grid-cols-3'
};
```

## 国际化支持

### 翻译键
```typescript
t.welcome.title
t.welcome.subtitle
t.welcome.role
t.welcome.card1Title
t.welcome.card1Desc
t.welcome.card2Title
t.welcome.card2Desc
t.welcome.card3Title
t.welcome.card3Desc
t.welcome.getStarted
```

### 动态文本
- 用户名动态替换
- 角色动态显示
- 时间相关问候语

## RESTful API (可选)

### 1. 获取欢迎页面配置
```http
GET /api/welcome/config
```

**响应示例:**
```json
{
  "title": "欢迎使用 Lite-Wiki",
  "subtitle": "轻量级智能知识库",
  "featureCards": [
    {
      "id": "workbench",
      "title": "智能工作台",
      "description": "文档管理、团队协作、智能搜索",
      "icon": "layout",
      "route": "/dashboard/documents"
    }
  ],
  "showOnboarding": true
}
```

### 2. 标记用户已查看欢迎页
```http
POST /api/user/welcome-viewed
```

**响应示例:**
```json
{
  "success": true,
  "message": "欢迎页面已标记"
}
```

### 3. 获取用户首次访问状态
```http
GET /api/user/first-visit
```

**响应示例:**
```json
{
  "isFirstVisit": true,
  "onboardingStep": 1,
  "completedSteps": []
}
```

## 使用场景

### 新用户引导
1. 首次登录展示
2. 功能介绍
3. 快速导航

### 老用户欢迎
1. 个性化欢迎
2. 快速入口
3. 功能提醒

### 功能推广
1. 新功能介绍
2. 特性亮点
3. 快速试用

## 性能优化

1. **静态内容缓存**: 页面静态资源缓存
2. **图片优化**: 图标使用 SVG，减少加载时间
3. **代码分割**: 懒加载非关键组件
4. **预加载**: 预加载目标页面资源
5. **动画优化**: 使用 CSS3 动画，避免重排重绘

## A/B 测试

### 测试点
- 卡片布局方式
- 按钮文案
- 颜色主题
- 功能介绍顺序

### 指标
- 点击率
- 跳转率
- 停留时间
- 功能使用率

## 未来扩展

1. **个性化推荐**: 根据用户行为推荐功能
2. **互动教程**: 交互式产品导览
3. **视频介绍**: 产品功能演示视频
4. **进度追踪**: 新手引导进度条
5. **多语言支持**: 更多语言选项
6. **主题切换**: 多种视觉主题
7. **快捷键提示**: 键盘快捷键展示
8. **功能搜索**: 搜索特定功能
9. **最近访问**: 显示最近使用的功能
10. **推荐内容**: 基于用户兴趣的内容推荐

## 注意事项

1. **加载性能**: 控制首屏加载时间
2. **SEO 优化**: 添加合适的 meta 信息
3. **无障碍**: 支持键盘导航和屏幕阅读器
4. **国际化**: 考虑不同语言的排版差异
5. **可维护性**: 组件解耦，便于修改
6. **用户体验**: 流畅的过渡动画
7. **视觉一致性**: 与整体设计保持一致
8. **测试覆盖**: 编写单元测试和集成测试
