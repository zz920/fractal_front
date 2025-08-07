// Browserbase MCP服务
import { API_BASE_URL } from './config.js'

class BrowserbaseMcpService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.isConnected = false
    this.sessionId = null
  }

  // 初始化Browserbase服务
  async initialize() {
    try {
      console.log('🚀 初始化Browserbase MCP服务...')
      
      // 检查服务连接
      const response = await fetch(`${this.baseURL}/api/browserbase/health`, {
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
      console.error('Browserbase MCP服务初始化失败:', error)
      this.isConnected = false
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 创建浏览器会话
  async createSession(options = {}) {
    try {
      const response = await fetch(`${this.baseURL}/api/browserbase/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: options.name || 'browser-session',
          browserbaseSessionID: options.browserbaseSessionID || null
        }),
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      this.sessionId = data.sessionId
      
      return {
        success: true,
        sessionId: this.sessionId,
        data: data
      }
    } catch (error) {
      console.error('创建Browserbase会话失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 导航到URL
  async navigate(url, sessionId = this.sessionId) {
    try {
      const response = await fetch(`${this.baseURL}/api/browserbase/navigate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          url: url
        }),
        signal: AbortSignal.timeout(15000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('导航失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 执行操作
  async performAction(action, sessionId = this.sessionId) {
    try {
      const response = await fetch(`${this.baseURL}/api/browserbase/act`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          action: action
        }),
        signal: AbortSignal.timeout(30000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('执行操作失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 提取内容
  async extractContent(instruction, sessionId = this.sessionId) {
    try {
      const response = await fetch(`${this.baseURL}/api/browserbase/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          instruction: instruction
        }),
        signal: AbortSignal.timeout(30000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('提取内容失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 观察页面元素
  async observeElements(instruction, sessionId = this.sessionId) {
    try {
      const response = await fetch(`${this.baseURL}/api/browserbase/observe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          instruction: instruction,
          returnAction: true
        }),
        signal: AbortSignal.timeout(30000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('观察元素失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 截图
  async takeScreenshot(name = 'screenshot', sessionId = this.sessionId) {
    try {
      const response = await fetch(`${this.baseURL}/api/browserbase/screenshot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          name: name
        }),
        signal: AbortSignal.timeout(15000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('截图失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 关闭会话
  async closeSession(sessionId = this.sessionId) {
    try {
      const response = await fetch(`${this.baseURL}/api/browserbase/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId
        }),
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      this.sessionId = null
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('关闭会话失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 获取会话列表
  async getSessionList() {
    try {
      const response = await fetch(`${this.baseURL}/api/browserbase/sessions`, {
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
        sessions: data.sessions || []
      }
    } catch (error) {
      console.error('获取会话列表失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 获取服务状态
  getStatus() {
    return {
      connected: this.isConnected,
      sessionId: this.sessionId,
      service: 'browserbase-mcp'
    }
  }
}

// 创建单例实例
const browserbaseMcpService = new BrowserbaseMcpService()

export default browserbaseMcpService
