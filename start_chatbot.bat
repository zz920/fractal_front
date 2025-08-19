@echo off
chcp 65001 >nul
echo 🗺️ 百度地图聊天机器人启动中...
echo.

echo 正在检查Python环境...
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Python已安装
    python --version
    echo.
    echo 🚀 正在启动聊天机器人...
    echo 💡 提示：输入 'help' 查看地图工具命令
    echo 💡 输入 'quit' 退出程序
    echo.
    python simple_chatbot.py
) else (
    echo ❌ Python未安装或不在PATH中
    echo.
    echo 📥 请先安装Python：
    echo    1. 访问 https://www.python.org/downloads/
    echo    2. 下载并安装Python 3.8+
    echo    3. 安装时勾选"Add Python to PATH"
    echo.
    echo 💡 或者使用Microsoft Store安装Python
)

echo.
echo 按任意键退出...
pause >nul



