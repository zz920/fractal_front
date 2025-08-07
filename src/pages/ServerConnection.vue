<template>
  <div class="server-connection">
    <div class="page-header">
      <h1>服务器连接</h1>
      <p>管理和监控MCP服务器连接状态</p>
    </div>
    
    <div class="connection-content">
      <!-- 连接状态 -->
      <div class="connection-status">
        <h2>连接状态</h2>
        <div class="status-grid">
          <div class="status-card">
            <div class="status-icon" :class="{ connected: isConnected }">
              <i :class="isConnected ? 'fas fa-wifi' : 'fas fa-wifi-slash'"></i>
            </div>
            <div class="status-info">
              <h3>{{ isConnected ? '已连接' : '未连接' }}</h3>
              <p>{{ isConnected ? '服务器连接正常' : '无法连接到服务器' }}</p>
            </div>
          </div>
          
          <div class="status-card">
            <div class="status-icon" :class="{ connected: isHealthy }">
              <i :class="isHealthy ? 'fas fa-heartbeat' : 'fas fa-heart-broken'"></i>
            </div>
            <div class="status-info">
              <h3>{{ isHealthy ? '健康' : '异常' }}</h3>
              <p>{{ isHealthy ? '服务器运行正常' : '服务器运行异常' }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 连接配置 -->
      <div class="connection-config">
        <h2>连接配置</h2>
        <div class="config-card">
          <div class="config-item">
            <label>服务器地址</label>
            <input type="text" v-model="serverUrl" placeholder="https://fractal.cpolar.cn:443" />
          </div>
          <div class="config-item">
            <label>端口</label>
            <input type="number" v-model="serverPort" placeholder="443" />
          </div>
          <div class="config-item">
            <label>超时时间 (秒)</label>
            <input type="number" v-model="timeout" placeholder="30" />
          </div>
          <div class="config-item">
            <label>重试次数</label>
            <input type="number" v-model="retryCount" placeholder="3" />
          </div>
          <div class="config-actions">
            <button class="test-btn" @click="testConnection">
              测试连接
            </button>
            <button class="save-btn" @click="saveConfig">
              保存配置
            </button>
          </div>
        </div>
      </div>
      
      <!-- 连接日志 -->
      <div class="connection-logs">
        <h2>连接日志</h2>
        <div class="logs-card">
          <div class="logs-header">
            <button class="clear-btn" @click="clearLogs">
              清空日志
            </button>
          </div>
          <div class="logs-content">
            <div v-for="(log, index) in connectionLogs" :key="index" class="log-item" :class="log.type">
              <span class="log-time">{{ log.time }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 服务信息 -->
      <div class="service-info">
        <h2>服务信息</h2>
        <div class="info-grid">
          <div class="info-card">
            <h3>服务器信息</h3>
            <ul>
              <li><strong>地址:</strong> {{ serverInfo.address || '未知' }}</li>
              <li><strong>版本:</strong> {{ serverInfo.version || '未知' }}</li>
              <li><strong>运行时间:</strong> {{ serverInfo.uptime || '未知' }}</li>
              <li><strong>负载:</strong> {{ serverInfo.load || '未知' }}</li>
            </ul>
          </div>
          
          <div class="info-card">
            <h3>API状态</h3>
            <ul>
              <li><strong>DeepSeek-V3:</strong> <span :class="apiStatus.deepseekV3 ? 'status-ok' : 'status-error'">{{ apiStatus.deepseekV3 ? '正常' : '异常' }}</span></li>
              <li><strong>MCP协调器:</strong> <span :class="apiStatus.mcpCoordinator ? 'status-ok' : 'status-error'">{{ apiStatus.mcpCoordinator ? '正常' : '异常' }}</span></li>
              <li><strong>浏览器服务:</strong> <span :class="apiStatus.browserService ? 'status-ok' : 'status-error'">{{ apiStatus.browserService ? '正常' : '异常' }}</span></li>
              <li><strong>导航服务:</strong> <span :class="apiStatus.navigationService ? 'status-ok' : 'status-error'">{{ apiStatus.navigationService ? '正常' : '异常' }}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'

export default {
  name: 'ServerConnection',
  setup() {
    const isConnected = ref(false)
    const isHealthy = ref(false)
    const serverUrl = ref('https://fractal.cpolar.cn:443')
    const serverPort = ref(443)
    const timeout = ref(30)
    const retryCount = ref(3)
    const connectionLogs = ref([])
    
    const serverInfo = reactive({
      address: '',
      version: '',
      uptime: '',
      load: ''
    })
    
    const apiStatus = reactive({
      deepseekV3: false,
      mcpCoordinator: false,
      browserService: false,
      navigationService: false
    })
    
    const addLog = (message, type = 'info') => {
      const time = new Date().toLocaleTimeString()
      connectionLogs.value.unshift({ time, message, type })
      if (connectionLogs.value.length > 100) {
        connectionLogs.value = connectionLogs.value.slice(0, 100)
      }
    }
    
    const testConnection = async () => {
      addLog('开始测试连接...', 'info')
      try {
        // 这里可以添加实际的连接测试逻辑
        const response = await fetch(`${serverUrl.value}/api/health`)
        if (response.ok) {
          isConnected.value = true
          isHealthy.value = true
          addLog('连接测试成功', 'success')
        } else {
          isConnected.value = false
          isHealthy.value = false
          addLog('连接测试失败', 'error')
        }
      } catch (error) {
        isConnected.value = false
        isHealthy.value = false
        addLog(`连接测试失败: ${error.message}`, 'error')
      }
    }
    
    const saveConfig = () => {
      addLog('保存连接配置', 'info')
      // 这里可以添加保存配置的逻辑
    }
    
    const clearLogs = () => {
      connectionLogs.value = []
      addLog('日志已清空', 'info')
    }
    
    onMounted(() => {
      addLog('页面已加载', 'info')
      testConnection()
    })
    
    return {
      isConnected,
      isHealthy,
      serverUrl,
      serverPort,
      timeout,
      retryCount,
      connectionLogs,
      serverInfo,
      apiStatus,
      testConnection,
      saveConfig,
      clearLogs
    }
  }
}
</script>

<style scoped>
.server-connection {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-header p {
  font-size: 1.1rem;
  color: #666;
}

.connection-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.connection-status h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.status-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
}

.status-icon.connected {
  background: #28a745;
}

.status-icon i {
  font-size: 1.5rem;
  color: white;
}

.status-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.status-info p {
  margin: 0;
  color: #666;
}

.connection-config h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.config-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.config-item {
  margin-bottom: 1.5rem;
}

.config-item label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.config-item input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.config-item input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.config-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.test-btn,
.save-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.test-btn {
  background: #17a2b8;
  color: white;
}

.test-btn:hover {
  background: #138496;
  transform: translateY(-2px);
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.connection-logs h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.logs-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logs-header {
  padding: 1rem 2rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
}

.clear-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #5a6268;
}

.logs-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem 2rem;
}

.log-item {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #6c757d;
  font-size: 0.9rem;
  min-width: 80px;
}

.log-message {
  color: #333;
  flex: 1;
}

.log-item.success .log-message {
  color: #28a745;
}

.log-item.error .log-message {
  color: #dc3545;
}

.log-item.warning .log-message {
  color: #ffc107;
}

.service-info h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  margin-bottom: 1rem;
  color: #333;
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-card li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
  display: flex;
  justify-content: space-between;
}

.info-card li:last-child {
  border-bottom: none;
}

.status-ok {
  color: #28a745;
  font-weight: bold;
}

.status-error {
  color: #dc3545;
  font-weight: bold;
}

@media (max-width: 768px) {
  .server-connection {
    padding: 1rem;
  }
  
  .status-grid,
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .config-actions {
    flex-direction: column;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
}
</style>
