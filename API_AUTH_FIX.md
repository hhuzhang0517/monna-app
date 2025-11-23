# 移动端API认证修复说明

## 问题描述

移动端在调用后端API时遇到401未授权错误和团队信息获取失败，即使用户已经登录。

**错误日志**:
```
ERROR  加载生成历史失败: [Error: 获取历史记录失败]
❌ User stats API - unauthorized
GET /api/user/stats 401 in 275ms
GET /api/user/generations 401 in 275ms

// 认证成功后仍然出现的错误:
✅ Bearer token authentication successful: xiaohuaeric@163.com
getTeamForUser: No user found
❌ No team found for user
```

**根本原因**:
1. 移动端使用 Bearer Token 认证 (通过 Authorization header)
2. 后端API只支持 Cookie 认证 (Web端)
3. 导致移动端的认证信息无法被后端识别
4. 即使认证成功，`getTeamForUser()` 函数内部仍然调用只支持Cookie的 `getUser()`，导致无法获取团队信息

## 解决方案

### 1. 创建统一认证辅助函数

新增 `lib/supabase/auth-helper.ts`:
- 同时支持 Bearer Token 和 Cookie 两种认证方式
- 按优先级检查: Bearer Token → Cookie
- 提供统一的 `getAuthenticatedUser()` 函数

### 2. 更新所有API端点

已更新以下API端点使用新的认证函数:
- ✅ `/api/user/stats` - 用户统计数据
- ✅ `/api/user/generations` - 生成历史记录
- ✅ `/api/user` - 用户基本信息
- ✅ `/api/credits` - 积分信息

### 3. 修改数据库查询函数

更新 `lib/db/queries.ts` 中的查询函数，支持传入已认证的用户对象:
- ✅ `getTeamForUser(providedUser?)` - 避免重复调用 `getUser()`
- ✅ `getUserTeamCredits(providedUser?)` - 使用传入的用户
- ✅ `getUserTeamSubscriptionInfo(providedUser?)` - 使用传入的用户
- ✅ `getUserTeamCreditHistory(limit, providedUser?)` - 使用传入的用户
- ✅ `getActivityLogs(providedUser?)` - 使用传入的用户

这样可以确保在移动端Bearer token认证成功后，后续的数据库查询也能正确使用该用户信息。

### 3. 认证流程

```typescript
// 移动端请求示例
const { data: { session } } = await supabase.auth.getSession();

const response = await fetch(API_URL, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
  },
});

// 后端处理流程
export async function GET(req: NextRequest) {
  // 1. 尝试从 Authorization header 获取 Bearer token
  // 2. 如果没有，尝试从 Cookie 获取 session
  // 3. 验证 token/session 并返回用户信息
  const user = await getAuthenticatedUser(req);
  
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  
  // ... 继续处理业务逻辑
}
```

## 测试步骤

### 前置条件
1. 确保后端服务已部署最新代码
2. 移动端已安装最新依赖 (`@supabase/supabase-js`)
3. 环境变量配置正确 (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`)

### 测试用例

#### 1. 测试移动端登录
```
步骤:
1. 打开移动端App
2. 点击"立即开始"按钮
3. 使用邮箱/手机/Google登录
4. 登录成功后跳转到主页

预期结果:
✅ 登录成功
✅ 用户信息显示正常
```

#### 2. 测试用户统计API
```
步骤:
1. 登录后，点击右上角用户头像
2. 查看用户菜单

预期结果:
✅ 显示用户名/邮箱
✅ 显示套餐名称（free/pro/premium）
✅ 显示剩余积分数

后端日志应显示:
✅ Bearer token authentication successful
✅ User stats API - user authenticated: user@example.com
```

#### 3. 测试生成历史API
```
步骤:
1. 登录后，从用户菜单点击"生成历史"
2. 查看历史记录列表

预期结果:
✅ 成功加载历史记录
✅ 显示图片/视频缩略图
✅ 显示提示词和创建时间

后端日志应显示:
✅ Bearer token authentication successful
✅ User generations API - user authenticated: user@example.com
```

#### 4. 测试个人信息API
```
步骤:
1. 登录后，从用户菜单点击"个人信息"
2. 查看个人资料

预期结果:
✅ 成功加载用户信息
✅ 显示姓名、邮箱、性别等

后端日志应显示:
✅ User API - user authenticated: user@example.com
```

#### 5. 测试积分API
```
步骤:
1. 登录后，查看用户菜单

预期结果:
✅ 显示正确的积分余额
✅ 显示套餐信息

后端日志应显示:
✅ Credits API - user authenticated: user@example.com
```

## 技术细节

### Bearer Token 认证
```typescript
// 移动端发送请求
const { data: { session } } = await supabase.auth.getSession();
const token = session.access_token;

// 后端验证 token
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const { data: { user }, error } = await supabase.auth.getUser(token);
```

### Cookie 认证
```typescript
// Web端自动通过 Cookie 发送 session
// 后端从 Cookie 读取
const supa = await createSupabaseServer();
const { data: { user } } = await supa.auth.getUser();
```

## 兼容性

- ✅ 移动端 (iOS/Android) - Bearer Token
- ✅ Web端 - Cookie
- ✅ 不会破坏现有功能
- ✅ 向后兼容

## 故障排查

### 问题1: 移动端仍然返回401
**检查项**:
1. 确认后端代码已部署最新版本
2. 检查移动端是否正确获取 session
3. 检查 Authorization header 是否正确发送

**调试代码**:
```typescript
// 在移动端添加日志
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session ? 'exists' : 'null');
console.log('Access Token:', session?.access_token?.substring(0, 20) + '...');
```

### 问题2: Web端登录失效
**检查项**:
1. 确认 Cookie 认证回退逻辑正常
2. 检查 `createSupabaseServer()` 函数

### 问题3: Token过期
**检查项**:
1. Supabase client 配置了 `autoRefreshToken: true`
2. 移动端重新获取 session

## 相关文件

**新增文件**:
- `lib/supabase/auth-helper.ts` - 统一认证辅助函数（70行）
- `mobile-app/API_AUTH_FIX.md` - 本文档

**修改的后端文件**:
- `lib/db/queries.ts` - 数据库查询函数，支持传入用户对象
- `app/api/user/stats/route.ts` - 用户统计API
- `app/api/user/generations/route.ts` - 生成历史API
- `app/api/user/route.ts` - 用户信息API
- `app/api/credits/route.ts` - 积分信息API

**移动端相关文件**:
- `mobile-app/components/UserMenu.tsx` - 用户菜单组件
- `mobile-app/app/history/index.tsx` - 生成历史页面
- `mobile-app/lib/supabase/client.ts` - Supabase客户端配置

