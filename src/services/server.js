import { ref, computed } from 'vue'

// 响应式状态
const serverAddress = ref('')
const serverPort = ref('')
const serverStatus = ref('unknown') // unknown, online, offline, error
const serverConfig = ref(null)
const isStatusPolling = ref(false)
const configLoaded = ref(false) // 新增：配置是否已加载
const configSource = ref('none') // 新增：配置来源 (hardcoded, localStorage, none)
let statusPollingInterval = null

export function useServer() {
  // 计算属性：完整的服务器URL
  const serverUrl = computed(() => {
    if (!serverAddress.value || !serverPort.value) return ''
    return `https://${serverAddress.value}:${serverPort.value}`
  })

  // 计算属性：WebSocket URL
  const websocketUrl = computed(() => {
    if (!serverConfig.value?.websocket?.url) return ''
    return serverConfig.value.websocket.url
  })

  // 计算属性：是否有有效配置
  const hasValidConfig = computed(() => {
    return configLoaded.value && serverAddress.value && serverPort.value
  })

  // 硬编码配置加载
  const loadHardcodedConfig = () => {
    // 根据环境设置不同的配置
    const isProduction = window.location.hostname.includes('github.io')
    
    if (isProduction) {
      // 生产环境（GitHub Pages）使用公网地址
      serverAddress.value = 'bwtest.cpolar.cn'
      serverPort.value = 443
    } else {
      // 开发环境使用本地地址
      serverAddress.value = '192.168.1.100'
      serverPort.value = 8081
    }
    
    configLoaded.value = true
    configSource.value = 'hardcoded'
    console.log('使用硬编码配置:', { address: serverAddress.value, port: serverPort.value })
    return true
  }

  // 从本地存储加载服务器配置
  const loadConfigFromStorage = () => {
    try {
      const saved = localStorage.getItem('fractal_server_config')
      if (saved) {
        const config = JSON.parse(saved)
        if (config.address && config.port) {
          serverAddress.value = config.address
          serverPort.value = config.port
          configLoaded.value = true
          configSource.value = 'localStorage'
          console.log('从localStorage加载配置成功:', config)
          return true
        }
      }
    } catch (error) {
      console.error('从localStorage加载配置失败:', error)
    }
    return false
  }

  // 保存服务器配置到本地存储
  const saveServerConfig = () => {
    const config = {
      address: serverAddress.value,
      port: serverPort.value
    }
    localStorage.setItem('fractal_server_config', JSON.stringify(config))
  }

  // 初始化配置加载
  const initializeConfig = async () => {
    // 优先从localStorage读取（用户自定义配置）
    const storageLoaded = loadConfigFromStorage()
    
    // 如果localStorage没有配置，使用硬编码配置
    if (!storageLoaded) {
      loadHardcodedConfig()
    }
  }

  // 查询服务器状态（/hello接口）
  const checkServerStatus = async () => {
    if (!serverUrl.value) {
      serverStatus.value = 'unknown'
      return
    }

    try {
      const response = await fetch(`${serverUrl.value}/hello`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        // 设置较短的超时时间
        signal: AbortSignal.timeout(3000)
      })

      if (response.ok) {
        serverStatus.value = 'online'
      } else {
        serverStatus.value = 'offline'
      }
    } catch (error) {
      console.error('服务器状态查询失败:', error)
      serverStatus.value = 'error'
    }
  }

  // 读取服务器配置（/ota接口）
  const fetchServerConfig = async () => {
    if (!serverUrl.value) {
      console.warn('服务器地址未配置')
      return false
    }

    try {
      const response = await fetch(`${serverUrl.value}/ota`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      })

      if (response.ok) {
        const config = await response.json()
        serverConfig.value = config
        console.log('服务器配置已更新:', config)
        return true
      } else {
        console.error('获取服务器配置失败:', response.status)
        return false
      }
    } catch (error) {
      console.error('获取服务器配置失败:', error)
      return false
    }
  }

  // 开始状态轮询
  const startStatusPolling = () => {
    if (isStatusPolling.value) return

    isStatusPolling.value = true
    // 立即执行一次状态检查
    checkServerStatus()
    
    // 每10秒查询一次状态
    statusPollingInterval = setInterval(() => {
      checkServerStatus()
    }, 1000)
  }

  // 停止状态轮询
  const stopStatusPolling = () => {
    if (statusPollingInterval) {
      clearInterval(statusPollingInterval)
      statusPollingInterval = null
    }
    isStatusPolling.value = false
  }

  // 更新服务器配置
  const updateServerConfig = (address, port) => {
    serverAddress.value = address
    serverPort.value = port
    configLoaded.value = true
    configSource.value = 'manual'
    saveServerConfig()
    
    // 如果正在轮询，重新开始轮询
    if (isStatusPolling.value) {
      stopStatusPolling()
      startStatusPolling()
    }
  }

  // 初始化时加载配置并开始轮询
  initializeConfig()
  // 默认开启状态轮询
  startStatusPolling()

  return {
    // 状态
    serverAddress,
    serverPort,
    serverStatus,
    serverConfig,
    isStatusPolling,
    configLoaded,
    configSource,
    
    // 计算属性
    serverUrl,
    websocketUrl,
    hasValidConfig,
    
    // 方法
    saveServerConfig,
    loadHardcodedConfig,
    loadConfigFromStorage,
    initializeConfig,
    checkServerStatus,
    fetchServerConfig,
    startStatusPolling,
    stopStatusPolling,
    updateServerConfig
  }
} 