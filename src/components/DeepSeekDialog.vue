<template>
  <div v-if="isOpen" class="deepseek-dialog" :class="{ minimized: isMinimized }">
    <!-- 对话框头部 -->
    <div class="dialog-header" @click="toggleMinimize">
      <div class="header-left">
        <div class="ai-avatar">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="header-info">
          <h3>DeepSeek AI助手</h3>
          <div class="status-indicators">
            <span class="status-badge" :class="{ connected: isConnected, disconnected: !isConnected }">
              {{ isConnected ? '已连接' : '未连接' }}
            </span>
            <span class="status-badge" :class="{ connected: coordinatorStatus.initialized, disconnected: !coordinatorStatus.initialized }">
              {{ coordinatorStatus.initialized ? '协调器已就绪' : '协调器初始化中' }}
            </span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="minimize-btn" @click.stop="toggleMinimize">
          {{ isMinimized ? '展开' : '最小化' }}
        </button>
        <button class="close-btn" @click="closeDialog">×</button>
      </div>
    </div>

    <!-- 对话框内容 -->
    <div v-if="!isMinimized" class="dialog-content">
      <!-- 消息列表 -->
      <div class="messages-container" ref="messagesContainer">
        <div v-for="message in messages" :key="message.id" class="message" :class="message.type">
          <div class="message-avatar">
            <svg v-if="message.type === 'user'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-sender">{{ message.type === 'user' ? '你' : 'DeepSeek AI' }}</span>
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              <span v-if="message.service" class="message-service">{{ message.service }}</span>
            </div>
            <div class="message-text" v-html="formatMessage(message.content)"></div>
            <div v-if="message.intent" class="message-intent">
              <span class="intent-badge" :class="message.intent">
                意图: {{ getIntentDisplayName(message.intent) }}
              </span>
              <span v-if="message.confidence" class="confidence-badge">
                置信度: {{ (message.confidence * 100).toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-container">
        <div class="input-wrapper">
          <textarea
            v-model="inputMessage"
            @keydown="handleEnter"
            placeholder="输入消息，支持自然语言导航命令如'帮我跳转到首页'..."
            class="message-input"
            :disabled="isLoading"
            ref="messageInput"
          ></textarea>
          <button 
            @click="sendMessage" 
            class="send-btn"
            :disabled="isLoading || !inputMessage.trim()"
          >
            <svg v-if="!isLoading" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
            <div v-else class="loading-spinner"></div>
          </button>
        </div>
        
        <!-- 快捷操作按钮 -->
        <div class="quick-actions">
          <button @click="sendExampleMessage('帮我跳转到首页')" class="quick-btn">
            🏠 跳转首页
          </button>
          <button @click="sendExampleMessage('打开语音模拟器')" class="quick-btn">
            🎤 语音模拟器
          </button>
          <button @click="sendExampleMessage('系统状态')" class="quick-btn">
            📊 系统状态
          </button>
          <button @click="sendExampleMessage('帮助')" class="quick-btn">
            ❓ 帮助
          </button>
        </div>
      </div>
    </div>

    <!-- 最小化时的未读消息提示 -->
    <div v-if="isMinimized && unreadCount > 0" class="unread-badge">
      {{ unreadCount }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import mcpCoordinator from '@/services/mcp-coordinator.js'

export default {
  name: 'DeepSeekDialog',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const messages = ref([])
    const inputMessage = ref('')
    const isLoading = ref(false)
    const isConnected = ref(false)
    const isMinimized = ref(false)
    const unreadCount = ref(0)
    const coordinatorStatus = ref({ initialized: false })
    const messagesContainer = ref(null)
    const messageInput = ref(null)

    // 检查连接状态
    const checkConnection = async () => {
      try {
        console.log('🔍 检查MCP协调器连接状态...')
        const result = await mcpCoordinator.initialize()
        isConnected.value = result.success
        coordinatorStatus.value = { initialized: result.success }
        
        if (result.success) {
          addMessage({
            type: 'assistant',
            content: '🤖 MCP协调器已初始化，支持智能导航、操作执行和上下文管理。\n\n💡 **支持的导航命令:**\n• "帮我跳转到首页" - 跳转到首页\n• "打开语音模拟器" - 跳转到语音模拟器\n• "进入设置页面" - 跳转到设置页面\n• "返回上一页" - 返回上一页\n• "刷新页面" - 刷新当前页面\n\n🎯 **支持的操作命令:**\n• "截图" - 截取当前页面\n• "提取内容" - 提取页面内容\n• "观察元素" - 观察页面元素\n\n🔍 **支持的查询命令:**\n• "系统状态" - 查看系统状态\n• "系统信息" - 查看系统信息\n\n💬 **其他功能:**\n• 支持自然语言对话\n• 智能意图识别\n• 上下文管理\n• 多服务协调',
            service: 'mcp-coordinator',
            intent: 'help',
            confidence: 1.0
          })
        } else {
          console.warn('⚠️ MCP协调器初始化失败，将使用基础AI对话功能')
          addMessage({
            type: 'assistant',
            content: '⚠️ MCP协调器初始化失败，将使用基础AI对话功能。\n\n💬 **基础功能:**\n• 支持自然语言对话\n• 智能回复生成\n• 上下文记忆\n\n🔧 **如需完整功能，请检查网络连接或联系管理员。**',
            service: 'fallback'
          })
        }
      } catch (error) {
        console.error('❌ 检查连接失败:', error)
        isConnected.value = false
        coordinatorStatus.value = { initialized: false }
        addMessage({
          type: 'assistant',
          content: '❌ 连接检查失败，将使用基础AI对话功能。\n\n💬 **基础功能:**\n• 支持自然语言对话\n• 智能回复生成\n• 上下文记忆\n\n🔧 **如需完整功能，请检查网络连接或联系管理员。**',
          service: 'fallback'
        })
      }
    }

    // 发送消息
    const sendMessage = async () => {
      if (!inputMessage.value.trim() || isLoading.value) return

      const userMessage = inputMessage.value.trim()
      addMessage({
        type: 'user',
        content: userMessage
      })

      inputMessage.value = ''
      isLoading.value = true

      try {
        // 检查MCP协调器是否可用
        if (!isConnected.value || !coordinatorStatus.value.initialized) {
          console.warn('⚠️ MCP协调器不可用，使用基础AI对话')
          const fallbackResult = await mcpCoordinator.services.deepseek.sendMessage(userMessage)
          
          if (fallbackResult.success) {
            addMessage({
              type: 'assistant',
              content: fallbackResult.response || 'AI回复已生成',
              service: 'deepseek',
              intent: 'ai_chat',
              confidence: 0.5
            })
          } else {
            addMessage({
              type: 'assistant',
              content: `❌ AI服务暂时不可用，请稍后重试。\n\n错误信息: ${fallbackResult.error || '未知错误'}`,
              service: 'error'
            })
          }
          return
        }

        const result = await mcpCoordinator.processMessage(userMessage)
        
        if (result.success) {
          let responseContent = ''
          let service = 'deepseek'
          let intent = result.intent
          let confidence = result.confidence

          if (result.result && result.result.type === 'navigation') {
            if (result.result.success) {
              responseContent = `🧭 **导航操作执行成功**\n\n${result.result.message}\n\n路径: ${result.result.data?.path || 'N/A'}\n状态: ✅ 成功`
            } else {
              responseContent = `❌ **导航操作失败**\n\n${result.result.error || '未知错误'}\n\n路径: ${result.result.data?.path || 'N/A'}\n状态: ❌ 失败`
            }
            service = 'navigation-mcp'
          } else if (result.result && result.result.type === 'action') {
            if (result.result.success) {
              responseContent = `⚡ **操作执行成功**\n\n${result.result.message}\n\n操作类型: ${result.result.data?.action || 'N/A'}\n状态: ✅ 成功`
            } else {
              responseContent = `❌ **操作执行失败**\n\n${result.result.error || '未知错误'}\n\n操作类型: ${result.result.data?.action || 'N/A'}\n状态: ❌ 失败`
            }
            service = 'action-execution-mcp'
          } else if (result.result && result.result.type === 'query') {
            if (result.result.success) {
              responseContent = `🔍 **查询结果**\n\n${result.result.message}\n\n数据: ${JSON.stringify(result.result.data, null, 2)}`
            } else {
              responseContent = `❌ **查询失败**\n\n${result.result.error || '未知错误'}`
            }
            service = 'intent-recognition-mcp'
          } else if (result.result && result.result.type === 'help') {
            responseContent = result.result.data?.helpText || '帮助信息'
            service = 'mcp-coordinator'
          } else if (result.result && result.result.type === 'ai_chat') {
            responseContent = result.result.data?.response || result.result.message || 'AI回复已生成'
            service = 'deepseek'
          } else {
            responseContent = result.result?.message || '操作执行完成'
            service = 'mcp-coordinator'
          }

          addMessage({
            type: 'assistant',
            content: responseContent,
            service: service,
            intent: intent,
            confidence: confidence
          })
        } else {
          // 如果MCP协调器处理失败，尝试降级到基础AI对话
          console.warn('⚠️ MCP协调器处理失败，降级到基础AI对话:', result.error)
          try {
            const fallbackResult = await mcpCoordinator.services.deepseek.sendMessage(userMessage)
            if (fallbackResult.success) {
              addMessage({
                type: 'assistant',
                content: fallbackResult.response || 'AI回复已生成',
                service: 'deepseek',
                intent: 'ai_chat',
                confidence: 0.5
              })
            } else {
              addMessage({
                type: 'assistant',
                content: `❌ 处理失败: ${result.error || '未知错误'}\n\nAI服务也暂时不可用，请稍后重试。`,
                service: 'error'
              })
            }
          } catch (fallbackError) {
            addMessage({
              type: 'assistant',
              content: `❌ 处理失败: ${result.error || '未知错误'}\n\n降级处理也失败: ${fallbackError.message}`,
              service: 'error'
            })
          }
        }
      } catch (error) {
        console.error('❌ 发送消息失败:', error)
        // 尝试降级到基础AI对话
        try {
          const fallbackResult = await mcpCoordinator.services.deepseek.sendMessage(userMessage)
          if (fallbackResult.success) {
            addMessage({
              type: 'assistant',
              content: fallbackResult.response || 'AI回复已生成',
              service: 'deepseek',
              intent: 'ai_chat',
              confidence: 0.5
            })
          } else {
            addMessage({
              type: 'assistant',
              content: `❌ 发送消息失败: ${error.message}\n\nAI服务也暂时不可用，请稍后重试。`,
              service: 'error'
            })
          }
        } catch (fallbackError) {
          addMessage({
            type: 'assistant',
            content: `❌ 发送消息失败: ${error.message}\n\n降级处理也失败: ${fallbackError.message}`,
            service: 'error'
          })
        }
      } finally {
        isLoading.value = false
      }
    }

    // 发送示例消息
    const sendExampleMessage = (message) => {
      inputMessage.value = message
      sendMessage()
    }

    // 处理回车键
    const handleEnter = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
      }
    }

    // 清除历史
    const clearHistory = async () => {
      messages.value = []
      try {
        await mcpCoordinator.services.deepseek.clearHistory()
      } catch (error) {
        console.error('清除历史失败:', error)
      }
    }

    // 切换最小化
    const toggleMinimize = () => {
      isMinimized.value = !isMinimized.value
      if (!isMinimized.value) {
        unreadCount.value = 0
      }
    }

    // 关闭对话框
    const closeDialog = () => {
      emit('close')
    }

    // 滚动到底部
    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }

    // 格式化消息
    const formatMessage = (content) => {
      if (typeof content === 'string') {
        return content.replace(/\n/g, '<br>')
      }
      return content
    }

    // 格式化时间
    const formatTime = (timestamp) => {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    // 获取意图显示名称
    const getIntentDisplayName = (intent) => {
      const intentNames = {
        'navigation': '导航',
        'action': '操作',
        'query': '查询',
        'help': '帮助',
        'ai_chat': 'AI对话'
      }
      return intentNames[intent] || intent
    }

    // 添加消息
    const addMessage = (message) => {
      const newMessage = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        ...message
      }
      messages.value.push(newMessage)
      
      if (isMinimized.value && message.type === 'assistant') {
        unreadCount.value++
      }
      
      scrollToBottom()
    }

    // 监听消息变化
    watch(messages, () => {
      scrollToBottom()
    }, { deep: true })

    // 组件挂载时检查连接
    onMounted(() => {
      checkConnection()
    })

    return {
      messages,
      inputMessage,
      isLoading,
      isConnected,
      isMinimized,
      unreadCount,
      coordinatorStatus,
      messagesContainer,
      messageInput,
      checkConnection,
      sendMessage,
      sendExampleMessage,
      handleEnter,
      clearHistory,
      toggleMinimize,
      closeDialog,
      scrollToBottom,
      formatMessage,
      formatTime,
      getIntentDisplayName
    }
  }
}
</script>

