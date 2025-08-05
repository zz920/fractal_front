<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
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
      
      <form class="register-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username" 
            required 
            placeholder="请输入用户名"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="email">邮箱地址</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required 
            placeholder="请输入邮箱地址"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            required 
            placeholder="请输入密码"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="form.confirmPassword" 
            required 
            placeholder="请再次输入密码"
            class="form-input"
          >
        </div>
        
        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.agree" required>
            <span class="checkmark"></span>
            我已阅读并同意 <a href="#" class="terms-link">服务条款</a> 和 <a href="#" class="terms-link">隐私政策</a>
          </label>
        </div>
        
        <button type="submit" class="register-btn" :disabled="loading || !form.agree">
          <span v-if="!loading">注册</span>
          <span v-else>注册中...</span>
        </button>
        
        <div class="login-link">
          已有账户？ <router-link to="/login">立即登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const loading = ref(false)
    
    const form = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agree: false
    })
    
    const handleRegister = async () => {
      if (form.password !== form.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }
      
      loading.value = true
      
      try {
        // 模拟注册请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 注册成功，自动登录
        userStore.login({
          username: form.username,
          email: form.email,
          avatar: form.username.charAt(0).toUpperCase()
        })
        
        // 跳转到首页
        router.push('/')
      } catch (error) {
        console.error('注册失败:', error)
        alert('注册失败，请重试')
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      loading,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 48px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.register-header {
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

.register-form {
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

.form-options {
  font-size: 0.9rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  color: #666;
  line-height: 1.4;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #6ec6fa;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #6ec6fa;
  font-weight: bold;
  font-size: 12px;
}

.terms-link {
  color: #6ec6fa;
  text-decoration: none;
  transition: color 0.3s;
}

.terms-link:hover {
  color: #4fc3f7;
}

.register-btn {
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

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(110, 198, 250, 0.3);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.register-btn:hover::before {
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
  .register-card {
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