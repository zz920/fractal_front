<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="login-logo">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="circleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#b6a6f7"/>
                <stop offset="50%" stop-color="#6ec6fa"/>
                <stop offset="100%" stop-color="#8be6b6"/>
              </linearGradient>
            </defs>
            <path d="M 180 100 A 80 80 0 1 1 20 100" fill="none" stroke="url(#circleGradient)" stroke-width="16" stroke-linecap="round"/>
            <rect x="92" y="18" width="16" height="18" rx="3" fill="#fff"/>
            <text x="100" y="120" text-anchor="middle" font-family="优设标题黑, Arial, sans-serif" font-size="32" font-weight="bold" fill="#111" font-style="italic" letter-spacing="4">FRACTAL</text>
          </svg>
        </div>
        <div>
          <div class="login-title">Fractal</div>
          <div class="login-welcome">欢迎回到语音助手</div>
        </div>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <label class="form-label" for="usernameOrEmail">用户名或邮箱</label>
        <input
          id="usernameOrEmail"
          v-model="formData.usernameOrEmail"
          type="text"
          class="form-input"
          :class="{ 'error': errors.usernameOrEmail }"
          placeholder="请输入用户名或邮箱"
          required
        />
        <span v-if="errors.usernameOrEmail" class="error-message">
          {{ errors.usernameOrEmail }}
        </span>
        
        <label class="form-label" for="password">密码</label>
        <input
          id="password"
          v-model="formData.password"
          type="password"
          class="form-input"
          :class="{ 'error': errors.password }"
          placeholder="请输入密码"
          required
        />
        <span v-if="errors.password" class="error-message">
          {{ errors.password }}
        </span>
        
        <div class="forgot-link">
          <router-link to="/reset">忘记密码？</router-link>
        </div>
        
        <button
          type="submit"
          class="login-btn"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
        
        <div v-if="loginError" class="login-error">
          {{ loginError }}
        </div>
      </form>
      
      <div class="login-footer">
        <p>还没有账号？ <router-link to="/register">立即注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user.js'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // 表单数据
    const formData = reactive({
      usernameOrEmail: '',
      password: ''
    })
    
    // 表单验证错误
    const errors = reactive({
      usernameOrEmail: '',
      password: ''
    })
    
    const isLoading = ref(false)
    const loginError = ref('')
    
    // 清除错误信息
    const clearErrors = () => {
      errors.usernameOrEmail = ''
      errors.password = ''
      loginError.value = ''
    }
    
    // 表单验证
    const validateForm = () => {
      clearErrors()
      let isValid = true
      
      if (!formData.usernameOrEmail.trim()) {
        errors.usernameOrEmail = '请输入用户名或邮箱'
        isValid = false
      }
      
      if (!formData.password.trim()) {
        errors.password = '请输入密码'
        isValid = false
      }
      
      return isValid
    }
    
    // 处理登录
    const handleLogin = async () => {
      if (!validateForm()) {
        return
      }
      
      isLoading.value = true
      loginError.value = ''
      
      try {
        await userStore.userLogin({
          usernameOrEmail: formData.usernameOrEmail,
          password: formData.password
        })
        router.push('/dashboard')
      } catch (error) {
        loginError.value = error.message || '登录失败，请检查用户名和密码'
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      formData,
      errors,
      isLoading,
      loginError,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-page {
  margin: 0;
  min-height: 100vh;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  background: radial-gradient(ellipse at 20% 20%, #b6f0fa 0%, #a2d6f7 40%, #3a2d4a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 32px #b6b6e6;
  width: 600px;
  max-width: 95vw;
  padding: 48px 48px 32px 48px;
  margin: 60px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-header {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.login-logo {
  margin-right: 18px;
}

.login-logo svg {
  width: 70px;
  height: 70px;
}

.login-title {
  font-size: 2.3rem;
  font-weight: bold;
  font-family: '优设标题黑', Arial, sans-serif;
  color: #111;
  letter-spacing: 2px;
  margin-right: 10px;
}

.login-welcome {
  color: #bbb;
  font-size: 1.05rem;
  margin-top: 2px;
  margin-left: 2px;
  font-weight: 400;
}

.login-form {
  width: 100%;
  margin-top: 18px;
}

.form-label {
  font-size: 1.13rem;
  font-weight: bold;
  margin-bottom: 6px;
  margin-top: 18px;
  display: block;
}

.form-input {
  width: 100%;
  height: 44px;
  border: 2px solid #bbb;
  border-radius: 10px;
  font-size: 1.15rem;
  padding: 0 14px;
  margin-bottom: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #6ec6fa;
}

.form-input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 4px;
  display: block;
}

.forgot-link {
  color: #3498f7;
  font-size: 1rem;
  text-decoration: underline;
  margin-bottom: 18px;
  display: inline-block;
}

.login-btn {
  width: 220px;
  height: 44px;
  background: #6ec6fa;
  color: #222;
  font-size: 1.18rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn:hover {
  background: #5bb5e9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(110, 198, 250, 0.3);
}

.login-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-error {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 12px;
  text-align: center;
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  color: #666;
}

.login-footer a {
  color: #3498f7;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style> 