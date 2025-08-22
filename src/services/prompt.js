import { useAuth } from './auth.js'

// 服务器配置 - 与auth.js保持一致
const API_BASE_URL = 'https://fractal.cpolar.cn:443'

export const usePrompt = () => {
  const { getAuthHeaders, clearAuthData, user } = useAuth()
  
  // 处理API响应
  const handleApiResponse = async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || `HTTP错误 ${response.status}`
      throw new Error(errorMessage)
    }
    
    const data = await response.json()
    if (data.success === true) {
      return data.data
    } else {
      throw new Error(data.message || '请求失败')
    }
  }
  
  // 获取用户提示词列表
  const getPromptList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user_config/list_prompt`, {
        headers: getAuthHeaders()
      })
      
      if (response.status === 401) {
        clearAuthData()
        throw new Error('认证失败')
      }
      
      const data = await handleApiResponse(response)
      return data.prompt_list || []
    } catch (error) {
      console.error('获取提示词列表错误:', error)
      throw error
    }
  }
  
  // 创建提示词
  const createPrompt = async (title, content) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user_config/create_prompt`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, content })
      })
      
      if (response.status === 401) {
        clearAuthData()
        throw new Error('认证失败')
      }
      
      return await handleApiResponse(response)
    } catch (error) {
      console.error('创建提示词错误:', error)
      throw error
    }
  }
  
  // 编辑提示词
  const editPrompt = async (promptData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user_config/edit_prompt`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(promptData)
      })
      
      if (response.status === 401) {
        clearAuthData()
        throw new Error('认证失败')
      }
      
      return await handleApiResponse(response)
    } catch (error) {
      console.error('编辑提示词错误:', error)
      throw error
    }
  }
  
  // 删除提示词
  const deletePrompt = async (promptId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user_config/delete_prompt`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id: promptId
        })
      })
      
      if (response.status === 401) {
        clearAuthData()
        throw new Error('认证失败')
      }
      
      return await handleApiResponse(response)
    } catch (error) {
      console.error('删除提示词错误:', error)
      throw error
    }
  }
  
  // 选择提示词
  const selectPrompt = async (promptId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user_config/select_prompt`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          user_id: user.value?.user_id,
          prompt_id: String(promptId)
        })
      })
      
      if (response.status === 401) {
        clearAuthData()
        throw new Error('认证失败')
      }
      
      return await handleApiResponse(response)
    } catch (error) {
      console.error('提示词选择错误:', error)
      throw error
    }
  }
  
  // 获取用户配置（包含当前选中的提示词）
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
  
  return {
    getPromptList,
    createPrompt,
    editPrompt,
    deletePrompt,
    selectPrompt,
    getUserConfig
  }
}