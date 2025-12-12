# User Profile & Notifications 页面文档

## 页面概述

用户配置文件和通知模块用于管理用户个人信息和接收系统消息。支持个人资料编辑、密码修改、双因素认证、通知管理等功能。

---

## 1. User Profile 页面 (UserProfile.tsx)

### 页面概述
用户配置文件页面允许用户查看和编辑个人信息、安全设置和偏好配置。

### 功能特性
- 个人资料查看
- 信息编辑
- 头像上传
- 密码修改
- 双因素认证
- 语言偏好
- 邮件通知设置

### 页面结构
```
UserProfile
├── Header (页面头部)
│   └── 页面标题
├── Profile Card (个人资料卡片)
│   ├── Banner (顶部横幅)
│   │   └── 渐变背景
│   ├── Profile Info (个人信息)
│   │   ├── Avatar (头像)
│   │   │   └── 头像图片
│   │   │   └── 相机图标 (编辑时显示)
│   │   ├── Name (姓名)
│   │   └── Role (角色)
│   └── Edit Button (编辑按钮)
│       ├── 编辑模式按钮
│       └── 取消按钮
└── Form Sections (表单区域)
    ├── Left Column (左列)
    │   └── Account Info (账户信息)
    │       ├── Full Name (姓名输入)
    │       ├── Nickname (昵称输入)
    │       ├── Email (邮箱显示)
    │       └── Bio (个人简介)
    └── Right Column (右列)
        ├── Personal Details (个人详情)
        │   ├── Phone (电话)
        │   └── Role (角色显示)
        ├── Security (安全设置)
        │   ├── Password Field (密码字段)
        │   └── 2FA Description (双因素认证说明)
        └── Preferences (偏好设置)
            ├── Language (语言选择)
            │   ├── English
            │   └── 中文 (Chinese)
            └── Email Notifications (邮件通知)
└── 2FA Modal (双因素认证模态框)
    ├── Modal Header (模态框头部)
    │   ├── Shield Icon (盾牌图标)
    │   ├── Title (标题)
    │   └── Description (描述)
    ├── Verification (验证区域)
    │   ├── Phone Display (手机号显示)
    │   ├── Code Input (验证码输入)
    │   └── Verify Button (验证按钮)
    └── Cancel Button (取消按钮)
```

### 数据类型
```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  nickname: string;
  bio: string;
  avatar: string;
  language: 'en' | 'zh';
  emailNotifications: boolean;
  twoFactorEnabled: boolean;
}
```

### Mock 数据
```typescript
const MOCK_USER = {
  id: 'user-123',
  name: 'Alex Zhang',
  email: 'alex@example.com',
  role: 'user',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
};
```

### RESTful API

#### 1. 获取用户资料
```http
GET /api/user/profile
```

**响应示例:**
```json
{
  "id": "user-123",
  "name": "Alex Zhang",
  "email": "alex@example.com",
  "role": "user",
  "phone": "13800000000",
  "nickname": "AlexDev",
  "bio": "Senior developer passionate about React and AI agents.",
  "avatar": "https://example.com/avatar.jpg",
  "language": "zh",
  "emailNotifications": true,
  "twoFactorEnabled": false
}
```

#### 2. 更新用户资料
```http
PUT /api/user/profile
```

**请求体:**
```json
{
  "name": "Alex Zhang",
  "nickname": "AlexDev",
  "bio": "Senior developer passionate about React and AI agents.",
  "phone": "13800000000",
  "language": "zh"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "个人资料已更新",
  "user": {
    "id": "user-123",
    "name": "Alex Zhang",
    ...
  }
}
```

#### 3. 上传头像
```http
POST /api/user/avatar
```

**请求体:** (multipart/form-data)
```
avatar: [binary data]
```

**响应示例:**
```json
{
  "success": true,
  "avatarUrl": "https://cdn.example.com/avatars/user-123.jpg"
}
```

#### 4. 修改密码
```http
PUT /api/user/password
```

**请求体:**
```json
{
  "currentPassword": "current-password",
  "newPassword": "new-password"
}
```

**前置条件:** 需要双因素认证

#### 5. 启用双因素认证
```http
POST /api/user/2fa/enable
```

**请求体:**
```json
{
  "phone": "13800000000"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "验证码已发送",
  "verificationId": "verify-123"
}
```

#### 6. 验证双因素认证
```http
POST /api/user/2fa/verify
```

