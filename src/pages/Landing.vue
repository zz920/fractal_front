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
          <text x="100" y="120" text-anchor="middle" font-family="优设标题黑, Arial, sans-serif" font-size="32" font-weight="bold" fill="#111" font-style="italic" letter-spacing="4">FRACTAL</text>
        </svg>
        <span class="main-title">Fractal</span>
      </div>
      <span class="lang" @click="toggleLanguage">{{ currentLang === 'zh' ? 'English' : '中文' }}</span>
    </div>
    
    <div class="subtitle">{{ translations[currentLang].subtitle }}</div>
    
    <div class="main-content">
      <div class="left-panel">
        <div class="enter-btns enter-btns-diagonal">
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
        <div class="feature-overlay"></div>
        <div class="feature-list">
          <div class="feature-item" v-for="(feature, index) in translations[currentLang].features" :key="index">
            <!-- 主卡片面板 -->
            <div class="feature-card-main">
              <span class="feature-icon">
                <i :class="feature.icon"></i>
              </span>
              <div class="feature-content">
                <div class="feature-title">{{ feature.title }}</div>
                <div class="feature-desc">{{ feature.desc }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dots">
          <div class="dot" :class="{ active: currentDot === 0 }" @click="setCurrentDot(0)"></div>
          <div class="dot" :class="{ active: currentDot === 1 }" @click="setCurrentDot(1)"></div>
          <div class="dot" :class="{ active: currentDot === 2 }" @click="setCurrentDot(2)"></div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-left">
        <div class="footer-logo">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="footerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#b6a6f7"/>
                <stop offset="50%" stop-color="#6ec6fa"/>
                <stop offset="100%" stop-color="#8be6b6"/>
              </linearGradient>
            </defs>
            <path d="M 180 100 A 80 80 0 1 1 20 100" fill="none" stroke="url(#footerGradient)" stroke-width="16" stroke-linecap="round"/>
            <rect x="92" y="18" width="16" height="18" rx="3" fill="#fff"/>
            <text x="100" y="120" text-anchor="middle" font-family="优设标题黑, Arial, sans-serif" font-size="32" font-weight="bold" fill="#111" font-style="italic" letter-spacing="4">FRACTAL</text>
          </svg>
        </div>
        <div class="footer-icons">
          <i class="fas fa-envelope"></i>
          <i class="fas fa-gamepad"></i>
          <i class="fab fa-github"></i>
        </div>
      </div>
      
      <div class="footer-center">
        <div class="footer-title">{{ translations[currentLang].footerTitles[0] }}</div>
        <div class="footer-placeholder"></div>
      </div>
      
      <div class="footer-right">
        <div class="footer-title">{{ translations[currentLang].footerTitles[1] }}</div>
        <div class="footer-placeholder"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { ref, onMounted } from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'

export default {
  name: 'Landing',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    const currentLang = ref('zh')
    const currentDot = ref(0)
    
    const translations = {
      zh: {
        subtitle: '一款人性化的智能语音助手',
        webText: '进入网页版',
        appText: '获取APP',
        features: [
          {
            title: '智能化语音助手',
            desc: '实时对话',
            icon: 'fas fa-equals'
          },
          {
            title: '自定义音色配置',
            desc: '自定义声线',
            icon: 'fas fa-music'
          },
          {
            title: 'MCP工具应用',
            desc: '便捷办公',
            icon: 'fas fa-briefcase'
          }
        ],
        footerTitles: ['可连接设备', '关于我们']
      },
      en: {
        subtitle: 'A Humanized Intelligent Voice Assistant',
        webText: 'Web Version',
        appText: 'Get APP',
        features: [
          {
            title: 'Intelligent Voice Assistant',
            desc: 'Real-time Dialogue',
            icon: 'fas fa-equals'
          },
          {
            title: 'Custom Voice Configuration',
            desc: 'Custom Voice',
            icon: 'fas fa-music'
          },
          {
            title: 'MCP Tool Applications',
            desc: 'Convenient Office',
            icon: 'fas fa-briefcase'
          }
        ],
        footerTitles: ['Connectable Devices', 'About Us']
      }
    }

    const toggleLanguage = () => {
      currentLang.value = currentLang.value === 'zh' ? 'en' : 'zh'
    }

    const goToLogin = () => {
      // 检查用户是否已登录
      if (userStore.isAuthenticated) {
        // 已登录，直接跳转到主页
        router.push('/dashboard')
      } else {
        // 未登录，跳转到登录页面
        router.push('/login')
      }
    }

    const setCurrentDot = (index) => {
      currentDot.value = index
    }

    onMounted(() => {
      // 自动轮播功能
      setInterval(() => {
        currentDot.value = (currentDot.value + 1) % 3
      }, 3000)
    })

    return {
      currentLang,
      currentDot,
      translations,
      toggleLanguage,
      goToLogin,
      setCurrentDot
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
  position: relative;
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
  font-family: '优设标题黑', Arial, sans-serif;
  font-size: 120px;
  color: #2d1ed6;
  font-weight: bold;
  font-style: italic;
  letter-spacing: 4px;
  margin-bottom: 0;
}

.lang {
  font-family: '优设标题黑', Arial, sans-serif;
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
  padding: 0 60px;
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

.enter-btns-diagonal {
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

.diagonal-btn:active {
  transform: translateY(-4px);
  transition: all 0.1s ease;
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
  background: linear-gradient(135deg, #4bb6e6, #8be6b6);
  color: #fff;
  border-radius: 6px;
  box-shadow: -2px 0 8px #b6b6e6;
  z-index: 1;
}

.app-diagonal:hover {
  background: linear-gradient(135deg, #5bc7f6, #9bf7c6);
  box-shadow: 0 8px 32px rgba(75, 182, 230, 0.3);
}

.right-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 0 0 420px;
  min-height: 600px;
  position: relative;
  margin-left: 40px;
}

.feature-overlay {
  position: absolute;
  top: 0;
  left: -80px;
  right: -80px;
  bottom: 0;
  background: linear-gradient(135deg, rgba(110, 198, 250, 0.3), rgba(139, 230, 182, 0.3));
  border-radius: 20px;
  z-index: 1;
}

.feature-overlay::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 40px;
  right: -80px;
  bottom: -20px;
  background: linear-gradient(135deg, rgba(110, 198, 250, 0.2), rgba(139, 230, 182, 0.2));
  border-radius: 20px;
  z-index: 0;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
  margin-left: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  position: relative;
  min-width: 320px;
  margin-left: 20px;
  height: 80px;
}

.feature-card-main {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

.feature-card-main:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #4bb6e6, #8be6b6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: white;
  font-size: 1.5rem;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 0.9rem;
  color: #666;
}

.dots {
  display: flex;
  gap: 12px;
  position: relative;
  z-index: 2;
  margin-left: 20px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: #4bb6e6;
  transform: scale(1.2);
}

.dot:hover {
  background: rgba(75, 182, 230, 0.7);
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 60px 60px 40px 60px;
  margin-top: 60px;
}

.footer-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-logo {
  margin-bottom: 20px;
}

.footer-logo svg {
  width: 60px;
  height: 60px;
}

.footer-icons {
  display: flex;
  gap: 20px;
}

.footer-icons i {
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
  transition: color 0.2s;
}

.footer-icons i:hover {
  color: #4bb6e6;
}

.footer-center,
.footer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.footer-placeholder {
  width: 200px;
  height: 120px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
    align-items: center;
  }
  
  .left-panel {
    margin-right: 0;
    margin-bottom: 40px;
  }
  
  .right-panel {
    margin-left: 0;
  }
  
  .footer {
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 20px 20px 0 20px;
  }
  
  .main-content {
    padding: 0 20px;
  }
  
  .footer {
    padding: 40px 20px 20px 20px;
  }
  
  .main-title {
    font-family: '优设标题黑', Arial, sans-serif;
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
}
</style> 