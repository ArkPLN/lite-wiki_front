# 认证页面文档

## 页面概述

认证模块包含四个核心页面：登录、注册、匿名登录和忘记密码。提供完整的用户认证流程，支持常规登录、免注册体验和密码找回功能。

## 1. 登录页面 (Login)

### 页面功能
- 用户邮箱/用户名登录
- 密码验证
- 记住我选项
- 社交登录（Google、GitHub）
- 错误提示
- 登录状态保持

### 页面结构
```
Login
├── Header (顶部导航)
├── Main Content (主内容区)
│   ├── Logo
│   ├── 登录表单
│   │   ├── 邮箱输入
│   │   ├── 密码输入
│   │   ├── 记住我选项
│   │   └── 登录按钮
│   ├── 分割线 ("或")
│   ├── 社交登录按钮
│   │   ├── Google 登录
│   │   └── GitHub 登录
│   └── 链接
│       ├── "还没有账户？注册"
│       ├── "忘记密码？"
│       └── "匿名登录"
└── Footer (页脚)
```

### RESTful API
```http
POST /api/auth/login
```

**请求体:**
```json
{
  "email": "user@example.com",
  "password": "password",
  "rememberMe": true
}
```

**响应示例:**
```json
{
  "success": true,
  "token": "jwt-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "avatar": "avatar-url",
    "role": "user"
  },
  "expiresIn": 3600
}
```

### 社交登录 API
```http
POST /api/auth/social-login
```

**请求体:**
```json
{
  "provider": "google",
  "token": "social-token"
}
```

---

## 2. 注册页面 (Register)

### 页面功能
- 新用户注册
- 邮箱验证
- 密码强度验证
- 用户角色选择
- 服务条款同意
- 自动登录

### 页面结构
```
Register
├── Header (顶部导航)
├── Main Content (主内容区)
│   ├── Logo
│   ├── 注册表单
│   │   ├── 姓名输入
│   │   ├── 邮箱输入
│   │   ├── 密码输入
│   │   ├── 确认密码
│   │   ├── 角色选择 (学生/老师/其他)
│   │   ├── 同意条款复选框
│   │   └── 注册按钮
│   ├── 分割线 ("或")
│   ├── 社交注册按钮
│   │   ├── Google 注册
│   │   └── GitHub 注册
│   └── 链接 ("已有账户？登录")
└── Footer (页脚)
```

### RESTful API
```http
POST /api/auth/register
```

**请求体:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password",
  "role": "user",
  "agreedToTerms": true
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "注册成功，请查看邮箱验证",
  "userId": "user-id",
  "verificationEmailSent": true
}
```

### 邮箱验证 API
```http
POST /api/auth/verify-email
```

**请求体:**
```json
{
  "userId": "user-id",
  "token": "verification-token"
}
```

---

## 3. 匿名登录页面 (AnonymousLogin)

### 页面功能
- 免注册快速体验
- 临时用户会话
- 有限功能访问
- 引导注册转化

### 页面结构
```
AnonymousLogin
├── Header (顶部导航)
├── Main Content (主内容区)
│   ├── 图标区域
│   ├── 标题: "快速体验 Lite-Wiki"
│   ├── 描述文本
│   ├── 特性列表
│   │   ✓ 浏览公开文档
│   │   ✓ 体验 AI 助手
│   │   ✓ 查看社区讨论
│   │   ✗ 保存编辑内容
│   │   ✗ 加入团队
│   └── 按钮
│       ├── "开始体验" (匿名登录)
│       └── "注册账户" (引导注册)
└── Footer (页脚)
```

### RESTful API
```http
POST /api/auth/anonymous-login
```

**请求体:**
```json
{
  "deviceInfo": "device-fingerprint",
  "browserInfo": "browser-details"
}
```

**响应示例:**
```json
{
  "success": true,
  "token": "anonymous-token",
  "user": {
    "id": "anonymous-user-id",
    "name": "Guest User",
    "role": "anonymous",
    "permissions": ["view_public", "use_ai"]
  },
  "expiresIn": 86400
}
```

### 获取匿名用户权限 API
```http
GET /api/auth/anonymous-permissions
```

**响应示例:**
```json
{
  "permissions": [
    "view_public",
    "use_ai_basic",
    "browse_community"
  ],
  "restrictions": [
    "cannot_save",
    "cannot_create_team",
    "limited_ai_queries"
  ]
}
```

---

## 4. 忘记密码页面 (ForgotPassword)

### 页面功能
- 邮箱重置密码
- 验证码发送
- 密码重置表单
- 邮件发送状态

### 页面结构
```
ForgotPassword
├── Header (顶部导航)
├── Main Content (主内容区)
│   ├── 图标区域
│   ├── 标题: "重置密码"
│   ├── 描述文本
│   ├── 邮箱输入框
│   ├── "发送重置邮件" 按钮
│   └── 链接 ("返回登录")
└── Step 2 (邮件发送后显示)
    ├── 邮件图标
    ├── 标题: "检查您的邮箱"
    ├── 描述文本
    └── "返回登录" 按钮
```

### RESTful API
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

### 重置密码 API
```http
POST /api/auth/reset-password
```

**请求体:**
```json
{
  "token": "reset-token",
  "newPassword": "new-password"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "密码重置成功"
}
```

### 验证重置令牌 API
```http
GET /api/auth/verify-reset-token/:token
```

**响应示例:**
```json
{
  "valid": true,
  "email": "user@example.com",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

---

## 共享组件

### Input 组件
```typescript
interface InputProps {
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}
```

### Button 组件
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}
```

---

## 路由配置

```
/login                  - 登录页面
/register              - 注册页面
/anonymous-login       - 匿名登录页面
/forgot-password       - 忘记密码页面
```

## 依赖常量

```typescript
ROUTES.LOGIN = '/login'
ROUTES.REGISTER = '/register'
ROUTES.ANONYMOUS_LOGIN = '/anonymous-login'
ROUTES.FORGOT_PASSWORD = '/forgot-password'
ROUTES.DASHBOARD.OVERVIEW = '/dashboard/overview'
ROUTES.PORTAL = '/'
```

---

## 验证规则

### 邮箱验证
- 格式：`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- 最大长度：254 字符

### 密码验证
- 最少 8 个字符
- 至少包含一个大写字母
- 至少包含一个小写字母
- 至少包含一个数字
- 可包含特殊字符

### 姓名验证
- 2-50 个字符
- 不允许特殊字符

---

## 错误处理

### 常见错误码
- `INVALID_EMAIL`: 邮箱格式错误
- `INVALID_PASSWORD`: 密码错误
- `USER_NOT_FOUND`: 用户不存在
- `EMAIL_EXISTS`: 邮箱已存在
- `WEAK_PASSWORD`: 密码强度不足
- `TOKEN_EXPIRED`: 令牌过期
- `VERIFICATION_REQUIRED`: 需要邮箱验证

### 错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "INVALID_EMAIL",
    "message": "邮箱格式不正确"
  }
}
```

---

## 安全注意事项

1. **密码加密**: 使用 bcrypt 或 argon2
2. **JWT 令牌**: 设置合适的过期时间
3. **Rate Limiting**: 登录尝试次数限制
4. **CSRF 防护**: 使用 CSRF 令牌
5. **邮件验证**: 强制邮箱验证
6. **密码重置**: 使用一次性令牌
7. **会话管理**: 安全退出登录

---

## 国际化支持

支持中英双语，所有文本通过 `useLanguage` hook 获取：

```typescript
t.login.title
t.login.email
t.login.password
t.login.loginButton
t.register.title
t.register.name
t.register.createAccount
...
```
