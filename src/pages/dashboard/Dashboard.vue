<template>
  <div class="dashboard">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <!-- 品牌区域 -->
      <div class="brand-section">
        <div class="brand-logo">
          <div class="beme-logo">
            <span class="beme-text">BEME</span>
          </div>
          <div class="logo-container">
            <div class="fractal-logo">
              <svg class="logo-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#6ec6fa"/>
                    <stop offset="100%" stop-color="#b6a6f7"/>
                  </linearGradient>
                </defs>
                <path d="M 180 100 A 80 80 0 1 1 20 100" fill="none" stroke="url(#logoGradient)" stroke-width="16" stroke-linecap="round"/>
                <rect x="92" y="18" width="16" height="18" rx="3" fill="#fff"/>
                <text x="100" y="120" text-anchor="middle" font-family="Orbitron, Arial, sans-serif" font-size="32" font-weight="bold" fill="#1e3a8a" font-style="italic" letter-spacing="4">FRACTAL</text>
              </svg>
            </div>
            <div class="brand-text">
              <div class="fractal-title">Fractal</div>
              <div class="fractal-subtitle">语音助手</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 导航菜单 -->
      <nav class="nav-menu">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link
              to="/dashboard/overview"
              class="nav-link"
              :class="{ active: $route.path === '/dashboard/overview' || $route.path === '/dashboard' }"
            >
              <i class="nav-icon fas fa-home" data-fallback="🏠"></i>
              <span>首页</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/dashboard/voice"
              class="nav-link"
              :class="{ active: $route.path === '/dashboard/voice' }"
            >
              <i class="nav-icon fas fa-comments" data-fallback="💬"></i>
              <span>语音模拟器</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/dashboard/device"
              class="nav-link"
              :class="{ active: $route.path === '/dashboard/device' }"
            >
              <i class="nav-icon fas fa-desktop" data-fallback="🖥️"></i>
              <span>设备管理</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/dashboard/voice-config"
              class="nav-link"
              :class="{ active: $route.path === '/dashboard/voice-config' }"
            >
              <i class="nav-icon fas fa-music" data-fallback="🎵"></i>
              <span>音色配置</span>
            </router-link>
          </li>
        </ul>
      </nav>
      
      <!-- 设置按钮 -->
      <div class="sidebar-footer">
        <button class="settings-btn" @click="openSettings">
          <i class="settings-icon fas fa-cog" data-fallback="⚙️"></i>
          <span>设置</span>
        </button>
      </div>
    </aside>
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 顶部用户信息栏 -->
      <header class="top-header">
        <div class="header-content">
          <div class="header-left">
            <!-- 左侧可以放置其他内容，比如面包屑导航等 -->
          </div>
          <div class="user-info">
            <div class="user-avatar">
              <div class="avatar-placeholder">
                {{ userInitials }}
              </div>
            </div>
            <div class="user-details">
              <div class="username">{{ user?.user_name || '用户' }}</div>
              <div class="user-email">{{ user?.email || '未设置邮箱' }}</div>
            </div>
          </div>
        </div>
      </header>

      <!-- 主要内容 -->
      <div class="content-area">
        <router-view />
      </div>
    </main>

    <!-- 设置弹窗 -->
    <div v-if="settingsVisible" class="settings-modal-overlay" @click="closeSettings">
      <div class="settings-modal" @click.stop>
        <div class="settings-modal-header">
          <h3>设置</h3>
          <button class="close-btn" @click="closeSettings">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="settings-modal-content">
          <Settings />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user.js'
import Settings from '@/components/Settings.vue'

export default {
  name: 'Dashboard',
  components: {
    Settings
  },
  setup() {
    const userStore = useUserStore()
    const settingsVisible = ref(false)

    // 计算用户姓名首字母
    const userInitials = computed(() => {
      const name = userStore.user?.user_name || '用户'
      return name.charAt(0).toUpperCase()
    })

    // 打开设置弹窗
    const openSettings = () => {
      console.log('打开设置弹窗')
      settingsVisible.value = true
    }

    // 关闭设置弹窗
    const closeSettings = () => {
      console.log('关闭设置弹窗')
      settingsVisible.value = false
    }

    return {
      user: computed(() => userStore.user),
      userInitials,
      settingsVisible,
      openSettings,
      closeSettings
    }
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #EEEBF5;
}

/* 左侧导航栏 */
.sidebar {
  width: 20%;
  min-width: 250px;
  background: #fff;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
}

/* 品牌区域 */
.brand-section {
  padding: 24px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: center;
  align-items: center;
}

.brand-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}

