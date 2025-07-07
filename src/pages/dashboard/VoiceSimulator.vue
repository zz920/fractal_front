<template>
  <div class="voice-simulator">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>语音模拟器</h1>
      <p>与 Fractal 语音助手进行智能对话</p>
    </div>
    
    <!-- 语音助手界面 -->
    <div class="simulator-content">
      <div class="content-layout">
        <!-- 服务器状态栏 -->
        <div class="server-status-bar">
          <div class="status-info">
            <div class="status-label">服务器状态:</div>
            <div class="status-value">
              <div class="status-dot" :class="serverStatusClass"></div>
              <span>{{ serverStatusText }}</span>
            </div>
          </div>
        </div>
        
        <!-- 主对话区域 -->
        <div class="main-conversation-area">
          <MainTextArea 
            :current-text="currentText"
            :display-state="displayState"
            :server-status="serverStatus"
            :microphone-enabled="microphoneEnabled"
            @toggle-microphone="toggleMicrophone"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainTextArea from '../../components/MainTextArea.vue'
import { useWebSocket } from '../../services/websocket.js'
import { useAudio } from '../../services/audio.js'
import { useServer } from '../../services/server.js'
import { useProtocol } from '../../services/protocol.js'
import { watch, computed, ref } from 'vue'

export default {
  name: 'VoiceSimulator',
  components: {
    MainTextArea
  },
  setup() {
    const { connectionStatus, connect, disconnect, sendMessage, sendBinary, addMessageHandler, removeMessageHandler } = useWebSocket()
    const { microphoneStatus, microphoneEnabled, toggleMicrophone: toggleMic, startAudioStream, stopAudioStream } = useAudio()
    const { serverStatus, hasValidConfig, websocketUrl, fetchServerConfig: fetchConfig } = useServer()
    const { 
      sessionId, 
      isListening, 
      isSpeaking, 
      currentText, 
      sendHello, 
      handleHelloResponse, 
      sendStartListen, 
      sendStopListen, 
      sendDetectMessage,
      handleTTSMessage, 
      handleAudioData, 
      resetProtocol 
    } = useProtocol()

    const configFetched = ref(false)
    const detectMessageSent = ref(false)

    // 服务器状态计算属性
    const serverStatusClass = computed(() => {
      switch (serverStatus.value) {
        case 'online': return 'success'
        case 'offline': return 'inactive'
        case 'error': return 'error'
        default: return 'inactive'
      }
    })
    
    const serverStatusText = computed(() => {
      switch (serverStatus.value) {
        case 'online': return '在线'
        case 'offline': return '离线'
        case 'error': return '连接错误'
        default: return '未知'
      }
    })

    // 计算显示状态
    const displayState = computed(() => {
      // 如果正在播放TTS，显示speaking状态
      if (isSpeaking.value) {
        return 'speaking'
      }
      
      // 如果麦克风已开启且不在播放状态，显示listening状态（显示emoji）
      if (microphoneEnabled.value) {
        return 'listening'
      }
      
      // 默认显示ready状态
      return 'ready'
    })

    // 监听服务器状态变化，自动获取配置
    watch(serverStatus, async (newStatus) => {
      if (newStatus === 'online' && !configFetched.value) {
        console.log('服务器在线，自动获取配置...')
        await fetchConfig()
        configFetched.value = true
      } else if (newStatus !== 'online') {
        configFetched.value = false
      }
    })

    // 监听WebSocket URL和配置有效性变化
    watch([websocketUrl, hasValidConfig], ([newUrl, isValid]) => {
      if (newUrl && isValid) {
        // 只有在有有效配置时才标记为可连接
        // WebSocket服务会自动处理状态变化
      } else {
        // 如果没有有效配置，断开连接
        disconnect()
        resetProtocol()
      }
    })

    // 监听麦克风状态变化，开启麦克风时尝试连接WebSocket
    watch(microphoneEnabled, async (enabled) => {
      if (enabled && hasValidConfig.value && websocketUrl.value) {
        // 开启麦克风时，如果有有效配置，尝试连接WebSocket
        connect()
        
        // 等待连接建立后发送Hello消息
        const checkConnection = setInterval(() => {
          if (connectionStatus.value === 'connected') {
            clearInterval(checkConnection)
            sendHello(sendMessage)
          } else if (connectionStatus.value === 'failed') {
            clearInterval(checkConnection)
            console.error('WebSocket连接失败')
          }
        }, 100)
        
      } else if (!enabled) {
        // 关闭麦克风时，发送停止监听消息并断开WebSocket连接
        if (isListening.value) {
          sendStopListen(sendMessage)
        }
        stopAudioStream()
        // 重置检测消息发送标记
        detectMessageSent.value = false
        setTimeout(() => {
          disconnect()
          resetProtocol()
        }, 200)
      }
    })

    // 监听协议状态变化
    watch(isListening, (listening) => {
      if (listening) {
        // 进入listening状态，开始音频流
        startAudioStream((audioData) => {
          if (!isSpeaking.value) {
            // 只有在非speaking状态才发送音频数据
            sendBinary(audioData)
          }
        })
        
        // 音频流建立后发送检测消息（模拟用户说话）
        setTimeout(() => {
          if (!detectMessageSent.value) {
            sendDetectMessage(sendMessage)
            detectMessageSent.value = true
          }
        }, 200)
      } else {
        // 退出listening状态，停止音频流
        stopAudioStream()
      }
    })

    // 设置消息处理器
    const handleJsonMessage = (message) => {
      // 处理Hello响应
      if (message.session_id && !sessionId.value) {
        handleHelloResponse(message)
        // Hello成功后发送开始监听消息
        setTimeout(() => {
          sendStartListen(sendMessage)
        }, 100)
        return
      }
      
      // 处理TTS消息
      handleTTSMessage(message, null, (text) => {
        // 这里可以更新界面显示
        console.log('更新显示文本:', text)
      })
    }

    const handleBinaryMessage = (audioData) => {
      handleAudioData(audioData, null)
    }

    // 添加消息处理器
    addMessageHandler('json', handleJsonMessage)
    addMessageHandler('binary', handleBinaryMessage)

    // 自定义麦克风切换逻辑
    const toggleMicrophone = async () => {
      if (microphoneEnabled.value) {
        // 关闭麦克风
        await toggleMic()
      } else {
        // 开启麦克风
        const success = await toggleMic()
        if (!success) {
          console.error('开启麦克风失败')
        }
      }
    }

    return {
      serverStatus,
      serverStatusClass,
      serverStatusText,
      currentText,
      displayState,
      microphoneEnabled,
      toggleMicrophone
    }
  }
}
</script>

<style scoped>
.voice-simulator {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.page-header p {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
}

.simulator-content {
  flex: 1;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
  min-height: 600px;
}

.content-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 600px;
}

.server-status-bar {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-label {
  font-size: 0.9rem;
  color: #495057;
  font-weight: 500;
}

.status-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #495057;
  font-weight: 500;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #dee2e6;
  animation: pulse-dot 2s infinite;
}

.status-dot.success {
  background: #28a745;
}

.status-dot.error {
  background: #dc3545;
}

.status-dot.inactive {
  background: #6c757d;
}

@keyframes pulse-dot {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.main-conversation-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .server-status-bar {
    padding: 0.75rem 1rem;
  }
  
  .status-info {
    gap: 0.5rem;
  }
  
  .status-label,
  .status-value {
    font-size: 0.85rem;
  }
}
</style> 