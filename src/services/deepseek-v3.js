// DeepSeek-V3 AI服务
import { API_BASE_URL, API_ENDPOINTS, DEEPSEEK_V3_CONFIG } from './config.js'
import httpService from './http.js'
import deepseekV3ApiService from './deepseek-v3-api.js'

class DeepSeekV3Service {
  constructor() {
    this.baseURL = API_BASE_URL
    this.endpoints = API_ENDPOINTS.DEEPSEEK_V3
    this.config = DEEPSEEK_V3_CONFIG
    this.conversationHistory = []
    this.isConnected = false
    this.apiKey = null
    this.useMock = import.meta.env.DEV // 开发环境使用模拟服务
    this.apiService = deepseekV3ApiService
  }

  // 设置API密钥
  setApiKey(apiKey) {
    this.apiKey = apiKey
    localStorage.setItem('deepseek_v3_api_key', apiKey)
  }

  // 获取API密钥
  getApiKey() {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('deepseek_v3_api_key')
    }
    return this.apiKey
  }

  // 检查连接状态
  async checkConnection() {
    try {
      const result = await this.apiService.checkHealth()
      this.isConnected = result.success
      return this.isConnected
    } catch (error) {
      console.error('DeepSeek-V3连接检查失败:', error)
      this.isConnected = false
      return false
    }
  }

  // 发送消息到DeepSeek-V3
  async sendMessage(message, options = {}) {
    try {
      const apiKey = this.getApiKey()
      if (!apiKey) {
        throw new Error('API密钥未设置')
      }

      const result = await this.apiService.sendChatMessage(message, options)

      if (result.success) {
        // 保存用户消息到历史
        this.conversationHistory.push({
          role: 'user',
          content: message,
          timestamp: new Date().toISOString()
        })

        // 保存AI回复到历史
        if (result.response) {
          this.conversationHistory.push({
            role: 'assistant',
            content: result.response,
            timestamp: new Date().toISOString()
          })
        }

        return {
          success: true,
          response: result.response || 'AI回复已生成',
          message: result.message || '消息发送成功'
        }
      } else {
        return {
          success: false,
          error: result.error || '未知错误',
          message: '发送消息失败'
        }
      }
    } catch (error) {
      console.error('DeepSeek-V3发送消息失败:', error)
      return {
        success: false,
        error: error.message,
        message: '发送消息失败'
      }
    }
  }

  // 流式发送消息
  async sendMessageStream(message, options = {}) {
    try {
      const apiKey = this.getApiKey()
      if (!apiKey) {
        throw new Error('API密钥未设置')
      }

      const result = await this.apiService.sendChatMessageStream(message, options)

      if (result.success) {
        // 保存用户消息到历史
        this.conversationHistory.push({
          role: 'user',
          content: message,
          timestamp: new Date().toISOString()
        })

        return result
      } else {
        return {
          success: false,
          error: result.error
        }
      }
    } catch (error) {
      console.error('DeepSeek-V3流式发送消息失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 清除对话历史
  clearHistory() {
    this.conversationHistory = []
    console.log('🗑️ DeepSeek-V3对话历史已清除')
  }

  // 获取对话历史
  getHistory() {
    return this.conversationHistory
  }

  // 设置对话历史
  setHistory(history) {
    this.conversationHistory = history || []
  }

  // 获取对话统计信息
  getConversationStats() {
    const userMessages = this.conversationHistory.filter(msg => msg.role === 'user').length
    const assistantMessages = this.conversationHistory.filter(msg => msg.role === 'assistant').length
    const totalMessages = this.conversationHistory.length

    return {
      totalMessages,
      userMessages,
      assistantMessages,
      isConnected: this.isConnected
    }
  }

  // 测试API连接
  async testApiConnection() {
    try {
      const result = await this.apiService.testConnection()
      return result
    } catch (error) {
      console.error('DeepSeek-V3 API连接测试失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 获取服务状态
  async getServiceStatus() {
    try {
      const healthResult = await this.apiService.checkHealth()
      const modelsResult = await this.apiService.getModels()
      const configResult = await this.apiService.getConfig()

      return {
        success: true,
        health: healthResult,
        models: modelsResult,
        config: configResult,
        isConnected: this.isConnected,
        conversationStats: this.getConversationStats()
      }
    } catch (error) {
      console.error('获取DeepSeek-V3服务状态失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// 创建单例实例
const deepseekV3Service = new DeepSeekV3Service()

export default deepseekV3Service
