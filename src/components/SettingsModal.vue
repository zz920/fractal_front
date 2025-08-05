<template>
  <div v-if="isVisible" class="settings-modal-overlay" @click="hideModal">
    <div class="settings-modal" @click.stop>
      <div class="settings-modal-header">
        <div class="settings-modal-title">设置</div>
        <button class="settings-modal-close" @click="hideModal">&times;</button>
      </div>
      
      <div class="settings-modal-content">
        <!-- 账户设置 -->
        <div class="settings-section">
          <div class="section-title">
            <i class="fa-solid fa-user"></i>
            账户设置
          </div>
          <div class="setting-item">
            <div>
              <div class="setting-label">用户名</div>
              <div class="setting-description">当前登录的用户名</div>
            </div>
            <div class="setting-control">
              <span>{{ userStore.userInfo.username }}</span>
            </div>
          </div>
          <div class="setting-item">
            <div>
              <div class="setting-label">邮箱</div>
              <div class="setting-description">当前绑定的邮箱地址</div>
            </div>
            <div class="setting-control">
              <span>{{ userStore.userInfo.email }}</span>
              <button class="button-control" @click="showRebindModal">换绑</button>
            </div>
          </div>
          <div class="setting-item">
            <div>
              <div class="setting-label">修改密码</div>
              <div class="setting-description">更新您的账户密码</div>
            </div>
            <div class="setting-control">
              <button class="button-control" @click="changePassword">修改</button>
            </div>
          </div>
          <div class="setting-item">
            <div>
              <div class="setting-label">账户登出</div>
              <div class="setting-description">退出当前登录的账户</div>
            </div>
            <div class="setting-control">
              <button class="button-control" @click="logout">登出</button>
            </div>
          </div>
          <div class="setting-item">
            <div>
              <div class="setting-label">账户注销</div>
              <div class="setting-description">永久删除您的账户</div>
            </div>
            <div class="setting-control">
              <button class="button-control danger" @click="deleteAccount">注销</button>
            </div>
          </div>
        </div>
        
        <!-- 应用设置 -->
        <div class="settings-section">
          <div class="section-title">
            <i class="fa-solid fa-cog"></i>
            应用设置
          </div>
          <div class="setting-item">
            <div>
              <div class="setting-label">语言</div>
              <div class="setting-description">选择应用显示语言</div>
            </div>
            <div class="setting-control">
              <select class="select-control" v-model="userStore.settings.language" @change="changeLanguage">
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          <div class="setting-item">
            <div>
              <div class="setting-label">主题</div>
              <div class="setting-description">选择应用主题</div>
            </div>
            <div class="setting-control">
              <select class="select-control" v-model="userStore.settings.theme" @change="changeTheme">
                <option value="light">浅色</option>
                <option value="dark">深色</option>
              </select>
            </div>
          </div>
          <div class="setting-item">
            <div>
              <div class="setting-label">通知</div>
              <div class="setting-description">接收应用通知</div>
            </div>
            <div class="setting-control">
              <button 
                class="toggle-btn" 
                :class="{ active: userStore.settings.notifications }"
                @click="toggleSetting('notifications')"
              >
                <span class="toggle-slider"></span>
              </button>
            </div>
          </div>
          <div class="setting-item">
            <div>
              <div class="setting-label">声音</div>
              <div class="setting-description">播放应用音效</div>
            </div>
            <div class="setting-control">
              <button 
                class="toggle-btn" 
                :class="{ active: userStore.settings.sound }"
                @click="toggleSetting('sound')"
              >
                <span class="toggle-slider"></span>
              </button>
            </div>
          </div>
          <div class="setting-item">
            <div>
              <div class="setting-label">自动保存</div>
              <div class="setting-description">自动保存设置和数据</div>
            </div>
            <div class="setting-control">
              <button 
                class="toggle-btn" 
                :class="{ active: userStore.settings.autoSave }"
                @click="toggleSetting('autoSave')"
              >
                <span class="toggle-slider"></span>
              </button>
            </div>
          </div>
          <div class="setting-item">
            <div>
              <div class="setting-label">深色模式</div>
              <div class="setting-description">使用深色主题</div>
            </div>
            <div class="setting-control">
              <button 
                class="toggle-btn" 
                :class="{ active: userStore.settings.darkMode }"
                @click="toggleSetting('darkMode')"
              >
                <span class="toggle-slider"></span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 数据管理 -->
        <div class="settings-section">
          <div class="section-title">
            <i class="fa-solid fa-database"></i>
            数据管理
          </div>
          <div class="setting-item">
            <div>
              <div class="setting-label">清除缓存</div>
              <div class="setting-description">清除应用缓存数据</div>
            </div>
            <div class="setting-control">
              <button class="button-control" @click="clearData">清除</button>
            </div>
          </div>
          <div class="setting-item">
            <div>
              <div class="setting-label">检查更新</div>
              <div class="setting-description">检查应用更新</div>
            </div>
            <div class="setting-control">
              <button class="button-control" @click="checkUpdate">检查</button>
            </div>
          </div>
        </div>
        
        <!-- 关于 -->
        <div class="settings-section">
          <div class="section-title">
            <i class="fa-solid fa-info-circle"></i>
            关于
          </div>
          <div class="setting-item">
            <div>
              <div class="setting-label">版本</div>
              <div class="setting-description">当前应用版本</div>
            </div>
            <div class="setting-control">
              <span>v1.0.0</span>
            </div>
          </div>
          <div class="setting-item">
            <div>
              <div class="setting-label">使用条款</div>
              <div class="setting-description">查看应用使用条款</div>
            </div>
            <div class="setting-control">
              <button class="button-control" @click="viewTerms">查看</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'

