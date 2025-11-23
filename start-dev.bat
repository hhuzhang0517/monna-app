@echo off
echo ========================================
echo Monna Mobile App - 开发服务器启动脚本
echo ========================================
echo.

REM 检查是否在正确的目录
if not exist "package.json" (
    echo 错误: 未找到 package.json
    echo 请确保在 mobile-app 目录下运行此脚本
    pause
    exit /b 1
)

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
)

REM 检查环境变量文件
if not exist ".env.local" (
    echo.
    echo 警告: 未找到 .env.local 文件
    echo 正在从 .env.example 复制...
    copy .env.example .env.local
    echo.
    echo 请编辑 .env.local 文件，填入正确的配置
    echo 按任意键继续编辑...
    pause > nul
    notepad .env.local
)

echo.
echo 正在启动 Expo 开发服务器...
echo.
echo 提示:
echo   - 按 'i' 启动 iOS 模拟器
echo   - 按 'a' 启动 Android 模拟器
echo   - 按 'w' 在浏览器中打开
echo   - 扫描二维码在真机运行（需安装 Expo Go）
echo.
echo ========================================
echo.

REM 启动开发服务器
call npm start

pause
