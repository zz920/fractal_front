<template>
  <div class="home-content">
    <div class="main-title main-title-centered">首页</div>
    <div class="main-subtitle main-title-centered">欢迎回到<span style="font-family:'Orbitron',Arial,sans-serif;color:#888;">Fractal</span>助手</div>
    <div class="main-title-bar main-title-bar-centered"></div>
    
    <div class="main-content-row main-content-row-centered">
      <div class="welcome-card welcome-card-centered">
        <div class="welcome-avatar welcome-avatar-centered">
          <div class="avatar-circle">
            <span class="avatar-initial">{{ userStore.userInfo.avatar }}</span>
          </div>
          <div class="welcome-user-info">
            <div class="welcome-user-name">{{ userStore.userInfo.username }}</div>
            <div class="welcome-user-email">{{ userStore.userInfo.email }}</div>
          </div>
        </div>
        
        <div class="welcome-main welcome-main-centered">
          <div class="welcome-main-title">欢迎回来，{{ userStore.userInfo.username }}!</div>
          <div class="welcome-main-desc">您可以开始使用Fractal语音助手进行智能对话</div>
          
          <div class="welcome-btns welcome-btns-centered">
            <button class="welcome-btn primary btn-large" @click="navigateToVoiceSimulator">
              <i class="fa-regular fa-comments"></i>开始语音对话
            </button>
            <button class="welcome-btn btn-large" @click="navigateToDeviceManagement">
              <i class="fa-solid fa-tablet-screen-button"></i>管理我的设备
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="ad-card ad-card-centered">广告位暂缺</div>
    
    <div class="main-content-row main-content-row-centered">
      <div class="placeholder-card"></div>
      <div class="placeholder-card"></div>
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
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.main-title-centered {
  text-align: left;
  margin-left: 2rem;
}

.main-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.main-title-bar {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #a2b6e9, #e3c6f7);
  margin: 0 0 3rem 2rem;
  border-radius: 2px;
}

.main-content-row {
  margin-bottom: 2rem;
}

.main-content-row-centered {
  display: flex;
  justify-content: center;
}

.welcome-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
}

.welcome-card-centered {
  margin: 0 auto;
}

.welcome-avatar {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.welcome-avatar-centered {
  justify-content: center;
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

.welcome-main {
  text-align: center;
}

.welcome-main-centered {
  max-width: 600px;
  margin: 0 auto;
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

.welcome-btns {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.welcome-btns-centered {
  max-width: 500px;
  margin: 0 auto;
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

.btn-large {
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
}

.ad-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.ad-card-centered {
  max-width: 600px;
  margin: 0 auto;
}

.placeholder-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  flex: 1;
  margin: 0 1rem;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.1rem;
}

.placeholder-card:first-child {
  margin-left: 0;
}

.placeholder-card:last-child {
  margin-right: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .welcome-card {
    padding: 1.5rem;
  }
  
  .welcome-btns {
    flex-direction: column;
  }
  
  .welcome-btn {
    width: 100%;
    justify-content: center;
  }
  
  .placeholder-card {
    margin: 0.5rem 0;
  }
}
</style> 