<template>
  <div class="settings">
    <div class="settings-content">
      <!-- 账户设置 -->
      <div class="settings-card">
        <h2>账户设置</h2>
        <div class="settings-section">
          <div class="setting-item">
            <div class="setting-info">
              <h3>个人信息</h3>
              <p>更新您的个人信息和联系方式</p>
            </div>
            <button class="setting-btn" @click="editProfile">
              <i class="fas fa-edit"></i>
              编辑
            </button>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3>密码</h3>
              <p>更改您的登录密码</p>
            </div>
            <button class="setting-btn" @click="changePassword">
              <i class="fas fa-key"></i>
              更改
            </button>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3>邮箱验证</h3>
              <p>验证您的邮箱地址</p>
            </div>
            <button class="setting-btn" @click="verifyEmail">
              <i class="fas fa-envelope"></i>
              验证
            </button>
          </div>
        </div>
      </div>
      
      <!-- 应用设置 -->
      <div class="settings-card">
        <h2>应用设置</h2>
        <div class="settings-section">
          <div class="setting-item">
            <div class="setting-info">
              <h3>通知设置</h3>
              <p>管理应用通知和提醒</p>
            </div>
            <div class="toggle-switch">
              <input 
                type="checkbox" 
                id="notifications" 
                v-model="settings.notifications"
                @change="updateSettings"
              >
              <label for="notifications"></label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3>自动保存</h3>
              <p>自动保存您的设置和偏好</p>
            </div>
            <div class="toggle-switch">
              <input 
                type="checkbox" 
                id="autoSave" 
                v-model="settings.autoSave"
                @change="updateSettings"
              >
              <label for="autoSave"></label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3>主题模式</h3>
              <p>选择您喜欢的主题</p>
            </div>
            <select v-model="settings.theme" @change="updateSettings" class="theme-select">
              <option value="light">浅色主题</option>
              <option value="dark">深色主题</option>
              <option value="auto">跟随系统</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- 隐私设置 -->
      <div class="settings-card">
        <h2>隐私设置</h2>
        <div class="settings-section">
          <div class="setting-item">
            <div class="setting-info">
              <h3>数据收集</h3>
              <p>允许收集使用数据以改善服务</p>
            </div>
            <div class="toggle-switch">
              <input 
                type="checkbox" 
                id="dataCollection" 
                v-model="settings.dataCollection"
                @change="updateSettings"
              >
              <label for="dataCollection"></label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3>个性化推荐</h3>
              <p>基于您的使用习惯提供个性化推荐</p>
            </div>
            <div class="toggle-switch">
              <input 
                type="checkbox" 
                id="personalization" 
                v-model="settings.personalization"
                @change="updateSettings"
              >
              <label for="personalization"></label>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 危险区域 -->
      <div class="settings-card danger-zone">
        <h2>危险区域</h2>
        <div class="settings-section">
          <div class="setting-item">
            <div class="setting-info">
              <h3>登出账号</h3>
              <p>安全退出当前登录的账号</p>
            </div>
            <button class="danger-btn" @click="logoutAccount">
              <i class="fas fa-sign-out-alt"></i>
              登出账号
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

export default {
  name: 'Settings',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    const settings = ref({
      notifications: true,
      autoSave: true,
      theme: 'light',
      dataCollection: false,
      personalization: true
    })
    
    const editProfile = () => {
      // 这里可以添加编辑个人信息的逻辑
      console.log('编辑个人信息')
    }
    
    const changePassword = () => {
      // 这里可以添加更改密码的逻辑
      console.log('更改密码')
    }
    
    const verifyEmail = () => {
      // 这里可以添加邮箱验证的逻辑
      console.log('验证邮箱')
    }
    
    const updateSettings = () => {
      // 这里可以添加更新设置的逻辑
      console.log('更新设置:', settings.value)
    }
    
    const logoutAccount = async () => {
      if (confirm('确定要登出当前账号吗？')) {
        try {
          await userStore.userLogout()
          router.push('/login')
        } catch (error) {
          console.error('登出失败:', error)
        }
      }
    }
    
    return {
      settings,
      editProfile,
      changePassword,
      verifyEmail,
      updateSettings,
      logoutAccount
    }
  }
}
</script>

<style scoped>
.settings {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
}



.settings-content {
  display: grid;
  gap: 32px;
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
  margin: 0 0 24px 0;
  font-family: '优设标题黑', sans-serif;
}

.settings-section {
  display: grid;
  gap: 20px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid #e9ecef;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-info h3 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 4px 0;
  font-family: '优设标题黑', sans-serif;
}

.setting-info p {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.setting-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #6ec6fa;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.setting-btn:hover {
  background: #5bb5e9;
  transform: translateY(-1px);
}

/* 开关样式 */
.toggle-switch {
  position: relative;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.toggle-switch label:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

.toggle-switch input:checked + label {
  background-color: #6ec6fa;
}

.toggle-switch input:checked + label:before {
  transform: translateX(26px);
}

/* 主题选择 */
.theme-select {
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: #fff;
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;
}

.theme-select:focus {
  outline: none;
  border-color: #6ec6fa;
}

/* 危险区域 */
.danger-zone {
  border: 2px solid #dc3545;
}

.danger-zone h2 {
  color: #dc3545;
}

.danger-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.danger-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .settings {
    padding: 20px;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .setting-btn,
  .danger-btn {
    align-self: flex-end;
  }
}
</style> 