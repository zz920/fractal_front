#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
API配置文件
管理不同地图服务的API配置和密钥
"""

import os
from typing import Dict, Any

class APIConfig:
    """API配置管理类"""
    
    def __init__(self):
        """初始化API配置"""
        self.baidu_map_config = {
            "api_key": os.getenv("BAIDU_MAP_API_KEY", "tiDQOua8ZbUvhTmfZBci9LPLG1g6Mk3u"),
            "base_url": "https://api.map.baidu.com",
            "timeout": 10,
            "max_results": 20,
            "endpoints": {
                "geocoding": "/geocoding/v3/",
                "reverse_geocoding": "/reverse_geocoding/v3/",
                "place_search": "/place/v2/search",
                "route_matrix": "/routematrix/v2/driving",
                "direction": "/direction/v2/driving"
            }
        }
        
        self.google_map_config = {
            "api_key": os.getenv("GOOGLE_MAP_API_KEY", ""),
            "base_url": "https://maps.googleapis.com",
            "timeout": 10,
            "max_results": 20
        }
    
    def get_baidu_config(self) -> Dict[str, Any]:
        """获取百度地图配置"""
        return self.baidu_map_config
    
    def get_google_config(self) -> Dict[str, Any]:
        """获取谷歌地图配置"""
        return self.google_map_config
    
    def get_api_key(self, service: str = "baidu") -> str:
        """获取指定服务的API密钥"""
        if service == "baidu":
            return self.baidu_map_config["api_key"]
        elif service == "google":
            return self.google_map_config["api_key"]
        return ""
    
    def get_base_url(self, service: str = "baidu") -> str:
        """获取指定服务的基础URL"""
        if service == "baidu":
            return self.baidu_map_config["base_url"]
        elif service == "google":
            return self.google_map_config["base_url"]
        return ""
    
    def get_endpoint(self, service: str, endpoint_type: str) -> str:
        """获取指定服务的端点URL"""
        if service == "baidu" and endpoint_type in self.baidu_map_config["endpoints"]:
            return self.baidu_map_config["endpoints"][endpoint_type]
        return ""
    
    def update_api_key(self, service: str, api_key: str) -> bool:
        """更新指定服务的API密钥"""
        try:
            if service == "baidu":
                self.baidu_map_config["api_key"] = api_key
                os.environ["BAIDU_MAP_API_KEY"] = api_key
                return True
            elif service == "google":
                self.google_map_config["api_key"] = api_key
                os.environ["GOOGLE_MAP_API_KEY"] = api_key
                return True
            return False
        except Exception:
            return False
    
    def is_service_configured(self, service: str) -> bool:
        """检查指定服务是否已配置"""
        api_key = self.get_api_key(service)
        return bool(api_key and api_key.strip())
    
    def get_available_services(self) -> list:
        """获取可用的地图服务列表"""
        services = []
        if self.is_service_configured("baidu"):
            services.append("baidu")
        if self.is_service_configured("google"):
            services.append("google")
        return services

# 全局API配置实例
api_config = APIConfig()

