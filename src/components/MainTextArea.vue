<template>
  <div class="main-text-area">
    <div class="text-container">
      <!-- 连接中状态 -->
      <div v-if="displayState === 'connecting'" class="placeholder-text">
        <div class="placeholder-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
          </svg>
        </div>
        <h3>Fractal语音助手</h3>
        <p>正在连接服务器...</p>
        <div class="connection-status">
          <div class="status-dot" :class="connectionStatusClass"></div>
          <span>{{ connectionStatusText }}</span>
        </div>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="displayState === 'error'" class="placeholder-text">
        <div class="placeholder-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
          </svg>
        </div>
        <h3>Fractal语音助手</h3>
        <p>连接服务器失败</p>
        <div class="connection-status">
          <div class="status-dot" :class="connectionStatusClass"></div>
          <span>{{ connectionStatusText }}</span>
        </div>
      </div>
      
      <!-- 监听状态 - 显示emoji笑脸 -->
      <div v-else-if="displayState === 'listening'" class="listening-state">
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
      
      <!-- 默认连接状态 -->
      <div v-else class="placeholder-text">
        <div class="placeholder-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
          </svg>
        </div>
        <h3>Fractal语音助手</h3>
        <p>等待连接服务器...</p>
        <div class="connection-status">
          <div class="status-dot" :class="connectionStatusClass"></div>
          <span>{{ connectionStatusText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'MainTextArea',
  props: {
    connectionStatus: {
      type: String,
      default: 'disconnected'
    },
    currentText: {
      type: String,
      default: ''
    },
    displayState: {
      type: String,
      default: 'connected'
    }
  },
  setup(props) {
    const connectionStatusClass = computed(() => {
      switch (props.connectionStatus) {
        case 'connected': return 'success'
        case 'connecting': return 'warning'
        case 'error': return 'error'
        default: return 'inactive'
      }
    })

    const connectionStatusText = computed(() => {
      switch (props.connectionStatus) {
        case 'connected': return '已连接到服务器'
        case 'connecting': return '正在连接服务器...'
        case 'error': return '连接服务器失败'
        default: return '未连接到服务器'
      }
    })

    return {
      connectionStatusClass,
      connectionStatusText
    }
  }
}
</script>

<style scoped>
.main-text-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  margin: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  min-height: 400px;
}

.text-container {
  width: 100%;
  height: 100%;
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
  margin: 0 0 1rem 0;
  color: #6c757d;
  font-size: 1rem;
}

.connection-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.tts-text {
  width: 100%;
  text-align: center;
}

.text-content h3 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-weight: 500;
  font-size: 1.2rem;
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

.speaking-emoji {
  animation: speak 1.5s infinite;
}

@keyframes speak {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.speaking-state h3 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-weight: 500;
  font-size: 1.2rem;
}

.speaking-state .tts-message {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  line-height: 1.6;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  text-align: left;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.status-dot.success {
  background-color: #28a745;
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.5);
}

.status-dot.warning {
  background-color: #ffc107;
  box-shadow: 0 0 8px rgba(255, 193, 7, 0.5);
}

.status-dot.error {
  background-color: #dc3545;
  box-shadow: 0 0 8px rgba(220, 53, 69, 0.5);
}

.status-dot.inactive {
  background-color: #6c757d;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-text-area {
    margin: 0.5rem;
    padding: 1rem;
    min-height: 300px;
  }
  
  .placeholder-icon svg {
    width: 48px;
    height: 48px;
  }
  
  .placeholder-text h3 {
    font-size: 1.2rem;
  }
  
  .tts-message {
    font-size: 1rem;
    padding: 0.75rem;
  }
}
</style> 