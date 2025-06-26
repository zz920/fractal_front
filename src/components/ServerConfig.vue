<template>
  <div class="server-config-modal" @click.self="$emit('close')">
    <div class="config-card">
      <div class="config-header">
        <h3>服务器配置</h3>
        <button @click="$emit('close')" class="close-button" title="关闭">
          <svg viewBox="0 0 24 24" fill="currentColor" class="close-icon">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </button>
      </div>
      
      <div class="config-status">
        <div class="status-item">
          <span class="status-label">配置状态:</span>
          <div class="status-value">
            <div class="status-dot" :class="configStatusClass"></div>
            <span>{{ configStatusText }}</span>
          </div>
        </div>
        
        <div class="status-item" v-if="hasValidConfig">
          <span class="status-label">配置来源:</span>
          <span class="status-value">{{ configSourceText }}</span>
        </div>
        
        <div class="status-item" v-if="serverUrl">
          <span class="status-label">服务器地址:</span>
          <span class="status-value">{{ serverUrl }}</span>
        </div>
      </div>
      
      <div class="config-actions">
        <button 
          @click="fetchConfig"
          class="btn"
          :class="hasValidConfig ? 'btn-success' : 'btn-secondary'"
          :disabled="!hasValidConfig || isFetching"
        >
          {{ isFetching ? '读取中...' : '读取配置' }}
        </button>
        
        <button 
          @click="reloadConfig"
          class="btn btn-primary"
          :disabled="isReloading"
        >
          {{ isReloading ? '重新加载中...' : '重新加载配置' }}
        </button>
      </div>
      
      <div class="status-section">
        <div class="status-header">
          <h4>服务器状态</h4>
          <div class="status-controls">
            <button 
              @click="togglePolling"
              class="btn btn-sm"
              :class="isStatusPolling ? 'btn-danger' : 'btn-success'"
              :disabled="!hasValidConfig"
            >
              {{ isStatusPolling ? '停止轮询' : '开始轮询' }}
            </button>
          </div>
        </div>
        
        <div class="status-display">
          <div class="status-item">
            <span class="status-label">连接状态:</span>
            <div class="status-value">
              <div class="status-dot" :class="statusClass"></div>
              <span>{{ statusText }}</span>
            </div>
          </div>
          
          <div class="status-item" v-if="websocketUrl">
            <span class="status-label">WebSocket地址:</span>
            <span class="status-value">{{ websocketUrl }}</span>
          </div>
        </div>
      </div>
      
      <div class="config-info" v-if="serverConfig">
        <h4>服务器配置信息</h4>
        <pre class="config-json">{{ JSON.stringify(serverConfig, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useServer } from '../services/server.js'

export default {
  name: 'ServerConfig',
  emits: ['close'],
  setup() {
    const {
      serverStatus,
      serverConfig,
      isStatusPolling,
      serverUrl,
      websocketUrl,
      configLoaded,
      configSource,
      hasValidConfig,
      fetchServerConfig,
      startStatusPolling,
      stopStatusPolling,
      initializeConfig
    } = useServer()

    const isFetching = ref(false)
    const isReloading = ref(false)

    // 计算属性
    const configStatusClass = computed(() => {
      return hasValidConfig.value ? 'success' : 'inactive'
    })

    const configStatusText = computed(() => {
      return hasValidConfig.value ? '已配置' : '未配置'
    })

    const configSourceText = computed(() => {
      switch (configSource.value) {
        case 'file': return '配置文件'
        case 'localStorage': return '本地存储'
        case 'manual': return '手动设置'
        default: return '未知'
      }
    })

    const statusClass = computed(() => {
      switch (serverStatus.value) {
        case 'online': return 'success'
        case 'offline': return 'error'
        case 'error': return 'error'
        default: return 'inactive'
      }
    })

    const statusText = computed(() => {
      switch (serverStatus.value) {
        case 'online': return '在线'
        case 'offline': return '离线'
        case 'error': return '连接错误'
        default: return '未知'
      }
    })

    // 方法
    const fetchConfig = async () => {
      isFetching.value = true
      try {
        await fetchServerConfig()
      } finally {
        isFetching.value = false
      }
    }

    const reloadConfig = async () => {
      isReloading.value = true
      try {
        await initializeConfig()
      } finally {
        isReloading.value = false
      }
    }

    const togglePolling = () => {
      if (isStatusPolling.value) {
        stopStatusPolling()
      } else {
        startStatusPolling()
      }
    }

    return {
      // 状态
      isFetching,
      isReloading,
      
      // 服务器状态
      serverStatus,
      serverConfig,
      isStatusPolling,
      serverUrl,
      websocketUrl,
      configLoaded,
      configSource,
      hasValidConfig,
      
      // 计算属性
      configStatusClass,
      configStatusText,
      configSourceText,
      statusClass,
      statusText,
      
      // 方法
      fetchConfig,
      reloadConfig,
      togglePolling
    }
  }
}
</script>

<style scoped>
.server-config-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.config-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.config-header h3 {
  margin: 0;
  color: #333;
  font-weight: 500;
  text-align: left;
}

.close-button {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: #f8f9fa;
  color: #495057;
  transform: scale(1.1);
}

.close-icon {
  width: 20px;
  height: 20px;
}

.config-status {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
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

.status-dot.error {
  background-color: #dc3545;
  box-shadow: 0 0 8px rgba(220, 53, 69, 0.5);
}

.status-dot.inactive {
  background-color: #6c757d;
}

.config-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
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

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}

.status-section {
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-header h4 {
  margin: 0;
  color: #333;
  font-weight: 500;
}

.status-display {
  display: grid;
  gap: 0.75rem;
}

.config-info {
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
}

.config-info h4 {
  margin: 0 0 1rem 0;
  color: #333;
  font-weight: 500;
}

.config-json {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.8rem;
  color: #495057;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style> 