**请求体:**
```json
{
  "verificationId": "verify-123",
  "code": "123456"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "双因素认证已启用"
}
```

#### 7. 更新偏好设置
```http
PUT /api/user/preferences
```

**请求体:**
```json
{
  "language": "zh",
  "emailNotifications": true,
  "pushNotifications": false
}
```

#### 8. 发送密码重置邮件
```http
POST /api/user/send-reset-email
```

---

## 2. Notifications 页面 (Notifications.tsx)

### 页面概述
通知页面显示系统发送给用户的所有通知消息，支持标记已读、删除和批量操作。

### 功能特性
- 通知列表展示
- 类型分类显示
- 标记已读
- 标记全部已读
- 删除通知
- 筛选和搜索

### 页面结构
```
Notifications
├── Header (页面头部)
│   ├── 标题和描述
│   │   ├── Bell Icon (铃铛图标)
│   │   ├── Title (标题)
│   │   └── Unread Count (未读数量)
│   └── Actions (操作按钮)
│       └── Mark All Read (标记全部已读)
└── Notification List (通知列表)
    ├── Notification Item (通知项)
    │   ├── Icon (图标)
    │   │   ├── Info Icon (信息)
    │   │   ├── Warning Icon (警告)
    │   │   ├── Error Icon (错误)
    │   │   └── System Icon (系统)
    │   ├── Content (内容)
    │   │   ├── Header (头部)
    │   │   │   ├── Title (标题)
    │   │   │   └── Badge (徽章)
    │   │   └── Message (消息)
    │   ├── Timestamp (时间戳)
    │   └── Actions (操作)
    │       ├── Mark Read (标记已读)
    │       └── Delete (删除)
    └── Empty State (空状态)
        └── Bell Icon (铃铛图标)
        └── Title (标题)
        └── Description (描述)
```

### 数据类型
```typescript
type NotificationType = 'info' | 'warning' | 'error' | 'system';

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
```

### Mock 数据
```typescript
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'info',
    title: 'New Team Member',
    message: 'Jessica Wu has joined the Engineering team. Say hello!',
    timestamp: '10 mins ago',
    isRead: false
  },
  {
    id: '2',
    type: 'warning',
    title: 'Storage Capacity',
    message: 'Your team storage is 85% full. Please consider archiving old documents.',
    timestamp: '2 hours ago',
    isRead: false
  },
  {
    id: '3',
    type: 'error',
    title: 'Sync Failed',
    message: 'Failed to sync "Project Roadmap.md" due to a network timeout.',
    timestamp: 'Yesterday',
    isRead: true
  },
  {
    id: '4',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur on Sunday at 2:00 AM UTC.',
    timestamp: '2 days ago',
    isRead: true
  }
];
```

### 样式映射
```typescript
// 类型到样式的映射
const typeStyles = {
  info: {
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    badgeColor: 'bg-blue-100 text-blue-700',
    borderColor: 'border-blue-500'
  },
  warning: {
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50',
    badgeColor: 'bg-amber-100 text-amber-700',
    borderColor: 'border-amber-500'
  },
  error: {
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
    badgeColor: 'bg-red-100 text-red-700',
    borderColor: 'border-red-500'
  },
  system: {
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
    badgeColor: 'bg-purple-100 text-purple-700',
    borderColor: 'border-purple-500'
  }
};
```

### RESTful API

#### 1. 获取通知列表
```http
GET /api/notifications
```

**查询参数:**
```
?page=1&limit=50&isRead=all
```

**响应示例:**
```json
{
  "notifications": [
    {
      "id": "1",
      "type": "info",
      "title": "New Team Member",
      "message": "Jessica Wu has joined the Engineering team. Say hello!",
      "timestamp": "2024-12-03T10:00:00Z",
      "isRead": false
    }
  ],
  "total": 45,
  "unreadCount": 12
}
```

#### 2. 标记通知已读
```http
PUT /api/notifications/{notificationId}/read
```

**响应示例:**
```json
{
  "success": true,
  "message": "通知已标记为已读"
}
```

#### 3. 标记所有通知已读
```http
PUT /api/notifications/read-all
```

#### 4. 删除通知
```http
DELETE /api/notifications/{notificationId}
```

#### 5. 批量删除通知
```http
DELETE /api/notifications/batch
```

**请求体:**
```json
{
  "ids": ["1", "2", "3"]
}
```

#### 6. 获取未读数量
```http
GET /api/notifications/unread-count
```

