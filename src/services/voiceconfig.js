import { useAuth } from './auth.js'

// 服务器配置 - 与auth.js保持一致
const API_BASE_URL = 'https://fractal.cpolar.cn:443'

export const useVoiceConfig = () => {
  const { getAuthHeaders, clearAuthData, user } = useAuth()
  
  // 处理API响应
  const handleApiResponse = async (response) => {
    console.log('API响应状态:', response.status)
    console.log('API响应头:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      let errorMessage = `HTTP错误 ${response.status}`
      
      try {
        const errorData = await response.json()
        console.log('错误响应数据:', errorData)
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch (parseError) {
        console.log('无法解析错误响应为JSON，尝试读取文本')
        try {
          const errorText = await response.text()
          console.log('错误响应文本:', errorText)
          errorMessage = errorText || errorMessage
        } catch (textError) {
          console.log('无法读取错误响应文本')
        }
      }
      
      throw new Error(errorMessage)
    }
    
    try {
      const data = await response.json()
      console.log('成功响应数据:', data)
      
      if (data.success === true) {
        return data.data
      } else {
        throw new Error(data.message || data.error || '请求失败')
      }
    } catch (parseError) {
      console.error('解析响应JSON失败:', parseError)
      throw new Error('响应数据格式错误')
    }
  }
  
  // 获取用户配置
  const getUserConfig = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user_config`, {
        headers: getAuthHeaders()
      })
      
      if (response.status === 401) {
        clearAuthData()
        throw new Error('认证失败')
      }
      
      return await handleApiResponse(response)
    } catch (error) {
      console.error('获取用户配置错误:', error)
      throw error
    }
  }
  
  // 选择音色
  const selectVoice = async (voiceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user_config/select_voice`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          user_id: user.value?.user_id,
          voice_id: String(voiceId)
        })
      })
      
      if (response.status === 401) {
        clearAuthData()
        throw new Error('认证失败')
      }
      
      return await handleApiResponse(response)
    } catch (error) {
      console.error('音色选择错误:', error)
      throw error
    }
  }
  
  // 上传语音文件
  const uploadVoiceFile = async (file) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user_config/upload_voice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthHeaders().Authorization?.split(' ')[1]}`,
          'Content-Type': 'audio/wav'
        },
        body: file
      })
      
      if (response.status === 401) {
        clearAuthData()
        throw new Error('认证失败')
      }
      
      return await handleApiResponse(response)
    } catch (error) {
      console.error('语音文件上传错误:', error)
      throw error
    }
  }
  
  // 获取音色列表
  const getVoiceList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user_config/list_voice`, {
        headers: getAuthHeaders()
      })
      
      if (response.status === 401) {
        clearAuthData()
        throw new Error('认证失败')
      }
      
      const data = await handleApiResponse(response)
      return data.voice_list || []
    } catch (error) {
      console.error('获取音色列表错误:', error)
      throw error
    }
  }
  
  // 编辑音色
  const editVoice = async (voiceData) => {
    try {
      console.log('发送编辑音色请求:', voiceData)
      
      const authHeaders = getAuthHeaders()
      console.log('认证头部:', authHeaders)
      
      const response = await fetch(`${API_BASE_URL}/api/user_config/edit_voice`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(voiceData)
      })
      
      console.log('编辑音色响应状态:', response.status)
      console.log('编辑音色响应头:', Object.fromEntries(response.headers.entries()))
      
      if (response.status === 401) {
        clearAuthData()
        throw new Error('认证失败')
      }
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('编辑音色错误响应:', errorText)
        throw new Error(`HTTP错误 ${response.status}: ${errorText}`)
      }
      
      return await handleApiResponse(response)
    } catch (error) {
      console.error('音色编辑错误:', error)
      throw error
    }
  }
  
  // 删除音色
  const deleteVoice = async (voiceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user_config/delete_voice`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id: voiceId
        })
      })
      
      if (response.status === 401) {
        clearAuthData()
        throw new Error('认证失败')
      }
      
      return await handleApiResponse(response)
    } catch (error) {
      console.error('音色删除错误:', error)
      throw error
    }
  }
  
  return {
    getUserConfig,
    selectVoice,
    uploadVoiceFile,
    getVoiceList,
    editVoice,
    deleteVoice
  }
}