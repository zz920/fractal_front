<template>
  <div class="reset-page">
    <div class="reset-container">
      <div class="reset-header">
        <div class="reset-logo">
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
          <div class="reset-title">Fractal</div>
          <div class="reset-welcome">重置密码</div>
        </div>
      </div>
      
      <form @submit.prevent="handleReset" class="reset-form">
        <label class="form-label" for="email">邮箱地址</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-input"
          :class="{ 'error': errors.email }"
          placeholder="请输入您的邮箱地址"
          required
        />
        <span v-if="errors.email" class="error-message">
          {{ errors.email }}
        </span>
        
        <button
          type="submit"
          class="reset-btn"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '发送中...' : '发送重置链接' }}
        </button>
        
        <div v-if="resetError" class="reset-error">
          {{ resetError }}
        </div>
        
        <div v-if="resetSuccess" class="reset-success">
          {{ resetSuccess }}
        </div>
      </form>
      
      <div class="reset-footer">
        <p>想起密码了？ <router-link to="/login">立即登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user.js'

export default {
  name: 'ResetPassword',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // 表单数据
    const formData = reactive({
      email: ''
    })
    
    // 表单验证错误
    const errors = reactive({
      email: ''
    })
    
    const isLoading = ref(false)
    const resetError = ref('')
    const resetSuccess = ref('')
    
    // 清除错误信息
    const clearErrors = () => {
      errors.email = ''
      resetError.value = ''
    }
    
    // 表单验证
    const validateForm = () => {
      clearErrors()
      let isValid = true
      
      if (!formData.email.trim()) {
        errors.email = '请输入邮箱地址'
        isValid = false
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
          errors.email = '请输入有效的邮箱地址'
          isValid = false
        }
      }
      
      return isValid
    }
    
    // 处理重置密码
    const handleReset = async () => {
      if (!validateForm()) {
        return
      }
      
      isLoading.value = true
      resetError.value = ''
      resetSuccess.value = ''
      
      try {
        // 调用密码重置API
        await userStore.userResetPassword(formData.email)
        
        resetSuccess.value = '重置链接已发送到您的邮箱，请查收邮件并按照提示重置密码。'
        
        // 3秒后跳转到登录页面
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } catch (error) {
        resetError.value = error.message || '发送重置链接失败，请稍后重试'
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      formData,
      errors,
      isLoading,
      resetError,
      resetSuccess,
      handleReset
    }
  }
}
</script>

<style scoped>
.reset-page {
  margin: 0;
  min-height: 100vh;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  background: radial-gradient(ellipse at 20% 20%, #b6f0fa 0%, #a2d6f7 40%, #3a2d4a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.reset-container {
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

.reset-header {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.reset-logo {
  margin-right: 18px;
}

.reset-logo svg {
  width: 70px;
  height: 70px;
}

.reset-title {
  font-size: 2.3rem;
  font-weight: bold;
  font-family: '优设标题黑', Arial, sans-serif;
  color: #111;
  letter-spacing: 2px;
  margin-right: 10px;
}

.reset-welcome {
  color: #bbb;
  font-size: 1.05rem;
  margin-top: 2px;
  margin-left: 2px;
  font-weight: 400;
}

.reset-form {
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

.reset-btn {
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
  margin-top: 20px;
}

.reset-btn:hover {
  background: #5bb5e9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(110, 198, 250, 0.3);
}

.reset-btn:disabled {
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

.reset-error {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 12px;
  text-align: center;
}

.reset-success {
  color: #2ecc71;
  font-size: 0.9rem;
  margin-top: 12px;
  text-align: center;
}

.reset-footer {
  margin-top: 24px;
  text-align: center;
  color: #666;
}

.reset-footer a {
  color: #3498f7;
  text-decoration: none;
}

.reset-footer a:hover {
  text-decoration: underline;
}
</style> 