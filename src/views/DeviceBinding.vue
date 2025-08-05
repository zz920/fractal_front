<template>
  <div class="device-binding">
    <div class="page-header">
      <h1>设备绑定</h1>
      <p>管理您的语音助手设备</p>
    </div>
    
    <div class="binding-content">
      <div class="binding-card">
        <h2>已绑定设备</h2>
        <div class="devices-list">
          <div v-for="device in boundDevices" :key="device.id" class="device-item">
            <div class="device-info">
              <div class="device-icon">
                <i :class="device.icon"></i>
              </div>
              <div class="device-details">
                <h3>{{ device.name }}</h3>
                <p>{{ device.type }} • {{ device.status }}</p>
                <p class="device-id">ID: {{ device.id }}</p>
              </div>
            </div>
            <div class="device-actions">
              <button class="btn btn-secondary" @click="configureDevice(device)">
                配置
              </button>
              <button class="btn btn-danger" @click="unbindDevice(device)">
                解绑
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="binding-card">
        <h2>添加新设备</h2>
        <div class="add-device-section">
          <div class="device-types">
            <div 
              v-for="type in deviceTypes" 
              :key="type.id"
              class="device-type-card"
              @click="selectDeviceType(type)"
              :class="{ 'selected': selectedType?.id === type.id }"
            >
              <div class="type-icon">
                <i :class="type.icon"></i>
              </div>
              <div class="type-info">
                <h3>{{ type.name }}</h3>
                <p>{{ type.description }}</p>
              </div>
            </div>
          </div>
          
          <div v-if="selectedType" class="binding-steps">
            <h3>绑定步骤</h3>
            <div class="steps-list">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>准备设备</h4>
                  <p>{{ selectedType.steps[0] }}</p>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>扫描二维码</h4>
                  <p>{{ selectedType.steps[1] }}</p>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>确认绑定</h4>
                  <p>{{ selectedType.steps[2] }}</p>
                </div>
              </div>
            </div>
            
            <div class="qr-section">
              <div class="qr-code">
                <div class="qr-placeholder">
                  <i class="fa-solid fa-qrcode"></i>
                  <p>二维码</p>
                </div>
              </div>
              <button class="btn btn-primary" @click="startBinding">
                开始绑定
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="binding-card">
        <h2>设备管理</h2>
        <div class="management-actions">
          <button class="btn btn-secondary" @click="refreshDevices">
            刷新设备列表
          </button>
          <button class="btn btn-secondary" @click="exportDevices">
            导出设备配置
          </button>
          <button class="btn btn-secondary" @click="importDevices">
            导入设备配置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'

export default {
  name: 'DeviceBinding',
  setup() {
    const boundDevices = reactive([
      {
        id: 'DEV001',
        name: '客厅智能音箱',
        type: '智能音箱',
        status: '在线',
        icon: 'fa-solid fa-speaker'
      },
      {
        id: 'DEV002',
        name: '卧室语音助手',
        type: '语音助手',
        status: '离线',
        icon: 'fa-solid fa-microphone'
      }
    ])
    
    const deviceTypes = reactive([
      {
        id: 'speaker',
        name: '智能音箱',
        description: '支持语音交互的智能音箱设备',
        icon: 'fa-solid fa-speaker',
        steps: [
          '确保音箱已开机并处于配对模式',
          '用手机扫描音箱上的二维码',
          '在手机上确认绑定请求'
        ]
      },
      {
        id: 'assistant',
        name: '语音助手',
        description: '便携式语音助手设备',
        icon: 'fa-solid fa-microphone',
        steps: [
          '长按设备上的配对按钮3秒',
          '扫描设备屏幕上显示的二维码',
          '等待设备自动连接确认'
        ]
      },
      {
        id: 'phone',
        name: '手机应用',
        description: '在手机上使用语音助手',
        icon: 'fa-solid fa-mobile-screen',
        steps: [
          '下载并安装语音助手应用',
          '扫描网页上的二维码',
          '在应用中确认授权登录'
        ]
      }
    ])
    
    const selectedType = ref(null)
    
    const selectDeviceType = (type) => {
      selectedType.value = type
    }
    
    const startBinding = () => {
      console.log('开始绑定设备:', selectedType.value.name)
      alert('正在启动设备绑定流程...')
    }
    
    const configureDevice = (device) => {
      console.log('配置设备:', device.name)
      alert(`配置设备: ${device.name}`)
    }
    
    const unbindDevice = (device) => {
      console.log('解绑设备:', device.name)
      if (confirm(`确认解绑设备: ${device.name}？`)) {
        const index = boundDevices.findIndex(d => d.id === device.id)
        if (index > -1) {
          boundDevices.splice(index, 1)
        }
      }
    }
    
    const refreshDevices = () => {
      alert('正在刷新设备列表...')
    }
    
    const exportDevices = () => {
      alert('导出设备配置')
    }
    
    const importDevices = () => {
      alert('导入设备配置')
    }
    
    return {
      boundDevices,
      deviceTypes,
      selectedType,
      selectDeviceType,
      startBinding,
      configureDevice,
      unbindDevice,
      refreshDevices,
      exportDevices,
      importDevices
    }
  }
}
</script>

<style scoped>
.device-binding {
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2d1ed6;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.binding-content {
  max-width: 1200px;
}

.binding-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid #e3d6f7;
}

.binding-card h2 {
  color: #2d1ed6;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.devices-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px solid #e1e5e9;
}

.device-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.device-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #6ec6fa 0%, #4bb6e6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.device-details h3 {
  color: #2d1ed6;
  margin-bottom: 0.25rem;
  font-size: 1.2rem;
}

.device-details p {
  color: #666;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.device-id {
  font-family: monospace;
  color: #999;
  font-size: 0.8rem;
}

.device-actions {
  display: flex;
  gap: 0.5rem;
}

.device-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.device-type-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.device-type-card:hover {
  border-color: #6ec6fa;
  transform: translateY(-2px);
}

.device-type-card.selected {
  border-color: #6ec6fa;
  background: linear-gradient(135deg, #f0f8ff 0%, #e3d6f7 100%);
}

.type-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6ec6fa 0%, #4bb6e6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
}

.type-info h3 {
  color: #2d1ed6;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.type-info p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.binding-steps h3 {
  color: #2d1ed6;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.step-number {
  width: 30px;
  height: 30px;
  background: #6ec6fa;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content h4 {
  color: #2d1ed6;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.step-content p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.qr-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.qr-code {
  text-align: center;
}

.qr-placeholder {
  width: 150px;
  height: 150px;
  background: white;
  border: 2px dashed #ccc;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.qr-placeholder i {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.management-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #6ec6fa 0%, #4bb6e6 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(110, 198, 250, 0.3);
}

.btn-secondary {
  background: white;
  color: #666;
  border: 2px solid #e1e5e9;
}

.btn-secondary:hover {
  background: #f8f9fa;
  border-color: #6ec6fa;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .device-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .device-types {
    grid-template-columns: 1fr;
  }
  
  .qr-section {
    flex-direction: column;
  }
}
</style> 