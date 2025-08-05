<template>
  <div class="voice-settings">
    <!-- 顶部标题栏 -->
    <div class="top-header">
      <h1 class="page-title">音色设置</h1>
      <div class="user-profile">
        <div class="user-avatar">{{ userStore.userInfo.avatar }}</div>
        <span class="user-name">{{ userStore.userInfo.username }}</span>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 左侧音色分类 -->
      <div class="voice-categories">
        <div 
          v-for="category in categories" 
          :key="category.id"
          :class="['category-item', { active: activeCategory === category.id }]"
          @click="selectCategory(category.id)"
        >
          <i :class="category.icon"></i>
          <span>{{ category.name }}</span>
        </div>
      </div>
      
      <!-- 右侧内容区域 -->
      <div class="voice-content">
        <!-- 搜索栏 -->
        <div class="search-container" v-show="showSearch">
          <input 
            type="text" 
            class="search-input" 
            placeholder="搜索音色..." 
            v-model="searchTerm"
            @input="handleSearch"
          >
        </div>
        
        <!-- 标签页容器 -->
        <div class="tabs-container" v-show="showTabs">
          <div class="voice-tabs">
            <div 
              v-for="tab in tabs" 
              :key="tab.id"
              :class="['voice-tab', { active: activeTab === tab.id }]"
              @click="selectTab(tab.id)"
            >
              {{ tab.name }}
            </div>
          </div>
        </div>
        
        <!-- 编辑控制栏 -->
        <div class="edit-controls" v-show="showEditControls">
          <button class="edit-btn" @click="toggleEditMode">
            <i class="fa-solid fa-edit"></i> 编辑
          </button>
          <button class="edit-btn danger" v-show="isEditMode" @click="deleteSelected">
            <i class="fa-solid fa-trash"></i> 删除选中
          </button>
          <button class="edit-btn" v-show="isEditMode" @click="renameSelected">
            <i class="fa-solid fa-pen"></i> 重命名
          </button>
          <button class="edit-btn" v-show="isEditMode" @click="changeCover">
            <i class="fa-solid fa-image"></i> 修改封面
          </button>
          <button class="edit-btn secondary" v-show="isEditMode" @click="cancelEdit">
            <i class="fa-solid fa-times"></i> 取消编辑
          </button>
        </div>
        
        <!-- 训练界面 -->
        <div class="training-container" v-show="showTraining">
          <!-- 上传区域 -->
          <div class="upload-area" @click="triggerFileUpload">
            <div class="upload-icon">
              <i class="fa-solid fa-file-audio"></i>
            </div>
            <div class="upload-text">在此处将需要训练的声音文件拖入</div>
            <div class="upload-subtext">(训练内容越多效果越好呦)</div>
            <button class="upload-btn" @click.stop="triggerFileUpload">选择文件导入</button>
          </div>
          
          <!-- 文件列表 -->
          <div class="file-list" v-show="uploadedFiles.length > 0">
            <div class="file-list-title">已上传的文件</div>
            <div class="file-items">
              <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                <div class="file-info">
                  <i class="fa-solid fa-file-audio file-icon"></i>
                  <div>
                    <div class="file-name">{{ file.name }}</div>
                    <div class="file-size">{{ formatFileSize(file.size) }}</div>
                  </div>
                </div>
                <button class="remove-file" @click="removeFile(index)">删除</button>
              </div>
            </div>
            <button class="start-training-btn" @click="startTraining">开始训练</button>
          </div>
          
          <!-- 训练状态 -->
          <div class="training-status" v-show="isTraining">
            <div class="training-icons">
              <div class="training-icon">
                <i class="fa-solid fa-gear"></i>
              </div>
              <div class="training-icon">
                <i class="fa-solid fa-file-audio"></i>
              </div>
              <div class="training-icon">
                <i class="fa-solid fa-gear"></i>
              </div>
            </div>
            <div class="training-text">{{ trainingText }}</div>
            <button class="cancel-btn" @click="cancelTraining">取消训练</button>
          </div>
        </div>
        
        <!-- 完成训练后的界面 -->
        <div class="completion-container" v-show="showCompletion">
          <div class="completion-header">
            <div class="completion-emoji">^o^</div>
            <div class="completion-title">模型训练完成</div>
          </div>
          <div class="completion-form">
            <div class="cover-upload" @click="triggerCoverUpload">
              <img class="cover-preview" v-show="coverImage" :src="coverImage" alt="封面预览">
              <div class="cover-text">{{ coverText }}</div>
            </div>
            <div>
              <input 
                type="text" 
                class="name-input" 
                v-model="voiceName" 
                placeholder="点此输入音色名称"
              >
              <div class="share-toggle">
                <div class="toggle-switch" :class="{ active: isShared }" @click="toggleShare">
                  <div class="toggle-slider"></div>
                </div>
                <div class="share-text">是否上传该音色至公共分享声库</div>
              </div>
            </div>
          </div>
          <div style="text-align: center;">
            <button class="complete-btn" @click="completeTraining">完成</button>
          </div>
        </div>
        
        <!-- 音色网格 -->
        <div class="voice-grid" v-show="showVoiceGrid">
          <!-- 空状态提示 -->
          <div v-if="filteredVoices.length === 0" class="empty-state">
            <div class="empty-icon">
              <i class="fa-solid fa-microphone-slash"></i>
            </div>
            <div class="empty-title">
              {{ getEmptyStateTitle() }}
            </div>
            <div class="empty-description">
              {{ getEmptyStateDescription() }}
            </div>
            <button v-if="activeCategory === 'training'" class="empty-action-btn" @click="selectCategory('training')">
              <i class="fa-solid fa-plus"></i> 开始训练音色
            </button>
          </div>
          
          <!-- 音色卡片 -->
          <div 
            v-for="voice in filteredVoices" 
            :key="voice.id"
            :class="['voice-card', { selected: selectedVoices.includes(voice.id) }]"
            @click="selectVoice(voice.id)"
          >
            <button 
              class="favorite-btn" 
              :class="{ favorited: voice.isFavorited }"
              @click.stop="toggleFavorite(voice.id)"
            >
              <i :class="voice.isFavorited ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
            </button>
            <div class="voice-avatar">{{ voice.avatar }}</div>
            <div class="voice-name">{{ voice.name }}</div>
            <div class="voice-description">{{ voice.description }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 音频设置 -->
    <div class="audio-settings">
      <h2 class="audio-title">音频设置</h2>
      <div class="audio-controls">
        <div class="audio-control">
          <label class="audio-label">输入设备</label>
          <select class="audio-input" v-model="audioSettings.inputDevice">
            <option value="">请选择设备</option>
            <option value="mic1">麦克风 1</option>
            <option value="mic2">麦克风 2</option>
          </select>
        </div>
        <div class="audio-control">
          <label class="audio-label">输出设备</label>
          <select class="audio-input" v-model="audioSettings.outputDevice">
            <option value="">请选择设备</option>
            <option value="speaker1">扬声器 1</option>
            <option value="speaker2">扬声器 2</option>
          </select>
        </div>
        <div class="audio-control">
          <label class="audio-label">输出音量</label>
          <input 
            type="range" 
            class="volume-slider" 
            min="0" 
            max="100" 
            v-model="audioSettings.volume"
            @input="updateVolume"
          >
          <div class="volume-value">{{ audioSettings.volume }}</div>
        </div>
        <div class="audio-control">
          <label class="audio-label">监听设备</label>
          <select class="audio-input" v-model="audioSettings.monitorDevice">
            <option value="">请选择设备</option>
            <option value="headphone1">耳机 1</option>
            <option value="headphone2">耳机 2</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

export default {
  name: 'VoiceSettings',
  setup() {
    const userStore = useUserStore()
    
    // 响应式状态
    const activeCategory = ref('recommended')
    const activeTab = ref('history')
    const searchTerm = ref('')
    const isEditMode = ref(false)
    const selectedVoices = ref([])
    const uploadedFiles = ref([])
    const isTraining = ref(false)
    const trainingText = ref('模型正在训练中,请稍等...')
    const showCompletion = ref(false)
    const voiceName = ref('')
    const coverImage = ref('')
    const isShared = ref(false)
    
    // 音频设置
    const audioSettings = ref({
      inputDevice: '',
      outputDevice: '',
      volume: 50,
      monitorDevice: ''
    })
    
    // 音色分类
    const categories = ref([
      { id: 'recommended', name: '推荐音色', icon: 'fa-solid fa-thumbs-up' },
      { id: 'library', name: '音色大全', icon: 'fa-solid fa-th-large' },
      { id: 'training', name: '自训练音色', icon: 'fa-solid fa-plus' },
      { id: 'my', name: '我的音色', icon: 'fa-solid fa-user' }
    ])
    
    // 标签页
    const tabs = ref([
      { id: 'history', name: '使用历史' },
      { id: 'favorites', name: '我的收藏' },
      { id: 'models', name: '我的模型' }
    ])
    
    // 音色数据
    const voices = ref([
      // 推荐音色
      { id: '1', name: '温柔女声', description: '推荐音色', avatar: '👩', isFavorited: false },
      { id: '2', name: '磁性男声', description: '推荐音色', avatar: '👨', isFavorited: false },
      { id: '3', name: '可爱童声', description: '推荐音色', avatar: '👶', isFavorited: false },
      { id: '4', name: '成熟女声', description: '推荐音色', avatar: '👩‍💼', isFavorited: false },
      { id: '5', name: '活力男声', description: '推荐音色', avatar: '👨‍💼', isFavorited: false },
      
      // 音色大全
      { id: '6', name: '甜美少女', description: '音色大全', avatar: '🌸', isFavorited: false },
      { id: '7', name: '深沉大叔', description: '音色大全', avatar: '🧔', isFavorited: false },
      { id: '8', name: '活泼少年', description: '音色大全', avatar: '👦', isFavorited: false },
      { id: '9', name: '优雅女士', description: '音色大全', avatar: '👩‍🦰', isFavorited: false },
      { id: '10', name: '稳重男士', description: '音色大全', avatar: '👨‍🦰', isFavorited: false },
      { id: '11', name: '可爱萝莉', description: '音色大全', avatar: '👧', isFavorited: false },
      { id: '12', name: '成熟御姐', description: '音色大全', avatar: '👩‍🦳', isFavorited: false },
      { id: '13', name: '阳光男孩', description: '音色大全', avatar: '👨‍🦱', isFavorited: false },
      { id: '14', name: '知性女性', description: '音色大全', avatar: '👩‍🦲', isFavorited: false },
      { id: '15', name: '魅力大叔', description: '音色大全', avatar: '👨‍🦲', isFavorited: false },
      { id: '16', name: '清纯少女', description: '音色大全', avatar: '🌺', isFavorited: false },
      { id: '17', name: '硬朗男人', description: '音色大全', avatar: '💪', isFavorited: false },
      { id: '18', name: '温柔妈妈', description: '音色大全', avatar: '👩‍👧', isFavorited: false },
      { id: '19', name: '慈祥爸爸', description: '音色大全', avatar: '👨‍👧', isFavorited: false },
      { id: '20', name: '活力女孩', description: '音色大全', avatar: '🏃‍♀️', isFavorited: false },
      
      // 自定义音色（我的模型）
      { id: '21', name: '我的音色1', description: '自定义音色', avatar: '🎤', isFavorited: true },
      { id: '22', name: '我的音色2', description: '自定义音色', avatar: '🎵', isFavorited: false }
    ])
    
    // 计算属性
    const showSearch = computed(() => activeCategory.value === 'library')
    const showTabs = computed(() => activeCategory.value === 'my')
    const showTraining = computed(() => activeCategory.value === 'training')
    const showVoiceGrid = computed(() => !showTraining.value && !showCompletion.value)
    const showEditControls = computed(() => activeCategory.value === 'my')
    
    const filteredVoices = computed(() => {
      let filtered = voices.value
      
      // 根据分类过滤
      if (activeCategory.value === 'recommended') {
        filtered = filtered.filter(voice => voice.description === '推荐音色')
      } else if (activeCategory.value === 'library') {
        filtered = filtered.filter(voice => voice.description === '音色大全')
      } else if (activeCategory.value === 'my') {
        if (activeTab.value === 'favorites') {
          filtered = filtered.filter(voice => voice.isFavorited)
        } else if (activeTab.value === 'models') {
          filtered = filtered.filter(voice => voice.description === '自定义音色')
        }
      }
      
      // 根据搜索词过滤
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase()
        filtered = filtered.filter(voice => 
          voice.name.toLowerCase().includes(term) || 
          voice.description.toLowerCase().includes(term)
        )
      }
      
      return filtered
    })
    
    const coverText = computed(() => {
      return coverImage.value ? '封面已上传' : '点击此处上传音色封面'
    })
    
    // 方法
    const selectCategory = (categoryId) => {
      activeCategory.value = categoryId
      searchTerm.value = ''
      selectedVoices.value = []
      isEditMode.value = false
    }
    
    const selectTab = (tabId) => {
      activeTab.value = tabId
    }
    
    const handleSearch = () => {
      // 搜索逻辑已在计算属性中处理
    }
    
    const toggleEditMode = () => {
      isEditMode.value = !isEditMode.value
      if (!isEditMode.value) {
        selectedVoices.value = []
      }
    }
    
    const selectVoice = (voiceId) => {
      if (isEditMode.value) {
        const index = selectedVoices.value.indexOf(voiceId)
        if (index > -1) {
          selectedVoices.value.splice(index, 1)
        } else {
          selectedVoices.value.push(voiceId)
        }
      }
    }
    
    const toggleFavorite = (voiceId) => {
      const voice = voices.value.find(v => v.id === voiceId)
      if (voice) {
        voice.isFavorited = !voice.isFavorited
      }
    }
    
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    const triggerFileUpload = () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'audio/*'
      input.multiple = true
      input.onchange = (e) => {
        if (e.target.files.length > 0) {
          Array.from(e.target.files).forEach(file => {
            handleFileUpload(file)
          })
        }
      }
      input.click()
    }
    
    const handleFileUpload = (file) => {
      if (file && file.type.startsWith('audio/')) {
        const existingFile = uploadedFiles.value.find(f => f.name === file.name)
        if (existingFile) {
          alert('文件已存在！')
          return
        }
        uploadedFiles.value.push(file)
      } else {
        alert('请选择音频文件！')
      }
    }
    
    const removeFile = (index) => {
      uploadedFiles.value.splice(index, 1)
    }
    
    const startTraining = () => {
      if (uploadedFiles.value.length === 0) {
        alert('请先上传音频文件！')
        return
      }
      
      isTraining.value = true
      
      // 模拟训练过程
      setTimeout(() => {
        trainingText.value = '模型训练完成！'
        setTimeout(() => {
          isTraining.value = false
          showCompletion.value = true
        }, 3000)
      }, 5000)
    }
    
    const cancelTraining = () => {
      isTraining.value = false
      trainingText.value = '模型正在训练中,请稍等...'
    }
    
    const triggerCoverUpload = () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => {
        if (e.target.files.length > 0) {
          const file = e.target.files[0]
          const reader = new FileReader()
          reader.onload = (e) => {
            coverImage.value = e.target.result
          }
          reader.readAsDataURL(file)
        }
      }
      input.click()
    }
    
    const toggleShare = () => {
      isShared.value = !isShared.value
    }
    
    const completeTraining = () => {
      if (!voiceName.value.trim()) {
        alert('请输入音色名称！')
        return
      }
      
      if (!coverImage.value) {
        alert('请上传音色封面！')
        return
      }
      
      // 创建新的音色
      const newVoice = {
        id: Date.now().toString(),
        name: voiceName.value,
        description: '自定义音色',
        avatar: voiceName.value.charAt(0).toUpperCase(),
        isFavorited: false
      }
      
      voices.value.push(newVoice)
      
      // 重置状态
      showCompletion.value = false
      uploadedFiles.value = []
      voiceName.value = ''
      coverImage.value = ''
      isShared.value = false
      
      alert('音色创建成功！')
    }
    
    const updateVolume = () => {
      // 音量更新逻辑
    }
    
    const deleteSelected = () => {
      if (selectedVoices.value.length === 0) {
        alert('请先选择要删除的音色！')
        return
      }
      
      if (confirm(`确定要删除选中的 ${selectedVoices.value.length} 个音色吗？`)) {
        voices.value = voices.value.filter(voice => !selectedVoices.value.includes(voice.id))
        selectedVoices.value = []
        isEditMode.value = false
      }
    }
    
    const renameSelected = () => {
      if (selectedVoices.value.length !== 1) {
        alert('请选择一个音色进行重命名！')
        return
      }
      
      const newName = prompt('请输入新的音色名称：')
      if (newName && newName.trim()) {
        const voice = voices.value.find(v => v.id === selectedVoices.value[0])
        if (voice) {
          voice.name = newName.trim()
          voice.avatar = newName.trim().charAt(0).toUpperCase()
        }
        selectedVoices.value = []
        isEditMode.value = false
      }
    }
    
    const changeCover = () => {
      if (selectedVoices.value.length !== 1) {
        alert('请选择一个音色修改封面！')
        return
      }
      
      alert('修改封面功能开发中...')
    }
    
    const cancelEdit = () => {
      isEditMode.value = false
      selectedVoices.value = []
    }
    
    // 空状态提示方法
    const getEmptyStateTitle = () => {
      if (activeCategory.value === 'my') {
        if (activeTab.value === 'favorites') {
          return '暂无收藏音色'
        } else if (activeTab.value === 'models') {
          return '暂无训练音色'
        } else {
          return '暂无使用历史'
        }
      } else if (activeCategory.value === 'library') {
        return '暂无搜索结果'
      }
      return '暂无音色'
    }
    
    const getEmptyStateDescription = () => {
      if (activeCategory.value === 'my') {
        if (activeTab.value === 'favorites') {
          return '您还没有收藏任何音色，快去发现喜欢的音色吧！'
        } else if (activeTab.value === 'models') {
          return '您还没有训练任何音色，点击下方按钮开始训练您的专属音色吧！'
        } else {
          return '您还没有使用过任何音色，快去体验各种音色吧！'
        }
      } else if (activeCategory.value === 'library') {
        return '没有找到匹配的音色，请尝试其他搜索关键词'
      }
      return '暂无可用音色'
    }
    
    onMounted(() => {
      userStore.initializeFromStorage()
    })
    
    return {
      userStore,
      activeCategory,
      activeTab,
      searchTerm,
      isEditMode,
      selectedVoices,
      uploadedFiles,
      isTraining,
      trainingText,
      showCompletion,
      voiceName,
      coverImage,
      isShared,
      audioSettings,
      categories,
      tabs,
      voices,
      showSearch,
      showTabs,
      showTraining,
      showVoiceGrid,
      showEditControls,
      filteredVoices,
      coverText,
      selectCategory,
      selectTab,
      handleSearch,
      toggleEditMode,
      selectVoice,
      toggleFavorite,
      formatFileSize,
      triggerFileUpload,
      handleFileUpload,
      removeFile,
      startTraining,
      cancelTraining,
      triggerCoverUpload,
      toggleShare,
      completeTraining,
      updateVolume,
      deleteSelected,
      renameSelected,
      changeCover,
      cancelEdit,
      getEmptyStateTitle,
      getEmptyStateDescription
    }
  }
}
</script>

