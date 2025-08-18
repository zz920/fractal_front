<template>
  <div class="right-panel">
    <div class="panel-content">
      <StatusDisplay 
        :connection-status="connectionStatus"
        :microphone-status="microphoneStatus"
        :microphone-enabled="microphoneEnabled"
        :server-status="serverStatus"
        @fetch-config="$emit('fetch-config')"
        @toggle-microphone="$emit('toggle-microphone')"
      />
    </div>
  </div>
</template>

<script>
import StatusDisplay from './StatusDisplay.vue'

export default {
  name: 'RightPanel',
  components: {
    StatusDisplay
  },
  props: {
    connectionStatus: {
      type: String,
      default: 'unconfigured'
    },
    microphoneStatus: {
      type: String,
      default: 'inactive'
    },
    microphoneEnabled: {
      type: Boolean,
      default: false
    },
    serverStatus: {
      type: String,
      default: 'unknown'
    }
  },
  emits: ['toggle-microphone', 'fetch-config']
}
</script>

<style scoped>
.right-panel {
  width: 320px;
  height: 100%;
  background: #f8f9fa;
  border-left: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
}

.panel-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .right-panel {
    width: 100%;
    height: auto;
    border-left: none;
    border-top: 1px solid #e9ecef;
  }
  
  .panel-content {
    padding: 1rem;
    gap: 1rem;
  }
}
</style> 