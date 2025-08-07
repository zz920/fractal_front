// API配置文件
// 服务器配置 - 与server.js中的配置保持一致
const API_BASE_URL = 'https://fractal.cpolar.cn:443'

// API端点配置
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email'
  },
  
  // 用户相关
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
    CHANGE_PASSWORD: '/api/user/change-password',
    DELETE_ACCOUNT: '/api/user/delete-account'
  },
  
  // 设备相关
  DEVICE: {
    LIST: '/api/device/list',
    BIND: '/api/device/bind',
    UNBIND: '/api/device/unbind',
    DETAILS: '/api/device/details',
    STATUS: '/api/device/status'
  },
  
  // 语音相关
  VOICE: {
    SETTINGS: '/api/voice/settings',
    SIMULATE: '/api/voice/simulate',
    TRAIN: '/api/voice/train',
    MODELS: '/api/voice/models'
  },
  
  // MCP相关
  MCP: {
    FEATURES: '/api/mcp/features',
    SUBSCRIPTION: '/api/mcp/subscription',
    CONFIG: '/api/mcp/config',
    STATUS: '/api/mcp/status'
  },

  // DeepSeek AI相关
  DEEPSEEK: {
    HEALTH: '/api/deepseek/health',
    CHAT: '/api/deepseek/chat',
    TEST: '/api/deepseek/test',
    CONFIG: '/api/deepseek/config'
  },

  // Browserbase MCP相关
  BROWSERBASE: {
    HEALTH: '/api/browserbase/health',
    SESSION: '/api/browserbase/session',
    NAVIGATE: '/api/browserbase/navigate',
    ACT: '/api/browserbase/act',
    EXTRACT: '/api/browserbase/extract',
    OBSERVE: '/api/browserbase/observe',
    SCREENSHOT: '/api/browserbase/screenshot',
    CLOSE: '/api/browserbase/close',
    SESSIONS: '/api/browserbase/sessions'
  }
}

// 请求配置
export const REQUEST_CONFIG = {
  TIMEOUT: 30000, // 30秒超时
  RETRY_TIMES: 3, // 重试次数
  RETRY_DELAY: 1000 // 重试延迟（毫秒）
}

// 导出基础URL
export { API_BASE_URL }
