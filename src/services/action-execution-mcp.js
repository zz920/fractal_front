// Action Execution MCP服务 - 基于 @adalovu/mcp-playwright
import { API_BASE_URL } from './config.js'

class ActionExecutionMcpService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.isConnected = false
    this.currentSession = null
    this.actionQueue = []
    this.executionHistory = []
  }

  // 初始化Action Execution MCP服务
  async initialize() {
    try {
      console.log('🚀 初始化Action Execution MCP服务...')
      
      // 检查服务连接
      const response = await fetch(`${this.baseURL}/api/action/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      })
      
      this.isConnected = response.ok
      return {
        success: this.isConnected,
        status: this.isConnected ? 'connected' : 'disconnected'
      }
    } catch (error) {
      console.error('Action Execution MCP服务初始化失败:', error)
      this.isConnected = false
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 创建执行会话
  async createSession(sessionConfig = {}) {
    try {
      console.log('🎭 创建执行会话...')
      
      const response = await fetch(`${this.baseURL}/api/action/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          config: {
            headless: sessionConfig.headless || false,
            timeout: sessionConfig.timeout || 30000,
            viewport: sessionConfig.viewport || { width: 1280, height: 720 },
            ...sessionConfig
          },
          timestamp: new Date().toISOString()
        }),
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      this.currentSession = data.sessionId
      
      return {
        success: true,
        sessionId: data.sessionId,
        message: '执行会话已创建'
      }
    } catch (error) {
      console.error('创建执行会话失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 执行动作
  async executeAction(action) {
    try {
      console.log(`⚡ 执行动作: ${action.type}`)
      
      // 添加到执行历史
      this.executionHistory.push({
        action: action,
        timestamp: new Date().toISOString(),
        status: 'pending'
      })
      
      const response = await fetch(`${this.baseURL}/api/action/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sessionId: this.currentSession,
          action: action,
          timestamp: new Date().toISOString()
        }),
        signal: AbortSignal.timeout(30000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // 更新执行历史
      const lastHistory = this.executionHistory[this.executionHistory.length - 1]
      lastHistory.status = 'completed'
      lastHistory.result = data
      
      return {
        success: true,
        action: action.type,
        result: data,
        message: `动作 ${action.type} 执行成功`
      }
    } catch (error) {
      console.error('执行动作失败:', error)
      
      // 更新执行历史
      const lastHistory = this.executionHistory[this.executionHistory.length - 1]
      lastHistory.status = 'failed'
      lastHistory.error = error.message
      
      return {
        success: false,
        action: action.type,
        error: error.message
      }
    }
  }

  // 执行导航动作
  async executeNavigation(navigationAction) {
    const action = {
      type: 'navigation',
      data: navigationAction,
      timestamp: new Date().toISOString()
    }
    
    return await this.executeAction(action)
  }

  // 执行点击动作
  async executeClick(selector, options = {}) {
    const action = {
      type: 'click',
      data: {
        selector: selector,
        options: {
          timeout: options.timeout || 5000,
          force: options.force || false,
          ...options
        }
      },
      timestamp: new Date().toISOString()
    }
    
    return await this.executeAction(action)
  }

  // 执行输入动作
  async executeInput(selector, text, options = {}) {
    const action = {
      type: 'input',
      data: {
        selector: selector,
        text: text,
        options: {
          timeout: options.timeout || 5000,
          clear: options.clear || true,
          ...options
        }
      },
      timestamp: new Date().toISOString()
    }
    
    return await this.executeAction(action)
  }

  // 执行截图动作
  async executeScreenshot(options = {}) {
    const action = {
      type: 'screenshot',
      data: {
        options: {
          fullPage: options.fullPage || false,
          path: options.path || null,
          quality: options.quality || 80,
          ...options
        }
      },
      timestamp: new Date().toISOString()
    }
    
    return await this.executeAction(action)
  }

  // 执行内容提取动作
  async executeExtract(selector, options = {}) {
    const action = {
      type: 'extract',
      data: {
        selector: selector,
        options: {
          text: options.text || true,
          html: options.html || false,
          attributes: options.attributes || [],
          ...options
        }
      },
      timestamp: new Date().toISOString()
    }
    
    return await this.executeAction(action)
  }

  // 执行观察动作
  async executeObserve(selector, options = {}) {
    const action = {
      type: 'observe',
      data: {
        selector: selector,
        options: {
          timeout: options.timeout || 10000,
          visible: options.visible || true,
          ...options
        }
      },
      timestamp: new Date().toISOString()
    }
    
    return await this.executeAction(action)
  }

  // 批量执行动作
  async executeBatch(actions) {
    try {
      console.log(`📦 批量执行 ${actions.length} 个动作...`)
      
      const results = []
      for (const action of actions) {
        const result = await this.executeAction(action)
        results.push(result)
        
        // 如果某个动作失败，可以选择停止或继续
        if (!result.success && action.critical) {
          break
        }
      }
      
      return {
        success: results.every(r => r.success),
        results: results,
        message: `批量执行完成，成功: ${results.filter(r => r.success).length}/${results.length}`
      }
    } catch (error) {
      console.error('批量执行失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 获取执行状态
  async getExecutionStatus() {
    try {
      const response = await fetch(`${this.baseURL}/api/action/status`, {
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
      return {
        success: true,
        status: data.status,
        sessionId: this.currentSession,
        queueLength: this.actionQueue.length,
        historyLength: this.executionHistory.length
      }
    } catch (error) {
      console.error('获取执行状态失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 停止执行会话
  async stopSession() {
    try {
      if (!this.currentSession) {
        return {
          success: false,
          error: '没有活动的执行会话'
        }
      }
      
      console.log('🛑 停止执行会话...')
      
      const response = await fetch(`${this.baseURL}/api/action/session/${this.currentSession}`, {
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

      this.currentSession = null
      
      return {
        success: true,
        message: '执行会话已停止'
      }
    } catch (error) {
      console.error('停止执行会话失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 获取执行历史
  getExecutionHistory() {
    return [...this.executionHistory]
  }

  // 清除执行历史
  clearExecutionHistory() {
    this.executionHistory = []
    return {
      success: true,
      message: '执行历史已清除'
    }
  }

  // 获取服务状态
  getStatus() {
    return {
      connected: this.isConnected,
      sessionId: this.currentSession,
      queueLength: this.actionQueue.length,
      historyLength: this.executionHistory.length,
      service: 'action-execution-mcp'
    }
  }
}

// 创建单例实例
const actionExecutionMcpService = new ActionExecutionMcpService()

export default actionExecutionMcpService
