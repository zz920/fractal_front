<template>
  <div class="voice-simulator">
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
          <!-- 状态显示区域 -->
          <div class="status-display">
            <div class="status-emoji">{{ getStatusEmoji() }}</div>
            <div class="status-text">{{ getStatusText() }}</div>
          </div>
          
          <!-- 对话区域 -->
          <div class="conversation-container">
            <!-- 助手输出区域 -->
            <div class="assistant-output-section">
              <div class="output-label">Fractal语音助手</div>
              <div class="output-container">
                <div class="output-text" :class="{ 'generating': currentState === 'generating' }">
                  <div v-if="currentState === 'ready'" class="welcome-message">
                    Hi, this is Fractal Voice Assistant, try talking to me.
                  </div>
                  <div v-else-if="currentState === 'listening'" class="listening-message">
                    || 聆听中 ||
                  </div>
                  <div v-else-if="currentState === 'generating'" class="generating-message">
                    生成中
                  </div>
                  <div v-else-if="assistantResponse" class="response-message">
                    {{ assistantResponse }}
                  </div>
                </div>
                <div class="output-actions">
                  <button 
                    v-if="assistantResponse"
                    @click="speakResponse"
                    :disabled="isSpeaking"
                    class="speak-button"
                  >
                    <i :class="isSpeaking ? 'fas fa-volume-mute' : 'fas fa-volume-up'"></i>
                    {{ isSpeaking ? '播放中...' : '朗读回复' }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 用户输入区域 -->
            <div class="user-input-section">
              <div class="input-label">您的语音输入</div>
              <div class="input-container">
                <textarea
                  v-model="userInputText"
                  class="user-input-textarea"
                  :placeholder="getInputPlaceholder()"
                  :disabled="!microphoneEnabled && currentState !== 'ready'"
                  @input="handleInputChange"
                  ref="userInputRef"
                ></textarea>
                <div class="input-actions">
                  <button 
                    @click="toggleMicrophone"
                    :disabled="!isServerOnline"
                    :class="{ 
                      'mic-button': !microphoneEnabled,
                      'stop-button': microphoneEnabled 
                    }"
                    class="action-button"
                  >
                    <i :class="microphoneEnabled ? 'fas fa-stop' : 'fas fa-microphone'"></i>
                    {{ microphoneEnabled ? '停止录音' : '开始录音' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useWebSocket } from '../../services/websocket.js'
import { useAudio } from '../../services/audio.js'
import { useServer } from '../../services/server.js'
import { useProtocol } from '../../services/protocol.js'
import { watch, computed, ref, nextTick } from 'vue'

export default {
  name: 'VoiceSimulator',
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
    
    // 新的状态变量
    const userInputText = ref('')
    const assistantResponse = ref('')
    const currentState = ref('ready') // ready, listening, generating, speaking
    const userInputRef = ref(null)

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

    // 计算服务器是否在线
    const isServerOnline = computed(() => {
      return serverStatus.value === 'online'
    })
    
    // 获取状态颜文字
    const getStatusEmoji = () => {
      switch (currentState.value) {
        case 'ready':
          return '(@|ワ|@),'
        case 'listening':
          return '(@•₃•@)'
        case 'generating':
          return '^o^'
        case 'speaking':
          return '😃'
        default:
          return '(@|ワ|@),'
      }
    }
    
    // 获取状态文本
    const getStatusText = () => {
      switch (currentState.value) {
        case 'ready':
          return '等待输入'
        case 'listening':
          return '正在聆听'
        case 'generating':
          return '正在生成回复'
        case 'speaking':
          return '正在朗读'
        default:
          return '等待输入'
      }
    }
    
    // 获取输入框占位符
    const getInputPlaceholder = () => {
      switch (currentState.value) {
        case 'ready':
          return '点击开始录音按钮，然后开始说话...'
        case 'listening':
          return '正在录音，请说话...'
        case 'generating':
          return '正在处理您的语音...'
        default:
          return '点击开始录音按钮，然后开始说话...'
      }
    }
    
    // 处理输入变化
    const handleInputChange = () => {
      // 自动调整文本框高度
      nextTick(() => {
        if (userInputRef.value) {
          userInputRef.value.style.height = 'auto'
          userInputRef.value.style.height = userInputRef.value.scrollHeight + 'px'
        }
      })
    }
    
    // 切换麦克风
    const toggleMicrophone = async () => {
      console.log('切换麦克风，当前状态:', microphoneEnabled.value)
      
      if (microphoneEnabled.value) {
        // 停止录音
        console.log('停止录音...')
        await toggleMic() // 调用实际的麦克风切换函数
        currentState.value = 'ready'
        userInputText.value = ''
        assistantResponse.value = ''
        console.log('录音已停止，状态重置为ready')
      } else {
        // 开始录音
        console.log('开始录音，请求麦克风权限...')
        const success = await toggleMic() // 调用实际的麦克风切换函数
        console.log('麦克风权限请求结果:', success)
        
        if (success) {
          currentState.value = 'listening'
          userInputText.value = ''
          assistantResponse.value = ''
          console.log('录音已开始，状态:', currentState.value)
          
          // 启动持续对话模式
          startContinuousConversation()
        } else {
          console.error('开启麦克风失败')
          // 即使麦克风失败，也模拟一个默认的交互
          currentState.value = 'generating'
          setTimeout(() => {
            userInputText.value = 'Hi'
            assistantResponse.value = 'Hi! 你好呀, 今天心情怎么样?'
            currentState.value = 'ready'
          }, 2000)
        }
      }
    }
    
    // 持续对话模式
    const startContinuousConversation = () => {
      console.log('启动持续对话模式')
      
      // 模拟对话模型检测用户说话
      const conversationInterval = setInterval(() => {
        if (!microphoneEnabled.value) {
          clearInterval(conversationInterval)
          return
        }
        
        // 模拟检测到用户说完一句话
        if (currentState.value === 'listening') {
          // 随机模拟检测到语音输入
          if (Math.random() < 0.3) { // 30%的概率检测到语音
            processUserSpeech()
          }
        }
      }, 3000) // 每3秒检查一次
    }
    
    // 处理用户语音输入
    const processUserSpeech = () => {
      console.log('检测到用户语音输入')
      currentState.value = 'generating'
      
      // 模拟语音识别过程
      setTimeout(() => {
        // 模拟语音识别结果
        const speechOptions = [
          '你好，我想测试语音功能',
          '今天天气怎么样？',
          '请帮我查询一下信息',
          '我想了解一下这个系统',
          '谢谢你的帮助'
        ]
        const recognizedText = speechOptions[Math.floor(Math.random() * speechOptions.length)]
        console.log('语音识别结果:', recognizedText)
        
        // 将识别结果填入输入框
        userInputText.value = recognizedText
        
        // 根据识别结果生成回复
        setTimeout(() => {
          if (recognizedText.includes('你好') || recognizedText.includes('hi') || recognizedText.includes('hello')) {
            assistantResponse.value = 'Hi! 你好呀, 今天心情怎么样?'
          } else if (recognizedText.includes('天气')) {
            assistantResponse.value = '今天天气不错，适合出门走走。'
          } else if (recognizedText.includes('查询') || recognizedText.includes('信息')) {
            assistantResponse.value = '好的，我来帮您查询相关信息。'
          } else if (recognizedText.includes('系统')) {
            assistantResponse.value = '这是一个智能语音助手系统，可以帮您进行各种对话。'
          } else if (recognizedText.includes('谢谢')) {
            assistantResponse.value = '不客气！很高兴能帮助到您。'
          } else {
            assistantResponse.value = `我听到了您说："${recognizedText}"。这是一个很好的开始！`
          }
          
          console.log('生成回复:', assistantResponse.value)
          
          // 自动朗读生成的回复
          setTimeout(() => {
            autoSpeakResponse()
          }, 500)
          
          // 朗读完成后继续录音
          setTimeout(() => {
            if (microphoneEnabled.value) {
              currentState.value = 'listening'
              console.log('继续录音，等待下一句...')
            }
          }, 4000) // 等待朗读完成后再继续录音
        }, 1000)
      }, 1500)
    }
    
    // 自动朗读回复（停止录音后自动触发）
    const autoSpeakResponse = () => {
      console.log('自动朗读回复:', assistantResponse.value)
      if (assistantResponse.value && !isSpeaking.value) {
        currentState.value = 'speaking'
        
        // 使用浏览器的语音合成API
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(assistantResponse.value)
          utterance.lang = 'zh-CN'
          utterance.rate = 0.9
          utterance.pitch = 1.0
          
          utterance.onstart = () => {
            console.log('开始自动朗读')
          }
          
          utterance.onend = () => {
            console.log('自动朗读结束')
            currentState.value = 'ready'
          }
          
          utterance.onerror = (error) => {
            console.error('自动朗读错误:', error)
            currentState.value = 'ready'
          }
          
          speechSynthesis.speak(utterance)
        } else {
          console.log('浏览器不支持语音合成，使用模拟朗读')
          // 模拟朗读过程
          setTimeout(() => {
            currentState.value = 'ready'
          }, 3000)
        }
      } else {
        console.log('无法自动朗读：', {
          hasResponse: !!assistantResponse.value,
          isSpeaking: isSpeaking.value
        })
      }
    }
    
    // 手动朗读回复（用户点击按钮触发）
    const speakResponse = () => {
      console.log('手动朗读回复:', assistantResponse.value)
      if (assistantResponse.value && !isSpeaking.value) {
        currentState.value = 'speaking'
        
        // 使用浏览器的语音合成API
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(assistantResponse.value)
          utterance.lang = 'zh-CN'
          utterance.rate = 0.9
          utterance.pitch = 1.0
          
          utterance.onstart = () => {
            console.log('开始手动朗读')
          }
          
          utterance.onend = () => {
            console.log('手动朗读结束')
            currentState.value = 'ready'
          }
          
          utterance.onerror = (error) => {
            console.error('手动朗读错误:', error)
            currentState.value = 'ready'
          }
          
          speechSynthesis.speak(utterance)
        } else {
          console.log('浏览器不支持语音合成，使用模拟朗读')
          // 模拟朗读过程
          setTimeout(() => {
            currentState.value = 'ready'
          }, 3000)
        }
      } else {
        console.log('无法手动朗读：', {
          hasResponse: !!assistantResponse.value,
          isSpeaking: isSpeaking.value
        })
      }
    }

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
        
        // 注释掉自动发送检测消息，避免在录音期间触发TTS
        // setTimeout(() => {
        //   if (!detectMessageSent.value) {
        //     sendDetectMessage(sendMessage)
        //     detectMessageSent.value = true
        //   }
        // }, 200)
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
        if (text != '') {
          currentText.value += text;
        } else {
          currentText.value = '';
        }
      })
    }

    const handleBinaryMessage = (audioData) => {
      handleAudioData(audioData, null)
    }

    // 添加消息处理器
    addMessageHandler('json', handleJsonMessage)
    addMessageHandler('binary', handleBinaryMessage)



    return {
      serverStatus,
      serverStatusClass,
      serverStatusText,
      currentText,
      microphoneEnabled,
      isSpeaking,
      toggleMicrophone,
      // 新的状态和方法
      userInputText,
      assistantResponse,
      currentState,
      userInputRef,
      isServerOnline,
      getStatusEmoji,
      getStatusText,
      getInputPlaceholder,
      handleInputChange,
      speakResponse,
      autoSpeakResponse,
      startContinuousConversation,
      processUserSpeech
    }
  }
}
</script>

