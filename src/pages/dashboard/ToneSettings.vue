<template>
  <div class="tone-settings">
    <div class="page-header">
      <h1>音色设置</h1>
      <p>个性化您的语音助手音色体验</p>
    </div>

    <div class="settings-layout">
      <!-- 左侧边栏 -->
      <div class="sidebar">
        <div class="sidebar-section">
          <h3>音色管理</h3>
          <div class="sidebar-nav">
            <button 
              class="sidebar-nav-item" 
              :class="{ active: activeFunction === 'recommended' }"
              @click="activeFunction = 'recommended'"
            >
              <i class="fas fa-thumbs-up"></i>
              <span>推荐音色</span>
            </button>
            <button 
              class="sidebar-nav-item" 
              :class="{ active: activeFunction === 'library' }"
              @click="activeFunction = 'library'"
            >
              <i class="fas fa-th"></i>
              <span>音色大全</span>
            </button>
            <button 
              class="sidebar-nav-item" 
              :class="{ active: activeFunction === 'custom-training' }"
              @click="activeFunction = 'custom-training'"
            >
              <i class="fas fa-plus"></i>
              <span>自训练音色</span>
            </button>
            <button 
              class="sidebar-nav-item" 
              :class="{ active: activeFunction === 'my-tones' }"
              @click="activeFunction = 'my-tones'"
            >
              <i class="fas fa-user"></i>
              <span>我的音色</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧主内容区域 -->
      <div class="main-content">
        <!-- 推荐音色页面 -->
        <div v-if="activeFunction === 'recommended'" class="content-section">
          <h3>推荐音色</h3>
          <div class="tone-grid">
            <div 
              v-for="tone in recommendedTones" 
              :key="tone.id"
              class="tone-item"
              :class="{ active: selectedTone === tone.id }"
              @click="selectTone(tone.id)"
            >
              <div class="tone-icon">
                <!-- 如果有自定义图片，显示图片；否则显示图标 -->
                <img 
                  v-if="tone.customImage" 
                  :src="tone.customImage" 
                  :alt="tone.name"
                  class="tone-image"
                  @click.stop="previewImage(tone.customImage, tone.name)"
                />
                <i v-else :class="tone.icon"></i>
                <!-- 图片上传按钮 -->
                <div class="image-upload-overlay" @click.stop>
                  <input 
                    type="file" 
                    :ref="`imageInput-${tone.id}`"
                    @change="handleImageUpload($event, tone.id)"
                    accept="image/*"
                    class="image-input"
                  />
                  <div class="upload-actions">
                    <button class="upload-image-btn" @click="$refs[`imageInput-${tone.id}`][0].click()" title="上传封面">
                      <i class="fas fa-camera"></i>
                    </button>
                    <button 
                      v-if="tone.customImage" 
                      class="remove-image-btn" 
                      @click="removeCustomImage(tone.id)"
                      title="删除封面"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="tone-info">
                <h3>{{ tone.name }}</h3>
                <p>{{ tone.description }}</p>
              </div>
              <div class="tone-actions">
                <button class="preview-btn" @click.stop="previewTone(tone.id)">
                  <i class="fas fa-play"></i>
                </button>
                <button 
                  class="favorite-btn" 
                  :class="{ active: isFavorite(tone.id) }"
                  @click.stop="toggleFavorite(tone.id)"
                >
                  <i :class="isFavorite(tone.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 音色大全页面 -->
        <div v-if="activeFunction === 'library'" class="content-section">
          <h3>音色大全</h3>
          <div class="search-section">
            <div class="search-box">
              <i class="fas fa-search search-icon"></i>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="搜索音色名称、描述或标签..."
                class="search-input"
              />
            </div>
          </div>
          <div class="tone-grid">
            <div 
              v-for="tone in filteredLibraryTones" 
              :key="tone.id"
              class="tone-item"
              :class="{ active: selectedTone === tone.id }"
              @click="selectTone(tone.id)"
            >
              <div class="tone-icon">
                <!-- 如果有自定义图片，显示图片；否则显示图标 -->
                <img 
                  v-if="tone.customImage" 
                  :src="tone.customImage" 
                  :alt="tone.name"
                  class="tone-image"
                  @click.stop="previewImage(tone.customImage, tone.name)"
                />
                <i v-else :class="tone.icon"></i>
                <!-- 图片上传按钮 -->
                <div class="image-upload-overlay" @click.stop>
                  <input 
                    type="file" 
                    :ref="`imageInput-${tone.id}`"
                    @change="handleImageUpload($event, tone.id)"
                    accept="image/*"
                    class="image-input"
                  />
                  <div class="upload-actions">
                    <button class="upload-image-btn" @click="$refs[`imageInput-${tone.id}`][0].click()" title="上传封面">
                      <i class="fas fa-camera"></i>
                    </button>
                    <button 
                      v-if="tone.customImage" 
                      class="remove-image-btn" 
                      @click="removeCustomImage(tone.id)"
                      title="删除封面"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="tone-info">
                <h3>{{ tone.name }}</h3>
                <p>{{ tone.description }}</p>
              </div>
              <div class="tone-actions">
                <button class="preview-btn" @click.stop="previewTone(tone.id)">
                  <i class="fas fa-play"></i>
                </button>
                <button 
                  class="favorite-btn" 
                  :class="{ active: isFavorite(tone.id) }"
                  @click.stop="toggleFavorite(tone.id)"
                >
                  <i :class="isFavorite(tone.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 自训练音色页面 -->
        <div v-if="activeFunction === 'custom-training'" class="content-section">
          <h3>自训练音色</h3>
          
          <!-- 训练状态显示 -->
          <div v-if="trainingStatus === 'training'" class="training-status">
            <div class="status-content">
              <div class="status-icons">
                <i class="fas fa-cog fa-spin"></i>
                <i class="fas fa-folder"></i>
                <i class="fas fa-cog fa-spin"></i>
              </div>
              <p class="status-text">模型正在训练中,请稍等...</p>
              <button class="cancel-training-btn" @click="cancelTraining">
                取消训练
              </button>
            </div>
          </div>

          <!-- 训练完成状态 -->
          <div v-else-if="trainingStatus === 'completed'" class="training-completed">
            <div class="completion-content">
              <div class="completion-header">
                <span class="completion-icon">^o^</span>
                <h3>模型训练完成</h3>
              </div>
              <div class="completion-form">
                <div class="completion-upload-section">
                  <div class="cover-upload" @click="$refs.coverInput.click()">
                    <!-- 如果已上传封面，显示图片；否则显示上传提示 -->
                    <div v-if="customToneCover" class="cover-preview">
                      <img :src="customToneCover" alt="封面预览" class="cover-image" />
                      <div class="cover-overlay">
                        <button class="change-cover-btn" @click.stop="$refs.coverInput.click()">
                          <i class="fas fa-camera"></i>
                          更换封面
                        </button>
                        <button class="remove-cover-btn" @click.stop="removeCustomCover">
                          <i class="fas fa-trash"></i>
                          删除封面
                        </button>
                      </div>
                    </div>
                    <div v-else class="cover-upload-placeholder">
                      <i class="fas fa-plus"></i>
                      <p>点击此处上传音色封面</p>
                    </div>
                    <input 
                      ref="coverInput"
                      type="file" 
                      accept="image/*" 
                      @change="handleCoverUpload" 
                      class="cover-input"
                    />
                  </div>
                  <div class="name-input">
                    <input 
                      v-model="customToneName" 
                      type="text" 
                      placeholder="点此输入音色名称" 
                      class="tone-name-input"
                    />
                  </div>
                </div>
                <div class="share-option">
                  <label class="share-toggle">
                    <input 
                      type="checkbox" 
                      v-model="shareToPublic" 
                      class="toggle-input"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                  <span class="share-text">是否上传该音色至公共分享声库</span>
                </div>
                <button class="complete-btn" @click="completeTraining">
                  完成
                </button>
              </div>
            </div>
          </div>

          <!-- 文件上传区域 -->
          <div v-else class="upload-section">
            <div class="upload-area" @drop="handleDrop" @dragover.prevent @dragenter.prevent>
              <div class="upload-content">
                <div class="upload-icons">
                  <i class="fas fa-circle"></i>
                  <i class="fas fa-circle"></i>
                </div>
                <p class="upload-text">在此处将需要训练的声音文件拖入</p>
                <p class="upload-hint">(训练内容越多效果越好呦)</p>
                <i class="fas fa-file-upload upload-icon"></i>
              </div>
              <input 
                type="file" 
                ref="fileInput" 
                @change="handleFileSelect" 
                multiple 
                accept="audio/*" 
                class="file-input"
              />
            </div>
            <button class="select-file-btn" @click="$refs.fileInput.click()">
              选择文件导入
            </button>
            
            <!-- 已上传文件列表 -->
            <div v-if="uploadedFiles.length > 0" class="uploaded-files">
              <h4>已上传文件 ({{ uploadedFiles.length }})</h4>
              <div class="file-list">
                <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                  <i class="fas fa-music"></i>
                  <span class="file-name">{{ file.name }}</span>
                  <span class="file-size">{{ formatFileSize(file.size) }}</span>
                  <button class="remove-file-btn" @click="removeFile(index)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <button class="start-training-btn" @click="startTraining">
                开始训练
              </button>
            </div>
          </div>
        </div>

        <!-- 我的音色页面 -->
        <div v-if="activeFunction === 'my-tones'" class="content-section">
          <div class="my-tones-header">
            <h3>我的音色</h3>
            <button 
              class="edit-btn" 
              :class="{ active: isEditMode }"
              @click="toggleEditMode"
            >
              <i :class="isEditMode ? 'fas fa-check' : 'fas fa-edit'"></i>
              {{ isEditMode ? '完成' : '编辑' }}
            </button>
          </div>
          
          <!-- 子导航栏 -->
          <div class="sub-navigation">
            <button 
              class="sub-nav-item" 
              :class="{ active: activeSubTab === 'history' }"
              @click="activeSubTab = 'history'"
            >
              <i class="fas fa-history"></i>
              使用历史
            </button>
            <button 
              class="sub-nav-item" 
              :class="{ active: activeSubTab === 'favorites' }"
              @click="activeSubTab = 'favorites'"
            >
              <i class="fas fa-heart"></i>
              我的收藏
            </button>
            <button 
              class="sub-nav-item" 
              :class="{ active: activeSubTab === 'models' }"
              @click="activeSubTab = 'models'"
            >
              <i class="fas fa-cube"></i>
              我的模型
            </button>
          </div>

          <!-- 使用历史 -->
          <div v-if="activeSubTab === 'history'" class="sub-content">
            <div class="tone-grid">
              <div 
                v-for="tone in usedTones" 
                :key="tone.id"
                class="tone-item"
                :class="{ active: selectedTone === tone.id }"
                @click="selectTone(tone.id)"
              >
                <div class="tone-icon">
                  <!-- 如果有自定义图片，显示图片；否则显示图标 -->
                  <img 
                    v-if="tone.customImage" 
                    :src="tone.customImage" 
                    :alt="tone.name"
                    class="tone-image"
                    @click.stop="previewImage(tone.customImage, tone.name)"
                  />
                  <i v-else :class="tone.icon"></i>
                  <!-- 图片上传按钮 -->
                  <div class="image-upload-overlay" @click.stop>
                    <input 
                      type="file" 
                      :ref="`imageInput-${tone.id}`"
                      @change="handleImageUpload($event, tone.id)"
                      accept="image/*"
                      class="image-input"
                    />
                    <div class="upload-actions">
                      <button class="upload-image-btn" @click="$refs[`imageInput-${tone.id}`][0].click()" title="上传封面">
                        <i class="fas fa-camera"></i>
                      </button>
                      <button 
                        v-if="tone.customImage" 
                        class="remove-image-btn" 
                        @click="removeCustomImage(tone.id)"
                        title="删除封面"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="tone-info">
                  <h3>{{ tone.name }}</h3>
                  <p>{{ tone.description }}</p>
                  <span class="usage-time">上次使用: {{ tone.lastUsed }}</span>
                </div>
                <div class="tone-actions">
                  <button class="preview-btn" @click.stop="previewTone(tone.id)">
                    <i class="fas fa-play"></i>
                  </button>
                  <button 
                    v-if="isEditMode" 
                    class="remove-btn" 
                    @click.stop="removeFromHistory(tone.id)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 我的收藏 -->
          <div v-if="activeSubTab === 'favorites'" class="sub-content">
            <div class="tone-grid">
              <div 
                v-for="tone in favoriteTones" 
                :key="tone.id"
                class="tone-item"
                :class="{ active: selectedTone === tone.id }"
                @click="selectTone(tone.id)"
              >
                <div class="tone-icon">
                  <!-- 如果有自定义图片，显示图片；否则显示图标 -->
                  <img 
                    v-if="tone.customImage" 
                    :src="tone.customImage" 
                    :alt="tone.name"
                    class="tone-image"
                    @click.stop="previewImage(tone.customImage, tone.name)"
                  />
                  <i v-else :class="tone.icon"></i>
                  <!-- 图片上传按钮 -->
                  <div class="image-upload-overlay" @click.stop>
                    <input 
                      type="file" 
                      :ref="`imageInput-${tone.id}`"
                      @change="handleImageUpload($event, tone.id)"
                      accept="image/*"
                      class="image-input"
                    />
                    <div class="upload-actions">
                      <button class="upload-image-btn" @click="$refs[`imageInput-${tone.id}`][0].click()" title="上传封面">
                        <i class="fas fa-camera"></i>
                      </button>
                      <button 
                        v-if="tone.customImage" 
                        class="remove-image-btn" 
                        @click="removeCustomImage(tone.id)"
                        title="删除封面"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="tone-info">
                  <h3>{{ tone.name }}</h3>
                  <p>{{ tone.description }}</p>
                </div>
                <div class="tone-actions">
                  <button class="preview-btn" @click.stop="previewTone(tone.id)">
                    <i class="fas fa-play"></i>
                  </button>
                  <button 
                    class="favorite-btn active" 
                    @click.stop="toggleFavorite(tone.id)"
                  >
                    <i class="fas fa-heart"></i>
                  </button>
                  <button 
                    v-if="isEditMode" 
                    class="remove-btn" 
                    @click.stop="removeFromFavorites(tone.id)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 我的模型 -->
          <div v-if="activeSubTab === 'models'" class="sub-content">
            <div class="tone-grid">
              <div 
                v-for="tone in myCustomTones" 
                :key="tone.id"
                class="tone-item custom-tone"
                :class="{ active: selectedTone === tone.id }"
                @click="selectTone(tone.id)"
              >
                <div class="tone-icon">
                  <!-- 如果有自定义图片，显示图片；否则显示图标 -->
                  <img 
                    v-if="tone.customImage || tone.cover" 
                    :src="tone.customImage || tone.cover" 
                    :alt="tone.name"
                    class="tone-image"
                    @click.stop="previewImage(tone.customImage || tone.cover, tone.name)"
                  />
                  <i v-else :class="tone.icon"></i>
                  <!-- 图片上传按钮 -->
                  <div class="image-upload-overlay" @click.stop>
                    <input 
                      type="file" 
                      :ref="`imageInput-${tone.id}`"
                      @change="handleImageUpload($event, tone.id)"
                      accept="image/*"
                      class="image-input"
                    />
                    <div class="upload-actions">
                      <button class="upload-image-btn" @click="$refs[`imageInput-${tone.id}`][0].click()" title="上传封面">
                        <i class="fas fa-camera"></i>
                      </button>
                      <button 
                        v-if="tone.customImage" 
                        class="remove-image-btn" 
                        @click="removeCustomImage(tone.id)"
                        title="删除封面"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="tone-info">
                  <h3>{{ tone.name }}</h3>
                  <p>{{ tone.description }}</p>
                  <span class="tone-type">自定义训练</span>
                </div>
                <div class="tone-actions">
                  <button class="preview-btn" @click.stop="previewTone(tone.id)">
                    <i class="fas fa-play"></i>
                  </button>
                  <button 
                    v-if="isEditMode" 
                    class="remove-btn" 
                    @click.stop="removeFromModels(tone.id)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ToneSettings',
  setup() {
    const selectedTone = ref('default')
    const activeFunction = ref('recommended')
    const activeSubTab = ref('history') // history, favorites, models
    const searchQuery = ref('')
    const trainingStatus = ref('idle') // idle, training, completed
    const uploadedFiles = ref([])
    const customToneName = ref('')
    const shareToPublic = ref(true)
    const myCustomTones = ref([])
    const isEditMode = ref(false) // 编辑模式开关
    const customToneCover = ref(null) // 新增：用于存储自定义音色的封面图片URL

    // 推荐音色
    const recommendedTones = ref([
      {
        id: 'default',
        name: '默认音色',
        description: '清晰自然的默认音色',
        icon: 'fas fa-user'
      },
      {
        id: 'friendly',
        name: '友好音色',
        description: '温暖友好的音色',
        icon: 'fas fa-smile'
      },
      {
        id: 'professional',
        name: '专业音色',
        description: '专业正式的音色',
        icon: 'fas fa-briefcase'
      }
    ])

    // 音色大全
    const libraryTones = ref([
      {
        id: 'casual',
        name: '轻松音色',
        description: '轻松随意的音色',
        icon: 'fas fa-coffee'
      },
      {
        id: 'formal',
        name: '正式音色',
        description: '正式庄重的音色',
        icon: 'fas fa-graduation-cap'
      },
      {
        id: 'creative',
        name: '创意音色',
        description: '富有创意的音色',
        icon: 'fas fa-palette'
      },
      {
        id: 'gentle',
        name: '温柔音色',
        description: '温柔细腻的音色',
        icon: 'fas fa-heart'
      }
    ])

    // 使用历史
    const usedTones = ref([
      {
        id: 'default',
        name: '默认音色',
        description: '清晰自然的默认音色',
        icon: 'fas fa-user',
        lastUsed: '2024-01-15 14:30'
      },
      {
        id: 'friendly',
        name: '友好音色',
        description: '温暖友好的音色',
        icon: 'fas fa-smile',
        lastUsed: '2024-01-14 09:15'
      }
    ])

    // 我的收藏
    const favoriteTones = ref([
      {
        id: 'casual',
        name: '轻松音色',
        description: '轻松随意的音色',
        icon: 'fas fa-coffee'
      },
      {
        id: 'formal',
        name: '正式音色',
        description: '正式庄重的音色',
        icon: 'fas fa-graduation-cap'
      }
    ])

    // 过滤后的音色大全
    const filteredLibraryTones = computed(() => {
      if (!searchQuery.value) return libraryTones.value
      
      const query = searchQuery.value.toLowerCase()
      return libraryTones.value.filter(tone => 
        tone.name.toLowerCase().includes(query) ||
        tone.description.toLowerCase().includes(query)
      )
    })

    const selectTone = (toneId) => {
      selectedTone.value = toneId
      // 更新使用时间
      const tone = usedTones.value.find(t => t.id === toneId)
      if (tone) {
        tone.lastUsed = new Date().toLocaleString('zh-CN')
      }
    }

    const previewTone = (toneId) => {
      console.log('预览音色:', toneId)
    }

    // 文件处理
    const handleFileSelect = (event) => {
      const files = Array.from(event.target.files)
      addFiles(files)
    }

    const handleDrop = (event) => {
      const files = Array.from(event.dataTransfer.files)
      addFiles(files)
    }

    const addFiles = (files) => {
      const audioFiles = files.filter(file => file.type.startsWith('audio/'))
      uploadedFiles.value.push(...audioFiles)
    }

    const removeFile = (index) => {
      uploadedFiles.value.splice(index, 1)
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // 训练相关
    const startTraining = () => {
      if (uploadedFiles.value.length === 0) {
        alert('请先上传音频文件')
        return
      }
      trainingStatus.value = 'training'
      // 模拟训练过程
      setTimeout(() => {
        trainingStatus.value = 'completed'
      }, 5000)
    }

    const cancelTraining = () => {
      trainingStatus.value = 'idle'
      uploadedFiles.value = []
    }

    const handleCoverUpload = (event) => {
      const file = event.target.files[0]
      if (!file) return

      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }

      // 验证文件大小（限制为5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片文件大小不能超过5MB')
        return
      }

      // 显示上传进度
      const loadingToast = showLoadingToast('正在上传封面图片...')

      // 创建FileReader来读取图片
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        
        // 验证图片尺寸
        const img = new Image()
        img.onload = () => {
          // 检查图片尺寸，建议最小200x200
          if (img.width < 200 || img.height < 200) {
            hideLoadingToast(loadingToast)
            if (!confirm('图片尺寸较小，可能影响显示效果。是否继续使用？')) {
              return
            }
          }
          
          // 保存封面图片URL
          customToneCover.value = imageUrl
          hideLoadingToast(loadingToast)
          showSuccessToast('封面图片上传成功！')
        }
        img.onerror = () => {
          hideLoadingToast(loadingToast)
          showErrorToast('图片加载失败，请重试')
        }
        img.src = imageUrl
      }
      reader.onerror = () => {
        hideLoadingToast(loadingToast)
        showErrorToast('图片读取失败，请重试')
      }
      reader.readAsDataURL(file)
    }

    const completeTraining = () => {
      if (!customToneName.value.trim()) {
        alert('请输入音色名称')
        return
      }

      // 创建新的自定义音色
      const newCustomTone = {
        id: `custom-${Date.now()}`,
        name: customToneName.value,
        description: '自定义训练音色',
        icon: 'fas fa-cube',
        cover: customToneCover.value, // 使用上传的封面图片URL
        type: 'custom'
      }

      myCustomTones.value.push(newCustomTone)
      
      // 重置状态
      trainingStatus.value = 'idle'
      uploadedFiles.value = []
      customToneName.value = ''
      customToneCover.value = null // 清空封面图片URL
      shareToPublic.value = true
      
      // 切换到我的音色页面
      activeFunction.value = 'my-tones'
    }

    const toggleFavorite = (toneId) => {
      const existingFavorite = favoriteTones.value.find(t => t.id === toneId)
      if (existingFavorite) {
        // 如果已收藏，则取消收藏
        const index = favoriteTones.value.findIndex(t => t.id === toneId)
        if (index !== -1) {
          favoriteTones.value.splice(index, 1)
        }
      } else {
        // 如果未收藏，则添加到收藏
        const tone = [...recommendedTones.value, ...libraryTones.value].find(t => t.id === toneId)
        if (tone) {
          favoriteTones.value.push({
            ...tone,
            isFavorite: true
          })
        }
      }
    }

    const isFavorite = (toneId) => {
      return favoriteTones.value.some(tone => tone.id === toneId)
    }

    // 编辑模式切换
    const toggleEditMode = () => {
      isEditMode.value = !isEditMode.value
    }

    // 从历史中移除音色
    const removeFromHistory = (toneId) => {
      const index = usedTones.value.findIndex(t => t.id === toneId)
      if (index !== -1) {
        usedTones.value.splice(index, 1)
      }
    }

    // 从收藏中移除音色
    const removeFromFavorites = (toneId) => {
      const index = favoriteTones.value.findIndex(t => t.id === toneId)
      if (index !== -1) {
        favoriteTones.value.splice(index, 1)
      }
    }

    // 从我的模型中移除音色
    const removeFromModels = (toneId) => {
      const index = myCustomTones.value.findIndex(t => t.id === toneId)
      if (index !== -1) {
        myCustomTones.value.splice(index, 1)
      }
    }

    // 处理图片上传
    const handleImageUpload = (event, toneId) => {
      const file = event.target.files[0]
      if (!file) return

      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }

      // 验证文件大小（限制为5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片文件大小不能超过5MB')
        return
      }

      // 显示上传进度
      const loadingToast = showLoadingToast('正在上传图片...')

      // 创建FileReader来读取图片
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        
        // 验证图片尺寸
        const img = new Image()
        img.onload = () => {
          // 检查图片尺寸，建议最小200x200
          if (img.width < 200 || img.height < 200) {
            hideLoadingToast(loadingToast)
            if (!confirm('图片尺寸较小，可能影响显示效果。是否继续使用？')) {
              return
            }
          }
          
          // 更新对应音色的自定义图片
          updateToneImage(toneId, imageUrl)
          hideLoadingToast(loadingToast)
          showSuccessToast('图片上传成功！')
        }
        img.onerror = () => {
          hideLoadingToast(loadingToast)
          showErrorToast('图片加载失败，请重试')
        }
        img.src = imageUrl
      }
      reader.onerror = () => {
        hideLoadingToast(loadingToast)
        showErrorToast('图片读取失败，请重试')
      }
      reader.readAsDataURL(file)
    }

    // 显示加载提示
    const showLoadingToast = (message) => {
      const toast = document.createElement('div')
      toast.className = 'loading-toast'
      toast.innerHTML = `
        <div class="loading-content">
          <i class="fas fa-spinner fa-spin"></i>
          <span>${message}</span>
        </div>
      `
      document.body.appendChild(toast)
      return toast
    }

    // 隐藏加载提示
    const hideLoadingToast = (toast) => {
      if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }

    // 显示成功提示
    const showSuccessToast = (message) => {
      const toast = document.createElement('div')
      toast.className = 'success-toast'
      toast.innerHTML = `
        <div class="toast-content">
          <i class="fas fa-check-circle"></i>
          <span>${message}</span>
        </div>
      `
      document.body.appendChild(toast)
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 3000)
    }

    // 显示错误提示
    const showErrorToast = (message) => {
      const toast = document.createElement('div')
      toast.className = 'error-toast'
      toast.innerHTML = `
        <div class="toast-content">
          <i class="fas fa-exclamation-circle"></i>
          <span>${message}</span>
        </div>
      `
      document.body.appendChild(toast)
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 3000)
    }

    // 更新音色图片
    const updateToneImage = (toneId, imageUrl) => {
      // 更新推荐音色
      const recommendedTone = recommendedTones.value.find(t => t.id === toneId)
      if (recommendedTone) {
        recommendedTone.customImage = imageUrl
        return
      }

      // 更新音色大全
      const libraryTone = libraryTones.value.find(t => t.id === toneId)
      if (libraryTone) {
        libraryTone.customImage = imageUrl
        return
      }

      // 更新使用历史
      const usedTone = usedTones.value.find(t => t.id === toneId)
      if (usedTone) {
        usedTone.customImage = imageUrl
        return
      }

      // 更新我的收藏
      const favoriteTone = favoriteTones.value.find(t => t.id === toneId)
      if (favoriteTone) {
        favoriteTone.customImage = imageUrl
        return
      }

      // 更新我的模型
      const customTone = myCustomTones.value.find(t => t.id === toneId)
      if (customTone) {
        customTone.customImage = imageUrl
        return
      }
    }

    // 预览图片
    const previewImage = (imageUrl, toneName) => {
      const modal = document.createElement('div')
      modal.className = 'image-preview-modal'
      modal.innerHTML = `
        <div class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3>${toneName} - 封面预览</h3>
              <button class="close-btn" onclick="this.closest('.image-preview-modal').remove()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <img src="${imageUrl}" alt="${toneName}" class="preview-image">
            </div>
          </div>
        </div>
      `
      document.body.appendChild(modal)
      
      // 点击遮罩关闭
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove()
        }
      })
    }

    // 删除自定义图片
    const removeCustomImage = (toneId) => {
      if (!confirm('确定要删除自定义封面吗？')) {
        return
      }
      
      // 清除对应音色的自定义图片
      updateToneImage(toneId, null)
      showSuccessToast('封面已删除')
    }

    // 删除自定义封面
    const removeCustomCover = () => {
      if (!confirm('确定要删除封面吗？')) {
        return
      }
      customToneCover.value = null
      showSuccessToast('封面已删除')
    }

    return {
      selectedTone,
      activeFunction,
      activeSubTab,
      searchQuery,
      trainingStatus,
      uploadedFiles,
      customToneName,
      shareToPublic,
      myCustomTones,
      isEditMode,
      recommendedTones,
      filteredLibraryTones,
      usedTones,
      favoriteTones,
      selectTone,
      previewTone,
      handleFileSelect,
      handleDrop,
      removeFile,
      formatFileSize,
      startTraining,
      cancelTraining,
      handleCoverUpload,
      completeTraining,
      toggleFavorite,
      isFavorite,
      toggleEditMode,
      removeFromHistory,
      removeFromFavorites,
      removeFromModels,
      handleImageUpload,
      previewImage,
      removeCustomImage,
      customToneCover,
      removeCustomCover
    }
  }
}
</script>

