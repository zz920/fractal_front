// MCP协调器 - 智能消息路由和意图分析
import deepseekV3Service from './deepseek-v3.js'
import browserbaseMcpService from './browserbase-mcp.js'
import navigationMcpService from './navigation-mcp.js'
import intentRecognitionMcpService from './intent-recognition-mcp.js'
import actionExecutionMcpService from './action-execution-mcp.js'
import contextManagementMcpService from './context-management-mcp.js'

class McpCoordinator {
  constructor() {
    this.services = {
      deepseekV3: deepseekV3Service,
      browserbase: browserbaseMcpService,
      navigation: navigationMcpService,
      intentRecognition: intentRecognitionMcpService,
      actionExecution: actionExecutionMcpService,
      contextManagement: contextManagementMcpService
    }
    this.isInitialized = false
    this.currentContext = null
    this.router = null
  }

  // 设置Vue Router
  setRouter(router) {
    this.router = router
    // 设置Navigation MCP服务的Router
    if (this.services.navigation && this.services.navigation.setRouter) {
      this.services.navigation.setRouter(router)
    }
    console.log('🚀 MCP协调器已设置Vue Router')
  }

  // 初始化所有MCP服务
  async initialize() {
    try {
      console.log('🚀 初始化MCP协调器...')
      
      const initResults = {}
      let successCount = 0
      let totalServices = Object.keys(this.services).length
      
      // 初始化各个服务
      for (const [name, service] of Object.entries(this.services)) {
        try {
          console.log(`🔧 初始化 ${name} 服务...`)
          let result
          
          // 检查服务是否有initialize方法
          if (typeof service.initialize === 'function') {
            result = await service.initialize()
          } else {
            console.log(`⚠️ ${name} 服务没有initialize方法，跳过初始化`)
            result = { success: true, status: 'no-initialize-method' }
          }
          
          initResults[name] = result
          if (result.success) {
            successCount++
            console.log(`✅ ${name} 服务初始化成功`)
          } else {
            console.warn(`⚠️ ${name} 服务初始化失败:`, result.error || '未知错误')
          }
        } catch (error) {
          console.error(`❌ ${name} 服务初始化失败:`, error)
          initResults[name] = { success: false, error: error.message }
        }
      }
      
      // 初始化上下文管理
      try {
        await this.initializeContext()
      } catch (error) {
        console.warn('⚠️ 上下文初始化失败:', error)
      }
      
      this.isInitialized = successCount > 0
      console.log(`✅ MCP协调器初始化完成 (${successCount}/${totalServices} 服务成功)`)
      
      return {
        success: this.isInitialized,
        services: initResults,
        message: `MCP协调器初始化完成 (${successCount}/${totalServices} 服务成功)`,
        successCount,
        totalServices
      }
    } catch (error) {
      console.error('❌ MCP协调器初始化失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 初始化上下文
  async initializeContext() {
    try {
      console.log('📝 初始化上下文...')
      
      // 检查contextManagement服务是否存在且有createContext方法
      if (this.services.contextManagement && typeof this.services.contextManagement.createContext === 'function') {
        // 创建初始上下文
        const contextResult = await this.services.contextManagement.createContext({
          type: 'session',
          data: {
            sessionStart: new Date().toISOString(),
            services: Object.keys(this.services),
            userAgent: navigator.userAgent
          }
        })
        
        if (contextResult.success) {
          this.currentContext = contextResult.context
          console.log('📝 会话上下文已创建:', contextResult.contextId)
        } else {
          console.warn('上下文创建失败:', contextResult.error)
        }
      } else {
        console.warn('contextManagement服务不可用，跳过上下文初始化')
      }
    } catch (error) {
      console.error('初始化上下文失败:', error)
    }
  }

  // 处理用户消息
  async processMessage(message, options = {}) {
    try {
      console.log(`🤖 处理消息: ${message}`)
      
      // 更新上下文
      try {
        await this.updateContext({
          lastMessage: message,
          timestamp: new Date().toISOString()
        })
      } catch (contextError) {
        console.warn('⚠️ 更新上下文失败:', contextError)
      }
      
      // 分析意图
      let intentResult
      try {
        intentResult = await this.services.intentRecognition.analyzeIntent(message)
      } catch (error) {
        console.error('❌ 意图分析失败:', error)
        // 降级到基础AI对话
        return await this.handleGeneralQuery(message)
      }
      
      if (!intentResult || !intentResult.success) {
        console.warn('⚠️ 意图分析失败，降级到基础AI对话:', intentResult?.error || '未知错误')
        return await this.handleGeneralQuery(message)
      }
      
      console.log(`🎯 识别意图: ${intentResult.intent} (置信度: ${intentResult.confidence})`)
      
      // 根据意图路由到相应服务
      let result
      try {
        switch (intentResult.intent) {
          case 'navigation':
            result = await this.handleNavigation(intentResult, message)
            break
          case 'action':
            result = await this.handleAction(intentResult, message)
            break
          case 'query':
            result = await this.handleQuery(intentResult, message)
            break
          case 'help':
            result = await this.handleHelp(message)
            break
          default:
            result = await this.handleGeneralQuery(message)
        }
      } catch (error) {
        console.error('❌ 处理意图失败:', error)
        result = await this.handleGeneralQuery(message)
      }
      
      // 更新上下文
      try {
        await this.updateContext({
          lastIntent: intentResult.intent,
          lastAction: result,
          timestamp: new Date().toISOString()
        })
      } catch (contextError) {
        console.warn('⚠️ 更新上下文失败:', contextError)
      }
      
      return {
        success: true,
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        action: intentResult.action,
        result: result,
        context: this.currentContext?.id
      }
    } catch (error) {
      console.error('❌ 处理消息失败:', error)
      // 尝试降级到基础AI对话
      try {
        const fallbackResult = await this.handleGeneralQuery(message)
        return {
          success: true,
          intent: 'ai_chat',
          confidence: 0.5,
          result: fallbackResult,
          error: error.message
        }
      } catch (fallbackError) {
        console.error('❌ 降级处理也失败:', fallbackError)
        return {
          success: false,
          error: error.message,
          fallbackError: fallbackError.message
        }
      }
    }
  }

  // 处理导航意图
  async handleNavigation(intentResult, message) {
    try {
      console.log('🧭 处理导航意图...')
      console.log('意图结果:', intentResult)
      
      const action = intentResult.action
      if (!action) {
        console.error('未找到导航动作')
        return {
          success: false,
          error: '未找到导航动作'
        }
      }
      
      console.log('导航动作:', action)
      
      let result
      switch (action.type) {
        case 'navigate':
          console.log(`🚀 执行导航到: ${action.path}`)
          result = await this.services.navigation.navigateTo(action.path)
          break
        case 'go_back':
          console.log('🔙 执行返回操作')
          result = await this.services.navigation.goBack()
          break
        case 'refresh':
          console.log('🔄 执行刷新操作')
          result = await this.services.navigation.refresh()
          break
        default:
          console.log('📍 默认导航到首页')
          result = await this.services.navigation.navigateTo('/home')
      }
      
      console.log('导航结果:', result)
      
      return {
        type: 'navigation',
        success: result.success,
        data: result,
        message: result.message || `导航到 ${action.path || '目标页面'}`
      }
    } catch (error) {
      console.error('处理导航失败:', error)
      return {
        type: 'navigation',
        success: false,
        error: error.message
      }
    }
  }

  // 处理操作意图
  async handleAction(intentResult, message) {
    try {
      console.log('⚡ 处理操作意图...')
      
      const action = intentResult.action
      if (!action) {
        return {
          success: false,
          error: '未找到操作动作'
        }
      }
      
      let result
      switch (action.type) {
        case 'screenshot':
          result = await this.services.actionExecution.executeScreenshot()
          break
        case 'extract_content':
          result = await this.services.actionExecution.executeExtract('body')
          break
        case 'observe_elements':
          result = await this.services.actionExecution.executeObserve('body')
          break
        default:
          result = await this.services.actionExecution.executeAction(action)
      }
      
      return {
        type: 'action',
        success: result.success,
        data: result,
        message: result.message || `执行操作 ${action.type}`
      }
    } catch (error) {
      console.error('处理操作失败:', error)
      return {
        type: 'action',
        success: false,
        error: error.message
      }
    }
  }

  // 处理查询意图
  async handleQuery(intentResult, message) {
    try {
      console.log('🔍 处理查询意图...')
      
      const action = intentResult.action
      if (!action) {
        return {
          success: false,
          error: '未找到查询动作'
        }
      }
      
      let result
      switch (action.type) {
        case 'query_status':
          result = await this.getSystemStatus()
          break
        case 'query_info':
          result = await this.getSystemInfo()
          break
        default:
          result = await this.handleGeneralQuery(message)
      }
      
      return {
        type: 'query',
        success: result.success,
        data: result,
        message: result.message || '查询完成'
      }
    } catch (error) {
      console.error('处理查询失败:', error)
      return {
        type: 'query',
        success: false,
        error: error.message
      }
    }
  }

  // 处理帮助意图
  async handleHelp(message) {
    try {
      console.log('❓ 处理帮助意图...')
      
      const helpText = `
🤖 **MCP协调器帮助**

**支持的导航命令:**
- "帮我跳转到首页" - 跳转到首页
- "打开语音模拟器" - 跳转到语音模拟器
- "进入设置页面" - 跳转到设置页面
- "返回上一页" - 返回上一页
- "刷新页面" - 刷新当前页面

**支持的操作命令:**
- "截图" - 截取当前页面
- "提取内容" - 提取页面内容
- "观察元素" - 观察页面元素

**支持的查询命令:**
- "系统状态" - 查看系统状态
- "系统信息" - 查看系统信息

**其他功能:**
- 支持自然语言对话
- 智能意图识别
- 上下文管理
- 多服务协调

💡 **提示:** 你可以用自然语言描述你的需求，AI会智能理解并执行相应操作。
      `
      
      return {
        type: 'help',
        success: true,
        data: { helpText },
        message: '帮助信息已显示'
      }
    } catch (error) {
      console.error('处理帮助失败:', error)
      return {
        type: 'help',
        success: false,
        error: error.message
      }
    }
  }

  // 处理一般查询（AI对话）
  async handleGeneralQuery(message) {
    try {
      console.log('💬 处理一般查询...')
      
      const result = await this.services.deepseekV3.sendMessage(message)
      
      return {
        type: 'ai_chat',
        success: result.success,
        data: result,
        message: result.response || 'AI回复已生成'
      }
    } catch (error) {
      console.error('处理一般查询失败:', error)
      return {
        type: 'ai_chat',
        success: false,
        error: error.message
      }
    }
  }

  // 获取系统状态
  async getSystemStatus() {
    try {
      const status = {}
      
      for (const [name, service] of Object.entries(this.services)) {
        status[name] = service.getStatus()
      }
      
      return {
        success: true,
        status: status,
        message: '系统状态已获取'
      }
    } catch (error) {
      console.error('获取系统状态失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 获取系统信息
  async getSystemInfo() {
    try {
      const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        timestamp: new Date().toISOString(),
        services: Object.keys(this.services),
        context: this.currentContext?.id,
        currentPath: this.router ? this.router.currentRoute.value.path : '/'
      }
      
      return {
        success: true,
        info: info,
        message: '系统信息已获取'
      }
    } catch (error) {
      console.error('获取系统信息失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 更新上下文
  async updateContext(updates) {
    try {
      if (this.currentContext && this.services.contextManagement && typeof this.services.contextManagement.updateContext === 'function') {
        await this.services.contextManagement.updateContext(this.currentContext.id, updates)
      } else {
        console.warn('上下文更新服务不可用，跳过更新')
      }
    } catch (error) {
      console.error('更新上下文失败:', error)
    }
  }

  // 获取协调器状态
  getStatus() {
    const serviceStatuses = {}
    
    // 获取各个服务的状态
    for (const [name, service] of Object.entries(this.services)) {
      try {
        if (typeof service.getStatus === 'function') {
          serviceStatuses[name] = service.getStatus()
        } else {
          serviceStatuses[name] = { status: 'unknown', service: name }
        }
      } catch (error) {
        serviceStatuses[name] = { status: 'error', error: error.message, service: name }
      }
    }
    
    return {
      initialized: this.isInitialized,
      services: Object.keys(this.services),
      serviceStatuses: serviceStatuses,
      currentContext: this.currentContext?.id,
      hasRouter: !!this.router,
      currentPath: this.router ? this.router.currentRoute.value.path : '/',
      service: 'mcp-coordinator'
    }
  }

  // 重置协调器
  async reset() {
    try {
      console.log('🔄 重置MCP协调器...')
      
      this.isInitialized = false
      this.currentContext = null
      
      // 重置各个服务
      for (const [name, service] of Object.entries(this.services)) {
        try {
          if (typeof service.reset === 'function') {
            await service.reset()
            console.log(`✅ ${name} 服务已重置`)
          } else {
            console.log(`⚠️ ${name} 服务没有reset方法，跳过重置`)
          }
        } catch (error) {
          console.error(`❌ ${name} 服务重置失败:`, error)
        }
      }
      
      return {
        success: true,
        message: 'MCP协调器已重置'
      }
    } catch (error) {
      console.error('重置MCP协调器失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// 创建单例实例
const mcpCoordinator = new McpCoordinator()

export default mcpCoordinator
