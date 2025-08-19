#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
地图工具核心功能模块
包含地图工具的基础类和通用功能
"""

import requests
from typing import Dict, List, Optional
from api_config import api_config
from utils import calculate_distance_simple, validate_coordinates

class Location:
    """位置信息数据类"""
    def __init__(self, latitude: float, longitude: float, address: str, name: Optional[str] = None):
        self.latitude = latitude
        self.longitude = longitude
        self.address = address
        self.name = name

class MapSearchResult:
    """地图搜索结果数据类"""
    def __init__(self, query: str, results: List[Location], total_count: int):
        self.query = query
        self.results = results
        self.total_count = total_count

class BaseMapTool:
    """地图工具基类"""
    
    def __init__(self, service: str = "baidu"):
        """初始化地图工具"""
        self.service = service
        self.api_key = api_config.get_api_key(service)
        self.base_url = api_config.get_base_url(service)
        self.timeout = 10
        self.max_results = 20
    
    def _make_api_request(self, endpoint: str, params: Dict) -> Optional[Dict]:
        """发送API请求到地图服务"""
        try:
            params['ak'] = self.api_key
            params['output'] = 'json'
            
            response = requests.get(f"{self.base_url}{endpoint}", params=params, timeout=self.timeout)
            response.raise_for_status()
            
            data = response.json()
            if data.get('status') == 0:
                return data
            else:
                print(f"❌ API请求失败: {data.get('message', '未知错误')}")
                return None
                
        except requests.RequestException as e:
            print(f"❌ 网络请求失败: {str(e)}")
            return None
        except Exception as e:
            print(f"❌ API调用异常: {str(e)}")
            return None
    
    def _create_location_from_data(self, location_data: Dict, address: str, name: Optional[str] = None) -> Location:
        """从API数据创建位置对象"""
        return Location(
            latitude=location_data['lat'],
            longitude=location_data['lng'],
            address=address,
            name=name or address
        )
    
    def _create_search_result(self, query: str, results: List[Location]) -> MapSearchResult:
        """创建搜索结果对象"""
        return MapSearchResult(
            query=query,
            results=results,
            total_count=len(results)
        )
    
    def is_configured(self) -> bool:
        """检查服务是否已配置"""
        return api_config.is_service_configured(self.service)
