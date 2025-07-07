import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuth } from '../services/auth.js'

export const useUserStore = defineStore('user', () => {
  // 使用认证服务
  const {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    checkAuthStatus,
    initAuth,
    clearAuthData
  } = useAuth()

  // 额外的状态管理
  const loginError = ref(null)
  const registerError = ref(null)

  // 登录操作
  const userLogin = async (credentials) => {
    loginError.value = null
    try {
      const userData = await login(credentials)
      return userData
    } catch (err) {
      loginError.value = err.message
      throw err
    }
  }

  // 注册操作
  const userRegister = async (userData) => {
    registerError.value = null
    try {
      const newUser = await register(userData)
      return newUser
    } catch (err) {
      registerError.value = err.message
      throw err
    }
  }

  // 登出操作
  const userLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('登出错误:', err)
      // 即使登出失败，也清除本地数据
      clearAuthData()
    }
  }

  // 初始化用户状态
  const initUserState = async () => {
    try {
      await initAuth()
    } catch (err) {
      console.error('初始化用户状态失败:', err)
    }
  }

  // 刷新用户信息
  const refreshUserInfo = async () => {
    try {
      const userData = await getProfile()
      return userData
    } catch (err) {
      console.error('刷新用户信息失败:', err)
      throw err
    }
  }

  // 更新用户信息
  const updateUserInfo = async (updateData) => {
    try {
      const userData = await updateProfile(updateData)
      return userData
    } catch (err) {
      console.error('更新用户信息失败:', err)
      throw err
    }
  }

  // 检查认证状态
  const checkUserAuthStatus = async () => {
    try {
      const isValid = await checkAuthStatus()
      return isValid
    } catch (err) {
      console.error('检查认证状态失败:', err)
      return false
    }
  }

  // 清除错误信息
  const clearErrors = () => {
    loginError.value = null
    registerError.value = null
  }

  return {
    // 状态
    token,
    user,
    isLoading,
    error,
    loginError,
    registerError,
    
    // 计算属性
    isAuthenticated,
    
    // 方法
    userLogin,
    userRegister,
    userLogout,
    initUserState,
    refreshUserInfo,
    updateUserInfo,
    checkUserAuthStatus,
    clearErrors,
    clearAuthData
  }
}) 