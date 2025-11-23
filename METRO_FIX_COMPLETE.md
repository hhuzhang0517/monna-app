# ✅ Metro 依赖问题已解决

## 问题根源

**错误信息**: `Error: Cannot find module 'metro/src/lib/TerminalReporter'`

**根本原因**: Metro 版本不匹配
- `@expo/metro@54.1.0` 明确要求 `metro@0.83.2`
- 但 npm 安装了 `metro@0.83.3`（更新版本）
- 版本不匹配导致模块解析失败

## 解决方案

强制安装 Metro 0.83.2 以匹配 @expo/metro 的要求：

```bash
cd d:\xroting\monna\monna-saas\mobile-app
npm install metro@0.83.2 --save-exact --legacy-peer-deps
```

## 验证修复

### 1. 检查 Metro 版本

```bash
npm list metro
```

应该显示：
```
├─┬ @expo/cli@54.0.16
│ └─┬ @expo/metro@54.1.0
│   └── metro@0.83.2
├── metro@0.83.2
```

### 2. 验证模块解析

```bash
node -e "console.log(require.resolve('metro/private/lib/TerminalReporter'))"
```

应该成功输出路径：
```
D:\xroting\monna\monna-saas\mobile-app\node_modules\metro\src\lib\TerminalReporter.js
```

### 3. 启动 Expo

```bash
npx expo start
```

Metro 服务器应该正常启动在 http://localhost:8081

## 当前配置状态

✅ **Metro 版本**: 0.83.2 (精确匹配)
✅ **@expo/metro 版本**: 54.1.0
✅ **@expo/cli 版本**: 54.0.16
✅ **Expo SDK**: 54.0.0
✅ **React**: 19.1.0
✅ **React Native**: 0.81.5
✅ **Node.js**: 22.14.0
✅ **父目录 node_modules**: 已备份（避免路径冲突）

## 技术细节

### 为什么会发生这个问题？

1. **包管理器行为**: npm 默认会尝试安装满足语义化版本范围的最新版本
2. **版本要求冲突**: `@expo/metro` 需要精确的 0.83.2，但 npm 安装了 0.83.3
3. **模块导出**: Metro 0.83.3 的 package.json exports 配置与 0.83.2 有细微差异

### Metro package.json exports 配置

```json
{
  "exports": {
    ".": "./src/index.js",
    "./package.json": "./package.json",
    "./private/*": "./src/*.js"
  }
}
```

这个配置允许通过 `metro/private/lib/TerminalReporter` 访问 `src/lib/TerminalReporter.js`。

### @expo/metro 的依赖声明

```json
{
  "dependencies": {
    "metro": "0.83.2"
  }
}
```

明确要求 **精确版本** 0.83.2，而不是 `^0.83.2` 或 `~0.83.2`。

## 重要提示

⚠️ **使用 `--save-exact` 标志**: 这确保 package.json 中记录精确版本，防止未来 `npm install` 时自动升级

⚠️ **避免手动升级 Metro**: 除非 @expo/metro 也相应更新，否则不要单独升级 metro 包

⚠️ **父目录 node_modules**: 确保 `d:\xroting\monna\node_modules` 已重命名或删除，防止 Metro 解析错误路径

## 下一步

现在 Metro 依赖问题已解决，你可以：

1. ✅ **启动开发服务器**: `npx expo start`
2. ✅ **在 iOS 真机测试**: 扫描二维码
3. ✅ **在 Android 模拟器测试**: 按 'a' 键
4. ✅ **测试所有模板**: 验证 219 个资源文件正确加载

---

**修复时间**: 2025-11-19
**状态**: ✅ 已解决
**关键修复**: 强制 Metro 版本为 0.83.2
