<template>
  <div class="reset-container">
    <div class="reset-card">
      <div class="reset-header">
        <div class="logo-section">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="logo-svg">
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
          <div class="logo-text">
            <h1 class="logo-title">Fractal</h1>
            <p class="logo-subtitle">语音助手</p>
          </div>
        </div>
      </div>
      
      <form class="reset-form" @submit.prevent="handleReset">
        <div class="form-group">
          <label for="email">邮箱地址</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required 
            placeholder="请输入注册时的邮箱地址"
            class="form-input"
          >
        </div>
        
        <button type="submit" class="reset-btn" :disabled="loading">
          <span v-if="!loading">发送重置邮件</span>
          <span v-else>发送中...</span>
        </button>
        
        <div class="login-link">
          <router-link to="/login">返回登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'Reset',
  setup() {
    const loading = ref(false)
    
    const form = reactive({
      email: ''
    })
    
    const handleReset = async () => {
      loading.value = true
      
      try {
        // 模拟发送重置邮件
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert('重置邮件已发送，请检查您的邮箱')
      } catch (error) {
        console.error('发送失败:', error)
        alert('发送失败，请重试')
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      loading,
      handleReset
    }
  }
}
</script>

<style scoped>
.reset-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.reset-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 48px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.reset-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.logo-svg {
  width: 60px;
  height: 60px;
  margin-right: 16px;
}

.logo-title {
  font-family: 'Orbitron', Arial, sans-serif;
  font-size: 2rem;
  font-weight: bold;
  color: #2d1ed6;
  margin: 0;
  font-style: italic;
  letter-spacing: 2px;
}

.logo-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

.reset-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: bold;
  color: #333;
  font-size: 0.9rem;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e3d6f7;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  background: #fff;
}

.form-input:focus {
  outline: none;
  border-color: #6ec6fa;
  box-shadow: 0 0 0 3px rgba(110, 198, 250, 0.1);
}

.reset-btn {
  background: linear-gradient(135deg, #6ec6fa 0%, #4fc3f7 100%);
  color: #fff;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.reset-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(110, 198, 250, 0.3);
}

.reset-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.reset-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.reset-btn:hover::before {
  left: 100%;
}

.login-link {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.login-link a {
  color: #6ec6fa;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.login-link a:hover {
  color: #4fc3f7;
}

@media (max-width: 480px) {
  .reset-card {
    padding: 32px 24px;
  }
  
  .logo-title {
    font-size: 1.5rem;
  }
  
  .logo-svg {
    width: 50px;
    height: 50px;
  }
}
</style> 