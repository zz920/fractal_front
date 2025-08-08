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
              <i class="nav-icon fas fa-home"></i>
              <span>首页</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/dashboard/voice"
              class="nav-link"
              :class="{ active: $route.path === '/dashboard/voice' }"
            >
              <i class="nav-icon fas fa-comments"></i>
              <span>语音模拟器</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/dashboard/device"
              class="nav-link"
              :class="{ active: $route.path === '/dashboard/device' }"
            >
              <i class="nav-icon fas fa-desktop"></i>
              <span>设备管理</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/dashboard/tone"
              class="nav-link"
              :class="{ active: $route.path === '/dashboard/tone' }"
            >
              <i class="nav-icon fas fa-user"></i>
              <span>音色设置</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/dashboard/mcp"
              class="nav-link"
              :class="{ active: $route.path === '/dashboard/mcp' }"
            >
              <i class="nav-icon fas fa-cube"></i>
              <span>MCP订阅</span>
            </router-link>
          </li>
        </ul>
      </nav>
      
      <!-- 设置按钮 -->
      <div class="sidebar-footer">
        <router-link to="/dashboard/settings" class="settings-btn">
          <i class="settings-icon fas fa-cog"></i>
          <span>设置</span>
        </router-link>
      </div>
    </aside>
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 顶部用户信息栏 -->
      <header class="user-header">
        <div class="page-title">
          <h1>{{ getCurrentPageTitle() }}</h1>
        </div>
        <div class="user-info">
          <div class="user-avatar">
            <span class="avatar-initial">{{ userInitials }}</span>
          </div>
          <div class="user-details">
            <span class="user-nickname">{{ user?.user_name || '用户' }}</span>
            <i class="user-status-icon fas fa-circle"></i>
          </div>
        </div>
      </header>
      
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user.js'

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // 计算用户姓名首字母
    const userInitials = computed(() => {
      const name = userStore.user?.user_name || '用户'
      return name.charAt(0).toUpperCase()
    })
    
    // 处理登出
    const handleLogout = async () => {
      try {
        await userStore.userLogout()
        router.push('/login')
      } catch (error) {
        console.error('登出失败:', error)
      }
    }
    
    // 获取当前页面标题
    const getCurrentPageTitle = () => {
      const route = router.currentRoute.value
      const routeMap = {
        '/dashboard/overview': '首页',
        '/dashboard/voice': '语音模拟器',
        '/dashboard/device': '设备管理',
        '/dashboard/tone': '音色设置',
        '/dashboard/mcp': 'MCP订阅',
        '/dashboard/settings': '设置'
      }
      return routeMap[route.path] || '控制台'
    }
    
    return {
      user: computed(() => userStore.user),
      userInitials,
      handleLogout,
      getCurrentPageTitle
    }
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background-color: rgb(238, 235, 245);
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
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #e9ecef;
}

.settings-btn {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.settings-btn:hover {
  background-color: #f8f9fa;
  border-color: #6ec6fa;
  color: #6ec6fa;
}

.settings-icon {
  width: 16px;
  margin-right: 8px;
  font-size: 0.9rem;
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
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background: #fff;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-title h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #b6a6f7 0%, #6ec6fa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(110, 198, 250, 0.3);
}

.avatar-initial {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
}

.user-details {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-nickname {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.user-status-icon {
  font-size: 0.6rem;
  color: #10b981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.content-wrapper {
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
</style> 