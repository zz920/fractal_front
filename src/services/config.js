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

  // DeepSeek-V3 AI相关
  DEEPSEEK_V3: {
    CHAT: '/api/deepseek-v3/chat',
    STREAM_CHAT: '/api/deepseek-v3/stream-chat',
    HEALTH: '/api/deepseek-v3/health',
    MODELS: '/api/deepseek-v3/models',
    CONFIG: '/api/deepseek-v3/config'
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

// DeepSeek-V3 模型配置
export const DEEPSEEK_V3_CONFIG = {
  MODEL_NAME: 'deepseek-v3',
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2048,
  TOP_P: 1,
  FREQUENCY_PENALTY: 0,
  PRESENCE_PENALTY: 0,
  SYSTEM_PROMPT: '你是一个智能助手，能够理解并执行用户的指令，提供帮助和信息。'
}

// 请求配置
export const REQUEST_CONFIG = {
  TIMEOUT: 30000, // 30秒超时
  RETRY_TIMES: 3, // 重试次数
  RETRY_DELAY: 1000 // 重试延迟（毫秒）
}

// 导出基础URL
export { API_BASE_URL }
