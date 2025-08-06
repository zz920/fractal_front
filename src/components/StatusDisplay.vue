<template>
  <div class="status-display">
    <div class="status-card">
      <h3>系统状态</h3>
      
      <div class="status-grid">
        <div class="status-item">
          <div class="status-label">服务器状态</div>
          <div class="status-value">
            <div class="status-dot" :class="serverStatusClass"></div>
            <span>{{ serverStatusText }}</span>
          </div>
        </div>
        
        <div class="status-item">
          <div class="status-label">WebSocket连接</div>
          <div class="status-value">
            <div class="status-dot" :class="connectionStatusClass"></div>
            <span>{{ connectionStatusText }}</span>
          </div>
        </div>
        
        <div class="status-item microphone-section">
          <div class="status-header">
            <div class="status-label">麦克风状态</div>
            <div class="status-value">
              <div class="status-dot" :class="microphoneStatusClass"></div>
              <span>{{ microphoneStatusText }}</span>
            </div>
          </div>
          <div class="microphone-control">
            <button 
              @click="$emit('toggle-microphone')"
              :class="{ active: microphoneEnabled }"
              class="mic-button"
            >
              <div class="mic-icon">
                <svg v-if="!microphoneEnabled" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </div>
              <span class="button-text">
                {{ microphoneEnabled ? '关闭' : '开启' }}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="system-info">
        <div class="info-item">
          <span class="info-label">固件版本:</span>
          <span class="info-value">v1.0.0</span>
        </div>
        <div class="info-item">
          <span class="info-label">运行时间:</span>
          <span class="info-value">{{ uptime }}</span>
        </div>
      </div>
      
      <div class="config-actions">
        <button 
          @click="fetchConfig"
          class="btn btn-primary"
          :disabled="isFetching"
        >
          {{ isFetching ? '查询中...' : '查询配置' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'StatusDisplay',
  props: {
    connectionStatus: {
      type: String,
      default: 'unconfigured'
    },
    microphoneStatus: {
      type: String,
      default: 'inactive'
    },
    microphoneEnabled: {
      type: Boolean,
      default: false
    },
    serverStatus: {
      type: String,
      default: 'unknown'
    }
  },
  emits: ['fetch-config', 'toggle-microphone'],
  setup(props, { emit }) {
    const startTime = ref(Date.now())
    const uptime = ref('00:00:00')
    const isFetching = ref(false)
    let uptimeInterval = null
    
    const updateUptime = () => {
      const elapsed = Date.now() - startTime.value
      const hours = Math.floor(elapsed / 3600000)
      const minutes = Math.floor((elapsed % 3600000) / 60000)
      const seconds = Math.floor((elapsed % 60000) / 1000)
      uptime.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    
    onMounted(() => {
      uptimeInterval = setInterval(updateUptime, 1000)
    })
    
    onUnmounted(() => {
      if (uptimeInterval) {
        clearInterval(uptimeInterval)
      }
    })
    
    const connectionStatusClass = computed(() => {
      switch (props.connectionStatus) {
        case 'connected': return 'success'
        case 'available': return 'info'
        case 'connecting': return 'warning'
        case 'failed': return 'error'
        default: return 'inactive'
      }
    })
    
    const connectionStatusText = computed(() => {
      switch (props.connectionStatus) {
        case 'connected': return '已连接'
        case 'available': return '可连接'
        case 'connecting': return '连接中...'
        case 'failed': return '未连接'
        default: return '未配置'
      }
    })

    const serverStatusClass = computed(() => {
      switch (props.serverStatus) {
        case 'online': return 'success'
        case 'offline': return 'inactive'
        case 'error': return 'error'
        default: return 'inactive'
      }
    })
    
    const serverStatusText = computed(() => {
      switch (props.serverStatus) {
        case 'online': return '在线'
        case 'offline': return '不在线'
        case 'error': return '连接错误'
        default: return '未知'
      }
    })
    
    const microphoneStatusClass = computed(() => {
      switch (props.microphoneStatus) {
        case 'active': return 'success'
        case 'error': return 'error'
        default: return 'inactive'
      }
    })
    
    const microphoneStatusText = computed(() => {
      switch (props.microphoneStatus) {
        case 'active': return '已激活'
        case 'error': return '权限错误'
        default: return '未激活'
      }
    })
    
    const fetchConfig = async () => {
      isFetching.value = true
      try {
        emit('fetch-config')
      } finally {
        setTimeout(() => {
          isFetching.value = false
        }, 1000)
      }
    }
    
    return {
      uptime,
      isFetching,
      connectionStatusClass,
      connectionStatusText,
      serverStatusClass,
      serverStatusText,
      microphoneStatusClass,
      microphoneStatusText,
      fetchConfig
    }
  }
}
</script>

<style scoped>
.status-display {
  width: 100%;
  max-width: 500px;
}

.status-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.status-card h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-weight: 500;
  text-align: center;
}

.status-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.microphone-section {
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.microphone-section .status-label {
  font-weight: 500;
  color: #495057;
}

.microphone-section .status-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.microphone-control {
  display: flex;
  justify-content: center;
}

.mic-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: #f8f9fa;
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mic-button:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.mic-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.mic-icon {
  width: 16px;
  height: 16px;
}

.mic-icon svg {
  width: 100%;
  height: 100%;
}

.button-text {
  font-size: 0.9rem;
}

.status-label {
  font-weight: 500;
  color: #495057;
}

.status-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
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

.status-dot.info {
  background-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
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

.system-info {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
}

.info-value {
  color: #6c757d;
  font-size: 0.9rem;
}

.config-actions {
  display: flex;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}
</style> 