<template>
  <button 
    @click="toggleAudio" 
    class="play-btn"
    :class="{ 'playing': isPlaying }"
    :title="isPlaying ? '暂停' : '播放'"
    :disabled="!audioEnabled"
  >
    <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
  </button>
</template>

<script>
import { ref, onUnmounted } from 'vue'

export default {
  name: 'AudioPlayer',
  props: {
    voiceId: {
      type: [String, Number],
      required: true
    },
    audioSrc: {
      type: String,
      default: '/EXP.wav'
    },
    audioEnabled: {
      type: Boolean,
      default: true
    }
  },
  emits: ['play', 'stop'],
  setup(props, { emit }) {
    const audioRef = ref(null)
    const isPlaying = ref(false)

    const playAudio = () => {
      if (!props.audioEnabled) return
      // 如果当前正在播放，先停止
      if (isPlaying.value) {
        stopAudio()
        return
      }
      
      // 创建新的音频实例
      audioRef.value = new Audio(props.audioSrc)
      
      audioRef.value.addEventListener('ended', () => {
        isPlaying.value = false
        emit('stop', props.voiceId)
      })
      
      audioRef.value.addEventListener('error', (error) => {
        console.error('音频播放错误:', error)
        isPlaying.value = false
        emit('stop', props.voiceId)
      })
      
      // 开始播放
      audioRef.value.play().then(() => {
        isPlaying.value = true
        emit('play', props.voiceId)
      }).catch((error) => {
        console.error('音频播放失败:', error)
        isPlaying.value = false
        emit('stop', props.voiceId)
      })
    }
    
    const stopAudio = () => {
      if (audioRef.value) {
        audioRef.value.pause()
        audioRef.value.currentTime = 0
        audioRef.value = null
      }
      isPlaying.value = false
      emit('stop', props.voiceId)
    }
    
    const toggleAudio = () => {
      if (!props.audioEnabled) return
      if (isPlaying.value) {
        stopAudio()
      } else {
        playAudio()
      }
    }

    // 组件卸载时清理音频
    onUnmounted(() => {
      if (audioRef.value) {
        stopAudio()
      }
    })

    return {
      isPlaying,
      toggleAudio
    }
  }
}
</script>

<style scoped>
.play-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
  min-width: 40px;
  height: 40px;
}

.play-btn:hover:not(:disabled) {
  background: #e9ecef;
  color: #495057;
}

.play-btn.playing {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.play-btn.playing:hover {
  background: #218838;
  border-color: #1e7e34;
}

.play-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-btn i {
  font-size: 0.875rem;
}
</style>
