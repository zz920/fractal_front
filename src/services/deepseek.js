// DeepSeek V3 AI服务
import { API_BASE_URL } from './config.js'
import deepseekMockService from './deepseek-mock.js'

class DeepSeekService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.apiKey = null
    this.conversationHistory = []
    this.isConnected = false
    this.useMock = import.meta.env.DEV // 开发环境使用模拟服务
  }

  // 设置API密钥
  setApiKey(apiKey) {
    this.apiKey = apiKey
    localStorage.setItem('deepseek_api_key', apiKey)
  }

  // 获取API密钥
  getApiKey() {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('deepseek_api_key')
    }
    return this.apiKey
  }

  // 检查连接状态
  async checkConnection() {
    if (this.useMock) {
      return await deepseekMockService.checkConnection()
    }

    try {
      const response = await fetch(`${this.baseURL}/api/deepseek/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      })
      
      this.isConnected = response.ok
      return this.isConnected
    } catch (error) {
      console.error('DeepSeek连接检查失败:', error)
      this.isConnected = false
      return false
    }
  }

  // 发送消息到DeepSeek V3
  async sendMessage(message, options = {}) {
    if (this.useMock) {
      return await deepseekMockService.sendMessage(message, options)
    }

    try {
      const apiKey = this.getApiKey()
      if (!apiKey) {
        console.warn('⚠️ DeepSeek API密钥未设置，降级到模拟服务')
        return await deepseekMockService.sendMessage(message, options)
      }

      const requestBody = {
        messages: [
          ...this.conversationHistory,
          {
            role: 'user',
            content: message
          }
        ],
        model: 'deepseek-chat',
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
        stream: false
      }

      const response = await fetch(`${this.baseURL}/api/deepseek/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(30000)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // 保存对话历史
      this.conversationHistory.push({
        role: 'user',
        content: message
      })
      
      this.conversationHistory.push({
        role: 'assistant',
        content: data.choices[0].message.content
      })
      
      return {
        success: true,
        response: data.choices[0].message.content,
        usage: data.usage,
        conversationId: data.id
      }
    } catch (error) {
      console.error('❌ DeepSeek API调用失败:', error)
      console.log('🔄 降级到模拟服务')
      
      // 降级到模拟服务
      try {
        return await deepseekMockService.sendMessage(message, options)
      } catch (mockError) {
        console.error('❌ 模拟服务也失败:', mockError)
        return {
          success: false,
          error: `API调用失败: ${error.message}`,
          fallbackError: mockError.message
        }
      }
    }
  }

  // 清空对话历史
  clearHistory() {
    this.conversationHistory = []
    if (this.useMock) {
      deepseekMockService.clearHistory()
    }
  }

  // 获取对话历史
  getHistory() {
    if (this.useMock) {
      return deepseekMockService.getHistory()
    }
    return [...this.conversationHistory]
  }

  // 设置对话历史
  setHistory(history) {
    this.conversationHistory = [...history]
    if (this.useMock) {
      deepseekMockService.setHistory(history)
    }
  }

  // 获取对话统计
  getConversationStats() {
    if (this.useMock) {
      return deepseekMockService.getConversationStats()
    }

    const userMessages = this.conversationHistory.filter(msg => msg.role === 'user').length
    const assistantMessages = this.conversationHistory.filter(msg => msg.role === 'assistant').length
    
    return {
      totalMessages: this.conversationHistory.length,
      userMessages,
      assistantMessages
    }
  }

  // 测试API连接
  async testApiConnection() {
    if (this.useMock) {
      return await deepseekMockService.testApiConnection()
    }

    try {
      const apiKey = this.getApiKey()
      if (!apiKey) {
        return {
          success: false,
          error: 'API密钥未设置'
        }
      }

      const response = await fetch(`${this.baseURL}/api/deepseek/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          message: 'Hello, this is a test message.'
        }),
        signal: AbortSignal.timeout(10000)
      })

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          response: data.response || '连接测试成功',
          latency: data.latency || null
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || `HTTP ${response.status}`
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// 创建单例实例
const deepseekService = new DeepSeekService()

export default deepseekService
