// DeepSeek V3 模拟服务 - 用于测试
class DeepSeekMockService {
  constructor() {
    this.conversationHistory = []
    this.isConnected = true
  }

  // 设置API密钥
  setApiKey(apiKey) {
    localStorage.setItem('deepseek_api_key', apiKey)
    return true
  }

  // 获取API密钥
  getApiKey() {
    return localStorage.getItem('deepseek_api_key') || 'mock-api-key'
  }

  // 检查连接状态
  async checkConnection() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true
        resolve(true)
      }, 500)
    })
  }

  // 发送消息到DeepSeek V3（模拟）
  async sendMessage(message, options = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // 模拟AI响应
          const aiResponse = this.generateMockResponse(message)
          
          // 保存对话历史
          this.conversationHistory.push({
            role: 'user',
            content: message
          })
          
          this.conversationHistory.push({
            role: 'assistant',
            content: aiResponse
          })
          
          resolve({
            success: true,
            response: aiResponse,
            usage: {
              prompt_tokens: message.length,
              completion_tokens: aiResponse.length,
              total_tokens: message.length + aiResponse.length
            },
            conversationId: 'mock-conversation-' + Date.now()
          })
        } catch (error) {
          console.error('❌ 模拟响应生成失败:', error)
          // 返回默认响应
          const defaultResponse = '抱歉，我现在无法处理您的请求。请稍后重试。'
          resolve({
            success: true,
            response: defaultResponse,
            usage: {
              prompt_tokens: message.length,
              completion_tokens: defaultResponse.length,
              total_tokens: message.length + defaultResponse.length
            },
            conversationId: 'mock-conversation-' + Date.now(),
            error: error.message
          })
        }
      }, 1000 + Math.random() * 2000) // 模拟1-3秒的响应时间
    })
  }

  // 生成模拟响应
  generateMockResponse(message) {
    try {
      const lowerMessage = message.toLowerCase()
      
      // 检查是否是导航相关查询
      if (lowerMessage.includes('跳转') || lowerMessage.includes('导航') || lowerMessage.includes('打开') || lowerMessage.includes('进入')) {
        return `我理解您想要进行页面导航。作为AI助手，我可以帮助您：

1. **跳转到首页** - 说"帮我跳转到首页"
2. **打开语音模拟器** - 说"打开语音模拟器"
3. **进入设置页面** - 说"进入设置页面"
4. **返回上一页** - 说"返回上一页"
5. **刷新页面** - 说"刷新页面"

请使用这些具体的导航命令，我会帮您执行相应的操作。`
      }
      
      // 检查是否是系统状态查询
      if (lowerMessage.includes('状态') || lowerMessage.includes('系统')) {
        return `系统状态信息：

🖥️ **系统状态**
- 连接状态: ✅ 已连接
- 响应时间: 45ms
- 服务状态: 正常

🤖 **AI服务状态**
- DeepSeek连接: ✅ 已连接
- MCP协调器: ✅ 已就绪
- 意图识别: ✅ 已启用

🌐 **浏览器服务状态**
- Browserbase连接: ✅ 已连接
- 当前会话: 活跃
- 可用功能: 导航、截图、内容提取、元素观察

📊 **系统资源**
- CPU使用率: 25%
- 内存使用率: 45%
- 磁盘使用率: 30%`
      }
      
      // 检查是否是帮助查询
      if (lowerMessage.includes('帮助') || lowerMessage.includes('help') || lowerMessage.includes('怎么') || lowerMessage.includes('如何')) {
        return `🤖 **AI助手帮助**

💡 **支持的导航命令:**
- "帮我跳转到首页" - 跳转到首页
- "打开语音模拟器" - 跳转到语音模拟器
- "进入设置页面" - 跳转到设置页面
- "返回上一页" - 返回上一页
- "刷新页面" - 刷新当前页面

🎯 **支持的操作命令:**
- "截图" - 截取当前页面
- "提取内容" - 提取页面内容
- "观察元素" - 观察页面元素

🔍 **支持的查询命令:**
- "系统状态" - 查看系统状态
- "系统信息" - 查看系统信息

💬 **其他功能:**
- 支持自然语言对话
- 智能意图识别
- 上下文管理
- 多服务协调

有什么我可以帮助您的吗？`
      }
      
      // 默认响应
      return `您好！我是DeepSeek AI助手，很高兴为您服务。

我可以帮助您：
- 进行页面导航和跳转
- 执行各种操作和查询
- 回答问题和提供帮助
- 进行自然语言对话

请告诉我您需要什么帮助，我会尽力协助您！`
    } catch (error) {
      console.error('❌ 模拟响应生成失败:', error)
      return '抱歉，我现在无法处理您的请求。请稍后重试。'
    }
  }

  // 清除对话历史
  clearHistory() {
    this.conversationHistory = []
    return true
  }

  // 获取对话历史
  getHistory() {
    return [...this.conversationHistory]
  }

  // 设置对话历史
  setHistory(history) {
    this.conversationHistory = [...history]
    return true
  }

  // 获取对话统计
  getConversationStats() {
    return {
      totalMessages: this.conversationHistory.length,
      userMessages: this.conversationHistory.filter(msg => msg.role === 'user').length,
      assistantMessages: this.conversationHistory.filter(msg => msg.role === 'assistant').length,
      lastMessageTime: this.conversationHistory.length > 0 ? new Date().toISOString() : null
    }
  }

  // 测试API连接
  async testApiConnection() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Mock服务连接正常',
          timestamp: new Date().toISOString()
        })
      }, 500)
    })
  }
}

// 创建单例实例
const deepseekMockService = new DeepSeekMockService()

export default deepseekMockService
