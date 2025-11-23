# 🚀 Monna Mobile App 启动指南

## ✅ 快速启动

```powershell
cd D:\xroting\monna\monna-saas\mobile-app
npx expo start
```

⚠️ **重要**: 使用 `npx expo start` 而不是 `npm start`

## 📱 测试方式

### 方法 1: Android 模拟器
1. 在 Android Studio 中启动模拟器
2. 运行 `npx expo start`
3. 按 **'a'** 在模拟器中打开

### 方法 2: 真机测试 (推荐)
1. 安装 Expo Go:
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. 运行 `npx expo start`
3. 扫描终端中的二维码

## 🎯 已完成功能

- ✅ 219 个资源文件已迁移
- ✅ 51 个图片模板（4个类别）
- ✅ 56 个视频模板（5个类别）
- ✅ 完整认证系统
- ✅ Stripe 支付集成
- ✅ 多语言支持

## 🔧 配置说明

### 当前版本
- Expo SDK: 54.0.0
- React: 19.1.0
- React Native: 0.81.5
- Metro: 0.83.2

### 为什么用 npx expo start?
npm start 在某些环境下会有模块解析问题，npx expo start 直接调用本地的 Expo CLI，更稳定。

## 💡 开发提示

### 热重载
保存文件后应用自动刷新

### 清除缓存
```bash
npx expo start --clear
```

### 切换到 Expo Go
在运行时按 **'s'** 键

### 调试
按 **'j'** 打开 Chrome DevTools

## 📁 项目结构

```
mobile-app/
├── assets/templates/   # 219个模板文件
│   ├── portrait/       # 表情模板
│   ├── artistic/       # 艺术模板
│   ├── anime/          # 动漫模板
│   ├── wearing/        # 穿戴模板
│   └── videos/         # 视频模板
├── app/                # 页面路由
├── components/         # UI组件
├── lib/                # 核心库
└── constants/          # 配置文件
```

## 🎉 开始测试

```powershell
cd D:\xroting\monna\monna-saas\mobile-app
npx expo start
```

然后按 **'a'** 或扫描二维码即可！
