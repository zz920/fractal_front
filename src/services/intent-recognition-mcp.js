// Intent Recognition MCP服务 - 基于 @chirag127/clear-thought-mcp-server
import { API_BASE_URL } from './config.js'

class IntentRecognitionMcpService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.isConnected = false
    this.useLocalMode = import.meta.env.DEV || false
    this.intentPatterns = {
      navigation: [
        '跳转', '首页', '打开', '返回', '去', '到', '访问', '进入', '帮我', '跳转到',
        'navigate', 'go to', 'open', 'back', 'home', 'visit', 'enter', 'help me'
      ],
      action: [
        '执行', '操作', '运行', '启动', '开始', '停止', '暂停', '截图', '提取', '观察',
        'execute', 'run', 'start', 'stop', 'pause', 'action', 'screenshot', 'extract', 'observe'
      ],
      query: [
        '查询', '搜索', '查找', '获取', '显示', '查看', '了解', '状态', '信息',
        'query', 'search', 'find', 'get', 'show', 'view', 'check', 'status', 'info'
      ],
      help: [
        '帮助', '说明', '教程', '指南', '怎么', '如何', '什么',
        'help', 'guide', 'tutorial', 'how', 'what', 'explain'
      ]
    }
  }

  // 初始化Intent Recognition MCP服务
  async initialize() {
    try {
      console.log('🚀 初始化Intent Recognition MCP服务...')
      
      if (this.useLocalMode) {
        console.log('🔧 使用本地模式进行意图识别')
        this.isConnected = true
        return {
          success: true,
          status: 'connected',
          mode: 'local'
        }
      }
      
      // 检查服务连接
      const response = await fetch(`${this.baseURL}/api/intent/health`, {
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
        status: this.isConnected ? 'connected' : 'disconnected',
        mode: 'remote'
      }
    } catch (error) {
      console.error('Intent Recognition MCP服务初始化失败:', error)
      this.isConnected = false
      return {
        success: false,
        error: error.message,
        mode: 'local'
      }
    }
  }

  // 分析用户意图
  async analyzeIntent(message) {
    try {
      console.log(`🧠 分析意图: ${message}`)
      
      if (this.useLocalMode || !this.isConnected) {
        // 使用本地模式分析
        try {
          return this.localIntentAnalysis(message)
        } catch (error) {
          console.error('❌ 本地意图分析失败:', error)
          // 返回默认结果
          return {
            success: true,
            intent: 'ai_chat',
            confidence: 0.5,
            action: null,
            entities: []
          }
        }
      }
      
      // 调用Intent Recognition MCP服务
      try {
        const response = await fetch(`${this.baseURL}/api/intent/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            message: message,
            timestamp: new Date().toISOString()
          }),
          signal: AbortSignal.timeout(10000)
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        if (data.success) {
          return {
            success: true,
            intent: data.intent || 'ai_chat',
            confidence: data.confidence || 0.5,
            action: data.action || null,
            entities: data.entities || []
          }
        } else {
          throw new Error(data.error || '意图分析失败')
        }
      } catch (error) {
        console.error('❌ 远程意图分析失败:', error)
        // 降级到本地模式
        console.log('🔄 降级到本地意图分析模式')
        return this.localIntentAnalysis(message)
      }
    } catch (error) {
      console.error('❌ 意图分析完全失败:', error)
      // 返回默认结果
      return {
        success: true,
        intent: 'ai_chat',
        confidence: 0.5,
        action: null,
        entities: []
      }
    }
  }

  // 本地意图分析（降级方案）
  localIntentAnalysis(message) {
    try {
      const lowerMessage = message.toLowerCase()
      let bestIntent = { type: 'ai_chat', confidence: 0.5, action: null }
      
      // 检查导航意图（优先级最高）
      if (this.intentPatterns.navigation.some(pattern => lowerMessage.includes(pattern))) {
        bestIntent = {
          type: 'navigation',
          confidence: 0.9,
          action: this.extractNavigationAction(message)
        }
        console.log('🎯 识别为导航意图:', bestIntent)
      }
      // 检查操作意图
      else if (this.intentPatterns.action.some(pattern => lowerMessage.includes(pattern))) {
        bestIntent = {
          type: 'action',
          confidence: 0.8,
          action: this.extractActionAction(message)
        }
        console.log('🎯 识别为操作意图:', bestIntent)
      }
      // 检查查询意图
      else if (this.intentPatterns.query.some(pattern => lowerMessage.includes(pattern))) {
        bestIntent = {
          type: 'query',
          confidence: 0.7,
          action: this.extractQueryAction(message)
        }
        console.log('🎯 识别为查询意图:', bestIntent)
      }
      // 检查帮助意图
      else if (this.intentPatterns.help.some(pattern => lowerMessage.includes(pattern))) {
        bestIntent = {
          type: 'help',
          confidence: 0.8,
          action: 'show_help'
        }
        console.log('🎯 识别为帮助意图:', bestIntent)
      }
      
      return {
        success: true,
        intent: bestIntent.type,
        confidence: bestIntent.confidence,
        action: bestIntent.action,
        entities: this.extractEntities(message)
      }
    } catch (error) {
      console.error('❌ 本地意图分析失败:', error)
      // 返回默认结果
      return {
        success: true,
        intent: 'ai_chat',
        confidence: 0.5,
        action: null,
        entities: []
      }
    }
  }

  // 提取导航动作
  extractNavigationAction(message) {
    const lowerMessage = message.toLowerCase()
    
    console.log('🔍 提取导航动作:', message)
    
    if (lowerMessage.includes('首页') || lowerMessage.includes('home')) {
      console.log('📍 识别为首页导航')
      return { type: 'navigate', path: '/home' }
    }
    if (lowerMessage.includes('语音') || lowerMessage.includes('voice')) {
      console.log('📍 识别为语音模拟器导航')
      return { type: 'navigate', path: '/voice-simulator' }
    }
    if (lowerMessage.includes('设置') || lowerMessage.includes('settings')) {
      console.log('📍 识别为设置页面导航')
      return { type: 'navigate', path: '/voice-settings' }
    }
    if (lowerMessage.includes('设备') || lowerMessage.includes('device')) {
      console.log('📍 识别为设备管理导航')
      return { type: 'navigate', path: '/device-management' }
    }
    if (lowerMessage.includes('mcp') || lowerMessage.includes('功能')) {
      console.log('📍 识别为MCP功能页面导航')
      return { type: 'navigate', path: '/mcp-features' }
    }
    if (lowerMessage.includes('返回') || lowerMessage.includes('back')) {
      console.log('📍 识别为返回操作')
      return { type: 'go_back' }
    }
    if (lowerMessage.includes('刷新') || lowerMessage.includes('refresh')) {
      console.log('📍 识别为刷新操作')
      return { type: 'refresh' }
    }
    
    console.log('📍 默认导航到首页')
    return { type: 'navigate', path: '/home' } // 默认跳转到首页
  }

  // 提取操作动作
  extractActionAction(message) {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('截图') || lowerMessage.includes('screenshot')) {
      return { type: 'screenshot' }
    }
    if (lowerMessage.includes('提取') || lowerMessage.includes('extract')) {
      return { type: 'extract_content' }
    }
    if (lowerMessage.includes('观察') || lowerMessage.includes('observe')) {
      return { type: 'observe_elements' }
    }
    
    return { type: 'unknown' }
  }

  // 提取查询动作
  extractQueryAction(message) {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('状态') || lowerMessage.includes('status')) {
      return { type: 'query_status' }
    }
    if (lowerMessage.includes('信息') || lowerMessage.includes('info')) {
      return { type: 'query_info' }
    }
    
    return { type: 'query_general' }
  }

  // 提取实体
  extractEntities(message) {
    const entities = []
    const lowerMessage = message.toLowerCase()
    
    // 提取路径实体
    const pathMatch = message.match(/['"`]([^'"`]+)['"`]/)
    if (pathMatch) {
      entities.push({
        type: 'path',
        value: pathMatch[1],
        confidence: 0.9
      })
    }
    
    // 提取URL实体
    const urlMatch = message.match(/https?:\/\/[^\s]+/)
    if (urlMatch) {
      entities.push({
        type: 'url',
        value: urlMatch[0],
        confidence: 0.95
      })
    }
    
    return entities
  }

  // 验证操作有效性
  async validateAction(action) {
    try {
      if (this.useLocalMode) {
        return {
          success: true,
          valid: true,
          message: '操作有效'
        }
      }
      
      const response = await fetch(`${this.baseURL}/api/intent/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: action,
          timestamp: new Date().toISOString()
        }),
        signal: AbortSignal.timeout(5000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        valid: data.valid || true,
        message: data.message || '操作有效'
      }
    } catch (error) {
      console.error('操作验证失败:', error)
      return {
        success: false,
        valid: false,
        error: error.message
      }
    }
  }

  // 获取服务状态
  getStatus() {
    return {
      connected: this.isConnected,
      patterns: Object.keys(this.intentPatterns),
      mode: this.useLocalMode ? 'local' : 'remote',
      service: 'intent-recognition-mcp'
    }
  }
}

// 创建单例实例
const intentRecognitionMcpService = new IntentRecognitionMcpService()

export default intentRecognitionMcpService
