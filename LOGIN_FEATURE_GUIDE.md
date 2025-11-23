# 移动端登录功能使用指南

## 功能概述

本指南介绍 Monna AI 移动端 App 的登录功能实现。该功能与 Web 端保持一致的用户体验，提供多种登录方式和完善的认证状态管理。

## 核心组件

### 1. LoginModal 组件

位置：`mobile-app/components/LoginModal.tsx`

**功能**：
- 提供登录弹窗界面
- 支持邮箱登录/注册
- 支持 Google OAuth 登录
- **支持手机号验证码登录（完整实现）**

**使用方式**：

```tsx
import { LoginModal } from '@/components/LoginModal';

function MyComponent() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // 登录成功后的操作
    console.log('用户登录成功');
  };

  return (
    <>
      <Button onPress={() => setShowLoginModal(true)}>
        登录
      </Button>
      
      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}
```

### 2. AuthContext 认证上下文

位置：`mobile-app/contexts/AuthContext.tsx`

**功能**：
- 全局认证状态管理
- 自动监听认证状态变化
- 会话持久化
- 提供便捷的 Hook

**使用方式**：

```tsx
import { useAuth, useRequireAuth } from '@/contexts/AuthContext';

// 基础用法
function MyComponent() {
  const { user, loading, signOut, refreshUser } = useAuth();

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      {user ? (
        <>
          <Text>欢迎，{user.email}</Text>
          <Button onPress={signOut}>登出</Button>
        </>
      ) : (
        <Text>请先登录</Text>
      )}
    </View>
  );
}

// 要求登录的组件
function ProtectedComponent() {
  const { user, loading, isAuthenticated } = useRequireAuth();

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!isAuthenticated) {
    return <Text>请先登录访问此功能</Text>;
  }

  return <Text>受保护的内容</Text>;
}
```

## 登录流程

### 用户体验流程

```
1. 用户访问欢迎页面 (welcome.tsx)
   ↓
2. 点击"立即开始"按钮
   ↓
3. 系统检查登录状态
   - 已登录 → 直接跳转到主功能页面
   - 未登录 → 显示登录弹窗
   ↓
4. 在登录弹窗中选择登录方式：
   a. 邮箱登录
      - 输入邮箱和密码
      - 可切换登录/注册模式
      - 勾选用户协议
      - 提交登录
   b. Google 登录
      - 勾选用户协议
      - 点击 Google 登录
      - 在浏览器中完成 OAuth
      - 自动返回应用
   ↓
5. 登录成功
   - 自动关闭登录弹窗
   - 跳转到主功能页面
   - 保存登录状态
```

### 技术流程

```typescript
// 1. 应用启动时初始化认证状态
AuthProvider 初始化
  ↓
检查本地存储的会话
  ↓
恢复用户登录状态
  ↓
监听认证状态变化

// 2. 用户触发登录
显示 LoginModal
  ↓
用户选择登录方式
  ↓
调用 Supabase Auth API
  ↓
成功：
  - 触发 onAuthStateChange
  - 更新 AuthContext 状态
  - 触发 onSuccess 回调
  - 关闭弹窗
失败：
  - 显示错误消息
  - 保持弹窗打开
  - 允许重试

// 3. 登录守卫检查
用户点击需要登录的功能
  ↓
检查 user 状态
  ↓
已登录：执行操作
未登录：显示登录弹窗
```

## 集成到新页面

如果你要在新的页面中添加登录功能，按以下步骤操作：

### 步骤 1：导入必要的依赖

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from '@/components/LoginModal';
import { useState } from 'react';
```

### 步骤 2：在组件中使用认证状态

```tsx
export default function MyPage() {
  const { user, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 处理需要登录的操作
  const handleProtectedAction = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    // 执行需要登录的操作
    console.log('执行受保护的操作');
  };

  // 登录成功回调
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // 可以在这里执行登录后的操作
  };

  return (
    <View>
      <Button onPress={handleProtectedAction}>
        需要登录的功能
      </Button>

      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </View>
  );
}
```

### 步骤 3：页面级别的登录守卫（可选）

如果整个页面都需要登录才能访问：

```tsx
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // 认证状态加载完成后，如果未登录则跳转到欢迎页
    if (!loading && !user) {
      router.replace('/welcome');
    }
  }, [user, loading]);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!user) {
    return null; // 或显示一个临时的加载界面
  }

  return (
    <View>
      {/* 页面内容 */}
    </View>
  );
}
```

## OAuth 配置

### Google OAuth

1. **Deep Link 配置**（已在 app.json 中配置）：
```json
{
  "expo": {
    "scheme": "monna",
    "ios": {
      "associatedDomains": ["applinks:monna.ai"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "monna",
              "host": "auth",
              "pathPrefix": "/callback"
            }
          ]
        }
      ]
    }
  }
}
```

2. **回调 URL**：`monna://auth/callback`

