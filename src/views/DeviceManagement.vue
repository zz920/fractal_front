<template>
  <div class="device-management">
    <!-- 顶部标题栏 -->
    <div class="top-header">
      <h1 class="page-title">设备管理</h1>
      <div class="user-profile">
        <div class="user-avatar">{{ userStore.userInfo.avatar }}</div>
        <span class="user-name">{{ userStore.userInfo.username }}</span>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 初始状态（无设备连接） -->
      <div class="current-device-section" v-show="!isDeviceBound">
        <div class="current-device-info">
          <div class="device-status-icon">✕</div>
          <div class="device-status-text">暂无连接设备</div>
        </div>
        <button class="bind-device-btn" @click="showDeviceBindingModal">
          <i class="fa-solid fa-plus"></i>
          开始绑定设备
        </button>
      </div>
      
      <!-- 已绑定设备状态 -->
      <div class="current-device-section" v-show="isDeviceBound">
        <div class="current-device-info">
          <div class="current-device-title">当前设备</div>
          <div class="device-name">设备一</div>
        </div>
        <button class="unbind-device-btn" @click="unbindCurrentDevice">
          <i class="fa-solid fa-unlink"></i>
          解绑设备
        </button>
      </div>
      
      <div class="device-management-section">
        <div class="section-title">设备管理</div>
        <div class="glasses-subtitle">我的眼镜</div>
        
        <!-- 初始状态设备卡片 -->
        <div class="device-cards-container" v-show="!isDeviceBound">
          <div class="add-device-card" @click="showDeviceBindingModal">
            <i class="fa-solid fa-plus"></i>
            <div class="add-device-card-text">添加更多眼镜</div>
          </div>
        </div>
        
        <!-- 已绑定设备卡片 -->
        <div class="device-cards-container" v-show="isDeviceBound">
          <div class="device-card">
            <div class="device-card-icon">👓</div>
            <div class="device-card-name">设备一</div>
            <div class="device-card-actions">
              <button class="device-action-btn" @click="viewDeviceDetails">查看详情</button>
              <button class="device-action-btn" @click="unbindDevice">解绑设备</button>
            </div>
          </div>
          <div class="add-device-card" @click="showDeviceBindingModal">
            <i class="fa-solid fa-plus"></i>
            <div class="add-device-card-text">添加更多眼镜</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 设备绑定模态框 -->
    <div class="modal-overlay" v-show="showBindingModal" @click="hideDeviceBindingModal">
      <div class="device-binding-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">设备绑定</div>
          <button class="close-btn" @click="hideDeviceBindingModal">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        
        <div class="form-group">
          <label class="form-label">
            <span class="required">*</span>验证码
          </label>
          <input 
            type="text" 
            class="form-input" 
            placeholder="请输入设备显示的验证码" 
            v-model="verificationCode"
            @keypress="handleVerificationKeyPress"
          >
          <div class="warning-message" v-show="showWarningMessage">
            验证码错误，请重新输入
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="cancel-btn" @click="hideDeviceBindingModal">取消</button>
          <button class="confirm-btn" @click="confirmBinding">确定</button>
        </div>
      </div>
    </div>
    
    <!-- 已绑定设备模态框 -->
    <div class="modal-overlay" v-show="showBoundDeviceModal" @click="hideBoundDeviceModal">
      <div class="bound-device-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">设备管理</div>
          <button class="close-btn" @click="hideBoundDeviceModal">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        
        <div class="device-info">
          <div class="device-icon">✓</div>
          <div class="device-details">
            <h3>Fractal智能眼镜</h3>
            <p>设备已连接 • 电量: 85% • 信号强度: 强</p>
          </div>
        </div>
        
        <div class="device-actions">
          <button class="view-details-btn" @click="viewDeviceDetails">
            <i class="fa-solid fa-info-circle"></i> 查看详情
          </button>
          <button class="unbind-btn" @click="unbindDevice">
            <i class="fa-solid fa-unlink"></i> 解绑设备
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

