<template>
  <div v-if="visible" class="settings-modal-overlay" @click="closeModal">
    <div class="settings-modal" @click.stop>
      <!-- 弹窗头部 -->
      <div class="modal-header">
        <div class="header-left">
          <button class="back-btn" @click="closeModal">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="user-info">
            <div class="user-avatar">
              <div class="avatar-circle">
                <i class="fas fa-user"></i>
              </div>
            </div>
            <div class="user-details">
              <span class="username">{{ userInfo.username }}</span>
            </div>
          </div>
        </div>
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- 弹窗内容 -->
      <div class="modal-content">
        <h2 class="modal-title">当前登录账号</h2>
        
        <!-- 邮箱信息 -->
        <div class="info-section">
          <div class="info-item">
            <span class="info-label">当前绑定邮箱:</span>
            <span class="info-value">{{ userInfo.email }}</span>
            <button class="change-btn" @click="showEmailModal = true">
              换绑邮箱
            </button>
          </div>
        </div>

        <!-- 昵称信息 -->
        <div class="info-section">
          <div class="info-item">
            <span class="info-label">昵称:</span>
            <span class="info-value">{{ userInfo.nickname }}</span>
            <button class="change-btn" @click="showNicknameModal = true">
              修改昵称
            </button>
          </div>
        </div>

        <!-- 登出按钮 -->
        <div class="logout-section">
          <button class="logout-btn" @click="handleLogout">
            <i class="fas fa-sign-out-alt"></i>
            <span>登出账号</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 换绑邮箱弹窗 -->
    <div v-if="showEmailModal" class="sub-modal-overlay" @click="showEmailModal = false">
      <div class="sub-modal" @click.stop>
        <div class="sub-modal-header">
          <h3>换绑邮箱</h3>
          <button class="close-btn" @click="showEmailModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="sub-modal-content">
          <div class="form-group">
            <label>新邮箱地址:</label>
            <input 
              v-model="newEmail" 
              type="email" 
              placeholder="请输入新的邮箱地址"
              class="form-input"
            />
          </div>
          <div class="form-actions">
            <button class="cancel-btn" @click="showEmailModal = false">取消</button>
            <button class="confirm-btn" @click="handleChangeEmail" :disabled="!newEmail || isUpdating">
              {{ isUpdating ? '更新中...' : '确认更新' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改昵称弹窗 -->
    <div v-if="showNicknameModal" class="sub-modal-overlay" @click="showNicknameModal = false">
      <div class="sub-modal" @click.stop>
        <div class="sub-modal-header">
          <h3>修改昵称</h3>
          <button class="close-btn" @click="showNicknameModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="sub-modal-content">
          <div class="form-group">
            <label>新昵称:</label>
            <input 
              v-model="newNickname" 
              type="text" 
              placeholder="请输入新的昵称"
              class="form-input"
            />
          </div>
          <div class="form-actions">
            <button class="cancel-btn" @click="showNicknameModal = false">取消</button>
            <button class="confirm-btn" @click="handleChangeNickname" :disabled="!newNickname || isUpdating">
              {{ isUpdating ? '更新中...' : '确认更新' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

export default {
  name: 'SettingsModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const router = useRouter()
    const userStore = useUserStore()

    // 状态管理
    const showEmailModal = ref(false)
    const showNicknameModal = ref(false)
    const newEmail = ref('')
    const newNickname = ref('')
    const isUpdating = ref(false)

    // 从用户store获取用户信息
    const userInfo = computed(() => {
      const user = userStore.user
      return {
        username: user?.user_name || '用户',
        email: user?.email || '未设置邮箱',
        nickname: user?.user_name || '用户'
      }
    })

    const closeModal = () => {
      emit('close')
    }

    const handleChangeEmail = async () => {
      if (!newEmail.value) return
      
      // 邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(newEmail.value)) {
        alert('请输入有效的邮箱地址')
        return
      }
      
      isUpdating.value = true
      try {
        await userStore.updateUserInfo({
          email: newEmail.value
        })
        
        // 更新成功
        showEmailModal.value = false
        newEmail.value = ''
        alert('邮箱更新成功！')
      } catch (error) {
        console.error('邮箱更新失败:', error)
        alert(`邮箱更新失败: ${error.message}`)
      } finally {
        isUpdating.value = false
      }
    }

    const handleChangeNickname = async () => {
      if (!newNickname.value) return
      
      // 昵称长度验证
      if (newNickname.value.length < 2 || newNickname.value.length > 20) {
        alert('昵称长度应在2-20个字符之间')
        return
      }
      
      isUpdating.value = true
      try {
        await userStore.updateUserInfo({
          username: newNickname.value
        })
        
        // 更新成功
        showNicknameModal.value = false
        newNickname.value = ''
        alert('昵称更新成功！')
      } catch (error) {
        console.error('昵称更新失败:', error)
        alert(`昵称更新失败: ${error.message}`)
      } finally {
        isUpdating.value = false
      }
    }

    const handleLogout = async () => {
      if (confirm('确定要登出账号吗？')) {
        try {
          // 调用用户store的登出方法
          await userStore.userLogout()
          
          // 关闭设置弹窗
          closeModal()
          
          // 跳转到登录页面
          router.push('/login')
        } catch (error) {
          console.error('登出失败:', error)
          // 即使登出失败，也清除本地数据并跳转
          userStore.clearAuthData()
          closeModal()
          router.push('/login')
        }
      }
    }

    return {
      userInfo,
      showEmailModal,
      showNicknameModal,
      newEmail,
      newNickname,
      isUpdating,
      closeModal,
      handleChangeEmail,
      handleChangeNickname,
      handleLogout
    }
  }
}
</script>

<style scoped>
.settings-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.settings-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #e9ecef;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  display: flex;
  align-items: center;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6ec6fa 0%, #b6a6f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.2rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #333;
}

.modal-content {
  padding: 24px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 24px 0;
  text-align: center;
}

.info-section {
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.9rem;
  color: #666;
  flex: 1;
}

.info-value {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  margin: 0 16px;
}

.change-btn {
  background: #6ec6fa;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.change-btn:hover {
  background: #5bb5e9;
}

.logout-section {
  border-top: 1px solid #e9ecef;
  padding-top: 24px;
  display: flex;
  justify-content: center;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: #fff;
  border: 1px solid #dc3545;
  border-radius: 6px;
  color: #dc3545;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 200px;
  width: auto;
}

.logout-btn:hover {
  background: #dc3545;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.logout-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(220, 53, 69, 0.3);
}

.logout-btn i {
  font-size: 0.9rem;
}

/* 子弹窗样式 */
.sub-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.sub-modal {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  overflow: hidden;
  animation: subModalSlideIn 0.3s ease-out;
}

@keyframes subModalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.sub-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.sub-modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.sub-modal-content {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #6ec6fa;
  box-shadow: 0 0 0 3px rgba(110, 198, 250, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.cancel-btn {
  padding: 10px 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #e9ecef;
  color: #333;
}

.confirm-btn {
  padding: 10px 20px;
  background: #6ec6fa;
  border: 1px solid #6ec6fa;
  border-radius: 6px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn:hover:not(:disabled) {
  background: #5bb5e9;
  border-color: #5bb5e9;
}

.confirm-btn:disabled {
  background: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .settings-modal {
    width: 95%;
    margin: 20px;
  }

  .modal-header {
    padding: 16px;
  }

  .modal-content {
    padding: 16px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .info-value {
    margin: 0;
  }

  .change-btn {
    align-self: flex-end;
  }

  .sub-modal {
    width: 95%;
    margin: 20px;
  }

  .sub-modal-header {
    padding: 16px 20px;
  }

  .sub-modal-content {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .confirm-btn {
    width: 100%;
  }
}
</style>
