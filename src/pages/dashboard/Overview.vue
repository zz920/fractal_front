<template>
  <div class="overview">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>首页</h1>
      <p>欢迎回到Fractal助手</p>
    </div>
    
    <!-- 用户信息与操作（合并为一张卡片） -->
    <div class="hero-card">
      <div class="hero-left">
        <div class="user-avatar">
          <div class="avatar-placeholder">
            {{ userInitials }}
          </div>
        </div>
        <div class="user-details">
          <h2 class="username">{{ user?.user_name || '用户' }}</h2>
          <p class="user-email">{{ user?.email || '未设置邮箱' }}</p>
          <div class="welcome-message">
            <h3>欢迎回来, {{ user?.user_name || '用户' }}!</h3>
            <p>您可以开始使用Fractal语音助手进行智能对话</p>
          </div>
        </div>
      </div>
      <div class="hero-right">
        <div class="action-buttons">
          <router-link to="/dashboard/voice" class="action-btn voice-btn">
            <div class="btn-icon">
              <i class="fas fa-comments"></i>
            </div>
            <span>开始语音对话</span>
          </router-link>
          <router-link to="/dashboard/device" class="action-btn device-btn">
            <div class="btn-icon">
              <i class="fas fa-desktop"></i>
            </div>
            <span>管理我的设备</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../../stores/user.js'
import { computed } from 'vue'

export default {
  name: 'Overview',
  setup() {
    const userStore = useUserStore()
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '未知'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch (error) {
        return '未知'
      }
    }
    
    // 计算用户姓名首字母
    const userInitials = computed(() => {
      const name = userStore.user?.user_name || '用户'
      return name.charAt(0).toUpperCase()
    })
    
    return {
      user: userStore.user,
      userInitials,
      formatDate
    }
  }
}
</script>

<style scoped>
.overview {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #EEEBF5;
  min-height: 100vh;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-family: '优设标题黑', Arial, sans-serif;
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.page-header p {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
}

/* 合并后的首屏卡片 */
.hero-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.hero-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.hero-right {
  display: flex;
  align-items: center;
}

.user-avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e6e6fa, #d8bfd8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: '优设标题黑', Arial, sans-serif;
  font-size: 2rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.user-details {
  flex: 1;
}

.username {
  font-family: '优设标题黑', Arial, sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.user-email {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
}

.welcome-message h3 {
  font-family: '优设标题黑', Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.welcome-message p {
  color: #555;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  font-family: '优设标题黑', Arial, sans-serif;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  min-width: 180px;
  justify-content: center;
}

.voice-btn {
  background: linear-gradient(135deg, #e6e6fa, #87ceeb);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(134, 206, 235, 0.3);
}

.voice-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(134, 206, 235, 0.4);
}

.device-btn {
  background: white;
  color: #333;
  border: 2px solid #6c757d;
}

.device-btn:hover {
  background: #f8f9fa;
  border-color: #495057;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.2rem;
}

.voice-btn .btn-icon {
  color: white;
}

.device-btn .btn-icon {
  color: #6c757d;
}

.action-btn span {
  font-weight: 500;
}



/* 响应式设计 */
@media (max-width: 768px) {
  .overview {
    padding: 1rem;
  }
  
  .hero-card {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1rem;
  }
  
  .hero-left {
    flex-direction: column;
    gap: 1rem;
  }
  
  .avatar-placeholder {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
  
  .username {
    font-size: 1.8rem;
  }
  
  .welcome-message h3 {
    font-size: 1.5rem;
  }
  
  .hero-right .action-buttons { 
    flex-direction: column; 
    align-items: center; 
    width: 100%;
  }
  
  .action-btn {
    min-width: 250px;
    width: 100%;
  }
}
</style> 