<template>
  <div class="prompt-form">
    <div class="form-header">
      <h2>{{ isEditing ? '编辑提示词' : '创建提示词' }}</h2>
      <button @click="$emit('cancel')" class="close-btn" title="关闭">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
        </svg>
      </button>
    </div>

    <div class="form-content">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="promptTitle" class="form-label">标题</label>
          <input
            id="promptTitle"
            v-model="formData.title"
            type="text"
            class="form-input"
            :class="{ 'error': errors.title }"
            placeholder="请输入提示词标题"
            maxlength="100"
          >
          <div v-if="errors.title" class="error-message">
            {{ errors.title }}
          </div>
        </div>

        <div class="form-group">
          <label for="promptContent" class="form-label">内容</label>
          <textarea
            id="promptContent"
            v-model="formData.content"
            class="form-textarea"
            :class="{ 'error': errors.content }"
            placeholder="请输入提示词内容"
            rows="8"
          ></textarea>
          <div v-if="errors.content" class="error-message">
            {{ errors.content }}
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
            {{ loading ? (isEditing ? '保存中...' : '创建中...') : (isEditing ? '保存' : '创建提示词') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, watch } from 'vue'

export default {
  name: 'PromptForm',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    initialData: {
      type: Object,
      default: () => ({
        title: '',
        content: ''
      })
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const isEditing = computed(() => !!props.initialData.id)
    
    // 表单数据
    const formData = reactive({
      id: '',
      title: '',
      content: ''
    })

    // 错误状态
    const errors = reactive({
      title: '',
      content: ''
    })

    const submitError = ref('')

    // 监听初始数据变化
    watch(() => props.initialData, (newData) => {
      if (newData) {
        formData.id = newData.id || ''
        formData.title = newData.title || ''
        formData.content = newData.content || ''
      }
    }, { immediate: true })

    // 表单验证规则
    const validateForm = () => {
      clearErrors()
      let isValid = true

      // 验证标题
      if (!formData.title.trim()) {
        errors.title = '标题不能为空'
        isValid = false
      } else if (formData.title.length > 100) {
        errors.title = '标题不能超过100个字符'
        isValid = false
      }

      // 验证内容
      if (!formData.content.trim()) {
        errors.content = '内容不能为空'
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

    // 计算表单是否有效
    const isFormValid = computed(() => {
      return formData.title.trim() && formData.content.trim()
    })

    // 处理表单提交
    const handleSubmit = async () => {
      if (!validateForm()) {
        return
      }

      try {
        submitError.value = ''
        await emit('submit', {
          id: formData.id,
          title: formData.title.trim(),
          content: formData.content.trim()
        })
        
        // 清空表单（如果不是编辑模式）
        if (!isEditing.value) {
          resetForm()
        }
      } catch (error) {
        submitError.value = error.message || (isEditing.value ? '保存失败' : '创建失败')
      }
    }

    // 重置表单
    const resetForm = () => {
      formData.id = ''
      formData.title = ''
      formData.content = ''
      clearErrors()
    }

    return {
      isEditing,
      formData,
      errors,
      submitError,
      isFormValid,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.prompt-form {
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
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.form-input.error,
.form-textarea.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 200px;
  font-family: inherit;
  line-height: 1.5;
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