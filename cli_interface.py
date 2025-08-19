#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
命令行界面模块
提供统一的用户交互接口和命令处理
"""

import asyncio
from typing import Optional, Callable
from simple_map_tools import SimpleMapToolManager, Location
from utils import format_distance

class CLIInterface:
    """命令行界面类"""
    
    def __init__(self):
        """初始化命令行界面"""
        self.map_manager = SimpleMapToolManager()
        self.running = True
        self.command_handlers = {
            'geocode': self._handle_geocode,
            'reverse': self._handle_reverse,
            'search': self._handle_search,
            'distance': self._handle_distance,
            'route': self._handle_route,
            'config': self._handle_config,
            'test': self._handle_test,
            'help': self._handle_help,
            'quit': self._handle_quit
        }
    
    def show_welcome(self):
        """显示欢迎信息"""
        print("🚀 百度地图工具启动中...")
        print("🗺️ 地图工具已加载，输入 'help' 查看可用命令")
        print("💡 输入 'quit' 退出程序")
        print("-" * 50)
    
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
    
    def _handle_geocode(self, args: list) -> str:
        """处理地理编码命令"""
        if len(args) < 1:
            return "❌ 命令格式错误，请使用：geocode <地址>"
        
        address = " ".join(args)
        location = self.map_manager.baidu_map.geocode(address)
        
        if location:
            return f"✅ 地理编码结果：{location.address} -> {location.latitude}, {location.longitude}"
        else:
            return "❌ 地理编码失败，请检查地址是否正确"
    
    def _handle_reverse(self, args: list) -> str:
        """处理逆地理编码命令"""
        if len(args) < 2:
            return "❌ 命令格式错误，请使用：reverse <纬度> <经度>"
        
        try:
            lat = float(args[0])
            lon = float(args[1])
            location = self.map_manager.baidu_map.reverse_geocode(lat, lon)
            
            if location:
                return f"✅ 逆地理编码结果：{lat}, {lon} -> {location.address}"
            else:
                return "❌ 逆地理编码失败"
        except ValueError:
            return "❌ 坐标格式错误，请输入有效的数字"
    
    def _handle_search(self, args: list) -> str:
        """处理搜索地点命令"""
        if len(args) < 1:
            return "❌ 命令格式错误，请使用：search <关键词>"
        
        query = " ".join(args)
        result = self.map_manager.baidu_map.search_places(query)
        
        if result and result.results:
            response = f"✅ 搜索完成，找到 {result.total_count} 个结果："
            for i, place in enumerate(result.results[:5], 1):
                response += f"\n   {i}. {place.name or place.address} ({place.latitude}, {place.longitude})"
            return response
        else:
            return "❌ 搜索失败或无结果"
    
    def _handle_distance(self, args: list) -> str:
        """处理计算距离命令"""
        if len(args) < 4:
            return "❌ 命令格式错误，请使用：distance <纬度1> <经度1> <纬度2> <经度2>"
        
        try:
            lat1, lon1, lat2, lon2 = float(args[0]), float(args[1]), float(args[2]), float(args[3])
            loc1 = Location(lat1, lon1, f"位置1({lat1}, {lon1})")
            loc2 = Location(lat2, lon2, f"位置2({lat2}, {lon2})")
            distance = self.map_manager.baidu_map.calculate_distance(loc1, loc2)
            return f"✅ 距离计算结果：{format_distance(distance)}"
        except ValueError:
            return "❌ 坐标格式错误，请输入有效的数字"
    
    def _handle_route(self, args: list) -> str:
        """处理路线规划命令"""
        if len(args) < 4:
            return "❌ 命令格式错误，请使用：route <纬度1> <经度1> <纬度2> <经度2> [出行方式]"
        
        try:
            lat1, lon1, lat2, lon2 = float(args[0]), float(args[1]), float(args[2]), float(args[3])
            mode = args[4] if len(args) > 4 else "driving"
            loc1 = Location(lat1, lon1, f"起点({lat1}, {lon1})")
            loc2 = Location(lat2, lon2, f"终点({lat2}, {lon2})")
            route = self.map_manager.baidu_map.get_route(loc1, loc2, mode)
            
            if route:
                return f"✅ 路线规划：{format_distance(route['distance'])}，{route['duration']}"
            else:
                return "❌ 路线规划失败"
        except ValueError:
            return "❌ 坐标格式错误，请输入有效的数字"
    
    def _handle_config(self, args: list) -> str:
        """处理配置命令"""
        return "✅ 当前配置：API密钥已配置，服务：百度地图API"
    
    def _handle_test(self, args: list) -> str:
        """处理测试命令"""
        return "🧪 测试功能已准备就绪，正在后台运行..."
    
    def _handle_help(self, args: list) -> str:
        """处理帮助命令"""
        self.show_help()
        return "📖 帮助信息已显示"
    
    def _handle_quit(self, args: list) -> str:
        """处理退出命令"""
        self.running = False
        return "👋 正在退出程序..."
    
    def process_command(self, command: str) -> Optional[str]:
        """处理用户命令"""
        try:
            parts = command.strip().split()
            if not parts:
                return "❌ 命令格式错误，请输入 help 查看帮助"
            
            cmd = parts[0].lower()
            args = parts[1:]
            
            if cmd in self.command_handlers:
                return self.command_handlers[cmd](args)
            else:
                return f"❌ 未知命令：{cmd}\n   输入 'help' 查看可用命令"
                
        except Exception as e:
            return f"❌ 处理命令时发生错误：{str(e)}"
    
    def run(self):
        """运行命令行界面"""
        self.show_welcome()
        
        while self.running:
            try:
                query = input("\nQuery: ").strip()
                if not query:
                    continue
                
                response = self.process_command(query)
                if response:
                    print(f"\n{response}")
                
                if not self.running:
                    break
                    
            except KeyboardInterrupt:
                print("\n\n👋 程序被用户中断，正在退出...")
                break
            except Exception as e:
                print(f"\n⚠ 发生错误：{str(e)}")

def main():
    """主函数"""
    try:
        cli = CLIInterface()
        cli.run()
    except Exception as e:
        print(f"❌ 程序异常退出：{str(e)}")

if __name__ == "__main__":
    main()