<style scoped>
.voice-settings {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  gap: 32px;
}

/* 左侧音色分类 */
.voice-categories {
  width: 280px;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  height: fit-content;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #555;
  position: relative;
}

.category-item:hover {
  background: rgba(168, 155, 250, 0.1);
}

.category-item.active {
  background: rgba(110, 198, 250, 0.15);
  color: #06b6d4;
}

.category-item.active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: #06b6d4;
  border-radius: 2px;
}

.category-item i {
  font-size: 1.3rem;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.category-item span {
  font-size: 1.1rem;
  font-weight: 500;
}

/* 右侧内容区域 */
.voice-content {
  flex: 1;
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.voice-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}

.voice-tab {
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
  font-weight: 500;
}

.voice-tab.active {
  background: #6b46c1;
  color: #fff;
}

.voice-tab:hover:not(.active) {
  background: rgba(107, 70, 193, 0.1);
}

.voice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.voice-card {
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.voice-card:hover {
  border-color: #6b46c1;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(107, 70, 193, 0.15);
}

.voice-card.selected {
  border-color: #06b6d4;
  background: rgba(6, 182, 212, 0.05);
}

.voice-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 12px;
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 50%, #06b6d4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 2rem;
  font-weight: bold;
}

.voice-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.voice-description {
  font-size: 0.9rem;
  color: #666;
  margin-top: 4px;
}

/* 收藏按钮样式 */
.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  opacity: 0;
}

