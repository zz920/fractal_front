// 服务模块统一导出
export { default as authService } from './auth.js'
export { default as deviceService } from './device.js'
export { default as serverService } from './server.js'
export { default as httpService } from './http.js'
export { default as serverConnection } from './server-connection.js'
export { default as serverIntegration } from './server-integration.js'
export { default as deepseekService } from './deepseek.js'
export { default as deepseekV3Service } from './deepseek-v3.js'
export { default as deepseekV3ApiService } from './deepseek-v3-api.js'
export { default as mcpCoordinator } from './mcp-coordinator.js'
export { default as browserbaseMcpService } from './browserbase-mcp.js'
export { default as navigationMcpService } from './navigation-mcp.js'
export { default as intentRecognitionMcpService } from './intent-recognition-mcp.js'
export { default as actionExecutionMcpService } from './action-execution-mcp.js'
export { default as contextManagementMcpService } from './context-management-mcp.js'

// 默认导出
export default {
  authService: await import('./auth.js').then(m => m.default),
  deviceService: await import('./device.js').then(m => m.default),
  serverService: await import('./server.js').then(m => m.default),
  httpService: await import('./http.js').then(m => m.default),
  serverConnection: await import('./server-connection.js').then(m => m.default),
  serverIntegration: await import('./server-integration.js').then(m => m.default),
  deepseekService: await import('./deepseek.js').then(m => m.default),
  deepseekV3Service: await import('./deepseek-v3.js').then(m => m.default),
  deepseekV3ApiService: await import('./deepseek-v3-api.js').then(m => m.default),
  mcpCoordinator: await import('./mcp-coordinator.js').then(m => m.default),
  browserbaseMcpService: await import('./browserbase-mcp.js').then(m => m.default),
  navigationMcpService: await import('./navigation-mcp.js').then(m => m.default),
  intentRecognitionMcpService: await import('./intent-recognition-mcp.js').then(m => m.default),
  actionExecutionMcpService: await import('./action-execution-mcp.js').then(m => m.default),
  contextManagementMcpService: await import('./context-management-mcp.js').then(m => m.default)
}
