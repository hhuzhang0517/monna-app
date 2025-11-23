# 修复指南 - SDK 版本和资源文件

## 问题 1：缺少应用图标

**原因**: 项目缺少 `assets/icon.png` 等必需的资源文件。

**已修复**: 我已经创建了占位图标文件，但您需要替换为真实的应用图标。

## 问题 2：Expo SDK 版本不匹配

**原因**:
- 项目使用 SDK 51
- 您的 Expo Go 应用是 SDK 54
- iOS 上无法降级 Expo Go

**解决方案有两个选择：**

### 选项 1：升级项目到 SDK 54（推荐）✅

我已经更新了 `package.json` 到 SDK 54，现在执行：

```bash
# 1. 删除旧依赖
rm -rf node_modules package-lock.json

# Windows PowerShell:
Remove-Item -Recurse -Force node_modules, package-lock.json

# 2. 重新安装依赖
npm install

# 3. 启动项目
npm start
```

### 选项 2：在 iOS 模拟器中使用 SDK 51

如果您想保持 SDK 51：

```bash
# 1. 确保安装了 Xcode（仅 macOS）
# 2. 按 'i' 在 iOS 模拟器中启动
npm start
# 然后按 'i'
```

## 📱 创建真实的应用图标

### 需要的图标文件：

1. **icon.png** - 1024x1024 px（主图标）
2. **adaptive-icon.png** - 1024x1024 px（Android 自适应图标）
3. **splash.png** - 适配启动画面
4. **favicon.png** - 48x48 px（Web favicon）

### 使用在线工具生成图标：

1. 访问 [App Icon Generator](https://www.appicon.co/)
2. 上传您的 1024x1024 logo
3. 生成所有尺寸的图标
4. 下载并替换 `assets/` 目录中的文件

### 快速创建临时图标（用于测试）：

使用以下工具快速生成：
- [Figma](https://figma.com) - 设计工具
- [Canva](https://canva.com) - 在线设计
- [IconKitchen](https://icon.kitchen/) - 快速图标生成器

### 图标设计建议：

```
icon.png (1024x1024):
- 使用橙色 (#f97316) 背景
- 白色 "M" 字母（Monna 首字母）
- 圆角矩形设计
- 简洁现代风格
```

## 🚀 完整的修复步骤

```bash
# 步骤 1: 进入项目目录
cd d:\xroting\monna\monna-saas\mobile-app

# 步骤 2: 清理旧依赖（Windows）
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# 步骤 3: 安装新依赖
npm install

# 步骤 4: 验证安装
npx expo --version
# 应该显示: 54.x.x

# 步骤 5: 启动开发服务器
npm start

# 步骤 6: 扫描二维码（现在应该可以工作了）
```

## ✅ 验证清单

安装完成后，检查：

- [ ] `node_modules` 目录已重新创建
- [ ] `npx expo --version` 显示 54.x.x
- [ ] `npm start` 无错误启动
- [ ] 扫描二维码能在 Expo Go 中打开
- [ ] 应用图标显示正常（虽然是占位图）

## 🎨 替换占位图标（可选但推荐）

当前 `assets/` 目录有占位图片，您可以：

### 方法 1: 使用设计工具

```bash
# 1. 在 Figma/Canva 中创建 1024x1024 的图标
# 2. 导出为 PNG
# 3. 重命名并替换：
#    - icon.png
#    - adaptive-icon.png
#    - splash.png (建议 1284x2778)
```

### 方法 2: 使用命令行生成（ImageMagick）

```bash
# 安装 ImageMagick
# Windows: choco install imagemagick
# macOS: brew install imagemagick

# 生成橙色背景 + 白色 M 的图标
magick -size 1024x1024 xc:#f97316 \
  -gravity center \
  -pointsize 512 \
  -fill white \
  -font Arial-Bold \
  -annotate +0+0 "M" \
  assets/icon.png
```

### 方法 3: 复制 web 项目图标

如果 web 项目有图标：

```bash
# 从 web 项目复制
copy ..\public\icon-512x512.png assets\icon.png
```

## 📊 SDK 54 的主要变化

升级到 SDK 54 后的改进：

- ✅ React 18.3.1 (更好的并发特性)
- ✅ React Native 0.76.5 (性能提升)
- ✅ Expo Router 4.0 (改进的类型安全)
- ✅ 更新的依赖包
- ✅ Bug 修复和性能优化

## 🐛 常见错误和解决方案

### 错误: "Cannot find module"

```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### 错误: "Metro bundler has encountered an error"

```bash
# 清除缓存
npm start -- --clear
```

### 错误: "Unable to resolve..."

```bash
# 重启 Metro bundler
# Ctrl+C 停止
npm start
```

## 📞 需要帮助？

如果仍然遇到问题：

1. **查看终端输出**: 完整的错误信息
2. **检查 Expo Go 版本**: 确保是最新版
3. **重启一切**:
   - 关闭 Expo Go
   - Ctrl+C 停止 Metro
   - 重新 `npm start`

## 总结

**您现在应该：**

1. ✅ 使用 SDK 54（与 Expo Go 兼容）
2. ✅ 有了基本的应用图标文件
3. ✅ 可以在真机上扫码运行

**后续建议：**

1. 🎨 替换占位图标为真实设计
2. 📱 测试所有功能
3. 🚀 开始开发

---

现在运行 `npm install && npm start` 即可开始！🎉
