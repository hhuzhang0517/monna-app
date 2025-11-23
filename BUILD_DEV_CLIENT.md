# 构建 Expo 开发客户端指南

## 什么是开发客户端？

开发客户端是一个定制版的 Expo Go，专门为您的项目构建，包含所有原生模块（Stripe、Camera 等）。这样您就可以：
- ✅ 在真机上测试完整功能
- ✅ 使用所有原生模块
- ✅ 热重载和快速迭代
- ✅ 不受 Expo Go 的限制

## 🚀 步骤 1：安装 EAS CLI

```powershell
# 全局安装 EAS CLI
npm install -g eas-cli

# 验证安装
eas --version
```

## 🔐 步骤 2：登录 Expo 账号

如果还没有 Expo 账号，先注册：
1. 访问 https://expo.dev/signup
2. 使用邮箱或 GitHub 注册

然后登录：

```powershell
cd mobile-app
eas login
```

输入您的 Expo 账号和密码。

## 📱 步骤 3：初始化 EAS 项目

```powershell
# 在 mobile-app 目录
eas init
```

这会创建一个 Expo 项目并配置构建设置。

## 🔧 步骤 4：配置构建

`eas.json` 已经为您创建好了，包含以下配置：

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

## 🏗️ 步骤 5：构建开发客户端

### iOS（推荐先构建 iOS）

```powershell
# 构建 iOS 开发客户端
eas build --profile development --platform ios
```

**构建过程**：
1. 代码上传到 Expo 服务器
2. 在云端编译（约 10-20 分钟）
3. 生成可安装的 `.ipa` 文件

**安装方式**：
- 构建完成后会有一个下载链接
- 在 iPhone 上打开链接
- 点击"Install"安装到设备

### Android

```powershell
# 构建 Android 开发客户端
eas build --profile development --platform android
```

**安装方式**：
- 下载 `.apk` 文件
- 传输到 Android 手机
- 点击安装（需要允许未知来源）

## 📲 步骤 6：使用开发客户端

安装完成后：

```powershell
# 1. 启动开发服务器
npm start

# 2. 在手机上打开刚安装的开发客户端
# 3. 扫描终端中的二维码
# 4. 应用会加载并运行！
```

## 🔄 完整流程示例

```powershell
# 第 1 步：安装 EAS CLI（只需一次）
npm install -g eas-cli

# 第 2 步：登录
cd d:\xroting\monna\monna-saas\mobile-app
eas login

# 第 3 步：初始化项目
eas init

# 第 4 步：构建 iOS 开发客户端
eas build --profile development --platform ios

# 等待构建完成（10-20 分钟）...

# 第 5 步：在 iPhone 上安装
# 点击构建完成后的下载链接

# 第 6 步：启动开发服务器
npm start

# 第 7 步：在开发客户端中扫码
```

## ⏱️ 构建时间估计

- **首次构建**: 15-25 分钟（需要安装所有依赖）
- **后续构建**: 10-15 分钟（使用缓存）
- **并发构建**: 可以同时构建 iOS 和 Android

## 💡 有用的 EAS 命令

```powershell
# 查看构建列表
eas build:list

# 查看构建详情
eas build:view [build-id]

# 取消构建
eas build:cancel [build-id]

# 查看项目配置
eas project:info

# 配置凭证
eas credentials
```

## 📊 构建状态监控

构建开始后：
1. 终端会显示构建 URL
2. 访问 URL 可以看到实时日志
3. 或者访问 https://expo.dev 查看所有构建

## 🎯 构建完成后

### iOS
1. 点击下载链接（在 iPhone 上）
2. 点击"Install"
3. 可能需要在设置中信任开发者证书
4. 应用图标会出现在主屏幕

### Android
1. 下载 `.apk` 文件
2. 传输到手机（AirDrop / USB / 云盘）
3. 点击安装
4. 允许来自此来源的应用

## 🔒 iOS 开发证书

如果是第一次构建 iOS 应用：

```powershell
# EAS 会提示您选择
# 选项 1: 让 EAS 自动管理证书（推荐）
# 选项 2: 使用已有的证书

# 自动管理（最简单）
# 选择 "Yes, let EAS handle it"
```

## 🐛 常见问题

### 问题 1: 构建失败 - "No matching provisioning profile"

**解决**：
```powershell
# 清除凭证重新配置
eas credentials
# 选择 iOS -> 删除所有 -> 重新构建
```

### 问题 2: 安装时提示"Untrusted Developer"

**解决**（iOS）：
1. 设置 -> 通用 -> VPN 与设备管理
2. 找到开发者证书
3. 点击"信任"

### 问题 3: 构建排队时间太长

**解决**：
- 免费账号有并发限制
- 升级到付费计划（$29/月）可以优先构建
- 或等待队列空闲（通常晚上较快）

## 💰 费用说明

- **免费账号**:
  - 每月 30 次构建
  - 队列优先级较低
  - 足够开发使用

- **付费账号** ($29/月):
  - 无限制构建
  - 优先队列
  - 更多并发

## 🎉 构建成功后的使用体验

1. **完整功能**: 所有原生模块都可用（Stripe、Camera、OAuth）
2. **热重载**: 代码修改立即生效
3. **真机测试**: 在真实设备上测试性能
4. **不需要 Mac**: 云端构建，Windows 也能开发 iOS

## 📝 下一步

构建成功后：
1. ✅ 安装到手机
2. ✅ 运行 `npm start`
3. ✅ 扫码加载应用
4. ✅ 开始开发和测试！

---

**准备好了吗？开始构建吧！** 🚀

```powershell
eas login
eas build --profile development --platform ios
```
