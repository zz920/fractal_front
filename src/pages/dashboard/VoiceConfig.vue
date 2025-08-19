<template>
  <div class="voice-config">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">音色设置</h1>
      <p class="page-subtitle">个性化您的语音助手音色体验</p>
    </div>

    <div class="voice-content">
      <!-- 左侧导航栏 -->
      <aside class="voice-sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">音色管理</h3>
          <div class="sidebar-nav">
            <button 
              class="nav-btn"
              :class="{ active: activeSection === 'upload' }"
              @click="activeSection = 'upload'"
            >
              <i class="fas fa-plus"></i>
              自训练音色
            </button>
            <button 
              class="nav-btn"
              :class="{ active: activeSection === 'tones' }"
              @click="activeSection = 'tones'"
            >
              <i class="fas fa-user"></i>
              我的音色 ({{ voiceList.length }})
            </button>
          </div>
        </div>
      </aside>

      <!-- 右侧内容区域 -->
      <main class="voice-main">
        <!-- 自训练音色区域 -->
        <div v-if="activeSection === 'upload'">
          <UploadArea 
            :is-uploading="isUploading"
            :upload-progress="uploadProgress"
            @file-select="handleFileSelect"
            @drag-over="handleDragOver"
            @drag-leave="handleDragLeave"
            @drop="handleDrop"
          />
        </div>

        <!-- 我的音色区域 -->
        <div v-if="activeSection === 'tones'" class="tones-section">
          <div class="section-header">
            <h2 class="section-title">我的音色</h2>
            <div class="tones-count">自定义音色: {{ voiceList.length }}/2</div>
          </div>
          
          <!-- 默认音色 -->
          <ToneCard 
            :tone="defaultTone"
            :is-selected="selectedVoiceId === ''"
            @select="selectVoice"
            @play="handlePlay"
            @stop="handleStop"
          />
          
          <!-- 自定义音色列表 -->
          <div class="custom-tones">
            <h3 class="custom-title">自定义音色</h3>
            
            <div v-if="voiceList.length === 0" class="empty-state">
              <div class="empty-icon">
                <i class="fas fa-music"></i>
              </div>
              <p class="empty-text">您还没有创建自定义音色</p>
              <button class="create-btn" @click="activeSection = 'upload'">
                创建第一个音色
              </button>
            </div>
            
            <div v-else class="tones-list">
              <ToneCard 
                v-for="voice in voiceList" 
                :key="voice.id" 
                :tone="formatVoiceForCard(voice)"
                :is-selected="String(voice.id) === String(selectedVoiceId)"
                @select="selectVoice"
                @edit="editVoice"
                @delete="deleteVoice"
                @play="handlePlay"
                @stop="handleStop"
              />
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 编辑模态框 -->
    <EditVoiceModal 
      :visible="showEditModal"
      :voice="editingVoice"
      :is-saving="isSaving"
      @close="closeEditModal"
      @save="saveVoiceEdit"
    />

    <!-- 消息提示 -->
    <MessageToast 
      :visible="message.show"
      :text="message.text"
      :type="message.type"
      @close="hideMessage"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useVoiceConfig } from '../../services/voiceconfig.js'
import ToneCard from '../../components/ToneCard.vue'
import UploadArea from '../../components/UploadArea.vue'
import EditVoiceModal from '../../components/EditVoiceModal.vue'
import MessageToast from '../../components/MessageToast.vue'
import '../../styles/voiceConfig.css'

export default {
  name: 'VoiceConfig',
  components: {
    ToneCard,
    UploadArea,
    EditVoiceModal,
    MessageToast
  },
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
    const activeSection = ref('tones')
    
    // 默认音色数据
    const defaultTone = computed(() => ({
      id: 'default',
      name: '默认音色',
      description: '清晰自然的默认音色',
      type: '系统预设'
    }))
    
    // 格式化音色数据用于卡片显示
    const formatVoiceForCard = (voice) => ({
      id: voice.id,
      name: voice.title,
      description: voice.description || '无描述',
      type: '自定义'
    })
    
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

    const handleFileSelect = (file) => {
      handleFileUpload(file)
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

    const saveVoiceEdit = async (voiceData) => {
      isSaving.value = true
      try {
        console.log('接收到的voiceData:', voiceData)
        console.log('voiceData.id:', voiceData.id)
        console.log('voiceData.title:', voiceData.title)
        console.log('voiceData.description:', voiceData.description)
        
        const editData = {
          id: voiceData.id,
          title: voiceData.title,
          description: voiceData.description
        }
        
        console.log('准备发送编辑数据:', editData)
        console.log('JSON.stringify(editData):', JSON.stringify(editData))
        
        await voiceConfig.editVoice(editData)
        
        showMessage('音色信息更新成功')
        closeEditModal()
        loadVoiceList()
      } catch (error) {
        console.error('编辑音色失败:', error)
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

    // 音频事件处理
    const handlePlay = (voiceId) => {
      // 这里可以添加全局音频状态管理逻辑
      console.log('开始播放音色:', voiceId)
    }
    
    const handleStop = (voiceId) => {
      // 这里可以添加全局音频状态管理逻辑
      console.log('停止播放音色:', voiceId)
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
      activeSection,
      defaultTone,
      formatVoiceForCard,
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
      deleteVoice,
      handlePlay,
      handleStop
    }
  }
}
</script>

<style scoped>
</style>