3. **Supabase 配置**：
   - 在 Supabase Dashboard 中配置 Google OAuth
   - 添加回调 URL 到允许列表
   - 配置 OAuth 客户端 ID

## 手机号登录详细说明

### 发送验证码流程

```typescript
// 1. 用户输入手机号（自动过滤非数字字符）
const phone = '13800138000';
const countryCode = '+86';

// 2. 点击"发送验证码"按钮
const phoneNumber = `${countryCode}${phone}`; // +8613800138000

// 3. 调用 Supabase Auth API
const { data, error } = await supabase.auth.signInWithOtp({
  phone: phoneNumber,
  options: {
    channel: 'sms'  // 通过短信发送
  }
});

// 4. 发送成功
// - 启动60秒倒计时
// - 按钮显示剩余秒数
// - 期间不可重复发送
```

### 验证码登录流程

```typescript
// 1. 用户输入6位验证码
const verificationCode = '123456';

// 2. 提交登录
const { data, error } = await supabase.auth.verifyOtp({
  phone: phoneNumber,
  token: verificationCode,
  type: 'sms'
});

// 3. 验证成功
if (data.user) {
  // 自动创建会话
  // 触发 AuthContext 更新
  // 关闭登录弹窗
  // 跳转到主页面
}
```

### 支持的国家/地区

移动端手机号登录支持以下国家和地区的区号：

| 国家/地区 | 区号 | 示例 |
|----------|------|------|
| 🇨🇳 中国 | +86 | +86 13800138000 |
| 🇺🇸 美国 | +1 | +1 2025551234 |
| 🇬🇧 英国 | +44 | +44 7911123456 |
| 🇯🇵 日本 | +81 | +81 9012345678 |
| 🇰🇷 韩国 | +82 | +82 1012345678 |
| 🇸🇬 新加坡 | +65 | +65 91234567 |
| 🇭🇰 香港 | +852 | +852 91234567 |
| 🇹🇼 台湾 | +886 | +886 912345678 |
| 🇦🇺 澳大利亚 | +61 | +61 412345678 |
| 🇩🇪 德国 | +49 | +49 15112345678 |
| 🇫🇷 法国 | +33 | +33 612345678 |
| 🇮🇹 意大利 | +39 | +39 3123456789 |
| 🇷🇺 俄罗斯 | +7 | +7 9123456789 |

### 错误处理

手机号登录会遇到以下常见错误：

1. **验证码发送失败**
   - 错误：手机号格式不正确
   - 解决：检查区号和手机号是否匹配

2. **验证码错误**
   - 错误：输入的验证码不正确
   - 解决：重新检查短信中的6位验证码

3. **验证码过期**
   - 错误：验证码有效期已过（通常5-10分钟）
   - 解决：点击"重新发送"获取新验证码

4. **发送次数限制**
   - 错误：短时间内发送次数过多
   - 解决：等待一段时间后再试

## 常见问题

### Q1: 手机号登录需要 Supabase 配置吗？

**A**: 是的，需要在 Supabase 中配置 Phone Auth：

1. 登录 Supabase Dashboard
2. 进入 Authentication → Settings
3. 启用 Phone Auth
4. 配置 SMS 提供商（Twilio、MessageBird等）
5. 设置验证码模板和过期时间

详细配置请参考：https://supabase.com/docs/guides/auth/phone-login

### Q2: 登录后页面没有自动跳转？

**A**: 检查以下几点：
1. 确认 `onSuccess` 回调是否正确设置
2. 检查 `router.replace()` 是否被正确调用
3. 查看控制台是否有错误信息

