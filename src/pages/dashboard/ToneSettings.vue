<template>
  <div class="tone-settings">
    <div class="page-header">
      <h1>音色设置</h1>
      <p>自定义您的语音助手音色</p>
    </div>
    
    <div class="settings-content">
      <div class="settings-card">
        <h2>音色选择</h2>
        <p>选择您喜欢的语音助手音色</p>
        
        <div class="tone-grid">
          <div 
            v-for="tone in availableTones" 
            :key="tone.id"
            class="tone-item"
            :class="{ active: selectedTone === tone.id }"
            @click="selectTone(tone.id)"
          >
            <div class="tone-icon">
              <i :class="tone.icon"></i>
            </div>
            <div class="tone-info">
              <h3>{{ tone.name }}</h3>
              <p>{{ tone.description }}</p>
            </div>
            <div class="tone-preview">
              <button class="preview-btn" @click.stop="previewTone(tone.id)">
                <i class="fas fa-play"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ToneSettings',
  setup() {
    const selectedTone = ref('default')
    
    const availableTones = ref([
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
      },
      {
        id: 'casual',
        name: '轻松音色',
        description: '轻松随意的音色',
        icon: 'fas fa-coffee'
      }
    ])
    
    const selectTone = (toneId) => {
      selectedTone.value = toneId
      // 这里可以添加保存到后端的逻辑
    }
    
    const previewTone = (toneId) => {
      // 这里可以添加音色预览的逻辑
      console.log('预览音色:', toneId)
    }
    
    return {
      selectedTone,
      availableTones,
      selectTone,
      previewTone
    }
  }
}
</script>

<style scoped>
.tone-settings {
  padding: 32px;
  max-width: 1200px;
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

.settings-content {
  margin-bottom: 32px;
}

.settings-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
}

.settings-card h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.settings-card p {
  color: #666;
  margin: 0 0 24px 0;
}

.tone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
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
}

.tone-info {
  flex: 1;
}

.tone-info h3 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 4px 0;
}

.tone-info p {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.tone-preview {
  margin-left: 16px;
}

.preview-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #6ec6fa;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.preview-btn:hover {
  background: #5bb5e9;
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .tone-settings {
    padding: 20px;
  }
  
  .tone-grid {
    grid-template-columns: 1fr;
  }
  
  .tone-item {
    flex-direction: column;
    text-align: center;
  }
  
  .tone-icon {
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .tone-preview {
    margin-left: 0;
    margin-top: 12px;
  }
}
</style> 