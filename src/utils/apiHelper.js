// API助手工具

// 检测可用的API
export const detectAvailableApi = async () => {
  try {
    // 这里应该检测各种API的可用性
    const apis = {
      toneService: true,
      voiceConfig: true,
      deviceManagement: true
    }
    
    return {
      success: true,
      apis
    }
  } catch (error) {
    console.error('检测API可用性失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 显示API状态
export const showApiStatus = (status) => {
  if (status.success) {
    console.log('✅ API状态正常')
    Object.entries(status.apis).forEach(([name, available]) => {
      console.log(`${available ? '✅' : '❌'} ${name}: ${available ? '可用' : '不可用'}`)
    })
  } else {
    console.error('❌ API状态异常:', status.error)
  }
  
  return status
}

// 检查网络连接
export const checkNetworkConnection = async () => {
  try {
    const response = await fetch('/api/health', { 
      method: 'HEAD',
      timeout: 5000 
    })
    return response.ok
  } catch (error) {
    console.error('网络连接检查失败:', error)
    return false
  }
}

// API错误处理
export const handleApiError = (error, context = '') => {
  console.error(`API错误 [${context}]:`, error)
  
  if (error.response) {
    // 服务器响应错误
    const { status, data } = error.response
    switch (status) {
      case 401:
        return '身份验证失败，请重新登录'
      case 403:
        return '权限不足，无法执行此操作'
      case 404:
        return '请求的资源不存在'
      case 500:
        return '服务器内部错误，请稍后重试'
      default:
        return `请求失败 (${status}): ${data?.message || '未知错误'}`
    }
  } else if (error.request) {
    // 网络请求错误
    return '网络连接失败，请检查网络设置'
  } else {
    // 其他错误
    return error.message || '操作失败，请重试'
  }
}
