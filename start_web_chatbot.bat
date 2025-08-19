@echo off
chcp 65001 >nul
echo 🗺️ 启动百度地图聊天机器人（网页版）
echo.

echo 正在启动聊天机器人...
echo 💡 这将打开您的默认浏览器
echo.

start chatbot_web.html

echo ✅ 聊天机器人已启动！
echo.
echo 🎯 功能说明：
echo   • 地理编码：geocode 北京市
echo   • 搜索地点：search 城市
echo   • 计算距离：distance 39.9042 116.4074 31.2304 121.4737
echo   • 路线规划：route 39.9042 116.4074 31.2304 121.4737
echo   • 查看帮助：help
echo.
echo 💡 您也可以点击快速操作按钮来测试功能
echo.

echo 按任意键退出...
pause >nul



