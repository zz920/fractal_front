#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
地图工具模块
继承自地图核心功能，提供完整的百度地图工具实现
"""

import asyncio
import subprocess
import os
from typing import Dict, List, Optional
from dataclasses import dataclass
from map_core import BaseMapTool, Location, MapSearchResult
from utils import calculate_distance_simple, validate_coordinates

class BaiduMapTool(BaseMapTool):
    """百度地图工具类"""
    
    async def start_mcp_server(self):
        """启动百度地图MCP服务器"""
        try:
            print("🚀 正在启动百度地图MCP服务器...")
            
            env = os.environ.copy()
            env["BAIDU_MAP_API_KEY"] = self.api_key
            
            process = await asyncio.create_subprocess_exec(
                "npx", "-y", "@baidumap/mcp-server-baidu-map",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                env=env
            )
            
            print("✅ 百度地图MCP服务器已启动")
            return process
            
        except Exception as e:
            print(f"❌ 启动MCP服务器失败: {str(e)}")
            return None
    
    def geocode(self, address: str) -> Optional[Location]:
        """地理编码：将地址转换为坐标"""
        print(f"🔍 正在地理编码: {address}")
        
        endpoint = "/geocoding/v3/"
        params = {
            'address': address,
            'city': ''
        }
        
        data = self._make_api_request(endpoint, params)
        if data and 'result' in data:
            location_data = data['result']['location']
            return self._create_location_from_data(location_data, address)
        
        return None
    
    def reverse_geocode(self, latitude: float, longitude: float) -> Optional[Location]:
        """逆地理编码：将坐标转换为地址"""
        if not validate_coordinates(latitude, longitude):
            print("❌ 坐标无效")
            return None
            
        print(f"🔍 正在逆地理编码: {latitude}, {longitude}")
        
        endpoint = "/reverse_geocoding/v3/"
        params = {
            'location': f"{latitude},{longitude}",
            'coordtype': 'wgs84ll'
        }
        
        data = self._make_api_request(endpoint, params)
        if data and 'result' in data:
            result = data['result']
            return Location(
                latitude=latitude,
                longitude=longitude,
                address=result.get('formatted_address', '未知地址'),
                name=result.get('business', '未知位置')
            )
        
        return None
    
    def search_places(self, query: str, location: Optional[Location] = None) -> MapSearchResult:
        """搜索地点"""
        print(f"🔍 正在搜索地点: {query}")
        
        endpoint = "/place/v2/search"
        params = {
            'query': query,
            'region': '全国',
            'output': 'json',
            'page_size': self.max_results
        }
        
        if location:
            params['location'] = f"{location.latitude},{location.longitude}"
            params['radius'] = 50000
        
        data = self._make_api_request(endpoint, params)
        if data and 'results' in data:
            results = []
            for place in data['results']:
                results.append(Location(
                    latitude=place['location']['lat'],
                    longitude=place['location']['lng'],
                    address=place.get('address', ''),
                    name=place.get('name', '')
                ))
            
            return self._create_search_result(query, results)
        
        return self._create_search_result(query, [])
    
    def calculate_distance(self, origin: Location, destination: Location) -> float:
        """计算两点间距离（公里）"""
        print(f"📏 正在计算距离: {origin.address} -> {destination.address}")
        
        endpoint = "/routematrix/v2/driving"
        params = {
            'origins': f"{origin.latitude},{origin.longitude}",
            'destinations': f"{destination.latitude},{destination.longitude}"
        }
        
        data = self._make_api_request(endpoint, params)
        if data and 'result' in data:
            distance_info = data['result']['distance'][0][0]
            return distance_info / 1000  # 转换为公里
        
        # 如果API调用失败，使用简单的距离计算
        return calculate_distance_simple(origin.latitude, origin.longitude, 
                                      destination.latitude, destination.longitude)
    
    def get_route(self, origin: Location, destination: Location, mode: str = "driving") -> Dict:
        """获取路线规划"""
        print(f"🗺️ 正在规划路线: {origin.address} -> {destination.address} ({mode})")
        
        endpoint = "/direction/v2/driving"
        params = {
            'origin': f"{origin.latitude},{origin.longitude}",
            'destination': f"{destination.latitude},{destination.longitude}"
        }
        
        data = self._make_api_request(endpoint, params)
        if data and 'result' in data:
            route_data = data['result']['routes'][0]
            steps = [step['instruction'] for step in route_data['steps']]
            
            return {
                "origin": origin.address,
                "destination": destination.address,
                "mode": mode,
                "distance": route_data['distance'] / 1000,  # 转换为公里
                "duration": f"{route_data['duration'] // 60}分钟",
                "steps": steps
            }
        
        # 如果API调用失败，返回基本信息
        distance = self.calculate_distance(origin, destination)
        return {
            "origin": origin.address,
            "destination": destination.address,
            "mode": mode,
            "distance": distance,
            "duration": "未知",
            "steps": ["路线规划暂时不可用"]
        }

class MapToolManager:
    """地图工具管理器"""
    
    def __init__(self):
        """初始化地图工具管理器"""
        self.baidu_map = BaiduMapTool()
        self.tools = {
            "baidu_map": self.baidu_map
        }
    
    def list_tools(self) -> List[str]:
        """列出可用的地图工具"""
        return list(self.tools.keys())
    
    def get_tool(self, tool_name: str) -> Optional[BaiduMapTool]:
        """获取指定的地图工具"""
        return self.tools.get(tool_name)
    
    async def test_all_tools(self):
        """测试所有地图工具"""
        print("🧪 开始测试所有地图工具...")
        
        print("\n--- 测试百度地图工具 ---")
        
        # 地理编码测试
        location = self.baidu_map.geocode("北京市")
        
        # 搜索地点测试
        search_result = self.baidu_map.search_places("城市")
        
        # 距离计算测试
        if len(search_result.results) >= 2:
            distance = self.baidu_map.calculate_distance(
                search_result.results[0], 
                search_result.results[1]
            )
        
        # 路线规划测试
        if len(search_result.results) >= 2:
            route = self.baidu_map.get_route(
                search_result.results[0], 
                search_result.results[1]
            )
        
        print("✅ 所有工具测试完成")

async def main():
    """主函数"""
    print("🗺️ 地图工具启动中...")
    
    manager = MapToolManager()
    await manager.test_all_tools()
    
    print("\n🎉 地图工具初始化完成！")

if __name__ == "__main__":
    asyncio.run(main())