.voice-card:hover .favorite-btn {
  opacity: 1;
}

.favorite-btn:hover {
  background: #fff;
  border-color: #ff6b6b;
  transform: scale(1.1);
}

.favorite-btn.favorited {
  background: #ff6b6b;
  border-color: #ff6b6b;
  color: #fff;
}

.favorite-btn.favorited:hover {
  background: #ff5252;
  border-color: #ff5252;
}

.favorite-btn i {
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.favorite-btn.favorited i {
  animation: heartBeat 0.6s ease-in-out;
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* 搜索栏样式 */
.search-container {
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #6b46c1;
}

.search-input::placeholder {
  color: #999;
}

/* 编辑控制栏 */
.edit-controls {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.edit-btn {
  background: #6b46c1;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
  font-weight: 500;
  min-width: 80px;
}

.edit-btn:hover {
  background: #5a3aa8;
}

.edit-btn.danger {
  background: #dc3545;
}

.edit-btn.danger:hover {
  background: #c82333;
}

.edit-btn.secondary {
  background: #6c757d;
}

.edit-btn.secondary:hover {
  background: #5a6268;
}

/* 训练界面样式 */
.training-container {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-bottom: 32px;
}

.upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.upload-area:hover {
  border-color: #6b46c1;
  background: rgba(107, 70, 193, 0.05);
}

.upload-icon {
  font-size: 3rem;
  color: #6b46c1;
  margin-bottom: 16px;
}

.upload-text {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 8px;
}

.upload-subtext {
  font-size: 0.9rem;
  color: #666;
}

.upload-btn {
  background: #6b46c1;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 16px;
}

.upload-btn:hover {
  background: #5a3aa8;
}

/* 文件列表样式 */
.file-list {
  margin-top: 24px;
}

.file-list-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  color: #6b46c1;
  font-size: 1.2rem;
}

.file-name {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.file-size {
  font-size: 0.8rem;
  color: #666;
}

.remove-file {
  background: #dc3545;
  color: #fff;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.remove-file:hover {
  background: #c82333;
}

.start-training-btn {
  background: #28a745;
  color: #fff;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 16px;
}

.start-training-btn:hover {
  background: #218838;
}

/* 训练状态 */
.training-status {
  text-align: center;
  padding: 40px 20px;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  background: #fafafa;
  margin-bottom: 24px;
}

.training-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.training-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 50%, #06b6d4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.2rem;
}

.training-text {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 12px;
}

.cancel-btn {
  background: #dc3545;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.cancel-btn:hover {
  background: #c82333;
}

/* 完成训练后的界面 */
.completion-container {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-bottom: 32px;
}

.completion-header {
  text-align: center;
  margin-bottom: 32px;
}

.completion-emoji {
  font-size: 2rem;
  margin-bottom: 12px;
}

.completion-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.completion-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

.cover-upload {
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cover-upload:hover {
  border-color: #6b46c1;
  background: rgba(107, 70, 193, 0.05);
}

.cover-preview {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  margin: 0 auto 16px;
}

.cover-text {
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
}

.name-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  transition: border-color 0.3s ease;
  margin-bottom: 16px;
}

.name-input:focus {
  outline: none;
  border-color: #6b46c1;
}

.share-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 24px;
  background: #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-switch.active {
  background: #8be6b6;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.toggle-switch.active .toggle-slider {
  transform: translateX(26px);
}

.share-text {
  font-size: 0.9rem;
  color: #666;
}

.complete-btn {
  background: #6b46c1;
  color: #fff;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 24px;
}

.complete-btn:hover {
  background: #5a3aa8;
}

/* 音频设置 */
.audio-settings {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-top: 32px;
}

.audio-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 24px;
}

.audio-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.audio-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.audio-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.audio-input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.audio-input:focus {
  outline: none;
  border-color: #6b46c1;
}

.volume-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e0e0e0;
  outline: none;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6b46c1;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6b46c1;
  cursor: pointer;
  border: none;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  width: 100%;
}

.empty-icon {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #666;
  margin-bottom: 12px;
}

.empty-description {
  font-size: 1rem;
  color: #999;
  margin-bottom: 32px;
  max-width: 400px;
  line-height: 1.5;
}

.empty-action-btn {
  background: #6b46c1;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty-action-btn:hover {
  background: #5a3aa8;
}

.volume-value {
  text-align: center;
  font-size: 1rem;
  color: #666;
  margin-top: 8px;
}

/* 移动端适配 */
@media (max-width: 1200px) {
  .content-area {
    flex-direction: column;
  }
  
  .voice-categories {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .voice-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .completion-form {
    grid-template-columns: 1fr;
  }
}
</style> 