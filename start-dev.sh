#!/bin/bash

echo "========================================"
echo "Monna Mobile App - 开发服务器启动脚本"
echo "========================================"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "错误: 未找到 package.json"
    echo "请确保在 mobile-app 目录下运行此脚本"
    exit 1
fi

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "依赖安装失败，请检查网络连接"
        exit 1
    fi
fi

# 检查环境变量文件
if [ ! -f ".env.local" ]; then
    echo ""
    echo "警告: 未找到 .env.local 文件"
    echo "正在从 .env.example 复制..."
    cp .env.example .env.local
    echo ""
    echo "请编辑 .env.local 文件，填入正确的配置"
    echo "按 Enter 继续编辑..."
    read

    # 尝试使用默认编辑器
    if command -v code &> /dev/null; then
        code .env.local
    elif command -v nano &> /dev/null; then
        nano .env.local
    elif command -v vim &> /dev/null; then
        vim .env.local
    else
        echo "请手动编辑 .env.local 文件"
    fi
fi

echo ""
echo "正在启动 Expo 开发服务器..."
echo ""
echo "提示:"
echo "  - 按 'i' 启动 iOS 模拟器"
echo "  - 按 'a' 启动 Android 模拟器"
echo "  - 按 'w' 在浏览器中打开"
echo "  - 扫描二维码在真机运行（需安装 Expo Go）"
echo ""
echo "========================================"
echo ""

# 启动开发服务器
npm start