.fractal-logo {
  flex-shrink: 0;
}

.logo-svg {
  width: 80px;
  height: 80px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fractal-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #1e3a8a;
  font-family: 'Orbitron', 'Arial', sans-serif;
  letter-spacing: 2px;
  font-style: italic;
}

.fractal-subtitle {
  font-size: 1.1rem;
  color: #1e3a8a;
  font-weight: 500;
  margin-top: 4px;
}

.beme-logo {
  margin-bottom: 8px;
}

.beme-text {
  font-size: 1.8rem;
  font-weight: 900;
  color: #1e3a8a;
  font-family: 'Arial', sans-serif;
  text-shadow: 
    3px 3px 0px rgba(30, 58, 138, 0.8),
    6px 6px 0px rgba(110, 198, 250, 0.4),
    0 0 10px rgba(110, 198, 250, 0.6);
  letter-spacing: 6px;
  filter: drop-shadow(0 0 4px rgba(110, 198, 250, 0.8));
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #6ec6fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.beme-text::before {
  content: 'BEME';
  position: absolute;
  top: 2px;
  left: 2px;
  color: rgba(110, 198, 250, 0.3);
  z-index: -1;
  text-shadow: none;
  -webkit-text-fill-color: rgba(110, 198, 250, 0.3);
}

/* 导航菜单 */
.nav-menu {
  flex: 1;
  padding: 20px 0;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 4px 12px;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #6ec6fa;
}

.nav-link.active {
  background-color: #e3f2fd;
  color: #6ec6fa;
  font-weight: 500;
}

.nav-icon {
  width: 20px;
  margin-right: 12px;
  font-size: 1rem;
}

.nav-link span {
  font-size: 0.95rem;
  font-weight: 500;
}

/* 设置按钮 */
.settings-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 12px;
  color: #666;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  outline: none;
  font-family: inherit;
}

.settings-btn:hover {
  background: #f0f3f5;
  color: #333;
  border-color: #e9ecef;
  transform: translateX(4px);
}

.settings-btn.active {
  background: #6ec6fa;
  color: #fff;
  box-shadow: 0 2px 8px rgba(110, 198, 250, 0.3);
  border-color: #6ec6fa;
}

.settings-icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  margin-left: 20%;
  min-height: 100vh;
  background-color: rgb(238, 235, 245);
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* 顶部用户信息栏 */
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background: #fff;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-left {
  flex: 1;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.user-avatar {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #6ec6fa 0%, #b6a6f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(110, 198, 250, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.user-email {
  font-size: 0.9rem;
  color: #666;
}

.content-area {
  flex: 1;
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    position: relative;
    height: auto;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .dashboard {
    flex-direction: column;
  }
}

/* 备用图标样式 */
.fas:before {
  content: attr(data-fallback);
}

/* 强制显示备用图标 */
.fas.fa-home:before { content: "🏠" !important; }
.fas.fa-comments:before { content: "💬" !important; }
.fas.fa-desktop:before { content: "🖥️" !important; }
.fas.fa-user:before { content: "👤" !important; }
.fas.fa-cube:before { content: "📦" !important; }
.fas.fa-cog:before { content: "⚙️" !important; }

/* Font Awesome失败时的备用样式 */
.font-awesome-failed .fas:before {
  font-family: "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif;
  font-size: 1.2em;
}

.font-awesome-failed .fas.fa-home:before { content: "🏠"; }
.font-awesome-failed .fas.fa-comments:before { content: "💬"; }
.font-awesome-failed .fas.fa-desktop:before { content: "🖥️"; }
.font-awesome-failed .fas.fa-user:before { content: "👤"; }
.font-awesome-failed .fas.fa-cube:before { content: "📦"; }
.font-awesome-failed .fas.fa-cog:before { content: "⚙️"; }

/* 设置弹窗样式 */
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
}

.settings-modal {
  background: #fff;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.settings-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.settings-modal-header h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  font-family: '优设标题黑', sans-serif;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #333;
}

.settings-modal-content {
  max-height: calc(90vh - 100px);
  overflow-y: auto;
  padding: 0;
}

/* 响应式设置弹窗 */
@media (max-width: 768px) {
  .settings-modal {
    width: 95%;
    margin: 20px;
  }
  
  .settings-modal-header {
    padding: 20px 24px;
  }
  
  .settings-modal-header h3 {
    font-size: 1.3rem;
  }
}
</style> 