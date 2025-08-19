#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
地图工具配置文件
统一管理所有配置信息
"""

import os
import json
from typing import Dict, Any

class MapConfig:
    """地图工具配置类"""
    
    def __init__(self, config_path: str = "mcp_config.json"):
        """初始化配置"""
        self.config_path = config_path
        self.default_config = {
            "mcpServers": {
                "baidu-map": {
                    "command": "npx",
                    "args": [
                        "-y",
                        "@baidumap/mcp-server-baidu-map"
                    ],
                    "env": {
                        "BAIDU_MAP_API_KEY": "tiDQOua8ZbUvhTmfZBci9LPLG1g6Mk3u"
                    }
                }
            },
            "api": {
                "baidu_map": {
                    "base_url": "https://api.map.baidu.com",
                    "timeout": 10,
                    "max_results": 20
                }
            },
            "features": {
                "geocoding": True,
                "reverse_geocoding": True,
                "place_search": True,
                "distance_calculation": True,
                "route_planning": True
            }
        }
        self.config = self.load_config()
    
    def load_config(self) -> Dict[str, Any]:
        """加载配置文件"""
        try:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                print(f"✅ 配置已从 {self.config_path} 加载")
                return config
            else:
                print(f"⚠ 配置文件 {self.config_path} 不存在，使用默认配置")
                return self.default_config
        except Exception as e:
            print(f"❌ 加载配置失败: {str(e)}，使用默认配置")
            return self.default_config
    
    def save_config(self) -> bool:
        """保存配置文件"""
        try:
            with open(self.config_path, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, indent=2, ensure_ascii=False)
            print(f"✅ 配置已保存到: {self.config_path}")
            return True
        except Exception as e:
            print(f"❌ 保存配置失败: {str(e)}")
            return False
    
    def get_api_key(self) -> str:
        """获取百度地图API密钥"""
        return self.config.get("mcpServers", {}).get("baidu-map", {}).get("env", {}).get("BAIDU_MAP_API_KEY", "")
    
    def get_base_url(self) -> str:
        """获取百度地图API基础URL"""
        return self.config.get("api", {}).get("baidu_map", {}).get("base_url", "https://api.map.baidu.com")
    
    def get_timeout(self) -> int:
        """获取API请求超时时间"""
        return self.config.get("api", {}).get("baidu_map", {}).get("timeout", 10)
    
    def get_max_results(self) -> int:
        """获取最大搜索结果数"""
        return self.config.get("api", {}).get("baidu_map", {}).get("max_results", 20)
    
    def is_feature_enabled(self, feature: str) -> bool:
        """检查功能是否启用"""
        return self.config.get("features", {}).get(feature, True)
    
    def update_api_key(self, api_key: str) -> bool:
        """更新API密钥"""
        try:
            self.config["mcpServers"]["baidu-map"]["env"]["BAIDU_MAP_API_KEY"] = api_key
            return self.save_config()
        except Exception as e:
            print(f"❌ 更新API密钥失败: {str(e)}")
            return False
    
    def get_mcp_config(self) -> Dict[str, Any]:
        """获取MCP服务器配置"""
        return self.config.get("mcpServers", {})

# 全局配置实例
map_config = MapConfig()
