#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
地图工具通用工具函数
"""

import math
from typing import Tuple, Optional

def calculate_distance_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    使用Haversine公式计算两点间距离（公里）
    更精确的距离计算方法
    """
    # 将经纬度转换为弧度
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Haversine公式
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # 地球半径（公里）
    earth_radius = 6371
    
    return earth_radius * c

def calculate_distance_simple(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    简单的距离计算（1度约等于111公里）
    用于API调用失败时的备用方案
    """
    lat_diff = abs(lat1 - lat2)
    lon_diff = abs(lon1 - lon2)
    return math.sqrt(lat_diff**2 + lon_diff**2) * 111

def validate_coordinates(lat: float, lon: float) -> bool:
    """验证坐标是否有效"""
    return -90 <= lat <= 90 and -180 <= lon <= 180

def format_coordinates(lat: float, lon: float, precision: int = 6) -> str:
    """格式化坐标显示"""
    return f"{lat:.{precision}f}, {lon:.{precision}f}"

def parse_coordinates(coord_str: str) -> Optional[Tuple[float, float]]:
    """解析坐标字符串"""
    try:
        parts = coord_str.strip().split(',')
        if len(parts) == 2:
            lat = float(parts[0].strip())
            lon = float(parts[1].strip())
            if validate_coordinates(lat, lon):
                return (lat, lon)
    except ValueError:
        pass
    return None

def format_distance(distance_km: float) -> str:
    """格式化距离显示"""
    if distance_km < 1:
        return f"{distance_km * 1000:.0f}米"
    elif distance_km < 10:
        return f"{distance_km:.1f}公里"
    else:
        return f"{distance_km:.0f}公里"

def format_duration(seconds: int) -> str:
    """格式化时间显示"""
    if seconds < 60:
        return f"{seconds}秒"
    elif seconds < 3600:
        return f"{seconds // 60}分钟"
    else:
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        if minutes > 0:
            return f"{hours}小时{minutes}分钟"
        else:
            return f"{hours}小时"

def sanitize_address(address: str) -> str:
    """清理地址字符串"""
    if not address:
        return ""
    
    # 移除多余的空白字符
    cleaned = " ".join(address.split())
    
    # 移除特殊字符（保留中文、英文、数字、常用标点）
    import re
    cleaned = re.sub(r'[^\w\s\u4e00-\u9fff\-\.\,\，\。\、\（\）]', '', cleaned)
    
    return cleaned.strip()

def truncate_text(text: str, max_length: int = 100) -> str:
    """截断文本到指定长度"""
    if len(text) <= max_length:
        return text
    return text[:max_length-3] + "..."
