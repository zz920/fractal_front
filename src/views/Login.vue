<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
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
      
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名或邮箱</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username" 
            required 
            placeholder="请输入用户名或邮箱地址"
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
        
        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.remember">
            <span class="checkmark"></span>
            记住我
          </label>
          <router-link to="/reset" class="forgot-link">忘记密码？</router-link>
        </div>
        
        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="!loading">登录</span>
          <span v-else>登录中...</span>
        </button>
        
        <div class="register-link">
          还没有账户？ <router-link to="/register">立即注册</router-link>
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
  name: 'Login',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const loading = ref(false)
    
    const form = reactive({
      username: '',
      password: '',
      remember: false
    })
    
    const handleLogin = async () => {
      loading.value = true
      
      try {
        // 模拟登录请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 判断输入的是用户名还是邮箱
        const isEmail = form.username.includes('@')
        const email = isEmail ? form.username : `${form.username}@example.com`
        const username = isEmail ? form.username.split('@')[0] : form.username
        
        // 登录成功
        userStore.login({
          username: username,
          email: email,
          avatar: username.charAt(0).toUpperCase()
        })
        
        // 跳转到首页
        router.push('/home')
      } catch (error) {
        console.error('登录失败:', error)
        alert('登录失败，请重试')
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 48px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  backdrop-filter: blur(10px);
}

.login-header {
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
  width: 80px;
  height: 80px;
  margin-right: 16px;
}

.logo-text {
  text-align: left;
}

.logo-title {
  font-family: 'Orbitron', Arial, sans-serif;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2d1ed6;
  margin: 0 0 4px 0;
  letter-spacing: 2px;
}

.logo-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
  font-weight: 500;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.form-input {
  padding: 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #6ec6fa;
  box-shadow: 0 0 0 3px rgba(110, 198, 250, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #6ec6fa;
}

.forgot-link {
  font-size: 0.9rem;
  color: #6ec6fa;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #4bb6e6;
}

.login-btn {
  background: linear-gradient(135deg, #6ec6fa 0%, #4bb6e6 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(110, 198, 250, 0.3);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  margin-top: 16px;
}

.register-link a {
  color: #6ec6fa;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-link a:hover {
  color: #4bb6e6;
}

@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
  }
  
  .logo-title {
    font-size: 2rem;
  }
  
  .logo-subtitle {
    font-size: 1rem;
  }
}
</style> 