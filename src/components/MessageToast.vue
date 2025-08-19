<template>
  <div v-if="visible" class="message" :class="type">
    <div class="message-content">
      <span class="message-text">{{ text }}</span>
      <button @click="handleClose" class="message-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageToast',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const handleClose = () => {
      emit('close')
    }

    return {
      handleClose
    }
  }
}
</script>

<style scoped>
.message {
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 400px;
  z-index: 1001;
  animation: slideIn 0.3s ease-out;
}

.message-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 0.9rem;
  font-weight: 500;
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

.message.warning .message-content {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
}

.message.info .message-content {
  background: #e2e3e5;
  border: 1px solid #d6d8db;
  color: #383d41;
}

.message-text {
  flex: 1;
  margin-right: 1rem;
}

.message-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  opacity: 0.7;
}

.message-close:hover {
  background: rgba(0, 0, 0, 0.1);
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .message {
    left: 20px;
    right: 20px;
    max-width: none;
  }
  
  .message-content {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
}
</style>
