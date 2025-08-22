<template>
  <div class="landing-page">
    <div class="header">
      <div class="header-center">
        <svg class="fractal-title" viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4bb6e6"/>
            <stop offset="50%" stop-color="#8be6b6"/>
            <stop offset="100%" stop-color="#b6a6f7"/>
          </linearGradient>
          <linearGradient id="smileGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#b6a6f7"/>
            <stop offset="50%" stop-color="#6ec6fa"/>
            <stop offset="100%" stop-color="#8be6b6"/>
          </linearGradient>
        </defs>
        
        <!-- Modern Fractal Text with Font -->
        <text class="fractal-text" x="200" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="#000" letter-spacing="2">
          FRACTAL
        </text>
        
        <!-- Smile Curve Below Text -->
        <path class="smile-curve" d="M 40 110 Q 200 150 360 110" fill="none" stroke="url(#smileGradient)" stroke-width="6" stroke-linecap="round"/>
        
        </svg>
        <div class="subtitle">{{ translations[currentLang].subtitle }}</div>
      </div>
      <span class="lang" @click="toggleLanguage">{{ currentLang === 'zh' ? 'English' : '中文' }}</span>
    </div>
    
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
          <!-- Page 1: Original 3 feature cards -->
          <div class="feature-page" :class="{ 'active': currentDot === 0 || currentDot === 2 }">
            <div class="feature-item">
              <div class="feature-card-main">
                <span class="feature-icon">
                  <i class="fas fa-equals"></i>
                </span>
                <div class="feature-content">
                  <div class="feature-title">{{ translations[currentLang].features[0].title }}</div>
                  <div class="feature-desc">{{ translations[currentLang].features[0].desc }}</div>
                </div>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-card-main">
                <span class="feature-icon">
                  <i class="fas fa-music"></i>
                </span>
                <div class="feature-content">
                  <div class="feature-title">{{ translations[currentLang].features[1].title }}</div>
                  <div class="feature-desc">{{ translations[currentLang].features[1].desc }}</div>
                </div>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-card-main">
                <span class="feature-icon">
                  <i class="fas fa-briefcase"></i>
                </span>
                <div class="feature-content">
                  <div class="feature-title">{{ translations[currentLang].features[2].title }}</div>
                  <div class="feature-desc">{{ translations[currentLang].features[2].desc }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Page 2: Hardware support message -->
          <div class="feature-page hardware-page" :class="{ 'active': currentDot === 1 }">
            <div class="feature-item">
              <div class="feature-card-main">
                <span class="feature-icon">
                  <i class="fas fa-microchip"></i>
                </span>
                <div class="feature-content">
                  <div class="feature-title">{{ currentLang === 'zh' ? '现支持小智AI硬件' : 'Support XiaoZhi AI' }}</div>
                  <a href="#" class="hardware-link">{{ currentLang === 'zh' ? '接入说明' : 'Access Guide' }}</a>
                </div>
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
          <span class="demo-badge">DEMO</span>
        </div>
      </div>
      
      <div class="footer-center">
        <div class="footer-title">{{ translations[currentLang].footerTitles[0] }}</div>
        <div class="devices-list">
          <div class="device-item">
            <i class="fas fa-robot"></i>
            <span>小智AI硬件</span>
          </div>
          <div class="device-item">
            <i class="fab fa-android"></i>
            <span>Android</span>
            <span class="dev-badge">开发中</span>
          </div>
          <div class="device-item">
            <i class="fab fa-apple"></i>
            <span>iPhone</span>
            <span class="dev-badge">开发中</span>
          </div>
          <div class="device-item">
            <i class="fas fa-globe"></i>
            <span>Web端</span>
          </div>
        </div>
      </div>
      
      <div class="footer-right">
        <div class="footer-title">{{ translations[currentLang].footerTitles[1] }}</div>
        <div class="about-content">
          <p class="about-description">{{ translations[currentLang].description }}</p>
          <div class="about-contact">
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <span>zz920.zhibowen@gmail.com</span>
            </div>
          </div>
          <div class="about-social">
            <a href="#" class="social-link">
              <i class="fab fa-github"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-weixin"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-weibo"></i>
            </a>
          </div>
        </div>
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
        description: 'Fractal - 重新定义智能语音交互体验',
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
        description: 'Fractal - Redefining Intelligent Voice Interaction Experience',
        features: [
          {
            title: 'AI Voice Assistant',
            desc: 'Real-time Dialogue',
            icon: 'fas fa-equals'
          },
          {
            title: 'Support Voice Configuration',
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
  padding: 10px 40px 0 40px;
}

.header-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin: 0 20px;
}

.logo-big {
  width: 80px;
  height: 80px;
  margin-right: 12px;
}


.lang {
  font-family: '优设标题黑', Arial, sans-serif;
  font-size: 1.1rem;
  color: #222;
  font-style: italic;
  margin-top: 8px;
  cursor: pointer;
  transition: color 0.2s;
  padding: 3px 6px;
  border-radius: 3px;
}

.lang:hover {
  color: #4bb6e6;
  background: rgba(75, 182, 230, 0.1);
}

.subtitle {
  text-align: center;
  font-size: 1.1rem;
  margin-top: 8px;
  color: #222;
  letter-spacing: 1px;
  font-weight: bold;
}


.fractal-title {
  width: 320px;
  height: 120px;
  margin-bottom: 5px;
}

.fractal-text {
  transition: all 0.3s ease;
}

.fractal-title:hover .fractal-text {
  transform: translateY(-2px);
  filter: drop-shadow(0 4px 8px rgba(75, 182, 230, 0.3));
}

.smile-curve {
  transition: all 0.3s ease;
}

.fractal-title:hover .smile-curve {
  stroke-width: 10;
  filter: drop-shadow(0 2px 4px rgba(182, 166, 247, 0.3));
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 30px;
  min-height: 320px;
  padding: 0 20px;
}

.left-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 40px;
  flex: 0 0 380px;
  min-height: 400px;
}