export default {
  name: 'DeviceManagement',
  setup() {
    const userStore = useUserStore()
    
    // 响应式状态
    const isDeviceBound = ref(false)
    const showBindingModal = ref(false)
    const showBoundDeviceModal = ref(false)
    const verificationCode = ref('')
    const showWarningMessage = ref(false)
    
    // 显示设备绑定模态框
    const showDeviceBindingModal = () => {
      showBindingModal.value = true
      verificationCode.value = ''
      showWarningMessage.value = false
    }
    
    // 隐藏设备绑定模态框
    const hideDeviceBindingModal = () => {
      showBindingModal.value = false
      verificationCode.value = ''
      showWarningMessage.value = false
    }
    
    // 确认绑定
    const confirmBinding = () => {
      const code = verificationCode.value.trim()
      
      if (!code) {
        alert('请输入验证码')
        return
      }
      
      if (code === '1234') {
        // 验证码正确，更新设备管理界面状态
        hideDeviceBindingModal()
        updateToBoundDeviceState()
      } else {
        // 验证码错误，显示警告
        showWarningMessage.value = true
        verificationCode.value = ''
      }
    }
    
    // 处理验证码输入框回车事件
    const handleVerificationKeyPress = (e) => {
      if (e.key === 'Enter') {
        confirmBinding()
      }
    }
    
    // 更新为已绑定设备状态
    const updateToBoundDeviceState = () => {
      isDeviceBound.value = true
      localStorage.setItem('deviceBound', 'true')
    }
    
    // 更新为初始状态
    const updateToInitialState = () => {
      isDeviceBound.value = false
      localStorage.removeItem('deviceBound')
    }
    
         // 显示已绑定设备模态框
     const showBoundDeviceModalFunc = () => {
       showBoundDeviceModal.value = true
     }
    
    // 隐藏已绑定设备模态框
    const hideBoundDeviceModal = () => {
      showBoundDeviceModal.value = false
    }
    
    // 查看设备详情
    const viewDeviceDetails = () => {
      showBoundDeviceModal.value = true
    }
    
    // 解绑设备
    const unbindDevice = () => {
      if (confirm('确定要解绑设备吗？')) {
        hideBoundDeviceModal()
        updateToInitialState()
        alert('设备已解绑')
      }
    }
    
    // 解绑当前设备
    const unbindCurrentDevice = () => {
      if (confirm('确定要解绑设备吗？')) {
        updateToInitialState()
        alert('设备已解绑')
      }
    }
    
    // 检查设备绑定状态
    const checkDeviceBindingState = () => {
      const isBound = localStorage.getItem('deviceBound') === 'true'
      if (isBound) {
        updateToBoundDeviceState()
      }
    }
    
    onMounted(() => {
      // 初始化用户状态
      userStore.initializeFromStorage()
      // 检查设备绑定状态
      checkDeviceBindingState()
    })
    
    return {
      userStore,
      isDeviceBound,
      showBindingModal,
      showBoundDeviceModal,
      verificationCode,
      showWarningMessage,
             showDeviceBindingModal,
       hideDeviceBindingModal,
       confirmBinding,
       handleVerificationKeyPress,
       showBoundDeviceModal,
       hideBoundDeviceModal,
       viewDeviceDetails,
       unbindDevice,
       unbindCurrentDevice
    }
  }
}
</script>

<style scoped>
.device-management {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgb(238,235,245);
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
  gap: 30px;
}

.current-device-section {
  background: #e3d6f7;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 15px;
  border: 1px solid #333;
}

.current-device-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.device-status-icon {
  font-size: 4rem;
  color: #999;
}

.device-status-text {
  font-size: 1.4rem;
  color: #e74c3c;
  font-weight: bold;
}

.bind-device-btn {
  background: #b6a6f7;
  color: #fff;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 16px rgba(182, 166, 247, 0.3);
}

.bind-device-btn:hover {
  background: #a595e6;
  transform: translateY(-2px);
}

.bind-device-btn i {
  font-size: 1.3rem;
}

.device-management-section {
  background: #e3d6f7;
  border-radius: 16px;
  padding: 30px;
  margin-left: 15px;
  border: 1px solid #333;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2d1ed6;
  margin-bottom: 20px;
}

.glasses-subtitle {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 20px;
}

.device-cards-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.device-card {
  width: 120px;
  height: 120px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.2s;
  position: relative;
}

.device-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.device-card-icon {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 8px;
}

.device-card-name {
  font-size: 1rem;
  color: #333;
  font-weight: bold;
}

.device-card-actions {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.device-card:hover .device-card-actions {
  opacity: 1;
}

.device-action-btn {
  background: #fff;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
}

.device-action-btn:hover {
  background: #e74c3c;
  color: #fff;
}

.add-device-card {
  width: 120px;
  height: 120px;
  background: #ccc;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.add-device-card:hover {
  background: #bbb;
  transform: translateY(-2px);
}

.add-device-card i {
  font-size: 3rem;
  color: #fff;
  margin-bottom: 8px;
}

.add-device-card-text {
  font-size: 0.9rem;
  color: #333;
  text-align: center;
}

/* 已绑定设备状态样式 */
.current-device-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2d1ed6;
  margin-bottom: 15px;
}

.device-name {
  font-size: 1.4rem;
  color: #8b5a8b;
  font-weight: bold;
}

.unbind-device-btn {
  background: #b6a6f7;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.unbind-device-btn:hover {
  background: #a595e6;
  transform: translateY(-2px);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-binding-modal {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.modal-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2d1ed6;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 8px;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 8px;
  font-weight: bold;
}

.required {
  color: #e74c3c;
}

.form-input {
  width: 100%;
  height: 50px;
  border: 2px solid #e3d6f7;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 1.1rem;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #6ec6fa;
}

.form-input::placeholder {
  color: #bbb;
}

.warning-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #e8e8e8;
}

.confirm-btn {
  background: #6ec6fa;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
}

.confirm-btn:hover {
  background: #5bb5e9;
}

/* 已绑定设备模态框样式 */
.bound-device-modal {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.device-info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.device-icon {
  font-size: 3rem;
  color: #28a745;
}

.device-details h3 {
  margin: 0 0 8px 0;
  color: #2d1ed6;
  font-size: 1.4rem;
}

.device-details p {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

.device-actions {
  display: flex;
  gap: 15px;
}

.view-details-btn {
  background: #6ec6fa;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  flex: 1;
}

.view-details-btn:hover {
  background: #5bb5e9;
}

.unbind-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  flex: 1;
}

.unbind-btn:hover {
  background: #c0392b;
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
  
  .current-device-section {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .device-cards-container {
    justify-content: center;
  }
  
  .device-binding-modal,
  .bound-device-modal {
    margin: 20px;
    padding: 20px;
  }
}
</style> 