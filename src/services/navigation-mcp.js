// Navigation MCP服务 - 基于 @cloudflare/playwright-mcp
import { API_BASE_URL } from './config.js'

class NavigationMcpService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.isConnected = false
    this.currentPath = '/'
    this.navigationHistory = []
    this.router = null
  }

  // 设置Vue Router实例
  setRouter(router) {
    this.router = router
    this.currentPath = router.currentRoute.value.path
    console.log('🚀 Navigation MCP服务已设置Vue Router:', this.currentPath)
  }

  // 初始化Navigation MCP服务
  async initialize() {
    try {
      console.log('🚀 初始化Navigation MCP服务...')
      
      // 检查是否有Vue Router
      if (!this.router) {
        console.warn('⚠️ Vue Router未设置，导航功能将受限')
      }
      
      this.isConnected = true
      return {
        success: true,
        status: 'connected',
        message: 'Navigation MCP服务已初始化'
      }
    } catch (error) {
      console.error('Navigation MCP服务初始化失败:', error)
      this.isConnected = false
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 跳转到指定路径
  async navigateTo(path) {
    try {
      console.log(`🌐 导航到: ${path}`)
      
      // 记录导航历史
      this.navigationHistory.push({
        from: this.currentPath,
        to: path,
        timestamp: new Date().toISOString()
      })
      
      // 更新当前路径
      this.currentPath = path
      
      // 使用Vue Router进行实际导航
      if (this.router) {
        try {
          console.log(`🚀 使用Vue Router导航到: ${path}`)
          await this.router.push(path)
          console.log(`✅ 成功导航到: ${path}`)
          
          return {
            success: true,
            path: path,
            message: `已成功跳转到 ${path}`,
            timestamp: new Date().toISOString()
          }
        } catch (routerError) {
          console.error('❌ Vue Router导航失败:', routerError)
          // 降级到window.location
          console.log('🔄 降级到window.location导航')
          return await this.fallbackNavigation(path)
        }
      } else {
        // 如果没有Vue Router，使用window.location
        console.log('🔄 使用window.location导航')
        return await this.fallbackNavigation(path)
      }
    } catch (error) {
      console.error('❌ 导航失败:', error)
      return {
        success: false,
        error: error.message,
        path: path
      }
    }
  }

  // 降级导航方法
  async fallbackNavigation(path) {
    try {
      console.log(`🚀 使用window.location导航到: ${path}`)
      window.location.href = path
      return {
        success: true,
        path: path,
        message: `已成功跳转到 ${path}`,
        timestamp: new Date().toISOString(),
        method: 'window.location'
      }
    } catch (locationError) {
      console.error('❌ window.location导航失败:', locationError)
      return {
        success: false,
        error: `页面导航失败: ${locationError.message}`,
        path: path
      }
    }
  }

  // 返回上一页
  async goBack() {
    try {
      if (this.navigationHistory.length === 0) {
        return {
          success: false,
          error: '没有导航历史记录'
        }
      }

      const lastNavigation = this.navigationHistory.pop()
      const previousPath = lastNavigation.from
      
      console.log(`🔙 返回上一页: ${previousPath}`)
      
      return await this.navigateTo(previousPath)
    } catch (error) {
      console.error('返回上一页失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 刷新当前页面
  async refresh() {
    try {
      console.log(`🔄 刷新当前页面: ${this.currentPath}`)
      
      if (this.router) {
        // 使用Vue Router刷新
        const currentRoute = this.router.currentRoute.value
        await this.router.replace({
          path: currentRoute.path,
          query: currentRoute.query,
          hash: currentRoute.hash
        })
      } else {
        // 使用window.location刷新
        window.location.reload()
      }
      
      return {
        success: true,
        path: this.currentPath,
        message: '页面已刷新',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('刷新页面失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // 获取当前路径
  getCurrentPath() {
    if (this.router) {
      return this.router.currentRoute.value.path
    }
    return this.currentPath
  }

  // 获取导航历史
  getNavigationHistory() {
    return [...this.navigationHistory]
  }

  // 清除导航历史
  clearNavigationHistory() {
    this.navigationHistory = []
    return {
      success: true,
      message: '导航历史已清除'
    }
  }

  // 获取服务状态
  getStatus() {
    return {
      connected: this.isConnected,
      currentPath: this.getCurrentPath(),
      historyCount: this.navigationHistory.length,
      hasRouter: !!this.router,
      service: 'navigation-mcp'
    }
  }
}

// 创建单例实例
const navigationMcpService = new NavigationMcpService()

export default navigationMcpService
