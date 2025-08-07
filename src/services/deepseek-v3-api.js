// DeepSeek-V3 API服务 - 与后端API通信
import { API_BASE_URL, API_ENDPOINTS, DEEPSEEK_V3_CONFIG } from './config.js'
import httpService from './http.js'

class DeepSeekV3ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.endpoints = API_ENDPOINTS.DEEPSEEK_V3
    this.config = DEEPSEEK_V3_CONFIG
  }

  // 检查健康状态
  async checkHealth() {
    try {
      const response = await httpService.get(this.endpoints.HEALTH)
      return {
        success: response.success,
        data: response.data,
        message: response.message || '健康检查完成'
      }
    } catch (error) {
      console.error('DeepSeek-V3健康检查失败:', error)
      return {
        success: false,
        error: error.message,
        message: '健康检查失败'
      }
    }
  }

  // 发送聊天消息
  async sendChatMessage(message, options = {}) {
    try {
      const requestBody = {
        messages: [
          {
            role: 'system',
            content: this.config.SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: message
          }
        ],
        model: this.config.MODEL_NAME,
        temperature: options.temperature || this.config.TEMPERATURE,
        max_tokens: options.max_tokens || this.config.MAX_TOKENS,
        top_p: options.top_p || this.config.TOP_P,
        frequency_penalty: options.frequency_penalty || this.config.FREQUENCY_PENALTY,
        presence_penalty: options.presence_penalty || this.config.PRESENCE_PENALTY,
        stream: false
      }

      const response = await httpService.post(this.endpoints.CHAT, requestBody)

      if (response.success) {
        return {
          success: true,
          response: response.data?.choices?.[0]?.message?.content || response.data?.response || 'AI回复已生成',
          data: response.data,
          message: '消息发送成功'
        }
      } else {
        return {
          success: false,
          error: response.error || '未知错误',
          message: '发送消息失败'
        }
      }
    } catch (error) {
      console.error('DeepSeek-V3 API发送消息失败:', error)
      return {
        success: false,
        error: error.message,
        message: 'API请求失败'
      }
    }
  }

  // 流式发送聊天消息
  async sendChatMessageStream(message, options = {}) {
    try {
      const requestBody = {
        messages: [
          {
            role: 'system',
            content: this.config.SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: message
          }
        ],
        model: this.config.MODEL_NAME,
        temperature: options.temperature || this.config.TEMPERATURE,
        max_tokens: options.max_tokens || this.config.MAX_TOKENS,
        top_p: options.top_p || this.config.TOP_P,
        frequency_penalty: options.frequency_penalty || this.config.FREQUENCY_PENALTY,
        presence_penalty: options.presence_penalty || this.config.PRESENCE_PENALTY,
        stream: true // 启用流式响应
      }

      const response = await httpService.postStream(this.endpoints.STREAM_CHAT, requestBody)

      if (response.success) {
        return {
          success: true,
          stream: response.stream, // 返回可读流
          message: '流式响应已开始'
        }
      } else {
        return {
          success: false,
          error: response.error || '未知错误',
          message: '流式发送消息失败'
        }
      }
    } catch (error) {
      console.error('DeepSeek-V3 API流式发送消息失败:', error)
      return {
        success: false,
        error: error.message,
        message: 'API请求失败'
      }
    }
  }

  // 测试连接
  async testConnection() {
    try {
      const response = await httpService.get(this.endpoints.HEALTH)
      return {
        success: response.success,
        data: response.data,
        message: response.message || '连接测试成功'
      }
    } catch (error) {
      console.error('DeepSeek-V3连接测试失败:', error)
      return {
        success: false,
        error: error.message,
        message: '连接测试失败'
      }
    }
  }

  // 获取模型列表
  async getModels() {
    try {
      const response = await httpService.get(this.endpoints.MODELS)
      return {
        success: response.success,
        data: response.data,
        message: response.message || '获取模型列表成功'
      }
    } catch (error) {
      console.error('DeepSeek-V3获取模型列表失败:', error)
      return {
        success: false,
        error: error.message,
        message: '获取模型列表失败'
      }
    }
  }

  // 获取配置信息
  async getConfig() {
    try {
      const response = await httpService.get(this.endpoints.CONFIG)
      return {
        success: response.success,
        data: response.data,
        message: response.message || '获取配置信息成功'
      }
    } catch (error) {
      console.error('DeepSeek-V3获取配置信息失败:', error)
      return {
        success: false,
        error: error.message,
        message: '获取配置信息失败'
      }
    }
  }
}

// 创建单例实例
const deepseekV3ApiService = new DeepSeekV3ApiService()

export default deepseekV3ApiService
