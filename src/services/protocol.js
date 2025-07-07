import { ref } from 'vue'
import { OpusAudioPlayer } from './audio.js'

// 协议状态管理
const sessionId = ref(null)
const isListening = ref(false)
const isSpeaking = ref(false)
const currentText = ref('')
let audioPlayer = null

export function useProtocol() {
  // Hello消息
  const sendHello = (sendMessage) => {
    const helloMessage = {
      type: "hello",
      version: 1,
      transport: "websocket",
      audio_params: {
        format: "opus",
        sample_rate: 16000,
        channels: 1,
        frame_duration: 60
      }
    }
    
    console.log('发送Hello消息:', helloMessage)
    sendMessage(helloMessage)
  }

  // 处理Hello响应
  const handleHelloResponse = (response) => {
    if (response.session_id) {
      sessionId.value = response.session_id
      console.log('收到Hello响应，会话ID:', response.session_id)
      console.log('欢迎消息:', response.welcome_msg)
      return true
    }
    return false
  }

  // 开始监听消息
  const sendStartListen = (sendMessage) => {
    if (!sessionId.value) {
      console.error('没有有效的会话ID，无法发送开始监听消息')
      return false
    }

    const listenMessage = {
      session_id: sessionId.value,
      type: "listen",
      state: "start",
      mode: "manual"
    }
    
    console.log('发送开始监听消息:', listenMessage)
    sendMessage(listenMessage)
    
    // 100ms后进入listening状态
    setTimeout(() => {
      isListening.value = true
      console.log('进入listening状态')
    }, 100)
    
    return true
  }

  // 停止监听消息
  const sendStopListen = (sendMessage) => {
    if (!sessionId.value) {
      console.error('没有有效的会话ID，无法发送停止监听消息')
      return false
    }

    const listenMessage = {
      session_id: sessionId.value,
      type: "listen",
      state: "stop",
      mode: "manual"
    }
    
    console.log('发送停止监听消息:', listenMessage)
    sendMessage(listenMessage)
    
    // 100ms后关闭连接
    setTimeout(() => {
      isListening.value = false
      console.log('退出listening状态')
    }, 100)
    
    return true
  }

  // 处理TTS消息
  const handleTTSMessage = (message, audioContext, onTextUpdate) => {
    switch (message.type) {
      case 'tts':
        switch (message.state) {
          case 'start':
            console.log('TTS开始，进入speaking状态')
            isSpeaking.value = true
            isListening.value = false
            
            // 重置音频播放器的播放时间
            if (audioPlayer && audioPlayer.isInitialized) {
              audioPlayer.resetPlayTime()
            }
            break
            
          case 'sentence_start':
            if (onTextUpdate) {
              onTextUpdate(message.text)
            }
            break
            
          case 'stop':
            isSpeaking.value = false
            isListening.value = true
            if (onTextUpdate) {
              onTextUpdate('')
            }
            break
            
          default:
            console.warn('未知的TTS状态:', message.state)
        }
        break
        
      default:
        console.log('收到其他消息:', message)
    }
  }

  // 处理二进制音频数据
  const handleAudioData = async (audioData, audioContext) => {
    if (!isSpeaking.value) {
      console.warn('不在speaking状态，忽略音频数据')
      return
    }

    // 初始化音频播放器（如果未初始化）
    if (!audioPlayer) {
      audioPlayer = new OpusAudioPlayer()
      await audioPlayer.init()
    }
    
    // 检查音频播放器状态
    if (!audioPlayer.isInitialized) {
      console.warn('音频播放器未初始化，尝试重新初始化')
      try {
        await audioPlayer.init()
        if (!audioPlayer.isInitialized) {
          console.error('音频播放器初始化失败，跳过音频数据')
          return
        }
      } catch (error) {
        console.error('音频播放器初始化失败:', error)
        return
      }
    }

    // 解码Opus音频数据并播放    
    const success = audioPlayer.decodeAndPlay(audioData)
    if (!success) {
      console.warn('音频播放失败，可能是损坏的opus帧')
    }
  }

  // 发送检测消息（模拟用户说话）
  const sendDetectMessage = (sendMessage) => {
    if (!sessionId.value) {
      console.error('没有有效的会话ID，无法发送检测消息')
      return false
    }

    const detectMessage = {
      session_id: sessionId.value,
      type: "listen",
      state: "detect",
      text: "你好小智"
    }
    
    sendMessage(detectMessage)
    
    return true
  }

  // 重置协议状态
  const resetProtocol = async () => {
    sessionId.value = null
    isListening.value = false
    isSpeaking.value = false
    currentText.value = ''
    
    // 清理音频播放器
    if (audioPlayer) {
      try {
        await audioPlayer.cleanup()
      } catch (error) {
        console.error('音频播放器清理失败:', error)
      }
      audioPlayer = null
    }
    
  }

  return {
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
  }
} 