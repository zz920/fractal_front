<template>
  <div class="overview">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>概览</h1>
      <p>欢迎回到 Fractal 语音助手</p>
    </div>
    
    <!-- 欢迎卡片 -->
    <div class="welcome-section">
      <div class="welcome-card">
        <div class="welcome-content">
          <div class="welcome-text">
            <h2>欢迎回来，{{ user?.user_name || '用户' }}！</h2>
            <p>您可以开始使用 Fractal 语音助手进行智能对话</p>
            <router-link to="/dashboard/voice" class="cta-button">
              开始语音对话
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 功能卡片网格 -->
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9,9H15V15H9M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
          </svg>
        </div>
        <h3>语音模拟</h3>
        <p>体验智能语音交互，与AI进行自然对话</p>
        <router-link to="/dashboard/voice" class="feature-link">
          立即体验 →
        </router-link>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
          </svg>
        </div>
        <h3>实时语音</h3>
        <p>支持实时语音识别和语音合成技术</p>
        <div class="feature-info">
          高质量音频处理
        </div>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
          </svg>
        </div>
        <h3>智能助手</h3>
        <p>基于先进AI技术的智能语音助手</p>
        <div class="feature-info">
          自然语言理解
        </div>
      </div>
    </div>
    
    <!-- 用户信息卡片 -->
    <div class="user-stats">
      <div class="stats-card">
        <h3>账户信息</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">用户名</div>
            <div class="stat-value">{{ user?.user_name || '未设置' }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">邮箱地址</div>
            <div class="stat-value">{{ user?.email || '未设置' }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">注册时间</div>
            <div class="stat-value">{{ formatDate(user?.created_at) }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">最后登录</div>
            <div class="stat-value">{{ formatDate(user?.last_login_at) || '首次登录' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../../stores/user.js'

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
    
    return {
      user: userStore.user,
      formatDate
    }
  }
}
</script>

<style scoped>
.overview {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
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

.welcome-section {
  margin-bottom: 3rem;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 3rem 2rem;
  color: white;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
}

.welcome-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.welcome-text {
  flex: 1;
}

.welcome-text h2 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.welcome-text p {
  font-size: 1.1rem;
  margin: 0 0 2rem 0;
  opacity: 0.9;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.cta-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: white;
}

.feature-icon svg {
  width: 24px;
  height: 24px;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.feature-card p {
  color: #6c757d;
  font-size: 0.95rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.feature-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.feature-link:hover {
  color: #5a6fd8;
}

.feature-info {
  color: #28a745;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  background: rgba(40, 167, 69, 0.1);
  border-radius: 4px;
  display: inline-block;
}

.user-stats {
  margin-bottom: 2rem;
}

.stats-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.stats-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1.5rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
}

.stat-label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  word-break: break-all;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-content {
    flex-direction: column;
    text-align: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .welcome-text h2 {
    font-size: 1.5rem;
  }
}
</style> 