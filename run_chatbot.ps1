# 聊天机器人启动脚本
Write-Host "🗺️ 百度地图聊天机器人启动中..." -ForegroundColor Green
Write-Host ""

# 检查Python安装
$pythonPaths = @(
    "python.exe",
    "py.exe",
    "C:\Users\20267\AppData\Local\Microsoft\WindowsApps\python.exe",
    "C:\Python*\python.exe",
    "C:\Program Files\Python*\python.exe",
    "C:\Users\$env:USERNAME\AppData\Local\Programs\Python\Python*\python.exe"
)

$pythonExe = $null
foreach ($path in $pythonPaths) {
    try {
        if (Get-Command $path -ErrorAction SilentlyContinue) {
            $pythonExe = $path
            break
        }
    } catch {
        continue
    }
}

if (-not $pythonExe) {
    Write-Host "❌ 未找到可用的Python安装" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 请先安装Python：" -ForegroundColor Yellow
    Write-Host "   1. 访问 https://www.python.org/downloads/" -ForegroundColor Cyan
    Write-Host "   2. 下载并安装Python 3.8+" -ForegroundColor Cyan
    Write-Host "   3. 安装时勾选'Add Python to PATH'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 或者使用Microsoft Store安装Python" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "按回车键退出"
    exit 1
}

Write-Host "✅ 找到Python: $pythonExe" -ForegroundColor Green

# 检查必要文件
$requiredFiles = @("mcp_client.py", "simple_map_tools.py")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "❌ 缺少必要文件：" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "   - $file" -ForegroundColor Red
    }
    Write-Host ""
    Read-Host "按回车键退出"
    exit 1
}

Write-Host "✅ 所有必要文件已就绪" -ForegroundColor Green
Write-Host ""

# 尝试运行聊天机器人
try {
    Write-Host "🚀 正在启动聊天机器人..." -ForegroundColor Green
    Write-Host "💡 提示：输入 'help' 查看地图工具命令" -ForegroundColor Cyan
    Write-Host "💡 输入 'quit' 退出程序" -ForegroundColor Cyan
    Write-Host ""
    
    # 运行Python脚本
    & $pythonExe mcp_client.py
    
} catch {
    Write-Host "❌ 启动失败：$($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 可能的解决方案：" -ForegroundColor Yellow
    Write-Host "   1. 检查Python安装是否完整" -ForegroundColor Cyan
    Write-Host "   2. 安装必要的依赖包" -ForegroundColor Cyan
    Write-Host "   3. 检查文件权限" -ForegroundColor Cyan
}

Write-Host ""
Read-Host "按回车键退出"



