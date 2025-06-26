<template>
  <div class="microphone-control">
    <div class="control-card">
      <h3>麦克风控制</h3>
      
      <div class="control-button">
        <button 
          @click="$emit('toggle')"
          :class="{ active: isEnabled }"
          class="mic-button"
        >
          <div class="mic-icon">
            <svg v-if="!isEnabled" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </div>
          <span class="button-text">
            {{ isEnabled ? '关闭麦克风' : '开启麦克风' }}
          </span>
        </button>
      </div>
      
      <div class="status-indicator">
        <div class="status-dot" :class="isEnabled ? 'active' : 'inactive'"></div>
        <span class="status-text">
          {{ isEnabled ? '麦克风已开启' : '麦克风已关闭' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MicrophoneControl',
  props: {
    isEnabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle']
}
</script>

<style scoped>
.microphone-control {
  width: 100%;
  max-width: 400px;
}

.control-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;
}

.control-card h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-weight: 500;
}

.control-button {
  margin-bottom: 1.5rem;
}

.mic-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  background: #f8f9fa;
  color: #6c757d;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mic-button:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.mic-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.mic-icon {
  width: 24px;
  height: 24px;
}

.mic-icon svg {
  width: 100%;
  height: 100%;
}

.button-text {
  font-size: 1rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.status-dot.active {
  background-color: #28a745;
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.5);
}

.status-dot.inactive {
  background-color: #dc3545;
}

.status-text {
  font-size: 0.9rem;
  color: #6c757d;
}
</style> 