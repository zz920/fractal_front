<template>
  <div class="landing-page">
    <div class="header">
      <div class="logo-title">
        <svg class="logo-big" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#b6a6f7"/>
              <stop offset="50%" stop-color="#6ec6fa"/>
              <stop offset="100%" stop-color="#8be6b6"/>
            </linearGradient>
          </defs>
          <path d="M 180 100 A 80 80 0 1 1 20 100" fill="none" stroke="url(#circleGradient)" stroke-width="16" stroke-linecap="round"/>
          <rect x="92" y="18" width="16" height="18" rx="3" fill="#fff"/>
          <text x="100" y="120" text-anchor="middle" font-family="Orbitron, Arial, sans-serif" font-size="32" font-weight="bold" fill="#111" font-style="italic" letter-spacing="4">FRACTAL</text>
        </svg>
        <span class="main-title">Fractal</span>
      </div>
      <span class="lang" @click="toggleLanguage">{{ currentLang === 'zh' ? 'English' : '中文' }}</span>
    </div>
    
    <div class="subtitle">{{ translations[currentLang].subtitle }}</div>
    
    <div class="main-content">
      <div class="left-panel">
        <div class="enter-btns">
          <div class="diagonal-btn web-diagonal" @click="goToLogin">
            <i class="fa-brands fa-windows"></i>
            <span class="web-text">{{ translations[currentLang].webText }}</span>
          </div>
          <div class="diagonal-btn app-diagonal">
            <i class="fa-solid fa-mobile"></i>
            <span class="app-text">{{ translations[currentLang].appText }}</span>
          </div>
        </div>
      </div>
      
      <div class="right-panel">
        <div class="feature-list">
          <div class="feature-item" @click="navigateToFeature('voice-simulator')">
            <span class="feature-icon"><i class="fa-solid fa-comments"></i></span>
            <div class="feature-title">{{ translations[currentLang].featureTitles[0] }}</div>
            <div class="feature-desc">{{ translations[currentLang].featureDescs[0] }}</div>
          </div>
          <div class="feature-item" @click="navigateToFeature('voice-settings')">
            <span class="feature-icon"><i class="fa-solid fa-music"></i></span>
            <div class="feature-title">{{ translations[currentLang].featureTitles[1] }}</div>
            <div class="feature-desc">{{ translations[currentLang].featureDescs[1] }}</div>
          </div>
          <div class="feature-item" @click="navigateToFeature('device-management')">
            <span class="feature-icon"><i class="fa-solid fa-briefcase"></i></span>
            <div class="feature-title">{{ translations[currentLang].featureTitles[2] }}</div>
            <div class="feature-desc">{{ translations[currentLang].featureDescs[2] }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

export default {
  name: 'Landing',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const currentLang = ref('zh')
    
    // 检查用户是否已登录
    const isLoggedIn = computed(() => {
      return userStore.userInfo && userStore.userInfo.username
    })
    
    const translations = {
      zh: {
        subtitle: '一款人性化的智能语音助手',
        webText: '进入网页版',
        appText: '获取APP',
        featureTitles: ['智能化语音助手', '自定义音色配置', 'MCP工具应用'],
        featureDescs: ['实时对话', '自定义声线', '便捷办公']
      },
      en: {
        subtitle: 'A Humanized Intelligent Voice Assistant',
        webText: 'Web Version',
        appText: 'Get APP',
        featureTitles: ['Intelligent Voice Assistant', 'Custom Tone Configuration', 'MCP Tool Application'],
        featureDescs: ['Real-time Dialogue', 'Custom Voice Line', 'Convenient Office']
      }
    }
    
    const toggleLanguage = () => {
      currentLang.value = currentLang.value === 'zh' ? 'en' : 'zh'
    }
    
    const goToLogin = () => {
      router.push('/login')
    }
    
    const navigateToFeature = (route) => {
      if (!isLoggedIn.value) {
        alert('请先登录后再使用此功能')
        router.push('/login')
        return
      }
      
      // 根据功能类型跳转到相应页面
      switch (route) {
        case 'voice-simulator':
          router.push('/voice-simulator')
          break
        case 'voice-settings':
          router.push('/voice-settings')
          break
        case 'device-management':
          router.push('/device-management')
          break
        default:
          router.push('/home')
      }
    }
    
    return {
      currentLang,
      translations,
      isLoggedIn,
      toggleLanguage,
      goToLogin,
      navigateToFeature
    }
  }
}
</script>

