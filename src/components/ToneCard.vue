<template>
  <div class="tone-card" :class="cardClass">
    <div class="tone-info">
      <div class="tone-icon">
        <i class="fas fa-user"></i>
      </div>
      <div class="tone-details">
        <h3 class="tone-name">{{ tone.name }}</h3>
        <p class="tone-description">{{ tone.description }}</p>
        <span class="tone-type">{{ tone.type }}</span>
      </div>
    </div>
    <div class="tone-actions">
      <AudioPlayer 
        :voice-id="tone.id" 
        :audio-src="tone.type === '系统预设' ? '/EXP.wav' : ''"
        :audio-enabled="tone.type === '系统预设'"
        @play="handlePlay" 
        @stop="handleStop"
      />
      <button 
        @click="handleSelect" 
        class="select-btn"
        :class="{ 'selected': isSelected }"
      >
        {{ isSelected ? '已选择' : '选择' }}
      </button>
      <button 
        v-if="tone.type === '自定义'" 
        @click="handleEdit" 
        class="edit-btn"
      >
        <i class="fas fa-edit"></i>
      </button>
      <button 
        v-if="tone.type === '自定义'" 
        @click="handleDelete" 
        class="delete-btn"
      >
        <i class="fas fa-trash"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import AudioPlayer from './AudioPlayer.vue'

export default {
  name: 'ToneCard',
  components: {
    AudioPlayer
  },
  props: {
    tone: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select', 'edit', 'delete', 'play', 'stop'],
  setup(props, { emit }) {
    const cardClass = computed(() => {
      return {
        'default-tone': props.tone.type === '系统预设',
        'custom-tone': props.tone.type === '自定义'
      }
    })

    const handleSelect = () => {
      emit('select', props.tone.id)
    }

    const handleEdit = () => {
      emit('edit', props.tone)
    }

    const handleDelete = () => {
      emit('delete', props.tone.id)
    }

    const handlePlay = (voiceId) => {
      emit('play', voiceId)
    }

    const handleStop = (voiceId) => {
      emit('stop', voiceId)
    }

    return {
      cardClass,
      handleSelect,
      handleEdit,
      handleDelete,
      handlePlay,
      handleStop
    }
  }
}
</script>

<style scoped>
.tone-card {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.tone-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.tone-card.default-tone {
  border-color: #4CAF50;
  background: #e8f5e9;
}

.tone-card.default-tone:hover {
  border-color: #388E3C;
  background: #dcedc8;
}

.tone-card.custom-tone {
  background: white;
}

.tone-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tone-icon {
  width: 40px;
  height: 40px;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.tone-details {
  flex: 1;
}

.tone-name {
  font-family: '优设标题黑', Arial, sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.25rem 0;
}

.tone-description {
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0 0 0.25rem 0;
}

.tone-type {
  font-size: 0.75rem;
  color: #adb5bd;
  margin: 0;
}

.tone-actions {
  display: flex;
  gap: 0.75rem;
}

.select-btn, .edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 40px;
  height: 40px;
}

.select-btn {
  background: #667eea;
  color: white;
}

.select-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.select-btn.selected {
  background: #28a745;
  cursor: default;
}

.select-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.edit-btn {
  background: #ffc107;
  color: #212529;
}

.edit-btn:hover:not(:disabled) {
  background: #e0a800;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover:not(:disabled) {
  background: #c82333;
}

.select-btn svg, .edit-btn svg, .delete-btn svg {
  width: 16px;
  height: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tone-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
  }

  .tone-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .tone-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .tone-actions {
    flex-direction: row;
    justify-content: flex-start;
    gap: 0.75rem;
  }
}
</style>
