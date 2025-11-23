# Monna Mobile App 部署指南

## 📋 部署前准备

### 1. 环境配置

确保已安装以下工具：
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`

### 2. 账号准备

#### Apple Developer
- Apple Developer 账号 ($99/年)
- 配置 App ID
- 配置 Certificates 和 Provisioning Profiles

#### Google Play Console
- Google Play Developer 账号 ($25 一次性)
- 创建应用
- 配置应用签名

#### Expo 账号
```bash
# 登录 Expo
eas login

# 创建项目
eas project:init
```

### 3. 配置 app.json

更新 `app.json` 中的项目信息：

```json
{
  "expo": {
    "name": "Monna",
    "slug": "monna-mobile",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.xroting.monna",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.xroting.monna",
      "versionCode": 1
    },
    "extra": {
      "eas": {
        "projectId": "your-expo-project-id"
      }
    }
  }
}
```

## 🔧 构建配置

### 创建 eas.json

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "app-bundle"
      },
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "production-url",
        "EXPO_PUBLIC_API_URL": "https://www.monna.us"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-id",
        "appleTeamId": "your-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./service-account.json",
        "track": "internal"
      }
    }
  }
}
```

## 📱 iOS 部署

### 1. 配置 Apple Developer

```bash
# 1. 登录 Apple Developer
# 2. 创建 App ID: com.xroting.monna
# 3. 配置 Associated Domains (用于 Deep Linking)
#    - applinks:monna.us
#    - applinks:www.monna.us
```

### 2. 配置 OAuth

#### Google OAuth
1. 在 Google Cloud Console 创建 iOS OAuth Client ID
2. 配置 Bundle ID: `com.xroting.monna`
3. 更新 `.env` 中的 `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`

#### Apple Sign In
1. 在 Apple Developer 启用 Sign in with Apple
2. 配置 Service ID
3. 配置 Return URLs

### 3. 构建 iOS 应用

```bash
# 开发构建 (可在模拟器运行)
eas build --profile development --platform ios

# 预览构建 (可用 TestFlight 分发)
eas build --profile preview --platform ios

# 生产构建
eas build --profile production --platform ios
```

### 4. 提交到 App Store

```bash
# 自动提交
eas submit --platform ios

# 或手动上传到 App Store Connect
# 1. 下载 .ipa 文件
# 2. 使用 Transporter 上传
# 3. 在 App Store Connect 创建版本
# 4. 填写应用信息和截图
# 5. 提交审核
```

### 5. TestFlight 内测

```bash
# 添加测试用户
# 在 App Store Connect -> TestFlight
# 添加内部测试员或外部测试员
```

## 🤖 Android 部署

### 1. 生成 Keystore

```bash
# 生成 upload keystore
keytool -genkeypair -v -storetype PKCS12 \
  -keystore monna-upload-key.keystore \
  -alias monna-upload \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# 保存密码到安全的地方!
```

### 2. 配置 Google Services

#### Google OAuth
1. 在 Google Cloud Console 创建 Android OAuth Client ID
2. 配置 Package name: `com.xroting.monna`
3. 配置 SHA-1 fingerprint:
```bash
# 获取 SHA-1
keytool -list -v -keystore monna-upload-key.keystore -alias monna-upload
```

### 3. 配置 Deep Links

在 `app.json` 中已配置，确认：
```json
{
  "android": {
    "intentFilters": [
      {
        "action": "VIEW",
        "autoVerify": true,
        "data": [
          {
            "scheme": "https",
            "host": "www.monna.us",
            "pathPrefix": "/auth/callback"
          }
        ]
      }
    ]
  }
}
```

### 4. 构建 Android 应用

```bash
# 开发构建
eas build --profile development --platform android

# 预览构建 (APK)
eas build --profile preview --platform android

# 生产构建 (AAB)
eas build --profile production --platform android
```

### 5. 提交到 Google Play

```bash
# 配置 Service Account
# 1. 在 Google Play Console 创建 Service Account
# 2. 下载 JSON key 保存为 service-account.json
# 3. 赋予 Release 权限

# 自动提交
eas submit --platform android

# 或手动上传
# 1. 下载 .aab 文件
# 2. 在 Google Play Console 上传
# 3. 创建新版本
# 4. 提交审核
```

### 6. 内测轨道

```bash
# 可选择发布轨道:
# - Internal testing (内部测试，最多100人)
# - Closed testing (封闭测试)
# - Open testing (开放测试)
# - Production (正式发布)
```

## 🔐 环境变量配置

### 开发环境

创建 `.env.local`:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
EXPO_PUBLIC_API_URL=http://localhost:3005
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
```

### 生产环境

在 EAS 中配置环境变量:
```bash
# 通过 EAS Secrets
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-prod.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY --value "pk_live_your_live_key"

# 或在 eas.json 中配置
# 注意: 不要在 eas.json 中存储敏感信息
```

## 📊 分析和监控

### 1. Expo Analytics

```bash
# 启用 Expo 分析
# 在 app.json 中配置
{
  "expo": {
    "analytics": {
      "enabled": true
    }
  }
}
```

### 2. Sentry 错误监控

```bash
# 安装 Sentry
npm install @sentry/react-native

# 配置
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: __DEV__ ? 'development' : 'production',
});
```

### 3. 性能监控

使用 React Native Performance 监控性能指标。

## 🔄 OTA 更新

Expo 支持 Over-The-Air 更新，无需重新发布：

```bash
# 发布更新
eas update --branch production --message "Fix bug in payment flow"

# 查看更新
eas update:list
```

**注意**: 仅适用于 JavaScript 更改，原生代码更改需重新构建。

## ✅ 发布检查清单

### 发布前
- [ ] 测试所有核心功能
- [ ] 检查 OAuth 回调
- [ ] 测试支付流程
- [ ] 验证图片/视频上传
- [ ] 检查多语言
- [ ] 测试在不同设备
- [ ] 审查隐私政策和服务条款
- [ ] 准备应用截图和描述

### iOS 特定
- [ ] 配置 App Store Connect
- [ ] 准备隐私清单
- [ ] 配置 Associated Domains
- [ ] 测试 Apple Sign In
- [ ] 准备应用审核信息

### Android 特定
- [ ] 配置 Google Play Console
- [ ] 配置应用签名
- [ ] 测试 Google Sign In
- [ ] 准备特性图片
- [ ] 配置内容分级

### 发布后
- [ ] 监控崩溃报告
- [ ] 收集用户反馈
- [ ] 监控性能指标
- [ ] 回应用户评论

## 🐛 常见问题

### iOS 构建失败
```bash
# 清除缓存
eas build:resign --platform ios

# 检查证书
eas credentials
```

### Android 签名问题
```bash
# 重新生成 keystore
# 在 Google Play Console 更新签名配置
```

### Deep Link 不工作
```bash
# iOS: 验证 Associated Domains
# Android: 验证 Intent Filters
# 测试: npx uri-scheme open monna://auth/callback --ios
```

## 📞 支持

遇到问题？
- 查看 [Expo 文档](https://docs.expo.dev/)
- 访问 [Expo 论坛](https://forums.expo.dev/)
- 联系技术支持: support@monna.us

---

祝部署顺利！🚀
