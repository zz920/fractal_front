<template>
  <div class="device-page">

    <!-- 设备管理主要内容 -->
    <div class="device-content">
      <!-- 操作栏 -->
      <div class="action-bar">
        <button 
          @click="showAddForm = true"
          class="add-device-btn"
          :disabled="isLoading"
        >
          <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
          <span>添加设备</span>
        </button>
      </div>

      <!-- 设备列表区域 -->
      <div class="device-list-container">
        <div v-if="isLoading && devices.length === 0" class="loading-state">
          <div class="loading-spinner"></div>
          <p>正在加载设备列表...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <div class="error-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
            </svg>
          </div>
          <h3>加载失败</h3>
          <p>{{ error }}</p>
          <button @click="loadDevices" class="retry-btn">重试</button>
        </div>

        <div v-else-if="devices.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,3H7A2,2 0 0,0 5,5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V5A2,2 0 0,0 17,3M17,19H7V5H17V19M16,10H13V7H16V10M12,7V10H9V7H12M16,11V14H13V11H16M12,11V14H9V11H12M16,15V18H13V15H16M12,15V18H9V15H12"/>
            </svg>
          </div>
          <h3>暂无设备</h3>
          <p>您还没有注册任何设备，点击上方按钮添加您的第一个设备。</p>
        </div>

        <DeviceList 
          v-else
          :devices="devices"
          :loading="isLoading"
          @delete-device="handleDeleteDevice"
        />
      </div>
    </div>

    <!-- 添加设备表单侧边栏 -->
    <div 
      v-if="showAddForm"
      class="form-sidebar-overlay"
      @click="showAddForm = false"
    >
      <div class="form-sidebar" @click.stop>
        <DeviceForm
          @submit="handleAddDevice"
          @cancel="showAddForm = false"
          :loading="isLoading"
        />
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div 
      v-if="showDeleteDialog"
      class="dialog-overlay"
      @click="showDeleteDialog = false"
    >
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <h3>确认删除</h3>
        </div>
        <div class="dialog-content">
          <p>确定要删除设备 <strong>{{ deviceToDelete?.device_name }}</strong> 吗？</p>
          <p class="warning-text">此操作不可撤销。</p>
        </div>
        <div class="dialog-actions">
          <button @click="showDeleteDialog = false" class="btn btn-cancel">
            取消
          </button>
          <button 
            @click="confirmDelete" 
            class="btn btn-danger"
            :disabled="isLoading"
          >
            {{ isLoading ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useDevice } from '../../services/device.js'
import DeviceList from '../../components/DeviceList.vue'
import DeviceForm from '../../components/DeviceForm.vue'

export default {
  name: 'Device',
  components: {
    DeviceList,
    DeviceForm
  },
  setup() {
    const {
      devices,
      isLoading,
      error,
      getDevices,
      registerDevice,
      deleteDevice,
      clearError
    } = useDevice()

    // 界面状态
    const showAddForm = ref(false)
    const showDeleteDialog = ref(false)
    const deviceToDelete = ref(null)

    // 加载设备列表
    const loadDevices = async () => {
      try {
        await getDevices()
      } catch (err) {
        console.error('加载设备列表失败:', err)
      }
    }

    // 处理添加设备
    const handleAddDevice = async (deviceData) => {
      try {
        await registerDevice(deviceData)
        showAddForm.value = false
        // 添加成功后重新加载列表
        await loadDevices()
      } catch (err) {
        console.error('添加设备失败:', err)
        // 错误处理由子组件负责
      }
    }

    // 处理删除设备
    const handleDeleteDevice = (device) => {
      deviceToDelete.value = device
      showDeleteDialog.value = true
    }

    // 确认删除
    const confirmDelete = async () => {
      if (!deviceToDelete.value) return
      
      try {
        await deleteDevice(deviceToDelete.value.id)
        showDeleteDialog.value = false
        deviceToDelete.value = null
      } catch (err) {
        console.error('删除设备失败:', err)
        // 错误会显示在界面上
      }
    }

    // 页面加载时获取设备列表
    onMounted(() => {
      loadDevices()
    })

    return {
      devices,
      isLoading,
      error,
      showAddForm,
      showDeleteDialog,
      deviceToDelete,
      loadDevices,
      handleAddDevice,
      handleDeleteDevice,
      confirmDelete
    }
  }
}
</script>

<style scoped>
.device-page {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #EEEBF5;
  min-height: 100vh;
}

.device-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.add-device-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-device-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.add-device-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.device-list-container {
  min-height: 400px;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon,
.empty-icon {
  width: 64px;
  height: 64px;
  color: #dee2e6;
  margin-bottom: 1rem;
}

.error-state h3,
.empty-state h3 {
  color: #495057;
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-family: '优设标题黑', sans-serif;
}

.error-state p,
.empty-state p {
  color: #6c757d;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.retry-btn:hover {
  background: #5a6fd8;
}

.form-sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  animation: fadeIn 0.3s ease;
}

.form-sidebar {
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 20px rgba(0,0,0,0.1);
  animation: slideInRight 0.3s ease;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.dialog {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  max-width: 400px;
  width: 90%;
  animation: slideIn 0.3s ease;
}

.dialog-header h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.25rem;
  font-family: '优设标题黑', sans-serif;
}

.dialog-content {
  margin-bottom: 1.5rem;
}

.dialog-content p {
  margin: 0 0 0.5rem 0;
  color: #495057;
  line-height: 1.5;
}

.warning-text {
  color: #dc3545;
  font-size: 0.9rem;
}

.dialog-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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

.btn-cancel {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.btn-cancel:hover {
  background: #e9ecef;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
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

/* 响应式设计 */
@media (max-width: 768px) {
  .form-sidebar {
    width: 100%;
  }
  
  .action-bar {
    padding: 0.75rem;
  }
  
  .add-device-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
  
  .dialog {
    margin: 1rem;
    max-width: none;
  }
}
</style> 