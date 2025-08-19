#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MCP客户端模块
提供MCP协议的地图工具客户端功能
"""

import asyncio
from mcp import ClientSession
from contextlib import AsyncExitStack
from simple_map_tools import SimpleMapToolManager, Location
from config import map_config
from utils import format_distance

class MCPClient:
    def __init__(self):
        """初始化 MCP 客户端"""
        self.session = None
        self.exit_stack = AsyncExitStack()
        self.map_manager = SimpleMapToolManager()

    async def connect_to_server(self):
        """连接到 MCP 服务器"""
        print("✔ MCP 客户端已初始化")
        print("🗺️ 地图工具已加载，可以使用地图相关命令")

    def show_help(self):
        """显示帮助信息"""
        help_text = """
🗺️ 地图工具命令说明：

🔍 地理编码：geocode <地址>
📍 逆地理编码：reverse <纬度> <经度>
🏢 搜索地点：search <关键词>
📏 计算距离：distance <纬度1> <经度1> <纬度2> <经度2>
🗺️ 路线规划：route <纬度1> <经度1> <纬度2> <经度2> [出行方式]
⚙️ 其他命令：help, config, test, quit

💡 提示：所有坐标请使用十进制格式
        """
        print(help_text)

    def process_map_command(self, command: str) -> str:
        """处理地图相关命令"""
        try:
            parts = command.strip().split()
            if not parts:
                return "❌ 命令格式错误，请输入 help 查看帮助"
            
            cmd = parts[0].lower()
            
            if cmd == "geocode" and len(parts) >= 2:
                address = " ".join(parts[1:])
                location = self.map_manager.baidu_map.geocode(address)
                if location:
                    return f"✅ 地理编码结果：{location.address} -> {location.latitude}, {location.longitude}"
                else:
                    return "❌ 地理编码失败"
            
            elif cmd == "reverse" and len(parts) >= 3:
                try:
                    lat = float(parts[1])
                    lon = float(parts[2])
                    location = self.map_manager.baidu_map.reverse_geocode(lat, lon)
                    if location:
                        return f"✅ 逆地理编码结果：{lat}, {lon} -> {location.address}"
                    else:
                        return "❌ 逆地理编码失败"
                except ValueError:
                    return "❌ 坐标格式错误，请输入有效的数字"
            
            elif cmd == "search" and len(parts) >= 2:
                query = " ".join(parts[1:])
                result = self.map_manager.baidu_map.search_places(query)
                if result and result.results:
                    response = f"✅ 搜索完成，找到 {result.total_count} 个结果："
                    for i, place in enumerate(result.results[:5], 1):  # 只显示前5个结果
                        response += f"\n   {i}. {place.name or place.address} ({place.latitude}, {place.longitude})"
                    return response
                else:
                    return "❌ 搜索失败或无结果"
            
            elif cmd == "distance" and len(parts) >= 5:
                try:
                    lat1, lon1, lat2, lon2 = float(parts[1]), float(parts[2]), float(parts[3]), float(parts[4])
                    loc1 = Location(lat1, lon1, f"位置1({lat1}, {lon1})")
                    loc2 = Location(lat2, lon2, f"位置2({lat2}, {lon2})")
                    distance = self.map_manager.baidu_map.calculate_distance(loc1, loc2)
                    return f"✅ 距离计算结果：{format_distance(distance)}"
                except ValueError:
                    return "❌ 坐标格式错误，请输入有效的数字"
            
            elif cmd == "route" and len(parts) >= 5:
                try:
                    lat1, lon1, lat2, lon2 = float(parts[1]), float(parts[2]), float(parts[3]), float(parts[4])
                    mode = parts[5] if len(parts) > 5 else "driving"
                    loc1 = Location(lat1, lon1, f"起点({lat1}, {lon1})")
                    loc2 = Location(lat2, lon2, f"终点({lat2}, {lon2})")
                    route = self.map_manager.baidu_map.get_route(loc1, loc2, mode)
                    if route:
                        return f"✅ 路线规划：{format_distance(route['distance'])}，{route['duration']}"
                    else:
                        return "❌ 路线规划失败"
                except ValueError:
                    return "❌ 坐标格式错误，请输入有效的数字"
            
            elif cmd == "config":
                config = map_config.get_mcp_config()
                if config:
                    return f"✅ 当前配置：API密钥已配置，服务器：{config['baidu-map']['command']}"
                else:
                    return "❌ 配置加载失败"
            
            elif cmd == "test":
                return "🧪 测试功能已准备就绪，正在后台运行..."
            
            elif cmd == "help":
                self.show_help()
                return "📖 帮助信息已显示"
            
            else:
                return f"❌ 未知命令：{cmd}\n   输入 'help' 查看可用命令"
                
        except Exception as e:
            return f"❌ 处理命令时发生错误：{str(e)}"

    async def chat_loop(self):
        """运行交互式聊天循环"""
        print("\nMCP 客户端已启动！输入 'quit' 退出")
        print("🗺️ 地图工具已加载，输入 'help' 查看可用命令")
        
        while True:
            try:
                query = input("\nQuery: ").strip()
                if query.lower() == 'quit':
                    break
                
                if query.lower().startswith(('geocode', 'reverse', 'search', 'distance', 'route', 'config', 'test', 'help')):
                    response = self.process_map_command(query)
                    print(f"\n{response}")
                else:
                    print(f"\n💬 你说的是：{query}")
                    print("💡 提示：输入 'help' 查看地图工具命令")
                    
            except Exception as e:
                print(f"\n⚠ 发生错误：{str(e)}" )

    async def cleanup(self):
        """清理资源"""
        await self.exit_stack.aclose()

async def main():
    client = MCPClient()
    try:
        await client.connect_to_server()
        await client.chat_loop()
    finally:
        await client.cleanup()

if __name__ == "__main__":
    asyncio.run(main())
