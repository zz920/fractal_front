<template>
  <div class="upload-section">
    <h2 class="section-title">自训练音色</h2>
    <p class="section-description">上传您的语音文件，训练专属音色</p>
    
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
          <i class="fas fa-cloud-upload-alt"></i>
        </div>
        <div class="upload-text">
          <h3 class="upload-title">点击或拖拽文件到此处</h3>
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
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'UploadArea',
  props: {
    isUploading: {
      type: Boolean,
      default: false
    },
    uploadProgress: {
      type: Number,
      default: 0
    }
  },
  emits: ['file-select', 'drag-over', 'drag-leave', 'drop'],
  setup(props, { emit }) {
    const fileInput = ref(null)
    const isDragOver = ref(false)

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        emit('file-select', file)
      }
    }

    const handleDragOver = (event) => {
      isDragOver.value = true
      emit('drag-over', event)
    }

    const handleDragLeave = (event) => {
      isDragOver.value = false
      emit('drag-leave', event)
    }

    const handleDrop = (event) => {
      isDragOver.value = false
      const files = event.dataTransfer.files
      if (files.length > 0) {
        emit('drop', files[0])
      }
    }

    return {
      fileInput,
      isDragOver,
      triggerFileInput,
      handleFileSelect,
      handleDragOver,
      handleDragLeave,
      handleDrop
    }
  }
}
</script>

<style scoped>
.upload-section {
  margin-bottom: 2rem;
}

.section-title {
  font-family: '优设标题黑', Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.section-description {
  color: #6c757d;
  margin: 0 0 1.5rem 0;
  font-size: 0.9rem;
}

.upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: #f8f9fa;
}

.upload-area:hover {
  border-color: #667eea;
  background: #e9ecef;
}

.upload-area.drag-over {
  border-color: #667eea;
  background: #e3f2fd;
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
  width: 64px;
  height: 64px;
  color: #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.upload-text h3 {
  font-size: 1.25rem;
  color: #495057;
  margin: 0 0 0.5rem 0;
}

.upload-text p {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.upload-progress {
  margin-top: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  color: #6c757d;
  font-size: 0.875rem;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .upload-area {
    padding: 2rem 1.5rem;
  }
  
  .upload-icon {
    width: 48px;
    height: 48px;
    font-size: 2.5rem;
  }
  
  .upload-text h3 {
    font-size: 1.1rem;
  }
  
  .upload-text p {
    font-size: 0.85rem;
  }
}
</style>
