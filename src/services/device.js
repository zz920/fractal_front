import { ref, computed } from 'vue'
import { useAuth } from './auth.js'

// 设备相关的响应式状态
const devices = ref([])
const isLoading = ref(false)
const error = ref(null)

// 服务器配置 - 与auth.js保持一致
const API_BASE_URL = 'https://fractal.cpolar.cn:443'

export function useDevice() {
  const { getAuthHeaders } = useAuth()

  // 处理API响应
  const handleApiResponse = async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || `HTTP错误 ${response.status}`
      throw new Error(errorMessage)
    }
    
    return await response.json()
  }

  // 获取设备列表
  const getDevices = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/devices`, {
        method: 'GET',
        headers: getAuthHeaders()
      })
      
      const result = await handleApiResponse(response)
      devices.value = result.data || []
      
      return devices.value
    } catch (err) {
      error.value = err.message
      console.error('获取设备列表失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 注册设备
  const registerDevice = async (deviceData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/devices/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          device_name: deviceData.deviceName,
          device_type: deviceData.deviceType,
          device_mac: deviceData.deviceMac
        })
      })
      
      const result = await handleApiResponse(response)
      
      // 添加到本地设备列表
      if (result.data) {
        devices.value.push(result.data)
      }
      
      return result.data
    } catch (err) {
      error.value = err.message
      console.error('注册设备失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 删除设备
  const deleteDevice = async (deviceId) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/devices/${deviceId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      
      await handleApiResponse(response)
      
      // 从本地设备列表中移除
      devices.value = devices.value.filter(device => device.id !== deviceId)
      
      return true
    } catch (err) {
      error.value = err.message
      console.error('删除设备失败:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 清除错误信息
  const clearError = () => {
    error.value = null
  }

  // 重置设备状态
  const resetDevices = () => {
    devices.value = []
    error.value = null
  }

  return {
    // 状态
    devices,
    isLoading,
    error,
    
    // 方法
    getDevices,
    registerDevice,
    deleteDevice,
    clearError,
    resetDevices
  }
} 