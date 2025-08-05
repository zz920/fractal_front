<template>
  <div class="voice-simulator">
    <!-- 顶部标题栏 -->
    <div class="top-header">
      <h1 class="page-title">语音模拟器</h1>
      <div class="user-profile">
        <div class="user-avatar">{{ userStore.userInfo.avatar }}</div>
        <span class="user-name">{{ userStore.userInfo.username }}</span>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="content-area">
      <div class="welcome-message">Hi，这里是Fractal语音助手，尝试着与我对话吧！</div>
      
      <div class="listening-status" v-show="isListening">
        <span class="listening-text">|| 聆听中 ||</span>
      </div>
      
      <div class="generating-status" v-show="isGenerating">
        <span class="generating-text">|| 生成中 ||</span>
      </div>
      
      <div class="emoticon" v-show="!isListening && !isGenerating">(@'ヮ'@)ノ</div>
      <div class="emoticon-recording" v-show="isListening">(@•3•@)</div>
      <div class="emoticon-generating" v-show="isGenerating">^O^</div>
      
      <div class="conversation-text" v-show="showConversation">
        Hi! 你好呀, 今天心情怎么样?
      </div>
      
      <div class="input-container">
        <input 
          type="text" 
          class="input-field" 
          placeholder="Say Hi!" 
          v-model="messageInput"
          @keypress="handleMessageKeyPress"
        >
      </div>
      
      <div class="recording-status" v-show="isListening">
        <i class="fa-solid fa-microphone recording-icon"></i>
        <span class="recording-text">正在录音...</span>
      </div>
      
      <button class="record-button" @click="startRecording" v-show="!isListening && !isGenerating">
        <i class="fa-solid fa-microphone"></i>
        开始录音
      </button>
      
      <button class="stop-button" @click="stopRecording" v-show="isListening">
        <i class="fa-solid fa-stop"></i>
        停止录音
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

export default {
  name: 'VoiceSimulator',
  setup() {
    const userStore = useUserStore()
    
    // 响应式状态
    const isListening = ref(false)
    const isGenerating = ref(false)
    const showConversation = ref(false)
    const messageInput = ref('Hi!')
    
    // 开始录音
    const startRecording = () => {
      isListening.value = true
      isGenerating.value = false
      showConversation.value = false
      messageInput.value = 'Hi!'
    }
    
    // 停止录音
    const stopRecording = () => {
      isListening.value = false
      isGenerating.value = true
      showConversation.value = true
      messageInput.value = 'Hi!'
      
      // 模拟生成过程，3秒后恢复正常状态
      setTimeout(() => {
        isGenerating.value = false
        showConversation.value = false
        messageInput.value = ''
      }, 3000)
    }
    
    // 处理消息输入回车事件
    const handleMessageKeyPress = (e) => {
      if (e.key === 'Enter') {
        const message = messageInput.value.trim()
        if (message) {
          console.log('发送消息:', message)
          messageInput.value = ''
        }
      }
    }
    
    onMounted(() => {
      // 初始化用户状态
      userStore.initializeFromStorage()
    })
    
    return {
      userStore,
      isListening,
      isGenerating,
      showConversation,
      messageInput,
      startRecording,
      stopRecording,
      handleMessageKeyPress
    }
  }
}
</script>

<style scoped>
.voice-simulator {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 顶部标题栏 */
.top-header {
  background: #fff;
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.page-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: #333;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 50%, #06b6d4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-name {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

/* 内容区域 */
.content-area {
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.welcome-message {
  font-size: 1.8rem;
  color: #6ec6fa;
  margin-bottom: 30px;
  text-align: center;
  font-weight: bold;
  line-height: 1.4;
}

.listening-status {
  margin-bottom: 20px;
  text-align: center;
}

.listening-text {
  font-size: 1.8rem;
  color: #6ec6fa;
  font-weight: bold;
}

.generating-status {
  margin-bottom: 20px;
  text-align: center;
}

.generating-text {
  font-size: 1.8rem;
  color: #b6a6f7;
  font-weight: bold;
}

.emoticon, .emoticon-recording, .emoticon-generating {
  font-size: 3rem;
  margin-bottom: 40px;
  text-align: center;
}

.emoticon-recording {
  color: #6ec6fa;
}

.conversation-text {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 30px;
  text-align: left;
  max-width: 600px;
  line-height: 1.6;
}

.input-container {
  width: 100%;
  max-width: 600px;
  margin-bottom: 30px;
}

.input-field {
  width: 100%;
  height: 60px;
  border: 2px solid #e3d6f7;
  border-radius: 12px;
  padding: 0 20px;
  font-size: 1.2rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(110, 198, 250, 0.1);
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #6ec6fa;
  box-shadow: 0 2px 12px rgba(110, 198, 250, 0.2);
}

.input-field::placeholder {
  color: #bbb;
}

.recording-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #4CAF50;
}

.recording-icon {
  font-size: 1.2rem;
  color: #4CAF50;
}

.recording-text {
  font-size: 1.1rem;
  color: #4CAF50;
  font-weight: bold;
}

.record-button {
  background: #6ec6fa;
  color: #fff;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 16px rgba(110, 198, 250, 0.3);
}

.record-button:hover {
  background: #5bb5e9;
  transform: translateY(-2px);
}

.record-button i {
  font-size: 1.5rem;
}

.stop-button {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 16px rgba(231, 76, 60, 0.3);
}

.stop-button:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.stop-button i {
  font-size: 1.5rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .top-header {
    padding: 16px 20px;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .content-area {
    padding: 20px;
  }
  
  .welcome-message {
    font-size: 1.5rem;
  }
  
  .input-container {
    max-width: 100%;
  }
}
</style> 