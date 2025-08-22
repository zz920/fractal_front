<template>
  <div class="prompt-config">
    <div class="page-header">
      <h1 class="page-title">角色配置</h1>
      <p class="page-description">管理和配置您的提示词设置</p>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar">
      <button 
        @click="showForm = true"
        class="add-prompt-btn"
        :disabled="isLoading"
      >
        <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
        </svg>
        <span>创建提示词</span>
      </button>
    </div>

    <!-- 提示词列表 -->
    <div class="prompt-list-section">
      <div class="section-header">
        <h2 class="section-title">我的提示词</h2>
        <div class="section-actions">
          <button @click="refreshPromptList" class="refresh-btn" :disabled="isLoading">
            <svg class="refresh-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
            </svg>
            刷新
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 默认无提示词选项（始终显示） -->
      <div class="prompt-grid">
        <div class="prompt-card" :class="{ 'selected': selectedPromptId === '' }">
          <div class="prompt-card-header">
            <div class="prompt-info">
              <h3 class="prompt-title">无提示词</h3>
              <p class="prompt-description">不使用任何自定义提示词</p>
              <p class="prompt-time">系统默认</p>
            </div>
            <div class="prompt-actions">
              <button @click="selectPrompt('')" class="select-btn" :disabled="selectedPromptId === ''">
                {{ selectedPromptId === '' ? '已选择' : '选择' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户创建的提示词列表 -->
      <div v-if="promptList.length > 0" class="prompt-grid">
        <div 
          v-for="prompt in promptList" 
          :key="prompt.id" 
          class="prompt-card"
          :class="{ 'selected': String(prompt.id) === String(selectedPromptId) }"
        >
          <div class="prompt-card-header">
            <div class="prompt-info">
              <h3 class="prompt-title">{{ prompt.title }}</h3>
              <p class="prompt-description">{{ truncateContent(prompt.content) }}</p>
              <p class="prompt-time">创建时间: {{ formatDate(prompt.created_at) }}</p>
            </div>
            <div class="prompt-actions">
              <button @click="selectPrompt(prompt.id)" class="select-btn" :disabled="String(prompt.id) === String(selectedPromptId)">
                {{ String(prompt.id) === String(selectedPromptId) ? '已选择' : '选择' }}
              </button>
              <button @click="editPrompt(prompt)" class="edit-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                </svg>
              </button>
              <button @click="deletePrompt(prompt.id)" class="delete-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑模态框 -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑提示词</h3>
          <button @click="closeEditModal" class="modal-close">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="edit-prompt-title">标题</label>
            <input 
              type="text" 
              id="edit-prompt-title" 
              v-model="editingPrompt.title" 
              class="form-input"
              placeholder="请输入提示词标题"
            />
          </div>
          <div class="form-group">
            <label for="edit-prompt-content">内容</label>
            <textarea 
              id="edit-prompt-content" 
              v-model="editingPrompt.content" 
              class="form-textarea"
              placeholder="请输入提示词内容"
              rows="6"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeEditModal" class="cancel-btn">取消</button>
          <button @click="savePromptEdit" class="save-btn" :disabled="isSaving">
            {{ isSaving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 消息提示 -->
    <div v-if="message.show" class="message" :class="message.type">
      <div class="message-content">
        <span class="message-text">{{ message.text }}</span>
        <button @click="hideMessage" class="message-close">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 创建/编辑提示词表单侧边栏 -->
    <div 
      v-if="showForm"
      class="form-sidebar-overlay"
      @click="closeForm"
    >
      <div class="form-sidebar" @click.stop>
        <PromptForm
          :initial-data="editingPrompt"
          :loading="isCreating"
          @submit="handlePromptSubmit"
          @cancel="closeForm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { usePrompt } from '../../services/prompt.js'
import PromptForm from '../../components/PromptForm.vue'

export default {
  name: 'PromptConfig',
  components: {
    PromptForm
  },
  setup() {
    const promptService = usePrompt()
    
    // 状态管理
    const isLoading = ref(false)
    const isCreating = ref(false)
    const isSaving = ref(false)
    const promptList = ref([])
    const selectedPromptId = ref(null)
    const showForm = ref(false)
    const editingPrompt = ref({})
    
    // 消息提示
    const message = reactive({
      show: false,
      text: '',
      type: 'success',
      timeout: null
    })

    // 显示消息
    const showMessage = (text, type = 'success') => {
      if (message.timeout) {
        clearTimeout(message.timeout)
      }
      
      message.text = text
      message.type = type
      message.show = true
      
      message.timeout = setTimeout(() => {
        message.show = false
      }, 3000)
    }

    // 隐藏消息
    const hideMessage = () => {
      message.show = false
      if (message.timeout) {
        clearTimeout(message.timeout)
      }
    }

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '未知时间'
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 截断内容显示
    const truncateContent = (content) => {
      if (!content) return '无内容'
      if (content.length <= 50) return content
      return content.substring(0, 50) + '...'
    }

    // 加载提示词列表
    const loadPromptList = async () => {
      isLoading.value = true
      try {
        const prompts = await promptService.getPromptList()
        promptList.value = prompts
        
        // 获取用户配置以获取当前选中的提示词
        const userConfig = await promptService.getUserConfig()
        // 如果 user_prompt 为空或不存在，则使用无提示词（空字符串）
        selectedPromptId.value = userConfig.user_prompt || ''
      } catch (error) {
        showMessage('加载提示词列表失败: ' + error.message, 'error')
      } finally {
        isLoading.value = false
      }
    }

    // 刷新提示词列表
    const refreshPromptList = () => {
      loadPromptList()
    }

    // 处理创建/编辑提示词
    const handlePromptSubmit = async (promptData) => {
      isCreating.value = true
      try {
        if (promptData.id) {
          // 编辑模式
          await promptService.editPrompt(promptData)
          showMessage('提示词更新成功')
        } else {
          // 创建模式
          await promptService.createPrompt(promptData.title, promptData.content)
          showMessage('提示词创建成功')
        }
        
        // 关闭表单
        showForm.value = false
        editingPrompt.value = {}
        
        // 重新加载列表
        loadPromptList()
      } catch (error) {
        showMessage((promptData.id ? '更新' : '创建') + '提示词失败: ' + error.message, 'error')
        throw error // 重新抛出错误让表单处理
      } finally {
        isCreating.value = false
      }
    }

    // 选择提示词
    const selectPrompt = async (promptId) => {
      try {
        // 如果选择无提示词，传入空字符串
        const promptIdToSend = promptId === '' ? '' : promptId
        await promptService.selectPrompt(promptIdToSend)
        selectedPromptId.value = promptIdToSend
        showMessage('提示词选择成功')
      } catch (error) {
        showMessage('提示词选择失败: ' + error.message, 'error')
      }
    }

    // 编辑提示词
    const editPrompt = (prompt) => {
      editingPrompt.value = { ...prompt }
      showForm.value = true
    }

    // 关闭表单
    const closeForm = () => {
      showForm.value = false
      editingPrompt.value = {}
    }

    // 删除提示词
    const deletePrompt = async (promptId) => {
      if (!confirm('确定要删除这个提示词吗？此操作不可恢复。')) {
        return
      }

      try {
        await promptService.deletePrompt(promptId)
        showMessage('提示词删除成功')
        loadPromptList()
      } catch (error) {
        showMessage('提示词删除失败: ' + error.message, 'error')
      }
    }

    // 组件挂载时加载数据
    onMounted(() => {
      loadPromptList()
    })

    return {
      isLoading,
      isCreating,
      promptList,
      selectedPromptId,
      showForm,
      editingPrompt,
      message,
      showMessage,
      hideMessage,
      formatDate,
      truncateContent,
      refreshPromptList,
      handlePromptSubmit,
      selectPrompt,
      editPrompt,
      closeForm,
      deletePrompt
    }
  }
}
</script>

<style scoped>
.prompt-config {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.page-description {
  color: #6c757d;
  margin: 0;
}

/* 创建区域样式 */
.create-section {
  margin-bottom: 2rem;
}

.create-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem 0;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-input, .form-textarea {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.create-btn {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.create-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.create-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

/* 操作栏样式 */
.action-bar {
  margin-bottom: 1.5rem;
}

.add-prompt-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-prompt-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.add-prompt-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* 提示词列表样式 */
.prompt-list-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-actions {
  display: flex;
  gap: 0.5rem;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.refresh-btn:hover:not(:disabled) {
  background: #e9ecef;
  color: #495057;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-icon {
  width: 16px;
  height: 16px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.prompt-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.prompt-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.3s ease;
}

.prompt-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.prompt-card.selected {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.prompt-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  gap: 1rem;
}

.prompt-info {
  flex: 1;
  min-width: 0;
}

.prompt-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.prompt-description {
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prompt-time {
  font-size: 0.75rem;
  color: #adb5bd;
  margin: 0;
}

.prompt-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.select-btn, .edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.select-btn {
  background: #667eea;
  color: white;
}

.select-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.select-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.edit-btn {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.edit-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

.edit-btn svg, .delete-btn svg {
  width: 16px;
  height: 16px;
}

/* 模态框样式 */
.modal-overlay {
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
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #f8f9fa;
  color: #495057;
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.cancel-btn, .save-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.cancel-btn {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.cancel-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.save-btn {
  background: #667eea;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.save-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

/* 消息提示样式 */
.message {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  max-width: 400px;
}

.message-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.message.success .message-content {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.message.error .message-content {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.message-text {
  flex: 1;
  margin: 0;
}

.message-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.message-close:hover {
  background: rgba(0, 0, 0, 0.1);
}

.message-close svg {
  width: 16px;
  height: 16px;
}

/* 表单侧边栏样式 */
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
}

.form-sidebar {
  width: 100%;
  max-width: 500px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .prompt-card-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .prompt-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
  
  .form-sidebar {
    max-width: 100%;
  }
  
  .message {
    left: 20px;
    right: 20px;
    max-width: none;
  }
}
</style>