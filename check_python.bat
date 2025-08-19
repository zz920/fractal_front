@echo off
echo ========================================
echo Python环境检查工具
echo ========================================
echo.

echo 正在检查Python安装...
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Python已安装
    python --version
    echo.
    echo 正在检查地图工具...
    python -c "import json, math; print('✅ 基础模块正常')" 2>nul
    if %errorlevel% == 0 (
        echo.
        echo 🚀 准备启动MCP客户端...
        echo 输入 'help' 查看地图工具命令
        echo.
        python mcp_client.py
    ) else (
        echo ❌ Python模块导入失败
        echo 请检查Python安装是否完整
    )
) else (
    echo ❌ Python未安装或不在PATH中
    echo.
    echo 📥 安装Python的步骤：
    echo 1. 访问 https://www.python.org/downloads/
    echo 2. 下载最新版本的Python
    echo 3. 安装时勾选"Add Python to PATH"
    echo 4. 重启命令提示符
    echo.
    echo 💡 或者使用Microsoft Store安装Python
    echo.
    echo 安装完成后，重新运行此脚本
)

echo.
echo 按任意键退出...
pause >nul



