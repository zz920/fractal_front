<template>
  <div class="home-content">
    <div class="main-title">首页</div>
    <div class="main-subtitle">欢迎回到<span style="font-family:'Orbitron',Arial,sans-serif;color:#888;">Fractal</span>助手</div>
    <div class="main-title-bar"></div>
    
    <div class="welcome-section">
      <div class="welcome-card">
        <div class="welcome-header">
          <div class="avatar-circle">
            <span class="avatar-initial">{{ userStore.userInfo.avatar }}</span>
          </div>
          <div class="welcome-user-info">
            <div class="welcome-user-name">{{ userStore.userInfo.username }}</div>
            <div class="welcome-user-email">{{ userStore.userInfo.email }}</div>
          </div>
        </div>
        
        <div class="welcome-content">
          <div class="welcome-main-title">欢迎回来，{{ userStore.userInfo.username }}!</div>
          <div class="welcome-main-desc">您可以开始使用Fractal语音助手进行智能对话</div>
          
          <div class="welcome-buttons">
            <button class="welcome-btn primary" @click="navigateToVoiceSimulator">
              <i class="fa-regular fa-comments"></i>开始语音对话
            </button>
            <button class="welcome-btn" @click="navigateToDeviceManagement">
              <i class="fa-solid fa-tablet-screen-button"></i>管理我的设备
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    onMounted(() => {
      // 初始化用户状态
      userStore.initializeFromStorage()
      
      // 检查URL参数，如果包含showSettings=true，则自动显示设置模态框
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('showSettings') === 'true') {
        console.log('Auto-showing settings modal from URL parameter')
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('showSettingsModal'))
        }, 100)
      }
    })

    const navigateToVoiceSimulator = () => {
      router.push('/voice-simulator')
    }

    const navigateToDeviceManagement = () => {
      router.push('/device-management')
    }

    return {
      userStore,
      navigateToVoiceSimulator,
      navigateToDeviceManagement
    }
  }
}
</script>

<style scoped>
.home-content {
  width: 100%;
  background: rgb(238,235,245);
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
  margin-left: 2rem;
}

.main-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
  margin-left: 2rem;
}

.main-title-bar {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #a2b6e9, #e3c6f7);
  margin: 0 0 2rem 2rem;
  border-radius: 2px;
}

.welcome-section {
  margin-left: 2rem;
  margin-right: 2rem;
}

.welcome-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 800px;
}

.welcome-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a2b6e9, #e3c6f7);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  box-shadow: 0 4px 16px rgba(162, 182, 233, 0.3);
}

.avatar-initial {
  font-size: 2rem;
  font-weight: bold;
  color: white;
}

.welcome-user-info {
  flex: 1;
}

.welcome-user-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.welcome-user-email {
  font-size: 1rem;
  color: #666;
}

.welcome-content {
  text-align: center;
}

.welcome-main-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.welcome-main-desc {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.welcome-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.welcome-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.welcome-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.welcome-btn.primary {
  background: linear-gradient(135deg, #a2b6e9, #e3c6f7);
  color: white;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .main-title,
  .main-subtitle,
  .main-title-bar {
    margin-left: 1rem;
  }
  
  .welcome-section {
    margin-left: 1rem;
    margin-right: 1rem;
  }
  
  .welcome-card {
    padding: 1.5rem;
  }
  
  .welcome-buttons {
    flex-direction: column;
  }
  
  .welcome-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 