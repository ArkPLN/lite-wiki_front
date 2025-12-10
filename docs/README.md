# Lite-Wiki 页面文档

欢迎来到 Lite-Wiki 页面文档集合！本文档提供了项目中所有页面的详细说明，包括功能特性、数据结构、RESTful API 等内容。

## 📚 文档索引

### 1. [Portal 页面](01-portal.md)
Lite-Wiki 的入口页面，展示产品特性和引导用户注册登录。

**主要内容:**
- 产品特性展示
- 用户交互流程
- 响应式设计
- 相关 API 文档

### 2. [认证页面](02-authentication.md)
用户登录、注册、匿名登录和密码重置功能。

**主要内容:**
- 登录页面 (Login)
- 注册页面 (Register)
- 匿名登录页面 (AnonymousLogin)
- 忘记密码页面 (ForgotPassword)
- 完整认证流程 API

### 3. [Dashboard 概览页面](03-dashboard-overview.md)
用户登录后的首页，展示系统概览和快速操作入口。

**主要内容:**
- 快速统计信息
- 最近活动
- 快捷操作
- 数据可视化

### 4. [编辑器页面](04-editor.md)
Markdown 文档编辑器，支持实时预览和版本控制。

**主要内容:**
- Markdown 编辑功能
- 实时预览
- 版本控制
- 协作编辑
- WebSocket 实时同步

### 5. [社区页面](05-community.md)
用户交流和讨论平台，支持话题分类和帖子互动。

**主要内容:**
- 话题管理
- 帖子系统
- 用户互动
- AI 摘要
- 搜索功能

### 6. [知识中心页面](06-knowledge-center.md)
基于 Google Gemini AI 的智能问答和知识检索系统。

**主要内容:**
- AI 对话
- 知识库选择
- 向量搜索
- 统计信息
- 文件索引

### 7. [团队页面](07-team.md)
团队协作模块，包含论坛、Wiki、成员目录和管理功能。

**主要内容:**
- 团队论坛 (Forum)
- 团队 Wiki (TeamWiki)
- 成员目录 (Directory)
- 团队管理 (Management)
- 权限体系

### 8. [库页面](08-library.md)
文档库管理，包含收藏、最近访问和回收站功能。

**主要内容:**
- 收藏页面 (Favorites)
- 最近访问页面 (Recent)
- 回收站页面 (Trash)
- 搜索和筛选
- 批量操作

### 9. [用户配置和通知页面](09-user-profile-and-notifications.md)
用户个人资料管理和系统通知功能。

**主要内容:**
- 用户配置页面 (UserProfile)
  - 个人资料编辑
  - 安全设置
  - 双因素认证
  - 偏好设置
- 通知页面 (Notifications)
  - 通知列表
  - 类型分类
  - 标记和删除

### 10. [欢迎页面](10-welcome.md)
新用户引导页面，提供功能介绍和快速导航。

**主要内容:**
- 个性化欢迎
- 功能卡片展示
- 快速导航
- 视觉设计

## 🗂️ 文档结构说明

每个页面的文档包含以下部分：

### 通用章节
1. **页面概述** - 页面功能和定位
2. **功能特性** - 核心功能列表
3. **页面结构** - UI 组件结构
4. **组件组成** - 使用的组件和图标
5. **路由配置** - 路由路径和参数
6. **依赖常量** - 相关的常量定义

### 数据章节
7. **数据类型** - TypeScript 接口定义
8. **Mock 数据** - 示例数据结构
9. **状态管理** - React 状态使用

### API 章节
10. **RESTful API** - 完整的 API 文档
    - 请求方法
    - 请求路径
    - 请求体/查询参数
    - 响应示例
    - 错误处理

### 高级章节
11. **国际化支持** - 多语言实现
12. **性能优化** - 优化策略
13. **错误处理** - 错误场景和处理
14. **安全注意事项** - 安全相关
15. **未来扩展** - 计划功能

## 🛠️ 技术栈

