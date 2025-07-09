<template>
  <div class="device-list">
    <!-- 桌面端表格视图 -->
    <div class="desktop-view">
      <div class="table-container">
        <table class="device-table">
          <thead>
            <tr>
              <th>设备名称</th>
              <th>设备类型</th>
              <th>MAC地址</th>
              <th>注册时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in devices" :key="device.id" class="device-row">
              <td class="device-name">{{ device.device_name }}</td>
              <td class="device-type">
                <span class="type-badge">{{ device.device_type }}</span>
              </td>
              <td class="device-mac">{{ device.device_mac }}</td>
              <td class="device-time">{{ formatDate(device.created_at) }}</td>
              <td class="device-actions">
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 移动端卡片视图 -->
    <div class="mobile-view">
      <div class="device-cards">
        <DeviceCard
          v-for="device in devices"
          :key="device.id"
          :device="device"
          :loading="loading"
          @delete-device="$emit('delete-device', device)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DeviceCard from './DeviceCard.vue'

export default {
  name: 'DeviceList',
  components: {
    DeviceCard
  },
  props: {
    devices: {
      type: Array,
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
.device-list {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

/* 桌面端表格视图 */
.desktop-view {
  display: block;
}

.table-container {
  overflow-x: auto;
}

.device-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.device-table thead {
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
}

.device-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  color: #495057;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.device-table td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
  vertical-align: middle;
}

.device-row {
  transition: all 0.2s ease;
}

.device-row:hover {
  background: rgba(102, 126, 234, 0.05);
}

.device-row:last-child td {
  border-bottom: none;
}

.device-name {
  font-weight: 500;
  color: #333;
}

.type-badge {
  padding: 0.25rem 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.device-mac {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #6c757d;
}



.device-time {
  font-size: 0.85rem;
  color: #6c757d;
}

.device-actions {
  text-align: center;
  width: 80px;
}

.delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  color: #dc3545;
  cursor: pointer;
  transition: all 0.2s ease;
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
  width: 16px;
  height: 16px;
}

/* 移动端卡片视图 */
.mobile-view {
  display: none;
}

.device-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .desktop-view {
    display: none;
  }
  
  .mobile-view {
    display: block;
  }
}

/* 中等屏幕优化 */
@media (max-width: 1024px) {
  .device-table th,
  .device-table td {
    padding: 0.75rem;
  }
  
  .device-table {
    font-size: 0.85rem;
  }
}

/* 小屏幕表格优化 */
@media (max-width: 900px) {
  .device-table th:nth-child(5),
  .device-table td:nth-child(5) {
    display: none;
  }
}

@media (max-width: 800px) {
  .device-table th:nth-child(4),
  .device-table td:nth-child(4) {
    display: none;
  }
}

@media (max-width: 700px) {
  .device-table th:nth-child(3),
  .device-table td:nth-child(3) {
    display: none;
  }
}
</style> 