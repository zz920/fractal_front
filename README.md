# 地图工具项目

一个基于百度地图API的地图工具集合，提供地理编码、搜索、距离计算、路线规划等功能。

## 🚀 项目特点

- ✅ **无模拟代码**：所有功能都使用真实的百度地图API
- ✅ **文件行数控制**：单个文件不超过1000行，代码结构清晰
- ✅ **模块化设计**：功能分离，易于维护和扩展
- ✅ **统一配置**：集中管理所有配置信息
- ✅ **错误处理**：完善的异常处理和用户提示

## 📁 项目结构

```
111/
├── config.py              # 统一配置文件
├── utils.py               # 通用工具函数
├── simple_map_tools.py    # 简化的地图工具（242行）
├── map_tools.py           # 完整的地图工具（306行）
├── mcp_client.py          # MCP客户端（167行）
├── simple_chatbot.py      # 简单聊天机器人（414行）
├── map_demo.py            # 地图演示程序（172行）
├── requirements.txt       # 依赖包列表
└── README.md             # 项目说明文档
```

## 🛠️ 主要功能

### 🔍 地理编码
- 将地址转换为坐标
- 支持全国地址查询

### 📍 逆地理编码
- 将坐标转换为地址
- 支持WGS84坐标系

### 🏢 地点搜索
- 关键词搜索地点
- 支持区域限制和半径搜索

### 📏 距离计算
- 计算两点间距离
- 使用Haversine公式，精度更高

### 🗺️ 路线规划
- 支持驾车、步行、公交等出行方式
- 提供详细路线步骤

## 📦 安装依赖

```bash
pip install -r requirements.txt
```

## 🚀 使用方法

### 1. 简单聊天机器人
```bash
python simple_chatbot.py
```

### 2. MCP客户端
```bash
python mcp_client.py
```

### 3. 地图演示程序
```bash
python map_demo.py
```

### 4. 直接使用工具类
```python
from simple_map_tools import SimpleMapToolManager

manager = SimpleMapToolManager()
location = manager.baidu_map.geocode("北京市")
print(f"坐标：{location.latitude}, {location.longitude}")
```

## ⚙️ 配置说明

### API密钥配置
在 `config.py` 中设置百度地图API密钥：

```python
# 更新API密钥
from config import map_config
map_config.update_api_key("your_api_key_here")
```

### 功能开关
可以禁用特定功能：

```python
# 禁用路线规划功能
map_config.config["features"]["route_planning"] = False
map_config.save_config()
```

## 🔧 开发说明

### 代码规范
- 单个文件不超过1000行
- 移除所有模拟代码和临时代码
- 使用类型注解提高代码可读性
- 完善的错误处理和日志记录

### 扩展功能
1. 在 `utils.py` 中添加新的工具函数
2. 在 `config.py` 中添加新的配置项
3. 创建新的工具类继承现有基类

## 📝 命令参考

### 地理编码
```
geocode 北京市
```

### 逆地理编码
```
reverse 39.9042 116.4074
```

### 搜索地点
```
search 城市
```

### 计算距离
```
distance 39.9042 116.4074 31.2304 121.4737
```

### 路线规划
```
route 39.9042 116.4074 31.2304 121.4737 driving
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 📞 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。