.enter-btns-diagonal {
  display: flex;
  flex-direction: row;
  margin-top: 60px;
  box-shadow: 0 4px 24px #b6b6e6;
}

.diagonal-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  width: 220px;
  font-size: 1.8rem;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  font-weight: bold;
  border-radius: 8px;
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
  flex: 0 0 320px;
  min-height: 400px;
  position: relative;
  margin-left: 30px;
}

.feature-overlay {
  position: absolute;
  top: 0;
  left: -40px;
  right: -40px;
  bottom: 0;
  background: linear-gradient(135deg, rgba(110, 198, 250, 0.3), rgba(139, 230, 182, 0.3));
  border-radius: 20px;
  z-index: 1;
}

.feature-overlay::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 20px;
  right: -40px;
  bottom: -15px;
  background: linear-gradient(135deg, rgba(110, 198, 250, 0.2), rgba(139, 230, 182, 0.2));
  border-radius: 20px;
  z-index: 0;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
  position: relative;
  z-index: 2;
  margin-left: 20px;
  height: 280px;
  width: 320px;
  overflow: hidden;
}

.feature-item {
  display: flex;
  align-items: center;
  min-width: 280px;
  margin-left: 20px;
  height: 70px;
  margin-bottom: 10px;
}

.feature-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.5s ease;
  pointer-events: none;
}

.feature-page.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}


.hardware-page .feature-card-main {
  justify-content: flex-start;
  text-align: left;
}

.hardware-page .feature-item {
  height: 70px;
}

.hardware-link {
  display: inline-block;
  margin-top: 3px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #4bb6e6, #8be6b6);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.hardware-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(75, 182, 230, 0.3);
}


.feature-card-main {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 10px;
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
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #4bb6e6, #8be6b6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
  font-size: 1.2rem;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 3px;
}

.feature-desc {
  font-size: 0.8rem;
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
  padding: 30px 20px 20px 20px;
  margin-top: 30px;
  gap: 30px;
}

.footer-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 0 0 20%;
  min-width: 0;
}

.footer-logo {
  position: relative;
}

.footer-logo svg {
  width: 40px;
  height: 40px;
}

.demo-badge {
  position: absolute;
  top: -6px;
  right: -30px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  font-size: 0.6rem;
  font-weight: bold;
  padding: 3px 6px;
  border-radius: 10px;
  animation: pulse 2s infinite;
}

.footer-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 0;
  margin: 0 20px;
  text-align: center;
}

.footer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
  padding-left: 40px;
}

.about-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about-description {
  color: #555;
  font-size: 0.8rem;
  margin-bottom: 10px;
  line-height: 1.4;
}

.about-contact {
  margin-bottom: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 0.75rem;
}

.contact-item i {
  color: #4bb6e6;
  width: 16px;
}

.about-social {
  display: flex;
  gap: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(75, 182, 230, 0.1);
  color: #555;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #4bb6e6;
  color: white;
  transform: translateY(-2px);
}

.social-link i {
  font-size: 0.9rem;
}

.footer-title {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
  width: 100%;
}

.devices-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
}

.device-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
  flex: 0 0 calc(33.333% - 8px);
  box-sizing: border-box;
}

.device-item:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
}

.device-item i {
  color: #4bb6e6;
  font-size: 0.9rem;
  width: 16px;
}

.device-item span {
  color: #444;
  font-size: 0.75rem;
  font-weight: 500;
}

.dev-badge {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  font-size: 0.6rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 8px;
  margin-left: 6px;
  white-space: nowrap;
}

/* 动画效果 */
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
  }
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
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
  }
  
  .footer-left,
  .footer-center,
  .footer-right {
    flex: 0 0 calc(50% - 15px);
    align-items: center;
    text-align: center;
  }
  
  .about-content {
    display: flex;
    flex-direction: column;
    align-items: center;
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
    padding: 20px 20px 15px 20px;
    flex-direction: column;
    gap: 20px;
  }
  
  .main-title {
    font-family: '优设标题黑', Arial, sans-serif;
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
  }
  
  .footer-left,
  .footer-center,
  .footer-right {
    flex: 1;
    width: 100%;
    align-items: center;
    text-align: center;
  }
  
  .devices-list {
    justify-content: center;
  }
  
  .device-item {
    flex: 0 0 calc(33.333% - 8px);
    justify-content: center;
  }
}
</style> 