import { ref, watch } from 'vue'
import { useServer } from './server.js'

const connectionStatus = ref('unconfigured') // unconfigured, available, connected, failed
let ws = null
let messageHandlers = []

export function useWebSocket() {
  const { websocketUrl, hasValidConfig } = useServer()

  // 监听WebSocket URL和配置有效性变化
  watch([websocketUrl, hasValidConfig], ([newUrl, isValid]) => {
    if (newUrl && isValid) {
      // 只有在有有效配置时才标记为可连接
      connectionStatus.value = 'available'
    } else {
      // 如果没有有效配置，标记为未配置
      connectionStatus.value = 'unconfigured'
      // 断开现有连接
      disconnect()
    }
  })

  const connect = () => {
    try {
      // 检查是否有有效的WebSocket URL和配置
      if (!websocketUrl.value || !hasValidConfig.value) {
        console.log('WebSocket URL未配置或配置无效，保持未配置状态')
        connectionStatus.value = 'unconfigured'
        return
      }

      // 如果已经连接，先断开
      if (ws && ws.readyState === WebSocket.OPEN) {
        disconnect()
      }

      // 使用实际的WebSocket URL
      ws = new WebSocket(websocketUrl.value)
      connectionStatus.value = 'connecting'
      
      ws.onopen = () => {
        connectionStatus.value = 'connected'
        console.log('WebSocket连接已建立:', websocketUrl.value)
      }
      
      ws.onclose = () => {
        connectionStatus.value = 'failed'
        console.log('WebSocket连接已关闭')
      }
      
      ws.onerror = (error) => {
        connectionStatus.value = 'failed'
        console.error('WebSocket错误:', error)
      }
      
      ws.onmessage = (event) => {        
        // 处理Blob消息（二进制数据）
        if (event.data instanceof Blob) {
          // 将Blob转换为ArrayBuffer
          event.data.arrayBuffer().then(buffer => {
            // 通知所有消息处理器
            messageHandlers.forEach(handler => {
              if (handler.type === 'binary') {
                handler.callback(buffer)
              }
            })
          }).catch(error => {
            console.error('Blob转换失败:', error)
          })
          return
        }
        
        // 处理二进制消息
        if (event.data instanceof ArrayBuffer) {
          console.log('收到二进制消息，长度:', event.data.byteLength)
          // 通知所有消息处理器
          messageHandlers.forEach(handler => {
            if (handler.type === 'binary') {
              handler.callback(event.data)
            }
          })
          return
        }
        
        // 处理文本消息
        try {
          const message = JSON.parse(event.data)
          
          // 通知所有消息处理器
          messageHandlers.forEach(handler => {
            if (handler.type === 'json') {
              handler.callback(message)
            }
          })
        } catch (error) {
          console.error('解析消息失败:', error)
        }
      }
      
    } catch (error) {
      connectionStatus.value = 'failed'
      console.error('连接失败:', error)
    }
  }
  
  const disconnect = () => {
    if (ws) {
      ws.close()
      ws = null
    }
    // 断开连接后，如果仍有有效配置，则回到可连接状态
    if (hasValidConfig.value && websocketUrl.value) {
      connectionStatus.value = 'available'
    } else {
      connectionStatus.value = 'unconfigured'
    }
  }
  
  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      if (typeof message === 'string') {
        ws.send(message)
      } else {
        ws.send(JSON.stringify(message))
      }
    } else {
      console.warn('WebSocket未连接，无法发送消息')
    }
  }

  const sendBinary = (data) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(data)
    } else {
      console.warn('WebSocket未连接，无法发送二进制数据')
    }
  }

  const addMessageHandler = (type, callback) => {
    messageHandlers.push({ type, callback })
  }

  const removeMessageHandler = (callback) => {
    messageHandlers = messageHandlers.filter(handler => handler.callback !== callback)
  }

  const reconnect = () => {
    disconnect()
    setTimeout(() => connect(), 1000)
  }
  
  return {
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
    sendBinary,
    addMessageHandler,
    removeMessageHandler,
    reconnect
  }
} 