<style scoped>
.tone-settings {
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.settings-layout {
  display: flex;
  gap: 32px;
}

/* 左侧边栏 */
.sidebar {
  flex: 0 0 280px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 32px;
}

.sidebar-section h3 {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f8f9fa;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #f8f9fa;
  color: #666;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  text-align: left;
  width: 100%;
}

.sidebar-nav-item:hover {
  background: #f0f3f5;
  color: #333;
  border-color: #e9ecef;
  transform: translateX(4px);
}

.sidebar-nav-item.active {
  background: #6ec6fa;
  color: #fff;
  box-shadow: 0 2px 8px rgba(110, 198, 250, 0.3);
  border-color: #6ec6fa;
}

.sidebar-nav-item i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

/* 右侧主内容区域 */
.main-content {
  flex: 1;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  min-width: 0;
}

.content-section {
  padding: 32px;
}

.content-section h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 24px 0;
}

/* 搜索框 */
.search-section {
  margin-bottom: 24px;
}

.search-box {
  position: relative;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #6ec6fa;
  box-shadow: 0 0 0 3px rgba(110, 198, 250, 0.1);
}

/* 音色网格 */
.tone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  align-items: start;
}

.tone-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  height: 120px;
  min-height: 120px;
  max-height: 120px;
  box-sizing: border-box;
}