**响应示例:**
```json
{
  "unreadCount": 12
}
```

#### 7. 创建通知 (管理员)
```http
POST /api/notifications
```

**请求体:**
```json
{
  "type": "info",
  "title": "System Update",
  "message": "A new version has been released.",
  "targetUsers": ["user-123"],
  "scheduledAt": "2024-12-03T15:00:00Z"
}
```

---

## 组件组成

### UserProfile 组件
- **Header**: 页面标题
- **Profile Card**: 资料卡片
- **Account Info**: 账户信息表单
- **Personal Details**: 个人详情
- **Security Section**: 安全设置
- **Preferences**: 偏好设置
- **2FA Modal**: 双因素认证模态框

### Notifications 组件
- **Header**: 页面头部
- **NotificationList**: 通知列表
- **EmptyState**: 空状态
- **NotificationItem**: 单个通知项

---

## 路由配置

```typescript
ROUTES.DASHBOARD.PROFILE = '/dashboard/profile'
ROUTES.DASHBOARD.NOTIFICATIONS = '/dashboard/notifications'
```

---

## 依赖常量

```typescript
ROUTES.DASHBOARD.OVERVIEW = '/dashboard/overview'
ROUTES.DASHBOARD.TEAM = '/dashboard/team'
ROUTES.DASHBOARD.COMMUNITY = '/dashboard/community'
```

---

## 国际化支持

### UserProfile 翻译键
```typescript
t.profile.title
t.profile.editProfile
t.profile.cancelEdit
t.profile.accountInfo
t.profile.personalDetails
t.profile.security
t.profile.preferences
t.profile.language
t.profile.emailNotifications
t.profile.saveChanges
t.profile.twoFaTitle
t.profile.twoFaDesc
t.profile.verificationSent
t.profile.verify
```

### Notifications 翻译键
```typescript
t.notifications.title
t.notifications.markAllRead
t.notifications.typeInfo
t.notifications.typeWarning
t.notifications.typeError
t.notifications.typeSystem
t.notifications.markRead
t.notifications.delete
t.notifications.noNotifications
t.notifications.noNotificationsDesc
```

---

## 状态管理

### UserProfile 状态
```typescript
const [isEditing, setIsEditing] = useState(false);
const [isSaving, setIsSaving] = useState(false);
const [show2FA, setShow2FA] = useState(false);
const [twoFACode, setTwoFACode] = useState('');
const [formData, setFormData] = useState({
  name: '',
  email: '',
  role: '',
  phone: '',
  nickname: '',
  bio: '',
  password: ''
});
```

### Notifications 状态
```typescript
const [notifications, setNotifications] = useState<NotificationItem[]>([]);
```

---

## 交互流程

### 用户资料编辑流程
1. 点击"编辑"按钮
2. 修改表单数据
3. 提交表单
4. 如果修改密码，触发 2FA
5. 验证成功后保存
6. 显示成功提示

### 双因素认证流程
1. 填写新密码
2. 点击保存
3. 弹出 2FA 模态框
4. 输入手机验证码
5. 验证成功
6. 保存资料

### 通知操作流程
1. 查看通知列表
2. 点击"标记已读"
3. 或点击"标记全部已读"
4. 或点击"删除"单个通知
5. 或选择多个通知批量删除

---

## 性能优化

1. **表单验证**: 实时验证
2. **图片压缩**: 头像上传压缩
3. **分页加载**: 通知列表分页
4. **缓存**: 用户资料缓存
5. **防抖**: 搜索输入防抖

---

## 安全注意事项

1. **密码验证**: 修改密码需要验证当前密码
2. **2FA**: 修改密码启用双因素认证
3. **权限验证**: 确保只能修改自己的资料
4. **敏感信息**: 邮箱不可直接修改
5. **审计日志**: 记录所有修改操作

---

## 错误处理

### 常见错误
- 网络错误
- 验证失败
- 权限不足
- 验证码错误
- 密码强度不足

### 处理策略
- 错误提示
- 重试机制
- 表单验证
- 降级方案

---

## 未来扩展

### UserProfile
1. 社交账号绑定
2. 个人网站链接
3. 更多语言支持
4. 主题设置
5. 隐私设置
6. 活动历史
7. 成就系统
8. 个性化推荐

### Notifications
1. 通知分类设置
2. 通知静默时段
3. 邮件推送设置
4. 通知模板自定义
5. 通知优先级
6. 通知统计
7. 智能通知
8. 通知订阅