<style scoped>
.deepseek-dialog {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: all 0.3s ease;
  border: 1px solid #e1e5e9;
}

.deepseek-dialog.minimized {
  height: 60px;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  cursor: pointer;
  user-select: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-avatar svg {
  width: 20px;
  height: 20px;
  color: white;
}

.header-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.status-indicators {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.status-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
}

.status-badge.connected {
  background: rgba(76, 175, 80, 0.8);
}

.status-badge.disconnected {
  background: rgba(244, 67, 54, 0.8);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.minimize-btn, .close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  transition: background-color 0.2s;
}

.minimize-btn:hover, .close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.close-btn {
  font-size: 18px;
  font-weight: bold;
}

.dialog-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  gap: 12px;
  animation: fadeIn 0.3s ease;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message.assistant .message-avatar {
  background: #f5f5f5;
  color: #666;
}

.message-avatar svg {
  width: 20px;
  height: 20px;
}

.message-content {
  flex: 1;
  max-width: calc(100% - 44px);
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.message-sender {
  font-weight: 600;
  font-size: 12px;
  color: #666;
}

.message-time {
  font-size: 10px;
  color: #999;
}

.message-service {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  background: #f0f0f0;
  color: #666;
}

.message-text {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 12px;
  line-height: 1.5;
  font-size: 14px;
  color: #333;
}

.message.user .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-intent {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.intent-badge, .confidence-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  background: #f0f0f0;
  color: #666;
}

.intent-badge.navigation {
  background: #e3f2fd;
  color: #1976d2;
}

.intent-badge.action {
  background: #f3e5f5;
  color: #7b1fa2;
}

.intent-badge.query {
  background: #e8f5e8;
  color: #388e3c;
}

.intent-badge.help {
  background: #fff3e0;
  color: #f57c00;
}

.intent-badge.ai_chat {
  background: #fce4ec;
  color: #c2185b;
}

.input-container {
  padding: 16px;
  border-top: 1px solid #e1e5e9;
  background: #fafafa;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #667eea;
}

.message-input:disabled {
  background: #f5f5f5;
  color: #999;
}

.send-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn svg {
  width: 20px;
  height: 20px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.quick-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.quick-btn {
  background: white;
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
}

.quick-btn:hover {
  background: #f0f0f0;
  border-color: #667eea;
  color: #667eea;
}

.unread-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f44336;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 滚动条样式 */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
