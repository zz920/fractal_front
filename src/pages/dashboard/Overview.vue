<template>
  <div class="overview">
    <!-- 欢迎卡片 -->
    <div class="welcome-section">
      <div class="welcome-card">
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
        <div class="welcome-content">
          <h2 class="welcome-title">欢迎回来, {{ user?.user_name || '用户' }}!</h2>
          <p class="welcome-description">您可以开始使用Fractal语音助手进行智能对话</p>
          <div class="action-buttons">
            <router-link to="/dashboard/voice" class="primary-btn">
              <i class="btn-icon fas fa-comments"></i>
              开始语音对话
            </router-link>
            <router-link to="/dashboard/device" class="secondary-btn">
              <i class="btn-icon fas fa-desktop"></i>
              管理我的设备
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useUserStore } from '../../stores/user.js'

export default {
  name: 'Overview',
  setup() {
    const userStore = useUserStore()
    
    // 计算用户姓名首字母
    const userInitials = computed(() => {
      const name = userStore.user?.user_name || '用户'
      return name.charAt(0).toUpperCase()
    })
    
    return {
      user: computed(() => userStore.user),
      userInitials
    }
  }
}
</script>

<style scoped>
.overview {
  padding: 32px;
  background-color: rgb(238, 235, 245);
  min-height: 100vh;
  width: 100%;
}

/* 欢迎卡片 */
.welcome-section {
  margin-bottom: 32px;
}

.welcome-card {
  background: linear-gradient(to right, rgb(234, 238, 255), rgb(231, 210, 247));
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  min-height: 400px;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  width: 80px;
  height: 80px;
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
  font-size: 2rem;
  font-weight: bold;
  font-family: 'Arial', sans-serif;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
}

.user-email {
  font-size: 1.2rem;
  color: #666;
}

/* 欢迎内容 */
.welcome-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 200px;
  padding: 24px 0;
}

.welcome-title {
  font-size: 2.8rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.welcome-description {
  font-size: 1.4rem;
  color: #666;
  margin: 0 0 32px 0;
  line-height: 1.5;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: auto;
}

.primary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #6ec6fa 0%, #b6a6f7 100%);
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(110, 198, 250, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(110, 198, 250, 0.4);
  color: #fff;
}

.secondary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: #fff;
  color: #333;
  text-decoration: none;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: #f8f9fa;
  border-color: #6ec6fa;
  color: #6ec6fa;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .overview {
    padding: 20px 20px 20px 0;
  }
  
  .page-header {
    padding-left: 20px;
  }
  
  .welcome-section {
    padding-left: 20px;
  }
  
  .welcome-card {
    padding: 24px;
    min-height: 300px;
  }
  
  .welcome-content {
    min-height: auto;
  }
  
  .action-buttons {
    justify-content: center;
    margin-top: 24px;
  }
  
  .welcome-title {
    font-size: 2.2rem;
  }
  
  .welcome-description {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .primary-btn,
  .secondary-btn {
    justify-content: center;
    width: 100%;
  }
}
</style> 