<style scoped>
.landing-page {
  margin: 0;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  min-height: 100vh;
  background: linear-gradient(to bottom, #fff 0%, #fff 18%, #e3c6f7 30%, #a2b6e9 70%, #fff 82%, #fff 100%);
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 36px 60px 0 60px;
}

.logo-title {
  display: flex;
  align-items: center;
}

.logo-big {
  width: 100px;
  height: 100px;
  margin-right: 18px;
}

.main-title {
  font-family: 'Orbitron', Arial, sans-serif;
  font-size: 3.2rem;
  color: #2d1ed6;
  font-weight: bold;
  font-style: italic;
  letter-spacing: 4px;
  margin-bottom: 0;
}

.lang {
  font-family: 'Orbitron', Arial, sans-serif;
  font-size: 1.3rem;
  color: #222;
  font-style: italic;
  margin-top: 10px;
  cursor: pointer;
  transition: color 0.2s;
  padding: 4px 8px;
  border-radius: 4px;
}

.lang:hover {
  color: #4bb6e6;
  background: rgba(75, 182, 230, 0.1);
}

.subtitle {
  text-align: center;
  font-size: 1.35rem;
  margin-top: 18px;
  color: #222;
  letter-spacing: 2px;
  font-weight: bold;
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 60px;
  min-height: 420px;
}

.left-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 60px;
  flex: 0 0 420px;
  min-height: 600px;
}

.enter-btns {
  display: flex;
  flex-direction: row;
  margin-top: 120px;
  box-shadow: 0 4px 24px #b6b6e6;
}

.diagonal-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 140px;
  width: 240px;
  font-size: 2rem;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  font-weight: bold;
  border-radius: 6px;
  margin: 0;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  transform: translateY(0);
}

.diagonal-btn:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.web-diagonal {
  background: #393a5a;
  color: #fff;
  border-radius: 6px;
  box-shadow: 2px 0 8px #b6b6e6;
  z-index: 2;
}

.web-diagonal:hover {
  background: #4a4b6a;
  box-shadow: 0 8px 32px rgba(57, 58, 90, 0.3);
}

.app-diagonal {
  background: #e6e8f7;
  color: #4bb6e6;
  border-radius: 6px;
  margin-left: 8px;
  z-index: 1;
}

.app-diagonal:hover {
  background: #f0f2ff;
  color: #3aa5d6;
  box-shadow: 0 8px 32px rgba(75, 182, 230, 0.3);
}

.web-diagonal i {
  font-size: 2.8rem;
  margin-bottom: 12px;
  transition: transform 0.3s ease;
}

.web-diagonal:hover i {
  transform: scale(1.1);
}

.app-diagonal i {
  font-size: 2.2rem;
  margin-bottom: 12px;
  transition: transform 0.3s ease;
}

.app-diagonal:hover i {
  transform: scale(1.1);
}

.web-text {
  font-size: 1.6rem;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  font-weight: bold;
  letter-spacing: 2px;
  transition: transform 0.3s ease;
}

.web-diagonal:hover .web-text {
  transform: translateY(-2px);
}

.app-text {
  font-size: 1.6rem;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  font-weight: bold;
  color: #4bb6e6;
  letter-spacing: 2px;
  transition: transform 0.3s ease;
}

.app-diagonal:hover .app-text {
  transform: translateY(-2px);
}

.right-panel {
  background: rgba(255,255,255,0.72);
  border-radius: 22px;
  box-shadow: 0 8px 32px 0 rgba(120,120,180,0.18), 0 1.5px 16px 0 #b6b6e6;
  border: 2.5px solid #e3d6f7;
  width: 570px;
  padding: 54px 38px 38px 38px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(8px);
}

.feature-list {
  position: relative;
  z-index: 2;
}

.feature-item {
  background: #6ec6fa;
  border-radius: 14px;
  margin-bottom: 38px;
  padding: 28px 38px 22px 90px;
  position: relative;
  box-shadow: 0 2px 18px #b6b6e6;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(110, 198, 250, 0.3);
}

.feature-item:last-child {
  margin-bottom: 0;
}

.feature-icon {
  position: absolute;
  left: 38px;
  top: 32px;
  font-size: 2.3rem;
}

.feature-title {
  font-family: 'Orbitron', Arial, sans-serif;
  font-size: 1.35rem;
  font-weight: bold;
  color: #222;
}

.feature-desc {
  font-size: 1.05rem;
  color: #222;
  margin-top: 4px;
  margin-left: 2px;
}

@media (max-width: 1100px) {
  .main-content {
    flex-direction: column;
    align-items: center;
  }
  .left-panel {
    margin-right: 0;
    margin-bottom: 30px;
  }
  .right-panel {
    width: 95vw;
    min-width: 0;
  }
}
</style> 