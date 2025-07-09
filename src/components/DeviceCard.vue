<template>
  <div class="device-card">
    <div class="card-header">
      <div class="device-info">
        <h3 class="device-name">{{ device.device_name }}</h3>
        <span class="device-type-badge">{{ device.device_type }}</span>
      </div>
      <button 
        @click="$emit('delete-device', device)"
        class="delete-btn"
        :disabled="loading"
        title="删除设备"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"/>
        </svg>
      </button>
    </div>
    
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">MAC地址</div>
          <div class="info-value mac-address">{{ device.device_mac }}</div>
        </div>
        

        
        <div class="info-item full-width">
          <div class="info-label">注册时间</div>
          <div class="info-value">{{ formatDate(device.created_at) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeviceCard',
  props: {
    device: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['delete-device'],
  setup() {
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '--'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        return '--'
      }
    }

    return {
      formatDate
    }
  }
}
</script>

<style scoped>
.device-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.device-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.device-info {
  flex: 1;
}

.device-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.device-type-badge {
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #dc3545;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 0.5rem;
}

.delete-btn:hover:not(:disabled) {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
  transform: scale(1.1);
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.delete-btn svg {
  width: 18px;
  height: 18px;
}

.card-body {
  padding: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.mac-address {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #495057;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .device-card {
    border-radius: 8px;
  }
  
  .card-header {
    padding: 0.75rem;
  }
  
  .card-body {
    padding: 0.75rem;
  }
  
  .device-name {
    font-size: 1rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .info-item.full-width {
    grid-column: 1;
  }
}
</style> 