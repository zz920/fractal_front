<template>
  <div class="dashboard">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <!-- 用户信息区域 -->
      <div class="user-info">
        <div class="user-avatar">
          <div class="avatar-placeholder">
            {{ userInitials }}
          </div>
        </div>
        <div class="user-details">
          <h3 class="user-name">{{ user?.user_name || '用户' }}</h3>
          <p class="user-email">{{ user?.email || '' }}</p>
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
              <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,13H11V3H3M3,21H11V15H3M13,21H21V11H13M13,3V9H21V3"/>
              </svg>
              <span>Overview</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/dashboard/voice"
              class="nav-link"
              :class="{ active: $route.path === '/dashboard/voice' }"
            >
              <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,9H15V15H9M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
              </svg>
              <span>Voice Simu</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/dashboard/device"
              class="nav-link"
              :class="{ active: $route.path === '/dashboard/device' }"
            >
              <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,3H7A2,2 0 0,0 5,5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V5A2,2 0 0,0 17,3M17,19H7V5H17V19M16,10H13V7H16V10M12,7V10H9V7H12M16,11V14H13V11H16M12,11V14H9V11H12M16,15V18H13V15H16M12,15V18H9V15H12"/>
              </svg>
              <span>设备管理</span>
            </router-link>
          </li>
        </ul>
      </nav>
      
      <!-- 登出按钮 -->
      <div class="sidebar-footer">
        <button @click="handleLogout" class="logout-btn">
          <svg class="logout-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
          </svg>
          <span>登出</span>
        </button>
      </div>
    </aside>
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <router-view />
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
        // 即使登出失败，也要跳转到登录页面
        router.push('/login')
      }
    }
    
    return {
      user: userStore.user,
      userInitials,
      handleLogout
    }
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

.sidebar {
  width: 280px;
  background: white;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
}

.user-info {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-menu {
  flex: 1;
  padding: 1rem 0;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #6c757d;
  text-decoration: none;
  transition: all 0.3s ease;
  border-right: 3px solid transparent;
}

.nav-link:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.nav-link.active {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-right-color: #667eea;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #f8f9fa;
  border-color: #dee2e6;
  color: #495057;
}

.logout-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  min-height: 100vh;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
}
</style> 