- **前端框架**: React 18.2.0
- **开发语言**: TypeScript
- **构建工具**: Vite 6.2.0
- **路由**: React Router DOM 6.23.1
- **UI 图标**: Lucide React
- **Markdown**: react-markdown
- **AI 服务**: Google Gemini

## 📋 项目信息

### 目录结构
```
/
├── App.tsx                 # 主应用组件
├── index.tsx              # 应用入口
├── constants.ts           # 常量定义
├── types.ts               # 类型定义
├── vite.config.ts         # Vite 配置
├── pages/                 # 页面组件
│   ├── Portal.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── AnonymousLogin.tsx
│   ├── ForgotPassword.tsx
│   └── dashboard/
│       ├── Overview.tsx
│       ├── Editor.tsx
│       ├── Community.tsx
│       ├── KnowledgeCenter.tsx
│       ├── Team.tsx
│       ├── Favorites.tsx
│       ├── Recent.tsx
│       ├── Trash.tsx
│       ├── UserProfile.tsx
│       ├── Notifications.tsx
│       └── Welcome.tsx
└── docs/                  # 页面文档
    ├── README.md          # 文档索引
    ├── 01-portal.md
    ├── 02-authentication.md
    ├── 03-dashboard-overview.md
    ├── 04-editor.md
    ├── 05-community.md
    ├── 06-knowledge-center.md
    ├── 07-team.md
    ├── 08-library.md
    ├── 09-user-profile-and-notifications.md
    └── 10-welcome.md
```

### 路由结构
```
/                                   # Portal 页面
/login                              # 登录
/register                           # 注册
/anonymous-login                    # 匿名登录
/forgot-password                    # 忘记密码

/dashboard/overview                 # Dashboard 概览
/dashboard/documents                # 文档编辑器
/dashboard/community                # 社区
/dashboard/knowledge                # 知识中心
/dashboard/team                     # 团队
  /dashboard/team/forum             #  团队论坛
  /dashboard/team/wiki              #  团队 Wiki
  /dashboard/team/directory         #  成员目录
  /dashboard/team/management        #  团队管理
/dashboard/favorites                # 收藏
/dashboard/recent                   # 最近访问
/dashboard/trash                    # 回收站
/dashboard/profile                  # 用户配置
/dashboard/notifications            # 通知
/dashboard/welcome                  # 欢迎页面
```

## 🔧 开发指南

### 运行项目
```bash
# 安装依赖
pnpm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 环境配置
在项目根目录创建 `.env.local` 文件：
```env
GEMINI_API_KEY=your_api_key_here
```

### 添加新页面
1. 在 `pages/` 目录创建页面组件
2. 在 `constants.ts` 添加路由定义
3. 在 `App.tsx` 注册路由
4. 创建对应文档文件

## 📖 使用说明

### 查阅文档
- 按页面功能浏览：参考目录结构
- 按 API 查阅：查看 RESTful API 章节
- 按技术实现查阅：查看组件组成章节

### 快速导航
- 使用 `Ctrl/Cmd + F` 搜索关键词
- 点击文档中的链接跳转到相关章节
- 查看相关页面的交叉引用

## 🤝 贡献指南

### 文档更新
1. 更新页面代码后及时更新文档
2. 保持文档与代码同步
3. 添加必要的中文注释
4. 提供完整的 API 示例

### 新增页面
1. 创建页面组件
2. 添加路由配置
3. 编写完整文档
4. 更新此索引文件

## 📝 注意事项

1. **API 密钥安全**: Gemini API 密钥需要保密
2. **版本控制**: 所有 API 都需要版本管理
3. **权限验证**: 确保所有操作都有权限检查
4. **国际化**: 所有文本需要支持中英双语
5. **性能优化**: 注意大数据量场景的性能

## 📞 支持与反馈

如有问题或建议，请通过以下方式联系：
- 创建 Issue
- 提交 Pull Request
- 联系开发团队

---

**更新时间**: 2024-12-03
**文档版本**: v1.0.0
