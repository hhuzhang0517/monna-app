# Monna Mobile App - 快速启动指南

## ⚡ 5分钟快速开始

### 1. 安装依赖

```bash
cd mobile-app
npm install
```

### 2. 配置环境变量

复制示例文件：
```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入以下必需配置：

```bash
# Supabase (必填)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# API URL (必填)
EXPO_PUBLIC_API_URL=https://www.monna.us
# 或本地开发: http://localhost:3005

# Stripe (必填)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# OAuth 回调 (必填)
EXPO_PUBLIC_REDIRECT_URL=monna://auth/callback
```

### 3. 启动应用

```bash
# 启动 Expo 开发服务器
npm start

# 然后选择:
# - 按 'i' 启动 iOS 模拟器
# - 按 'a' 启动 Android 模拟器
# - 扫描二维码在真机运行（需安装 Expo Go）
```

### 4. 测试功能

#### 测试登录
1. 打开应用，点击"登录"
2. 使用测试账号或注册新账号
3. 验证邮箱后登录

#### 测试生成
1. 进入"生成"页面
2. 选择"图片生成"或"视频生成"
3. 选择一个模板
4. 上传图片
5. 点击"开始生成"

#### 测试支付
1. 进入"定价"页面
2. 选择一个套餐
3. 使用测试卡号: `4242 4242 4242 4242`
4. 完成支付流程

## 📋 常见问题

### Q: 无法连接到 Supabase
**A**: 检查以下内容：
1. `.env.local` 文件是否存在
2. Supabase URL 和 Key 是否正确
3. 网络连接是否正常
4. 在 Supabase Dashboard 检查 API 设置

### Q: OAuth 登录不工作
**A**: 确保已配置：
1. Google Cloud Console 的 OAuth Client ID
2. Apple Developer 的 Sign in with Apple
3. Deep Link scheme 在 `app.json` 中配置
4. 回调 URL 在 OAuth 提供商中配置

### Q: 图片上传失败
**A**: 检查：
1. 图片大小是否超过限制 (10MB)
2. API URL 是否正确
3. Supabase Storage bucket 是否已创建
4. 是否有上传权限

### Q: 模拟器运行缓慢
**A**: 尝试：
1. 关闭其他应用释放内存
2. 使用较新的模拟器版本
3. 减少模拟器分辨率
4. 在真机上测试

## 🔧 开发工具

### Expo DevTools
```bash
# 启动后自动打开浏览器
# 或访问: http://localhost:19002
```

### React Native Debugger
```bash
# 安装 React Native Debugger
brew install --cask react-native-debugger

# 在应用中按 Cmd+D (iOS) 或 Cmd+M (Android)
# 选择 "Debug"
```

### Expo Go App
- iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
- Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 📱 真机测试

### iOS (需要 Mac)
1. 在 iPhone 上安装 Expo Go
2. 确保手机和电脑在同一网络
3. 扫描终端中的二维码

### Android
1. 在 Android 手机上安装 Expo Go
2. 确保手机和电脑在同一网络
3. 扫描终端中的二维码

## 🎨 调试技巧

### 查看日志
```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

### 清除缓存
```bash
# 清除 Metro bundler 缓存
npm start -- --clear

# 清除 node_modules
rm -rf node_modules
npm install

# 清除 Expo 缓存
expo start -c
```

### 重新加载
- iOS: Cmd+R
- Android: Cmd+M -> Reload

## 📚 下一步

完成快速启动后，查看：
- [README.md](./README.md) - 完整项目文档
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署指南
- [Expo 文档](https://docs.expo.dev/) - 官方文档

## 🆘 获取帮助

遇到问题？
1. 查看 [常见问题](#常见问题)
2. 搜索 [Expo 论坛](https://forums.expo.dev/)
3. 联系技术支持: support@monna.us

---

祝开发愉快！🚀
