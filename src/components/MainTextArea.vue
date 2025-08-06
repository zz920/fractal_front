<template>
  <div class="main-text-area">
    <div class="text-container">
      <!-- 监听状态 - 显示emoji笑脸 -->
      <div v-if="displayState === 'listening'" class="listening-state">
        <div class="emoji-container">
          <div class="emoji">😊</div>
        </div>
        <h3>情感对话</h3>
        <p>请说话...</p>
      </div>
      
      <!-- TTS播放状态 -->
      <div v-else-if="displayState === 'speaking'" class="speaking-state">
        <div class="emoji-container">
          <div class="emoji speaking-emoji">😃</div>
        </div>
        <h3>正在播放</h3>
        <p class="tts-message">{{ currentText }}</p>
      </div>
      
      <!-- 默认就绪状态 -->
      <div v-else class="placeholder-text">
        <div class="placeholder-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
          </svg>
        </div>
        <h3>Fractal语音助手</h3>
        <p>等待与您对话...</p>
      </div>
    </div>
    
    <!-- Say Hi 按钮 -->
    <div class="action-button-container">
      <button 
        @click="handleSayHi"
        :disabled="!isServerOnline"
        :class="{ 
          'say-hi-button': !microphoneEnabled,
          'stop-button': microphoneEnabled 
        }"
        class="main-action-button"
      >
        <div class="button-content">
          <div class="button-icon">
            <svg v-if="!microphoneEnabled" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
            </svg>
          </div>
          <span class="button-text">
            {{ microphoneEnabled ? '停止' : 'Say Hi' }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'MainTextArea',
  props: {
    currentText: {
      type: String,
      default: ''
    },
    displayState: {
      type: String,
      default: 'ready'
    },
    serverStatus: {
      type: String,
      default: 'unknown'
    },
    microphoneEnabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-microphone'],
  setup(props, { emit }) {
    // 计算服务器是否在线
    const isServerOnline = computed(() => {
      return props.serverStatus === 'online'
    })

    // 处理 Say Hi 按钮点击
    const handleSayHi = () => {
      if (isServerOnline.value) {
        emit('toggle-microphone')
      }
    }

    return {
      isServerOnline,
      handleSayHi
    }
  }
}
</script>

<style scoped>
.main-text-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  margin: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  min-height: 400px;
  position: relative;
}

.text-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  text-align: center;
  color: #6c757d;
}

.placeholder-icon {
  margin-bottom: 1rem;
}

.placeholder-icon svg {
  width: 64px;
  height: 64px;
  color: #dee2e6;
}

.placeholder-text h3 {
  margin: 0 0 0.5rem 0;
  color: #495057;
  font-weight: 500;
  font-size: 1.5rem;
}

.placeholder-text p {
  margin: 0;
  color: #6c757d;
  font-size: 1rem;
}

.tts-message {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  line-height: 1.6;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.listening-state {
  text-align: center;
  color: #495057;
}

.emoji-container {
  margin-bottom: 1.5rem;
}

.emoji {
  font-size: 4rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.listening-state h3 {
  margin: 0 0 0.5rem 0;
  color: #495057;
  font-weight: 500;
  font-size: 1.5rem;
}

.listening-state p {
  margin: 0;
  color: #6c757d;
  font-size: 1rem;
}

.speaking-state {
  text-align: center;
  color: #495057;
}

.speaking-state h3 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-weight: 500;
  font-size: 1.5rem;
}

.speaking-emoji {
  animation: speak 1.5s infinite;
}

@keyframes speak {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.action-button-container {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
}

.main-action-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.main-action-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.say-hi-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.say-hi-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0,0,0,0.15);
}

.say-hi-button:active:not(:disabled) {
  transform: translateY(0);
}

.stop-button {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
}

.stop-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff5252 0%, #e04848 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0,0,0,0.15);
}

.stop-button:active:not(:disabled) {
  transform: translateY(0);
}

.button-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.button-icon {
  width: 24px;
  height: 24px;
}

.button-icon svg {
  width: 100%;
  height: 100%;
}

.button-text {
  font-size: 1rem;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-text-area {
    margin: 1rem;
    padding: 1.5rem;
    min-height: 300px;
  }
  
  .placeholder-text h3 {
    font-size: 1.25rem;
  }
  
  .emoji {
    font-size: 3rem;
  }
  
  .main-action-button {
    min-width: 120px;
    height: 50px;
    font-size: 1rem;
  }
  
  .action-button-container {
    padding-top: 1.5rem;
  }
}
</style> 