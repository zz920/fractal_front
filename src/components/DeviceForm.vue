<template>
  <div class="device-form">
    <div class="form-header">
      <h2>添加设备</h2>
      <button @click="$emit('cancel')" class="close-btn" title="关闭">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
        </svg>
      </button>
    </div>

    <div class="form-content">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="deviceName" class="form-label">设备名称</label>
          <input
            id="deviceName"
            v-model="formData.deviceName"
            type="text"
            class="form-input"
            :class="{ 'error': errors.deviceName }"
            placeholder="请输入设备名称"
            maxlength="100"
          >
          <div v-if="errors.deviceName" class="error-message">
            {{ errors.deviceName }}
          </div>
        </div>

        <div class="form-group">
          <label for="deviceType" class="form-label">设备类型</label>
          <select
            id="deviceType"
            v-model="formData.deviceType"
            class="form-select"
            :class="{ 'error': errors.deviceType }"
          >
            <option value="">请选择设备类型</option>
            <option value="smartphone">智能手机</option>
            <option value="tablet">平板电脑</option>
            <option value="laptop">笔记本电脑</option>
            <option value="desktop">台式电脑</option>
            <option value="speaker">智能音箱</option>
            <option value="tv">智能电视</option>
            <option value="watch">智能手表</option>
            <option value="camera">摄像头</option>
            <option value="router">路由器</option>
            <option value="other">其他设备</option>
          </select>
          <div v-if="errors.deviceType" class="error-message">
            {{ errors.deviceType }}
          </div>
        </div>

        <div class="form-group">
          <label for="deviceMac" class="form-label">MAC地址</label>
          <input
            id="deviceMac"
            v-model="formData.deviceMac"
            type="text"
            class="form-input"
            :class="{ 'error': errors.deviceMac }"
            placeholder="例如：00:11:22:33:44:55"
            maxlength="17"
            @input="formatMacAddress"
          >
          <div v-if="errors.deviceMac" class="error-message">
            {{ errors.deviceMac }}
          </div>
          <div class="form-hint">
            MAC地址格式: XX:XX:XX:XX:XX:XX
          </div>
        </div>



        <div v-if="submitError" class="submit-error">
          {{ submitError }}
        </div>

        <div class="form-actions">
          <button 
            type="button" 
            @click="$emit('cancel')"
            class="btn btn-cancel"
            :disabled="loading"
          >
            取消
          </button>
          <button 
            type="submit"
            class="btn btn-primary"
            :disabled="loading || !isFormValid"
          >
            {{ loading ? '添加中...' : '添加设备' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'

export default {
  name: 'DeviceForm',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    // 表单数据
    const formData = reactive({
      deviceName: '',
      deviceType: '',
      deviceMac: ''
    })

    // 错误状态
    const errors = reactive({
      deviceName: '',
      deviceType: '',
      deviceMac: ''
    })

    const submitError = ref('')

    // 表单验证规则
    const validateForm = () => {
      clearErrors()
      let isValid = true

      // 验证设备名称
      if (!formData.deviceName.trim()) {
        errors.deviceName = '设备名称不能为空'
        isValid = false
      } else if (formData.deviceName.length > 100) {
        errors.deviceName = '设备名称不能超过100个字符'
        isValid = false
      }

      // 验证设备类型
      if (!formData.deviceType) {
        errors.deviceType = '请选择设备类型'
        isValid = false
      }

      // 验证MAC地址
      if (!formData.deviceMac.trim()) {
        errors.deviceMac = 'MAC地址不能为空'
        isValid = false
      } else if (!isValidMacAddress(formData.deviceMac)) {
        errors.deviceMac = 'MAC地址格式不正确'
        isValid = false
      }



      return isValid
    }

    // 清除错误信息
    const clearErrors = () => {
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })
      submitError.value = ''
    }

    // 验证MAC地址格式
    const isValidMacAddress = (mac) => {
      const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
      return macRegex.test(mac)
    }



    // 格式化MAC地址输入
    const formatMacAddress = (event) => {
      let value = event.target.value.replace(/[^0-9A-Fa-f]/g, '')
      if (value.length > 12) {
        value = value.slice(0, 12)
      }
      
      // 添加冒号分隔符
      const formatted = value.replace(/(.{2})(?=.)/g, '$1:')
      formData.deviceMac = formatted
    }

    // 计算表单是否有效
    const isFormValid = computed(() => {
      return formData.deviceName.trim() &&
             formData.deviceType &&
             formData.deviceMac.trim()
    })

    // 处理表单提交
    const handleSubmit = async () => {
      if (!validateForm()) {
        return
      }

      try {
        submitError.value = ''
        await emit('submit', {
          deviceName: formData.deviceName.trim(),
          deviceType: formData.deviceType,
          deviceMac: formData.deviceMac.trim()
        })
        
        // 清空表单
        resetForm()
      } catch (error) {
        submitError.value = error.message || '添加设备失败'
      }
    }

    // 重置表单
    const resetForm = () => {
      Object.keys(formData).forEach(key => {
        formData[key] = ''
      })
      clearErrors()
    }

    return {
      formData,
      errors,
      submitError,
      isFormValid,
      handleSubmit,
      formatMacAddress
    }
  }
}
</script>

<style scoped>
.device-form {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: white;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.form-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #495057;
}

.close-btn svg {
  width: 18px;
  height: 18px;
}

.form-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.form-input.error,
.form-select.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
}

.form-select {
  cursor: pointer;
  background: white;
}

.form-hint {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #6c757d;
}

.error-message {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #dc3545;
}

.submit-error {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.btn-cancel:hover:not(:disabled) {
  background: #e9ecef;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .form-header {
    padding: 1rem;
  }
  
  .form-content {
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style> 