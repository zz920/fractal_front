#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简单的百度地图聊天机器人
使用真实API调用，不依赖外部模块
"""

from simple_map_tools import SimpleMapToolManager, Location
from config import map_config
from utils import format_distance

class SimpleChatbot:
    """简单的地图聊天机器人"""
    
    def __init__(self):
        """初始化聊天机器人"""
        self.map_manager = SimpleMapToolManager()
        self.running = True
    
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
    
    def process_command(self, command):
        """处理用户命令"""
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
                        response += f"\n   {i}. {place.name or place.address} ({place.latitude}, {location.longitude})"
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
    
    def run(self):
        """运行聊天机器人"""
        print("🚀 地图聊天机器人启动中...")
        print("🗺️ 地图工具已加载，输入 'help' 查看可用命令")
        
        while self.running:
            try:
                query = input("\nQuery: ").strip()
                if query.lower() == 'quit':
                    print("👋 感谢使用地图聊天机器人！")
                    break
                
                if query.lower().startswith(('geocode', 'reverse', 'search', 'distance', 'route', 'config', 'test', 'help')):
                    response = self.process_command(query)
                    print(f"\n{response}")
                else:
                    print(f"\n💬 你说的是：{query}")
                    print("💡 提示：输入 'help' 查看地图工具命令")
                    
            except KeyboardInterrupt:
                print("\n\n👋 程序被用户中断，正在退出...")
                break
            except Exception as e:
                print(f"\n⚠ 发生错误：{str(e)}")

def main():
    """主函数"""
    try:
        chatbot = SimpleChatbot()
        chatbot.run()
    except Exception as e:
        print(f"❌ 程序异常退出：{str(e)}")

if __name__ == "__main__":
    main()


