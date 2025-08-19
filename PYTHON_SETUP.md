# Python环境设置指南

## 🚨 问题诊断

如果运行程序时遇到问题，可能是因为Python环境未正确配置。

## 🔍 检查Python安装

### 方法1：使用检查脚本
双击运行 `check_python.bat` 文件，它会自动检查Python环境。

### 方法2：手动检查
在命令提示符中输入：
```bash
python --version
```

如果显示"无法将'python'项识别为..."，说明Python未安装或不在PATH中。

## 📥 安装Python

### 方法1：官网下载（推荐）
1. 访问 [Python官网](https://www.python.org/downloads/)
2. 下载最新版本的Python（建议3.8+）
3. 运行安装程序
4. **重要**：勾选"Add Python to PATH"选项
5. 选择"Install Now"
6. 安装完成后重启命令提示符

### 方法2：Microsoft Store
1. 打开Microsoft Store
2. 搜索"Python"
3. 选择最新版本安装
4. 安装完成后重启命令提示符

### 方法3：使用winget（Windows 10/11）
```bash
winget install Python.Python.3.11
```

## ✅ 验证安装

安装完成后，在命令提示符中运行：
```bash
python --version
```

应该显示Python版本号。

## 🗺️ 运行地图工具

Python安装成功后，可以运行：

### 1. 检查环境
```bash
check_python.bat
```

### 2. 直接运行MCP客户端
```bash
python mcp_client.py
```

### 3. 运行地图演示
```bash
python map_demo.py
```

## 🛠️ 常见问题解决

### 问题1：Python命令不被识别
**解决方案**：重新安装Python，确保勾选"Add Python to PATH"

### 问题2：模块导入错误
**解决方案**：安装依赖包
```bash
pip install -r requirements.txt
```

### 问题3：权限问题
**解决方案**：以管理员身份运行命令提示符

## 📞 获取帮助

如果仍有问题：
1. 检查Python是否正确安装
2. 确认PATH环境变量包含Python路径
3. 尝试重新安装Python
4. 查看错误信息进行针对性解决

## 🔗 有用链接

- [Python官网](https://www.python.org/)
- [Python安装指南](https://docs.python.org/3/using/windows.html)
- [PATH环境变量设置](https://www.windows-commandline.com/set-path-environment-variable/)



