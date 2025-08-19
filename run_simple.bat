@echo off
chcp 65001 >nul
echo ========================================
echo MCP客户端启动脚本
echo ========================================
echo.

echo 正在尝试启动MCP客户端...
echo.

REM 尝试多种Python命令
echo 尝试方法1: python
python mcp_client_fixed.py 2>nul
if %errorlevel% == 0 goto :success

echo 尝试方法2: python3
python3 mcp_client_fixed.py 2>nul
if %errorlevel% == 0 goto :success

echo 尝试方法3: py
py mcp_client_fixed.py 2>nul
if %errorlevel% == 0 goto :success

echo 尝试方法4: 完整路径
C:\Users\20267\AppData\Local\Microsoft\WindowsApps\python.exe mcp_client_fixed.py 2>nul
if %errorlevel% == 0 goto :success

echo 尝试方法5: python3完整路径
C:\Users\20267\AppData\Local\Microsoft\WindowsApps\python3.exe mcp_client_fixed.py 2>nul
if %errorlevel% == 0 goto :success

echo.
echo ❌ 所有Python启动方法都失败了
echo.
echo 📥 请安装Python：
echo 1. 访问 https://www.python.org/downloads/
echo 2. 下载最新版本的Python
echo 3. 安装时勾选"Add Python to PATH"
echo 4. 重启命令提示符
echo.
echo 💡 或者使用Microsoft Store安装Python
echo.
echo 安装完成后，重新运行此脚本
echo.
pause
exit /b 1

:success
echo.
echo ✅ MCP客户端已成功启动！
echo.
pause