<style scoped>
.voice-simulator {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  padding: 24px;
  gap: 24px;
}

/* 状态显示区域 */
.status-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.status-emoji {
  font-size: 2rem;
  font-family: monospace;
  color: #6c757d;
  animation: pulse 2s infinite;
}

.status-text {
  font-size: 1rem;
  color: #495057;
  font-weight: 500;
}

/* 对话区域 */
.conversation-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
}

/* 用户输入区域 */
.user-input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-input-textarea {
  min-height: 80px;
  max-height: 200px;
  padding: 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.5;
  resize: none;
  transition: all 0.3s ease;
  background: #fff;
}

.user-input-textarea:focus {
  outline: none;
  border-color: #6ec6fa;
  box-shadow: 0 0 0 3px rgba(110, 198, 250, 0.1);
}

.user-input-textarea:disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mic-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.mic-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.stop-button {
  background: #dc3545;
  color: white;
}

.stop-button:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-2px);
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 助手输出区域 */
.assistant-output-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.output-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.output-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.output-text {
  min-height: 120px;
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: #fff;
  font-size: 1rem;
  line-height: 1.6;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.output-text.generating {
  background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
  border-color: #6ec6fa;
}

.welcome-message {
  color: #333;
  font-weight: 500;
}

.listening-message {
  color: #6c757d;
  font-weight: 500;
}

.generating-message {
  color: #6ec6fa;
  font-weight: 500;
}

.response-message {
  color: #333;
  text-align: left;
  width: 100%;
}

.output-actions {
  display: flex;
  justify-content: flex-end;
}

.speak-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.speak-button:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
}

.speak-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
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