### Q2: OAuth 登录失败？

**A**: 可能的原因：
1. Deep Link 配置不正确
2. Supabase OAuth 配置未完成
3. 回调 URL 不在允许列表中
4. 网络问题

解决方法：
```typescript
// 在 LoginModal 组件中查看详细日志
console.log('OAuth redirect URL:', redirectUrl);
console.log('OAuth result:', result);
```

### Q3: 登录状态不持久？

**A**: 检查：
1. AsyncStorage 是否正常工作
2. 是否调用了 `supabase.auth.signOut()`
3. Supabase 会话配置是否正确

### Q4: 如何处理登录过期？

**A**: AuthContext 会自动监听会话状态：
```typescript
// 在 AuthContext 中已处理
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  async (event, newSession) => {
    if (event === 'SIGNED_OUT') {
      // 会话过期或登出
      await AsyncStorage.removeItem('supabase.auth.token');
    }
  }
);
```

## API 调用示例

### 带认证的 API 调用

```typescript
import { supabase } from '@/lib/supabase/client';

async function callProtectedAPI() {
  // 获取当前会话
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('请先登录');
  }

  // 调用 API
  const response = await fetch('https://api.example.com/protected', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ data: 'your data' }),
  });

  return await response.json();
}
```

### 上传文件示例

```typescript
async function uploadFile(fileUri: string) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('请先登录');
  }

  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: 'file.jpg',
    type: 'image/jpeg',
  } as any);

  const response = await fetch('https://api.example.com/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  return await response.json();
}
```

## 测试检查清单

在完成开发后，请确保以下功能正常：

### 基础功能
- [ ] 未登录用户访问 welcome 页面，点击"立即开始"显示登录弹窗
- [ ] 登录对话框居中显示，不被遮挡
- [ ] 已登录用户访问 welcome 页面，自动跳转到主页面

### 邮箱登录
- [ ] 邮箱登录功能正常
- [ ] 邮箱注册功能正常
- [ ] 密码可见性切换正常
- [ ] 登录/注册模式切换正常

### Google OAuth
- [ ] Google OAuth 登录正常
- [ ] OAuth 浏览器打开和返回流程顺畅
- [ ] 登录后会话正确创建

### 手机号登录（新增）
- [ ] 可以选择国家区号
- [ ] 手机号输入自动过滤非数字
- [ ] 点击"发送验证码"成功发送
- [ ] 短信验证码正常接收
- [ ] 倒计时60秒显示正确
- [ ] 倒计时期间按钮禁用
- [ ] 验证码输入限制6位数字
- [ ] 正确的验证码可以成功登录
- [ ] 错误的验证码显示友好提示
- [ ] 过期验证码提示重新发送

### 通用功能
- [ ] 登录成功后自动关闭弹窗并跳转
- [ ] 登录状态持久化（重启 App 后仍保持登录）
- [ ] 登出功能正常
- [ ] 未登录用户点击受保护的功能，显示登录弹窗
- [ ] 登录后可以正常调用需要认证的 API
- [ ] 错误提示友好且准确
- [ ] 所有表单验证正常工作
- [ ] 用户协议勾选验证生效

## 相关文件

- `mobile-app/components/LoginModal.tsx` - 登录弹窗组件
- `mobile-app/contexts/AuthContext.tsx` - 认证状态管理
- `mobile-app/lib/supabase/client.ts` - Supabase 客户端配置
- `mobile-app/app/welcome.tsx` - 欢迎页面（登录入口）
- `mobile-app/app/_layout.tsx` - 根布局（AuthProvider）
- `CHANGELOG.md` - 变更日志

## 技术栈

- React Native + Expo
- Supabase Auth
- expo-web-browser (OAuth)
- expo-auth-session (OAuth)
- @react-native-async-storage/async-storage (持久化)
- @expo/vector-icons (图标)

## 后续优化计划

- [ ] 添加 Apple OAuth 登录
- [ ] 实现手机号验证码登录
- [ ] 添加忘记密码功能
- [ ] 支持生物识别登录（指纹/面容）
- [ ] 添加第三方社交媒体登录
- [ ] 优化 OAuth 回调体验
- [ ] 添加登录历史记录

