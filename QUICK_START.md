# 移动端快速启动指南

## 🚀 最简单的启动方式

### 步骤 1: 暂时隔离父目录依赖

```powershell
# 在 PowerShell 中执行
cd D:\xroting\monna\monna-saas
Rename-Item node_modules node_modules.backup -Force
```

### 步骤 2: 启动开发服务器

```powershell
cd mobile-app
npm start
```

### 步骤 3: 在手机上测试

1. **安装 Expo Go**
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **扫描二维码**
   - 终端会显示一个二维码
   - 用 Expo Go 扫描二维码

3. **查看应用**
   - 应用会自动加载
   - 可以看到完整的 UI 和所有模板

### 步骤 4: 完成后恢复父目录

```powershell
cd D:\xroting\monna\monna-saas
Rename-Item node_modules.backup node_modules -Force
```

## 📱 功能测试清单

### 图片模板测试
1. 打开应用 → 点击 "Generate" 标签
2. 确保 "Image" 选项卡被选中
3. 切换类别：
   - ✅ Expression（表情）- 应该看到9个模板
   - ✅ Artistic（艺术）- 应该看到9个模板
   - ✅ Anime（动漫）- 应该看到9个模板（每个显示2张源图+1张合成图）
   - ✅ Wearing（穿戴）- 应该看到8个模板

### 视频模板测试
1. 切换到 "Video" 选项卡
2. 切换类别：
   - ✅ Effects（特效）- 应该看到26个视频
   - ✅ Animation（动画）- 应该看到5个视频
   - ✅ Fantasy（奇幻）- 应该看到15个视频
   - ✅ Product（产品）- 应该看到5个视频
   - ✅ Expression（表情视频）- 应该看到5个视频
3. 悬停或点击视频应该能预览

## 🔧 常见问题

### Q: 启动时报错 "Metro config error"
**A**: 确保已经执行步骤1，重命名父目录的 node_modules

### Q: 模板图片/视频不显示
**A**: 检查资源是否正确复制：
```powershell
dir assets\templates /s
# 应该显示 219 个文件
```

### Q: Expo Go 无法连接
**A**:
1. 确保手机和电脑在同一 WiFi
2. 重启 Metro bundler: Ctrl+C 然后 `npm start`
3. 尝试用局域网 IP 连接（在 Metro 日志中可以看到）

### Q: 需要构建 APK/IPA
**A**:
```powershell
# Android
eas build --profile development --platform android

# iOS (需要 Apple Developer 账号)
eas build --profile development --platform ios
```

## 💡 开发提示

### 热重载
- 保存文件后，应用会自动刷新
- 摇动手机可以打开开发菜单

### 调试
- 在开发菜单中选择 "Debug Remote JS"
- 在 Chrome 中打开 http://localhost:19000/debugger-ui

### 清除缓存
```bash
npm start -- --clear
```

## 📞 需要帮助？

如果遇到问题，请检查：
1. `ASSETS_MIGRATION_COMPLETE.md` - 完整的迁移报告
2. `README.md` - 详细的项目文档
3. `BUILD_DEV_CLIENT.md` - 开发客户端构建指南

---

**祝开发顺利！** 🎉
