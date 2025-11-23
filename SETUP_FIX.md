# Monna Mobile App - 登录问题修复指南

## 问题：Expo 登录失败

您遇到的错误是 Expo CLI 登录验证问题。有几种解决方案：

## 解决方案 1：创建新的 Expo 账号（推荐）

```bash
# 1. 访问 Expo 官网注册
# https://expo.dev/signup

# 2. 使用新账号登录
npx expo login

# 输入您在 expo.dev 注册的用户名和密码
```

## 解决方案 2：不使用 Expo 账号开发（本地开发）

您可以**不登录 Expo** 直接开始开发：

```bash
# 1. 确保在 mobile-app 目录
cd mobile-app

# 2. 安装依赖（如果还没安装）
npm install

# 3. 直接启动开发服务器（无需登录）
npm start

# 4. 选择运行方式：
# - 按 'i' 启动 iOS 模拟器
# - 按 'a' 启动 Android 模拟器
# - 按 'w' 在浏览器打开（Web 版本）
```

**注意**: 本地开发不需要 Expo 账号，只有在构建生产版本或使用 EAS 服务时才需要。

## 解决方案 3：使用 GitHub 登录

```bash
# 使用 GitHub 账号登录 Expo
npx expo login --help

# 然后访问浏览器完成 OAuth 登录
```

## 解决方案 4：修复当前登录问题

```bash
# 1. 清除 Expo CLI 缓存
npm cache clean --force
npx expo logout

# 2. 重新安装 Expo CLI
npm install -g @expo/cli

# 3. 重新登录
npx expo login
```

## 推荐的开发流程（不需要立即登录）

### 第一阶段：本地开发（无需 Expo 账号）

```bash
# 1. 配置环境变量
cp .env.example .env.local

# 编辑 .env.local，填入必要配置：
# EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key
# EXPO_PUBLIC_API_URL=http://localhost:3005
# EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# 2. 启动开发服务器
npm start

# 3. 在模拟器或真机测试
# iOS: 按 'i'
# Android: 按 'a'
# 真机: 扫描二维码（需安装 Expo Go）
```

### 第二阶段：准备发布时再登录

当您准备构建和发布应用时，再创建 Expo 账号：

```bash
# 1. 注册 Expo 账号
# 访问: https://expo.dev/signup

# 2. 登录
npx expo login

# 3. 初始化 EAS 项目
npx eas init

# 4. 配置构建
npx eas build:configure

# 5. 开始构建
npx eas build --platform ios
npx eas build --platform android
```

## 快速开始开发（跳过登录）

```bash
# 第 1 步：进入项目目录
cd d:\xroting\monna\monna-saas\mobile-app

# 第 2 步：安装依赖
npm install

# 第 3 步：创建环境变量文件
# 复制 .env.example 为 .env.local
# 填入以下内容（使用 web 项目的配置）：

cat > .env.local << 'EOF'
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://oykmdhwswtnuihzuwtci.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95a21kaHdzd3RudWloenV3dGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MTc4MDMsImV4cCI6MjA0NjI5MzgwM30.5vH_BKo0i7rqYp5YqmJ8J9vZQqYW1YmYzGLRqX2Rqjg

# API
EXPO_PUBLIC_API_URL=http://localhost:3005

# Stripe (测试密钥)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51QKWAYP3MqQo44qmJ6PD7fvOAcj4wBT5xjN5i6dPNQtq5jyWYmMPnxYY3HaRX1YqYJ8j9VzQqYW1YmYzGLRqX2Rqjg

# OAuth
EXPO_PUBLIC_REDIRECT_URL=monna://auth/callback
EOF

# 第 4 步：启动开发服务器（无需登录）
npm start

# 第 5 步：选择运行平台
# 按 'i' - iOS 模拟器
# 按 'a' - Android 模拟器
# 扫码 - 真机（需 Expo Go app）
```

## Windows 用户快速配置

在 PowerShell 中运行：

```powershell
# 进入项目目录
cd d:\xroting\monna\monna-saas\mobile-app

# 安装依赖
npm install

# 创建 .env.local 文件
Copy-Item .env.example .env.local

# 使用记事本编辑配置
notepad .env.local

# 启动开发服务器
npm start
```

## 验证安装

运行以下命令检查环境：

```bash
# 检查 Node.js 版本（需要 18+）
node --version

# 检查 npm 版本
npm --version

# 检查 Expo CLI
npx expo --version

# 检查项目依赖
npm list expo
```

## 常见错误解决

### 错误 1：端口被占用
```bash
# 更改端口
npm start -- --port 19001
```

### 错误 2：Metro bundler 缓存问题
```bash
# 清除缓存重启
npm start -- --clear
```

### 错误 3：模块未找到
```bash
# 重新安装依赖
rm -rf node_modules
npm install
```

### 错误 4：Android 模拟器未启动
```bash
# 手动启动 Android 模拟器
# 打开 Android Studio > AVD Manager > 启动模拟器
# 然后在终端按 'a'
```

### 错误 5：iOS 模拟器未启动
```bash
# 确保安装了 Xcode（仅 macOS）
# 打开 Xcode > Preferences > Locations
# 确认 Command Line Tools 已选择
```

## 测试功能检查清单

启动成功后，测试以下功能：

- [ ] 应用能够启动
- [ ] 可以看到首页视频背景
- [ ] 语言切换工作正常
- [ ] 可以进入登录页面
- [ ] 可以查看生成页面的模板
- [ ] 可以查看定价页面
- [ ] Tab 导航工作正常

## 需要帮助？

如果仍然遇到问题：

1. **检查环境变量**: 确保 `.env.local` 文件存在且配置正确
2. **查看终端输出**: 仔细阅读错误信息
3. **检查网络**: 确保能够访问 Supabase 和其他服务
4. **重启开发服务器**: Ctrl+C 停止，然后重新 `npm start`

## 总结

**关键点**: 您不需要立即登录 Expo 账号就可以开始开发！

只需：
1. ✅ 安装依赖：`npm install`
2. ✅ 配置环境变量：创建 `.env.local`
3. ✅ 启动开发：`npm start`
4. ✅ 选择平台：按 'i' 或 'a'

Expo 账号只在**构建生产版本**时才需要，现在可以跳过！

---

立即开始开发吧！🚀
