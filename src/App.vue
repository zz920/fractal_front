<template>
  <div id="app">
    <header class="header">
      <h1>Fractal语音助手</h1>
    </header>
    
    <main class="main">
      <div class="content-layout">
        <MainTextArea 
          :connection-status="connectionStatus"
          :current-text="currentText"
          :display-state="displayState"
        />
        
        <RightPanel 
          :connection-status="connectionStatus"
          :microphone-status="microphoneStatus"
          :microphone-enabled="microphoneEnabled"
          :server-status="serverStatus"
          @toggle-microphone="toggleMicrophone"
          @fetch-config="fetchServerConfig"
        />
      </div>
    </main>
  </div>
</template>

<script>
import MainTextArea from './components/MainTextArea.vue'
import RightPanel from './components/RightPanel.vue'
import { useWebSocket } from './services/websocket.js'
import { useAudio } from './services/audio.js'
import { useServer } from './services/server.js'
import { useProtocol } from './services/protocol.js'
import { watch, computed } from 'vue'

export default {
  name: 'App',
  components: {
    MainTextArea,
    RightPanel
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
      handleTTSMessage, 
      handleAudioData, 
      resetProtocol 
    } = useProtocol()

    // 计算显示状态
    const displayState = computed(() => {
      // 如果正在播放TTS，显示speaking状态
      if (isSpeaking.value) {
        return 'speaking'
      }
      
      // 如果连接失败，显示error状态
      if (connectionStatus.value === 'failed') {
        return 'error'
      }
      
      // 如果正在连接，显示connecting状态
      if (connectionStatus.value === 'connecting') {
        return 'connecting'
      }
      
      // 如果麦克风已开启且不在播放状态，显示listening状态（显示emoji）
      if (microphoneEnabled.value) {
        return 'listening'
      }
      
      // 默认显示connected状态
      return 'connected'
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

    // 查询服务器配置
    const fetchServerConfig = async () => {
      await fetchConfig()
    }

    return {
      connectionStatus,
      microphoneStatus,
      microphoneEnabled,
      serverStatus,
      currentText,
      displayState,
      toggleMicrophone,
      fetchServerConfig
    }
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 300;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.content-layout {
  flex: 1;
  display: flex;
  height: calc(100vh - 80px); /* 减去header高度 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-layout {
    flex-direction: column;
    height: auto;
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
}
</style> 