export default {
  name: 'SettingsModal',
  setup() {
    const userStore = useUserStore()
    const isVisible = ref(false)

    const showModal = () => {
      isVisible.value = true
    }

    const hideModal = () => {
      isVisible.value = false
    }

    const toggleSetting = (setting) => {
      userStore.updateSettings({ [setting]: !userStore.settings[setting] })
    }

    const changeLanguage = (language) => {
      userStore.updateSettings({ language })
    }

    const changeTheme = (theme) => {
      userStore.updateSettings({ theme })
    }

    const showRebindModal = () => {
      alert('换绑功能开发中...')
    }

    const changePassword = () => {
      alert('修改密码功能开发中...')
    }

    const logout = () => {
      if (confirm('确定要登出账户吗？')) {
        userStore.logout()
        hideModal()
        // 跳转到登录页面
        window.location.href = '/login'
      }
    }

    const deleteAccount = () => {
      if (confirm('确定要注销账户吗？此操作不可撤销！')) {
        userStore.logout()
        hideModal()
        alert('账户已注销')
      }
    }

    const clearData = () => {
      if (confirm('确定要清除缓存吗？')) {
        alert('缓存已清除')
      }
    }

    const checkUpdate = () => {
      alert('检查更新功能开发中...')
    }

    const viewTerms = () => {
      alert('使用条款页面开发中...')
    }

    onMounted(() => {
      window.addEventListener('showSettingsModal', showModal)
    })

    onUnmounted(() => {
      window.removeEventListener('showSettingsModal', showModal)
    })

    return {
      isVisible,
      userStore,
      showModal,
      hideModal,
      toggleSetting,
      changeLanguage,
      changeTheme,
      showRebindModal,
      changePassword,
      logout,
      deleteAccount,
      clearData,
      checkUpdate,
      viewTerms
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
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.settings-modal {
  background: #fff;
  border-radius: 14px;
  border: 2px solid #d6c6c6;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10000;
}

.settings-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 2px solid #e3d6f7;
  background: linear-gradient(135deg, #f8f9ff 0%, #e3d6f7 100%);
  border-radius: 14px 14px 0 0;
}

.settings-modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d1ed6;
  font-family: 'Orbitron', Arial, sans-serif;
}

.settings-modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.settings-modal-close:hover {
  background: #e3d6f7;
  color: #2d1ed6;
}

.settings-modal-content {
  padding: 32px;
}

.settings-section {
  margin-bottom: 32px;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #2d1ed6;
  margin-bottom: 20px;
  font-family: 'Orbitron', Arial, sans-serif;
}

.section-title i {
  margin-right: 12px;
  color: #6ec6fa;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e3d6f7;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.setting-description {
  font-size: 0.9rem;
  color: #666;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.button-control {
  padding: 8px 16px;
  border: 2px solid #6ec6fa;
  background: #fff;
  color: #6ec6fa;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.button-control:hover {
  background: #6ec6fa;
  color: #fff;
}

.button-control.danger {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.button-control.danger:hover {
  background: #ff6b6b;
  color: #fff;
}

.select-control {
  padding: 8px 12px;
  border: 2px solid #6ec6fa;
  border-radius: 6px;
  background: #fff;
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;
}

.toggle-btn {
  width: 48px;
  height: 24px;
  background: #ccc;
  border: none;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-btn.active {
  background: #6ec6fa;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: all 0.3s;
}

.toggle-btn.active .toggle-slider {
  left: 26px;
}

@media (max-width: 768px) {
  .settings-modal {
    width: 95%;
    max-height: 95vh;
  }
  
  .settings-modal-content {
    padding: 20px;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .setting-control {
    width: 100%;
    justify-content: flex-end;
  }
}
</style> 