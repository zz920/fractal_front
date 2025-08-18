<template>
  <div class="voice-config">
    <div class="page-header">
      <h1 class="page-title">音色配置</h1>
      <p class="page-description">管理和配置您的音色设置</p>
    </div>

    <!-- 上传区域 -->
    <div class="upload-section">
      <div class="upload-card">
        <h2 class="section-title">上传语音文件</h2>
        <div class="upload-area" 
             :class="{ 'uploading': isUploading, 'drag-over': isDragOver }"
             @dragover.prevent="handleDragOver"
             @dragleave.prevent="handleDragLeave"
             @drop.prevent="handleDrop"
             @click="triggerFileInput">
          <input 
            type="file" 
            ref="fileInput" 
            class="file-input" 
            accept=".wav" 
            @change="handleFileSelect"
          />
          <div class="upload-content">
            <div class="upload-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"/>
              </svg>
            </div>
            <div class="upload-text">
              <p class="upload-title">点击或拖拽文件到此处</p>
              <p class="upload-subtitle">支持 WAV 格式，最大 10MB</p>
            </div>
          </div>
          <div v-if="isUploading" class="upload-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <p class="progress-text">上传中... {{ uploadProgress }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 音色列表 -->
    <div class="voice-list-section">
      <div class="section-header">
        <h2 class="section-title">我的音色</h2>
        <div class="section-actions">
          <button @click="refreshVoiceList" class="refresh-btn" :disabled="isLoading">
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

      <div v-else-if="voiceList.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
          </svg>
        </div>
        <p class="empty-text">暂无音色配置</p>
        <p class="empty-subtitle">请上传语音文件来创建音色</p>
      </div>

      <div v-else class="voice-grid">
        <!-- 默认音色选项 -->
        <div class="voice-card" :class="{ 'selected': selectedVoiceId === '' }">
          <div class="voice-card-header">
            <div class="voice-info">
              <h3 class="voice-title">默认音色</h3>
              <p class="voice-description">系统默认音色</p>
              <p class="voice-time">系统内置</p>
            </div>
            <div class="voice-actions">
              <button @click="selectVoice('')" class="select-btn" :disabled="selectedVoiceId === ''">
                {{ selectedVoiceId === '' ? '已选择' : '选择' }}
              </button>
            </div>
          </div>
        </div>
        
        <div 
          v-for="voice in voiceList" 
          :key="voice.id" 
          class="voice-card"
          :class="{ 'selected': String(voice.id) === String(selectedVoiceId) }"
        >
          <div class="voice-card-header">
            <div class="voice-info">
              <h3 class="voice-title">{{ voice.title }}</h3>
              <p class="voice-description">{{ voice.description || '无描述' }}</p>
              <p class="voice-time">上传时间: {{ formatDate(voice.upload_time) }}</p>
            </div>
            <div class="voice-actions">
              <button @click="selectVoice(voice.id)" class="select-btn" :disabled="String(voice.id) === String(selectedVoiceId)">
                {{ String(voice.id) === String(selectedVoiceId) ? '已选择' : '选择' }}
              </button>
              <button @click="editVoice(voice)" class="edit-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                </svg>
              </button>
              <button @click="deleteVoice(voice.id)" class="delete-btn">
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
          <h3>编辑音色信息</h3>
          <button @click="closeEditModal" class="modal-close">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="voice-title">标题</label>
            <input 
              type="text" 
              id="voice-title" 
              v-model="editingVoice.title" 
              class="form-input"
              placeholder="请输入音色标题"
            />
          </div>
          <div class="form-group">
            <label for="voice-description">描述</label>
            <textarea 
              id="voice-description" 
              v-model="editingVoice.description" 
              class="form-textarea"
              placeholder="请输入音色描述"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeEditModal" class="cancel-btn">取消</button>
          <button @click="saveVoiceEdit" class="save-btn" :disabled="isSaving">
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
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useVoiceConfig } from '../../services/voiceconfig.js'