.tone-item:hover {
  border-color: #6ec6fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(110, 198, 250, 0.2);
}

.tone-item.active {
  border-color: #6ec6fa;
  background: #f8f9ff;
}

.tone-item.custom-tone {
  border-color: #b6a6f7;
  background: #f8f9ff;
}

.tone-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6ec6fa 0%, #b6a6f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.2rem;
  margin-right: 16px;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
}

.tone-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.tone-image:hover {
  transform: scale(1.05);
}

.image-upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tone-icon:hover .image-upload-overlay {
  opacity: 1;
}

.image-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-actions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tone-icon:hover .upload-actions {
  opacity: 1;
}

.upload-image-btn {
  background: #fff;
  color: #6ec6fa;
  border: 1px solid #e9ecef;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.upload-image-btn:hover {
  background: #f8f9ff;
  color: #5bb5e9;
  border-color: #6ec6fa;
  transform: scale(1.1);
}

.remove-image-btn {
  background: #fff;
  color: #ff6b6b;
  border: 1px solid #e9ecef;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.remove-image-btn:hover {
  background: #fff5f5;
  color: #ff5252;
  border-color: #ff6b6b;
  transform: scale(1.1);
}

.tone-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.tone-info h3 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tone-info p {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.usage-time {
  font-size: 0.8rem;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tone-type {
  font-size: 0.8rem;
  color: #b6a6f7;
  background: #f0f0ff;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.tone-actions {
  display: flex;
  gap: 8px;
  margin-left: 16px;
  flex-shrink: 0;
}

.preview-btn, .favorite-btn, .remove-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.preview-btn {
  background: #6ec6fa;
  color: #fff;
}

.preview-btn:hover {
  background: #5bb5e9;
  transform: scale(1.1);
}

.favorite-btn {
  background: #fff;
  color: #999;
  border: 1px solid #e9ecef;
}

.favorite-btn:hover {
  background: #fff5f5;
  color: #ff6b6b;
  border-color: #ff6b6b;
}

.favorite-btn.active {
  background: #ff6b6b;
  color: #fff;
  border-color: #ff6b6b;
}

.favorite-btn.active:hover {
  background: #ff5252;
}

.remove-btn {
  background: #fff;
  color: #ff6b6b;
  border: 1px solid #e9ecef;
}

.remove-btn:hover {
  background: #fff5f5;
  color: #ff5252;
  border-color: #ff6b6b;
}

/* 上传区域 */
.upload-section {
  margin-top: 24px;
}

.upload-area {
  border: 2px dashed #e9ecef;
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
  background: #fafafa;
}

.upload-area:hover {
  border-color: #6ec6fa;
  background: #f8f9ff;
}

.upload-content {
  position: relative;
  z-index: 2;
}

.upload-icons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.upload-icons i {
  font-size: 1.5rem;
  color: #999;
}

.upload-text {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 8px 0;
}

.upload-hint {
  font-size: 0.9rem;
  color: #999;
  margin: 0 0 16px 0;
}

.upload-icon {
  font-size: 2rem;
  color: #6ec6fa;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.select-file-btn {
  margin-top: 16px;
  padding: 12px 24px;
  background: #6ec6fa;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-file-btn:hover {
  background: #5bb5e9;
}

/* 已上传文件 */
.uploaded-files {
  margin-top: 24px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
}

.uploaded-files h4 {
  margin: 0 0 16px 0;
  color: #333;
}

.file-list {
  margin-bottom: 16px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
}

.file-item i {
  color: #6ec6fa;
  margin-right: 12px;
}

.file-name {
  flex: 1;
  font-size: 0.9rem;
  color: #333;
}

.file-size {
  font-size: 0.8rem;
  color: #999;
  margin-right: 12px;
}

.remove-file-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.remove-file-btn:hover {
  background: #fff5f5;
}

.start-training-btn {
  padding: 12px 24px;
  background: #6ec6fa;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-training-btn:hover {
  background: #5bb5e9;
}

/* 训练状态 */
.training-status {
  text-align: center;
  padding: 48px 24px;
}

.status-content {
  max-width: 400px;
  margin: 0 auto;
}

.status-icons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.status-icons i {
  font-size: 2rem;
  color: #6ec6fa;
}

.status-text {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 24px 0;
}

.cancel-training-btn {
  padding: 12px 24px;
  background: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-training-btn:hover {
  background: #ff5252;
}

/* 训练完成 */
.training-completed {
  padding: 32px;
}

.completion-content {
  max-width: 600px;
  margin: 0 auto;
}

.completion-header {
  text-align: center;
  margin-bottom: 32px;
}

.completion-icon {
  font-size: 2rem;
  color: #6ec6fa;
  margin-right: 12px;
}

.completion-header h3 {
  display: inline;
  color: #333;
}

.completion-form {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
}

.completion-upload-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.cover-upload {
  flex: 1;
  border: 2px dashed #e9ecef;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cover-upload:hover {
  border-color: #6ec6fa;
}

.cover-upload i {
  font-size: 2rem;
  color: #6ec6fa;
  margin-bottom: 8px;
}

.cover-upload p {
  margin: 0;
  color: #666;
}

.cover-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.cover-preview {
  position: relative;
  width: 100%;
  height: 100px; /* Fixed height for preview */
  border-radius: 8px;
  overflow: hidden;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.cover-preview .cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-preview .cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cover-preview:hover .cover-overlay {
  opacity: 1;
}

.cover-preview .change-cover-btn,
.cover-preview .remove-cover-btn {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 1px solid #fff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.cover-preview .change-cover-btn:hover,
.cover-preview .remove-cover-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.cover-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #e0e0e0;
  border-radius: 8px;
  color: #666;
  font-size: 0.9rem;
}

.cover-upload-placeholder i {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.name-input {
  flex: 1;
}

.tone-name-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.tone-name-input:focus {
  outline: none;
  border-color: #6ec6fa;
}

.share-option {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.share-toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.toggle-input:checked + .toggle-slider {
  background-color: #6ec6fa;
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.share-text {
  font-size: 0.9rem;
  color: #666;
}

.complete-btn {
  width: 100%;
  padding: 12px 24px;
  background: #6ec6fa;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.complete-btn:hover {
  background: #5bb5e9;
}

/* 我的音色页面 */
.my-tones-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.my-tones-header h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #f0f3f5;
  color: #333;
  border-color: #6ec6fa;
}

.edit-btn.active {
  background: #6ec6fa;
  color: #fff;
  border-color: #6ec6fa;
}

.edit-btn i {
  font-size: 1rem;
}

/* 子导航栏 */
.sub-navigation {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 2px solid #f8f9fa;
  padding-bottom: 16px;
}

.sub-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  background: #f8f9fa;
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.sub-nav-item:hover {
  background: #f0f3f5;
  color: #333;
  border-color: #e9ecef;
}

.sub-nav-item.active {
  background: #6ec6fa;
  color: #fff;
  box-shadow: 0 2px 8px rgba(110, 198, 250, 0.3);
  border-color: #6ec6fa;
}

.sub-nav-item i {
  font-size: 1rem;
}

/* 子内容区域 */
.sub-content {
  padding-top: 24px;
}

/* 图片预览模态框 */
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  background: #fff;
  border-radius: 16px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #e9ecef;
  color: #333;
}

.modal-body {
  padding: 24px;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Toast提示样式 */
.loading-toast,
.success-toast,
.error-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: toastSlideIn 0.3s ease;
  max-width: 300px;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.loading-toast {
  background: #6ec6fa;
  color: #fff;
}

.success-toast {
  background: #51cf66;
  color: #fff;
}

.error-toast {
  background: #ff6b6b;
  color: #fff;
}

.loading-content,
.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.loading-content i,
.toast-content i {
  font-size: 1.2rem;
}

.loading-content span,
.toast-content span {
  font-size: 0.95rem;
  font-weight: 500;
}

/* 上传操作按钮样式 */
.upload-actions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tone-icon:hover .upload-actions {
  opacity: 1;
}

.upload-image-btn {
  background: #fff;
  color: #6ec6fa;
  border: 1px solid #e9ecef;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.upload-image-btn:hover {
  background: #f8f9ff;
  color: #5bb5e9;
  border-color: #6ec6fa;
  transform: scale(1.1);
}

.remove-image-btn {
  background: #fff;
  color: #ff6b6b;
  border: 1px solid #e9ecef;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.remove-image-btn:hover {
  background: #fff5f5;
  color: #ff5252;
  border-color: #ff6b6b;
  transform: scale(1.1);
}

/* 图片样式优化 */
.tone-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.tone-image:hover {
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tone-settings {
    padding: 20px;
    max-width: 100%;
  }
  
  .settings-layout {
    flex-direction: column;
    gap: 20px;
  }

  .sidebar {
    flex: none;
    width: 100%;
    position: static;
    margin-bottom: 0;
  }

  .main-content {
    width: 100%;
  }

  .tone-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .tone-item {
    flex-direction: column;
    text-align: center;
    height: auto;
    min-height: 140px;
    max-height: none;
    padding: 16px;
  }
  
  .tone-icon {
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .tone-actions {
    margin-left: 0;
    margin-top: 12px;
  }
  
  .completion-upload-section {
    flex-direction: column;
  }

  .sub-navigation {
    flex-direction: column;
    gap: 8px;
  }

  .sub-nav-item {
    justify-content: center;
  }

  .tone-info h3,
  .tone-info p,
  .usage-time {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
  }

  .modal-content {
    margin: 20px;
    max-width: calc(100vw - 40px);
    max-height: calc(100vh - 40px);
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-body {
    padding: 16px;
  }
  
  .loading-toast,
  .success-toast,
  .error-toast {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .upload-actions {
    gap: 4px;
  }
  
  .upload-image-btn,
  .remove-image-btn {
    width: 32px;
    height: 32px;
  }
}
</style> 