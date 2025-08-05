<template>
  <div class="sidebar">
    <div class="sidebar-logo">
      <div class="beme-logo">BEME</div>
      <div style="display:flex;align-items:center;">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:70px;height:70px;">
          <defs>
            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#b6a6f7"/>
              <stop offset="50%" stop-color="#6ec6fa"/>
              <stop offset="100%" stop-color="#8be6b6"/>
            </linearGradient>
          </defs>
          <path d="M 180 100 A 80 80 0 1 1 20 100" fill="none" stroke="url(#circleGradient)" stroke-width="16" stroke-linecap="round"/>
          <rect x="92" y="18" width="16" height="18" rx="3" fill="#fff"/>
          <text x="100" y="120" text-anchor="middle" font-family="Orbitron, Arial, sans-serif" font-size="38" font-weight="bold" fill="#111" font-style="italic" letter-spacing="4">FRACTAL</text>
        </svg>
                 <div style="display:flex;flex-direction:column;justify-content:center;margin-left:12px;min-width:60px;">
          <span class="sidebar-logo-title logo-blue-italic">Fractal</span>
          <span class="sidebar-logo-sub logo-blue-italic logo-large">语音助手</span>
        </div>
      </div>
    </div>
    
    <nav class="sidebar-menu">
      <ul>
        <li 
          v-for="item in menuItems" 
          :key="item.path"
          :class="{ active: currentRoute === item.path }"
          @click="navigateTo(item.path)"
        >
          <i :class="item.icon"></i>{{ item.name }}
        </li>
      </ul>
    </nav>
    
    <div class="sidebar-bottom">
      <button class="sidebar-setting-btn" @click="showSettings">
        <i class="fa-solid fa-gear"></i>设置
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

export default {
  name: 'Sidebar',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()

    const currentRoute = computed(() => route.path)

    const menuItems = [
      { name: '首页', path: '/home', icon: 'fa-solid fa-house' },
      { name: '语音模拟器', path: '/voice-simulator', icon: 'fa-solid fa-comments' },
      { name: '设备管理', path: '/device-management', icon: 'fa-solid fa-tablet-screen-button' },
      { name: '音色设置', path: '/voice-settings', icon: 'fa-solid fa-user-gear' },
      { name: 'MCP订阅', path: '/mcp-subscription', icon: 'fa-solid fa-desktop' }
    ]

    const navigateTo = (path) => {
      router.push(path)
    }

    const showSettings = () => {
      // 触发设置模态框显示事件
      window.dispatchEvent(new CustomEvent('showSettingsModal'))
    }

    return {
      currentRoute,
      menuItems,
      navigateTo,
      showSettings
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(120, 120, 180, 0.18);
  border: 2.5px solid #e3d6f7;
  display: flex;
  flex-direction: column;
  padding: 0;
  min-height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

.sidebar-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0 8px 0;
  border-bottom: 2px solid #d6c6c6;
}

/* 像素风格BEME Logo */
.beme-logo {
  font-family: 'Courier New', monospace;
  font-size: 2.5rem;
  font-weight: bold;
  color: #1e3a8a;
  text-shadow: 
    0 0 0 #3b82f6,
    1px 0 0 #60a5fa,
    2px 0 0 #93c5fd,
    3px 0 0 #dbeafe,
    0 1px 0 #3b82f6,
    1px 1px 0 #60a5fa,
    2px 1px 0 #93c5fd,
    3px 1px 0 #dbeafe,
    0 2px 0 #3b82f6,
    1px 2px 0 #60a5fa,
    2px 2px 0 #93c5fd,
    3px 2px 0 #dbeafe,
    0 3px 0 #3b82f6,
    1px 3px 0 #60a5fa,
    2px 3px 0 #93c5fd,
    3px 3px 0 #dbeafe;
  letter-spacing: 2px;
  line-height: 1;
  margin-bottom: 10px;
  image-rendering: pixelated;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: none;
}

.sidebar-logo svg {
  width: 80px;
  height: 80px;
}

.sidebar-logo-title {
  font-size: 0.9rem;
  margin-bottom: 0;
  margin-top: 3px;
  font-family: 'Orbitron', Arial, sans-serif;
  font-style: italic;
  font-weight: bold;
  color: #1a1ed6;
  letter-spacing: 0.3px;
}

.sidebar-logo-sub {
  font-size: 0.7rem;
  margin-top: 2px;
  margin-bottom: 0;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  font-style: italic;
  font-weight: bold;
  color: #1a1ed6;
  letter-spacing: 0.2px;
}

.sidebar-menu {
  flex: 1;
  padding: 0 0 0 0;
  margin-top: 18px;
}

.sidebar-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  display: flex;
  align-items: center;
  font-size: 1rem;
  padding: 24px 0 24px 32px;
  cursor: pointer;
  color: #333;
  border-left: 4px solid transparent;
  transition: background 0.2s, border-color 0.2s;
  margin-bottom: 12px;
  border-radius: 0 16px 16px 0;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

.sidebar-menu li.active, .sidebar-menu li:hover {
  background: #e3d6f7;
  border-left: 4px solid #6ec6fa;
  color: #2d1ed6;
}

.sidebar-menu li i {
  margin-right: 18px;
  font-size: 1.3em;
  min-width: 28px;
  text-align: left;
}

.sidebar-bottom {
  padding: 22px 24px 18px 24px;
  border-top: 2px solid #d6c6c6;
}

.sidebar-setting-btn {
  width: 100%;
  height: 48px;
  border-radius: 10px;
  border: 2px solid #ccc;
  background: #fff;
  color: #333;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
}

.sidebar-setting-btn:hover {
  background: #e3d6f7;
  border-color: #6ec6fa;
  color: #2d1ed6;
}

.sidebar-setting-btn i {
  margin-right: 8px;
}

.logo-blue-italic {
  color: #1a1ed6;
  font-family: 'Orbitron', Arial, sans-serif;
  font-style: italic;
  font-weight: bold;
  letter-spacing: 2px;
}

.logo-large {
  font-size: 0.7rem;
  margin-top: 2px;
}

@media (max-width: 800px) {
  .sidebar {
    width: 100vw;
    min-width: 0;
    border-radius: 0;
    border: none;
  }
  
  .sidebar-menu li {
    padding: 16px 0 16px 18px;
    margin-bottom: 4px;
  }
}
</style> 