export default {
  name: 'VoiceConfig',
  setup() {
    const voiceConfig = useVoiceConfig()
    
    // 状态管理
    const isLoading = ref(false)
    const isUploading = ref(false)
    const isSaving = ref(false)
    const isDragOver = ref(false)
    const uploadProgress = ref(0)
    const voiceList = ref([])
    const selectedVoiceId = ref(null)
    const fileInput = ref(null)
    const showEditModal = ref(false)
    const editingVoice = ref({})
    
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

    // 加载音色列表
    const loadVoiceList = async () => {
      isLoading.value = true
      try {
        const voices = await voiceConfig.getVoiceList()
        voiceList.value = voices
        
        // 获取用户配置以获取当前选中的音色
        const userConfig = await voiceConfig.getUserConfig()
        // 如果 voice_id 为空或不存在，则使用默认音色（空字符串）
        selectedVoiceId.value = userConfig.user_voice || ''
      } catch (error) {
        showMessage('加载音色列表失败: ' + error.message, 'error')
      } finally {
        isLoading.value = false
      }
    }

    // 刷新音色列表
    const refreshVoiceList = () => {
      loadVoiceList()
    }

    // 文件上传相关方法
    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleDragOver = (e) => {
      e.preventDefault()
      isDragOver.value = true
    }

    const handleDragLeave = (e) => {
      e.preventDefault()
      isDragOver.value = false
    }

    const handleDrop = (e) => {
      e.preventDefault()
      isDragOver.value = false
      
      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileUpload(files[0])
      }
    }

    const handleFileSelect = (e) => {
      const files = e.target.files
      if (files.length > 0) {
        handleFileUpload(files[0])
      }
    }

    const handleFileUpload = async (file) => {
      // 验证文件格式
      if (!file.name.toLowerCase().endsWith('.wav')) {
        showMessage('仅支持 WAV 格式文件', 'error')
        return
      }

      // 验证文件大小
      if (file.size > 10 * 1024 * 1024) {
        showMessage('文件大小不能超过 10MB', 'error')
        return
      }

      isUploading.value = true
      uploadProgress.value = 0

      try {
        // 模拟上传进度
        const progressInterval = setInterval(() => {
          if (uploadProgress.value < 90) {
            uploadProgress.value += 10
          }
        }, 200)

        await voiceConfig.uploadVoiceFile(file)
        
        clearInterval(progressInterval)
        uploadProgress.value = 100
        
        showMessage('语音文件上传成功')
        
        // 重新加载音色列表
        setTimeout(() => {
          loadVoiceList()
          isUploading.value = false
          uploadProgress.value = 0
          
          // 清空文件输入
          if (fileInput.value) {
            fileInput.value.value = ''
          }
        }, 1000)
        
      } catch (error) {
        showMessage('文件上传失败: ' + error.message, 'error')
        isUploading.value = false
        uploadProgress.value = 0
      }
    }

    // 选择音色
    const selectVoice = async (voiceId) => {
      try {
        // 如果选择默认音色，传入空字符串
        const voiceIdToSend = voiceId === '' ? '' : voiceId
        await voiceConfig.selectVoice(voiceIdToSend)
        selectedVoiceId.value = voiceIdToSend
        showMessage('音色选择成功')
      } catch (error) {
        showMessage('音色选择失败: ' + error.message, 'error')
      }
    }

    // 编辑音色
    const editVoice = (voice) => {
      editingVoice.value = { ...voice }
      showEditModal.value = true
    }

    const closeEditModal = () => {
      showEditModal.value = false
      editingVoice.value = {}
    }

    const saveVoiceEdit = async () => {
      isSaving.value = true
      try {
        await voiceConfig.editVoice({
          id: editingVoice.value.id,
          title: editingVoice.value.title,
          description: editingVoice.value.description
        })
        
        showMessage('音色信息更新成功')
        closeEditModal()
        loadVoiceList()
      } catch (error) {
        showMessage('音色编辑失败: ' + error.message, 'error')
      } finally {
        isSaving.value = false
      }
    }

    // 删除音色
    const deleteVoice = async (voiceId) => {
      if (!confirm('确定要删除这个音色吗？此操作不可恢复。')) {
        return
      }

      try {
        await voiceConfig.deleteVoice(voiceId)
        showMessage('音色删除成功')
        loadVoiceList()
      } catch (error) {
        showMessage('音色删除失败: ' + error.message, 'error')
      }
    }

    // 组件挂载时加载数据
    onMounted(() => {
      loadVoiceList()
    })

    return {
      isLoading,
      isUploading,
      isSaving,
      isDragOver,
      uploadProgress,
      voiceList,
      selectedVoiceId,
      fileInput,
      showEditModal,
      editingVoice,
      message,
      showMessage,
      hideMessage,
      formatDate,
      refreshVoiceList,
      triggerFileInput,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleFileSelect,
      selectVoice,
      editVoice,
      closeEditModal,
      saveVoiceEdit,
      deleteVoice
    }
  }
}
</script>

<style scoped>
.voice-config {
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

/* 上传区域样式 */
.upload-section {
  margin-bottom: 2rem;
}

.upload-card {
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

.upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.upload-area:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.upload-area.drag-over {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.upload-area.uploading {
  pointer-events: none;
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #6c757d;
}

.upload-title {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.upload-subtitle {
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0;
}

.upload-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 0 0 6px 6px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: #667eea;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0;
}

/* 音色列表样式 */
.voice-list-section {
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

.loading-state, .empty-state {
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

.empty-icon {
  width: 64px;
  height: 64px;
  color: #dee2e6;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: #495057;
  margin: 0 0 0.5rem 0;
}

.empty-subtitle {
  color: #6c757d;
  margin: 0;
}

.voice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.voice-card {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.voice-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.voice-card.selected {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.voice-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.voice-info {
  flex: 1;
}

.voice-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.voice-description {
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0 0 0.5rem 0;
}

.voice-time {
  font-size: 0.75rem;
  color: #adb5bd;
  margin: 0;
}

.voice-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
  max-width: 500px;
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

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-input, .form-textarea {
  width: 100%;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .voice-grid {
    grid-template-columns: 1fr;
  }
  
  .voice-card-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .voice-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .message {
    left: 20px;
    right: 20px;
    max-width: none;
  }
}
</style>