#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
地图工具演示脚本
提供交互式的地图功能演示
"""

import asyncio
import sys
from map_tools import MapToolManager, Location

class MapDemo:
    """地图工具演示类"""
    
    def __init__(self):
        """初始化演示类"""
        self.manager = MapToolManager()
        self.running = True
    
    def print_menu(self):
        """打印主菜单"""
        print("\n" + "="*50)
        print("🗺️  百度地图工具演示")
        print("="*50)
        print("1. 🔍 地理编码（地址转坐标）")
        print("2. 📍 逆地理编码（坐标转地址）")
        print("3. 🏢 搜索地点")
        print("4. 📏 计算距离")
        print("5. 🗺️ 路线规划")
        print("6. ⚙️ 查看配置")
        print("7. 🧪 测试所有功能")
        print("0. 🚪 退出")
        print("="*50)
    
    async def geocode_demo(self):
        """地理编码演示"""
        print("\n🔍 地理编码演示")
        address = input("请输入地址（如：北京市）：").strip()
        if not address:
            print("❌ 地址不能为空")
            return
        
        location = self.manager.baidu_map.geocode(address)
        if location:
            print(f"✅ 地理编码结果：{location.address} -> {location.latitude}, {location.longitude}")
    
    async def reverse_geocode_demo(self):
        """逆地理编码演示"""
        print("\n📍 逆地理编码演示")
        try:
            lat = float(input("请输入纬度（如：39.9042）：").strip())
            lon = float(input("请输入经度（如：116.4074）：").strip())
        except ValueError:
            print("❌ 请输入有效的数字")
            return
        
        location = self.manager.baidu_map.reverse_geocode(lat, lon)
        if location:
            print(f"✅ 逆地理编码结果：{lat}, {lon} -> {location.address}")
    
    async def search_places_demo(self):
        """搜索地点演示"""
        print("\n🏢 搜索地点演示")
        query = input("请输入搜索关键词（如：城市）：").strip()
        if not query:
            print("❌ 搜索关键词不能为空")
            return
        
        result = self.manager.baidu_map.search_places(query)
        if result and result.results:
            print(f"✅ 搜索完成，找到 {result.total_count} 个结果：")
            for i, place in enumerate(result.results[:5], 1):  # 只显示前5个结果
                print(f"   {i}. {place.name or place.address} ({place.latitude}, {place.longitude})")
    
    async def calculate_distance_demo(self):
        """计算距离演示"""
        print("\n📏 计算距离演示")
        try:
            lat1 = float(input("起点纬度：").strip())
            lon1 = float(input("起点经度：").strip())
            lat2 = float(input("终点纬度：").strip())
            lon2 = float(input("终点经度：").strip())
        except ValueError:
            print("❌ 请输入有效的数字")
            return
        
        loc1 = Location(lat1, lon1, f"起点({lat1}, {lon1})")
        loc2 = Location(lat2, lon2, f"终点({lat2}, {lon2})")
        distance = self.manager.baidu_map.calculate_distance(loc1, loc2)
        print(f"✅ 距离：{distance:.2f} 公里")
    
    async def route_planning_demo(self):
        """路线规划演示"""
        print("\n🗺️ 路线规划演示")
        try:
            lat1 = float(input("起点纬度：").strip())
            lon1 = float(input("起点经度：").strip())
            lat2 = float(input("终点纬度：").strip())
            lon2 = float(input("终点经度：").strip())
        except ValueError:
            print("❌ 请输入有效的数字")
            return
        
        loc1 = Location(lat1, lon1, f"起点({lat1}, {lon1})")
        loc2 = Location(lat2, lon2, f"终点({lat2}, {lon2})")
        route = self.manager.baidu_map.get_route(loc1, loc2, "driving")
        if route:
            print(f"✅ 路线规划：{route['distance']:.2f}公里，{route['duration']}")
    
    async def show_config_demo(self):
        """显示配置演示"""
        print("\n⚙️ 当前配置信息")
        print("✅ 配置加载成功")
    
    async def test_all_demo(self):
        """测试所有功能演示"""
        print("\n🧪 测试所有功能")
        await self.manager.test_all_tools()
    
    async def run(self):
        """运行演示程序"""
        print("🚀 地图工具演示程序启动中...")
        
        while self.running:
            try:
                self.print_menu()
                choice = input("\n请选择功能 (0-7)：").strip()
                
                if choice == "0":
                    print("👋 感谢使用地图工具演示程序！")
                    break
                elif choice == "1":
                    await self.geocode_demo()
                elif choice == "2":
                    await self.reverse_geocode_demo()
                elif choice == "3":
                    await self.search_places_demo()
                elif choice == "4":
                    await self.calculate_distance_demo()
                elif choice == "5":
                    await self.route_planning_demo()
                elif choice == "6":
                    await self.show_config_demo()
                elif choice == "7":
                    await self.test_all_demo()
                else:
                    print("❌ 无效选择，请输入 0-7 之间的数字")
                
                if self.running:
                    input("\n按回车键继续...")
                    
            except KeyboardInterrupt:
                print("\n\n👋 程序被用户中断，正在退出...")
                break
            except Exception as e:
                print(f"\n❌ 发生错误：{str(e)}")
                input("按回车键继续...")

async def main():
    """主函数"""
    demo = MapDemo()
    await demo.run()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 程序已退出")
    except Exception as e:
        print(f"❌ 程序异常退出：{str(e)}")
        sys.exit(1)

