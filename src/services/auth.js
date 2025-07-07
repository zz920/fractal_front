import { ref, computed } from 'vue'

// 认证相关的响应式状态
const token = ref(localStorage.getItem('auth_token') || '')
const refreshToken = ref(localStorage.getItem('refresh_token') || '')
const user = ref(null)
const isLoading = ref(false)
const error = ref(null)

// 从localStorage恢复用户信息
const storedUser = localStorage.getItem('user_info')
if (storedUser) {
  try {
    user.value = JSON.parse(storedUser)
  } catch (e) {
    console.error('用户信息解析失败:', e)
    localStorage.removeItem('user_info')
  }
}

// 服务器配置 - 与server.js中的配置保持一致
const API_BASE_URL = 'https://bwtest.cpolar.cn:443'

export function useAuth() {
  // 计算属性：是否已登录
  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  // 保存认证信息到localStorage
  const saveAuthData = (tokenData, userData) => {
    token.value = tokenData.token
    user.value = userData
    
    localStorage.setItem('auth_token', tokenData.token)
    localStorage.setItem('user_info', JSON.stringify(userData))
    
    // 如果有refresh token，也保存
    if (tokenData.refresh_token) {
      refreshToken.value = tokenData.refresh_token
      localStorage.setItem('refresh_token', tokenData.refresh_token)
    }
  }

  // 清除认证信息
  const clearAuthData = () => {
    token.value = ''
    refreshToken.value = ''
    user.value = null
    error.value = null
    
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_info')
  }

  // 创建带认证头的请求配置
  const getAuthHeaders = () => {
    const headers = {
      'Content-Type': 'application/json'
    }
    
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }
    
    return headers
  }

  // 处理API响应
  const handleApiResponse = async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.message || `HTTP错误 ${response.status}`
      throw new Error(errorMessage)
    }
    
    return await response.json()
  }

  // 用户注册
  const register = async (userData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_name: userData.username,
          password: userData.password,
          email: userData.email
        })
      })
      
      const result = await handleApiResponse(response)
      
      // 注册成功，返回用户信息
      return result.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 用户登录
  const login = async (credentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_name_or_email: credentials.usernameOrEmail,
          password: credentials.password
        })
      })
      
      const result = await handleApiResponse(response)
      
      // 登录成功，保存认证信息
      const { token: tokenData, user: userData } = result.data
      saveAuthData({ token: tokenData }, userData)
      
      return userData
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 用户登出
  const logout = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // 可以调用后端登出API来使token无效
      // await fetch(`${API_BASE_URL}/api/users/logout`, {
      //   method: 'POST',
      //   headers: getAuthHeaders()
      // })
      
      clearAuthData()
    } catch (err) {
      // 即使后端登出失败，也要清除本地数据
      clearAuthData()
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // 获取用户资料
  const getProfile = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'GET',
        headers: getAuthHeaders()
      })
      
      const result = await handleApiResponse(response)
      
      // 更新用户信息
      user.value = result.data
      localStorage.setItem('user_info', JSON.stringify(result.data))
      
      return result.data
    } catch (err) {
      error.value = err.message
      // 如果是401错误，可能token过期了
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        clearAuthData()
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 更新用户资料
  const updateProfile = async (updateData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          user_name: updateData.username,
          email: updateData.email,
          password: updateData.password
        })
      })
      
      const result = await handleApiResponse(response)
      
      // 更新用户信息
      user.value = result.data
      localStorage.setItem('user_info', JSON.stringify(result.data))
      
      return result.data
    } catch (err) {
      error.value = err.message
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        clearAuthData()
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 检查token是否有效
  const checkAuthStatus = async () => {
    if (!token.value) {
      return false
    }
    
    try {
      await getProfile()
      return true
    } catch (err) {
      // 如果获取用户信息失败，说明token可能无效
      return false
    }
  }

  // 初始化认证状态检查
  const initAuth = async () => {
    if (token.value && !user.value) {
      try {
        await getProfile()
      } catch (err) {
        // 如果获取用户信息失败，清除认证数据
        clearAuthData()
      }
    }
  }

  return {
    // 状态
    token,
    user,
    isLoading,
    error,
    
    // 计算属性
    isAuthenticated,
    
    // 方法
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    checkAuthStatus,
    initAuth,
    clearAuthData,
    getAuthHeaders
  }
} 