// Context Management MCP服务 - 基于 @upstash/context7-mcp
import { API_BASE_URL } from './config.js'

class ContextManagementMcpService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.isConnected = false
    this.currentContext = null
    this.contextHistory = []
    this.userPreferences = {}
    this.sessionData = {}
  }

  // 初始化Context Management MCP服务
  async initialize() {
    try {
      console.log('🚀 初始化Context Management MCP服务...')
      
      // 检查服务连接
      const response = await fetch(`${this.baseURL}/api/context/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      })
      
      this.isConnected = response.ok
      
      // 加载本地存储的上下文数据
      await this.loadLocalContext()
      
      return {
        success: this.isConnected,
        status: this.isConnected ? 'connected' : 'disconnected'
      }
    } catch (error) {
      console.error('Context Management MCP服务初始化失败:', error)
      this.isConnected = false
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 创建新上下文
  async createContext(contextData = {}) {
    try {
      console.log('📝 创建新上下文...')
      
      const context = {
        id: this.generateContextId(),
        type: contextData.type || 'general',
        data: contextData.data || {},
        metadata: {
          created: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          version: '1.0',
          ...contextData.metadata
        },
        sessionId: contextData.sessionId || this.getCurrentSessionId()
      }
      
      // 调用Context Management MCP服务
      const response = await fetch(`${this.baseURL}/api/context/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          context: context,
          timestamp: new Date().toISOString()
        }),
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // 更新当前上下文
      this.currentContext = context
      this.contextHistory.push(context)
      
      // 保存到本地存储
      this.saveLocalContext()
      
      return {
        success: true,
        contextId: context.id,
        context: context,
        message: '上下文已创建'
      }
    } catch (error) {
      console.error('创建上下文失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 更新上下文
  async updateContext(contextId, updates) {
    try {
      console.log(`🔄 更新上下文: ${contextId}`)
      
      if (!this.currentContext || this.currentContext.id !== contextId) {
        return {
          success: false,
          error: '上下文不存在或不是当前上下文'
        }
      }
      
      // 更新上下文数据
      this.currentContext.data = {
        ...this.currentContext.data,
        ...updates
      }
      this.currentContext.metadata.lastModified = new Date().toISOString()
      
      // 调用Context Management MCP服务
      const response = await fetch(`${this.baseURL}/api/context/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          contextId: contextId,
          updates: updates,
          timestamp: new Date().toISOString()
        }),
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // 更新历史记录
      const historyIndex = this.contextHistory.findIndex(ctx => ctx.id === contextId)
      if (historyIndex !== -1) {
        this.contextHistory[historyIndex] = { ...this.currentContext }
      }
      
      // 保存到本地存储
      this.saveLocalContext()
      
      return {
        success: true,
        contextId: contextId,
        context: this.currentContext,
        message: '上下文已更新'
      }
    } catch (error) {
      console.error('更新上下文失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 获取上下文
  async getContext(contextId) {
    try {
      console.log(`📖 获取上下文: ${contextId}`)
      
      // 先从本地查找
      const localContext = this.contextHistory.find(ctx => ctx.id === contextId)
      if (localContext) {
        return {
          success: true,
          context: localContext,
          source: 'local'
        }
      }
      
      // 调用Context Management MCP服务
      const response = await fetch(`${this.baseURL}/api/context/${contextId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // 添加到本地历史
      if (data.context) {
        this.contextHistory.push(data.context)
        this.saveLocalContext()
      }
      
      return {
        success: true,
        context: data.context,
        source: 'remote'
      }
    } catch (error) {
      console.error('获取上下文失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 获取当前上下文
  getCurrentContext() {
    return this.currentContext
  }

  // 设置当前上下文
  setCurrentContext(contextId) {
    const context = this.contextHistory.find(ctx => ctx.id === contextId)
    if (context) {
      this.currentContext = context
      return {
        success: true,
        context: context,
        message: '当前上下文已设置'
      }
    }
    return {
      success: false,
      error: '上下文不存在'
    }
  }

  // 保存用户偏好
  async saveUserPreferences(preferences) {
    try {
      console.log('💾 保存用户偏好...')
      
      this.userPreferences = {
        ...this.userPreferences,
        ...preferences,
        lastUpdated: new Date().toISOString()
      }
      
      // 调用Context Management MCP服务
      const response = await fetch(`${this.baseURL}/api/context/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          preferences: this.userPreferences,
          timestamp: new Date().toISOString()
        }),
        signal: AbortSignal.timeout(5000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 保存到本地存储
      this.saveLocalContext()
      
      return {
        success: true,
        preferences: this.userPreferences,
        message: '用户偏好已保存'
      }
    } catch (error) {
      console.error('保存用户偏好失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 获取用户偏好
  getUserPreferences() {
    return { ...this.userPreferences }
  }

  // 保存会话数据
  async saveSessionData(sessionId, data) {
    try {
      console.log(`💾 保存会话数据: ${sessionId}`)
      
      this.sessionData[sessionId] = {
        ...this.sessionData[sessionId],
        ...data,
        lastUpdated: new Date().toISOString()
      }
      
      // 调用Context Management MCP服务
      const response = await fetch(`${this.baseURL}/api/context/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          data: this.sessionData[sessionId],
          timestamp: new Date().toISOString()
        }),
        signal: AbortSignal.timeout(5000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 保存到本地存储
      this.saveLocalContext()
      
      return {
        success: true,
        sessionId: sessionId,
        data: this.sessionData[sessionId],
        message: '会话数据已保存'
      }
    } catch (error) {
      console.error('保存会话数据失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 获取会话数据
  getSessionData(sessionId) {
    return this.sessionData[sessionId] || {}
  }

  // 清除上下文历史
  async clearContextHistory() {
    try {
      console.log('🗑️ 清除上下文历史...')
      
      this.contextHistory = []
      this.currentContext = null
      
      // 调用Context Management MCP服务
      const response = await fetch(`${this.baseURL}/api/context/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 清除本地存储
      this.saveLocalContext()
      
      return {
        success: true,
        message: '上下文历史已清除'
      }
    } catch (error) {
      console.error('清除上下文历史失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 生成上下文ID
  generateContextId() {
    return `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 获取当前会话ID
  getCurrentSessionId() {
    return sessionStorage.getItem('sessionId') || `session_${Date.now()}`
  }

  // 加载本地上下文
  async loadLocalContext() {
    try {
      const stored = localStorage.getItem('contextManagement')
      if (stored) {
        const data = JSON.parse(stored)
        this.contextHistory = data.contextHistory || []
        this.userPreferences = data.userPreferences || {}
        this.sessionData = data.sessionData || {}
        
        // 恢复当前上下文
        if (data.currentContextId) {
          this.currentContext = this.contextHistory.find(ctx => ctx.id === data.currentContextId)
        }
      }
    } catch (error) {
      console.error('加载本地上下文失败:', error)
    }
  }

  // 保存本地上下文
  saveLocalContext() {
    try {
      const data = {
        contextHistory: this.contextHistory,
        userPreferences: this.userPreferences,
        sessionData: this.sessionData,
        currentContextId: this.currentContext?.id
      }
      localStorage.setItem('contextManagement', JSON.stringify(data))
    } catch (error) {
      console.error('保存本地上下文失败:', error)
    }
  }

  // 获取服务状态
  getStatus() {
    return {
      connected: this.isConnected,
      currentContextId: this.currentContext?.id,
      historyLength: this.contextHistory.length,
      preferencesCount: Object.keys(this.userPreferences).length,
      sessionCount: Object.keys(this.sessionData).length,
      service: 'context-management-mcp'
    }
  }
}

// 创建单例实例
const contextManagementMcpService = new ContextManagementMcpService()

export default contextManagementMcpService
