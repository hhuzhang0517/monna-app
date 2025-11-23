# Monna Mobile App 启动脚本
# 此脚本会自动处理父目录 node_modules 冲突问题

Write-Host "=== Monna Mobile App 启动脚本 ===" -ForegroundColor Cyan
Write-Host ""

# 检查并备份父目录 node_modules
$parentNodeModules = "D:\xroting\monna\node_modules"
$parentBackup = "D:\xroting\monna\node_modules.backup"

if (Test-Path $parentNodeModules) {
    Write-Host "正在备份父目录 node_modules..." -ForegroundColor Yellow
    Rename-Item $parentNodeModules $parentBackup -Force
    Write-Host "✓ 备份完成" -ForegroundColor Green
    $needRestore = $true
} elseif (Test-Path $parentBackup) {
    Write-Host "✓ 父目录 node_modules 已备份" -ForegroundColor Green
    $needRestore = $true
} else {
    Write-Host "✓ 无需备份" -ForegroundColor Green
    $needRestore = $false
}

Write-Host ""
Write-Host "正在启动 Expo 开发服务器..." -ForegroundColor Cyan
Write-Host "提示: 按 'a' 在 Android 模拟器中打开" -ForegroundColor Yellow
Write-Host "提示: 按 Ctrl+C 退出" -ForegroundColor Yellow
Write-Host ""

# 启动 Expo
npm start

# 脚本退出时恢复父目录 node_modules
Write-Host ""
if ($needRestore -and (Test-Path $parentBackup)) {
    Write-Host "正在恢复父目录 node_modules..." -ForegroundColor Yellow
    Rename-Item $parentBackup $parentNodeModules -Force
    Write-Host "✓ 已恢复" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== 已退出 ===" -ForegroundColor Cyan
