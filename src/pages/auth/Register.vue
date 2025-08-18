<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <div class="register-logo">
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
          <div class="register-title">Fractal</div>
          <div class="register-welcome">创建您的语音助手账户</div>
        </div>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label class="form-label" for="username">用户名</label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            class="form-input"
            :class="{ 'error': errors.username, 'success': successFields.username }"
            placeholder="请输入用户名"
            required
          />
          <div class="input-status">
            <span v-if="errors.username" class="error-status">
              <i class="fas fa-times"></i>{{ errors.username }}
            </span>
            <span v-else-if="successFields.username" class="success-status">
              <i class="fas fa-check"></i>用户名可用
            </span>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="email">邮箱</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="form-input"
            :class="{ 'error': errors.email, 'success': successFields.email }"
            placeholder="请输入邮箱地址"
            required
          />
          <div class="input-status">
            <span v-if="errors.email" class="error-status">
              <i class="fas fa-times"></i>{{ errors.email }}
            </span>
            <span v-else-if="successFields.email" class="success-status">
              <i class="fas fa-check"></i>邮箱格式正确
            </span>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="password">密码</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            class="form-input"
            :class="{ 'error': errors.password, 'success': successFields.password }"
            placeholder="请输入密码（8-30位，包含数字和字母）"
            required
          />
          <div class="input-status">
            <span v-if="errors.password" class="error-status">
              <i class="fas fa-times"></i>{{ errors.password }}
            </span>
            <span v-else-if="successFields.password" class="success-status">
              <i class="fas fa-check"></i>密码强度良好
            </span>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="confirmPassword">确认密码</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            class="form-input"
            :class="{ 'error': errors.confirmPassword, 'success': successFields.confirmPassword }"
            placeholder="请再次输入密码"
            required
          />
          <div class="input-status">
            <span v-if="errors.confirmPassword" class="error-status">
              <i class="fas fa-times"></i>{{ errors.confirmPassword }}
            </span>
            <span v-else-if="successFields.confirmPassword" class="success-status">
              <i class="fas fa-check"></i>密码匹配
            </span>
          </div>
        </div>
        
        <button
          type="submit"
          class="register-btn"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '注册中...' : '注册' }}
        </button>
        
        <div v-if="registerError" class="register-error">
          {{ registerError }}
        </div>
        
        <div v-if="registerSuccess" class="register-success">
          {{ registerSuccess }}
        </div>
      </form>
      
      <div class="register-footer">
        <p>已有账号？ <router-link to="/login">立即登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user.js'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // 表单数据
    const formData = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    
    // 表单验证错误
    const errors = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    
    // 成功状态
    const successFields = reactive({
      username: false,
      email: false,
      password: false,
      confirmPassword: false
    })
    
    const isLoading = ref(false)
    const registerError = ref('')
    const registerSuccess = ref('')
    
    // 清除错误信息
    const clearErrors = () => {
      errors.username = ''
      errors.email = ''
      errors.password = ''
      errors.confirmPassword = ''
      registerError.value = ''
    }
    
    // 验证用户名
    const validateUsername = (username) => {
      if (!username.trim()) {
        errors.username = '请输入用户名'
        successFields.username = false
        return false
      } else if (username.length < 3) {
        errors.username = '用户名至少3个字符'
        successFields.username = false
        return false
      } else if (username.length > 20) {
        errors.username = '用户名不能超过20个字符'
        successFields.username = false
        return false
      } else {
        errors.username = ''
        successFields.username = true
        return true
      }
    }
    
    // 验证邮箱
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email.trim()) {
        errors.email = '请输入邮箱'
        successFields.email = false
        return false
      } else if (!emailRegex.test(email)) {
        errors.email = '请输入有效的邮箱地址'
        successFields.email = false
        return false
      } else {
        errors.email = ''
        successFields.email = true
        return true
      }
    }
    
    // 验证密码
    const validatePassword = (password) => {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/
      if (!password.trim()) {
        errors.password = '请输入密码'
        successFields.password = false
        return false
      } else if (password.length < 8) {
        errors.password = '密码至少8个字符'
        successFields.password = false
        return false
      } else if (password.length > 30) {
        errors.password = '密码不能超过30个字符'
        successFields.password = false
        return false
      } else if (!passwordRegex.test(password)) {
        errors.password = '密码必须包含数字和字母'
        successFields.password = false
        return false
      } else {
        errors.password = ''
        successFields.password = true
        return true
      }
    }
    
    // 验证确认密码
    const validateConfirmPassword = (confirmPassword) => {
      if (!confirmPassword.trim()) {
        errors.confirmPassword = '请确认密码'
        successFields.confirmPassword = false
        return false
      } else if (confirmPassword !== formData.password) {
        errors.confirmPassword = '两次输入的密码不一致'
        successFields.confirmPassword = false
        return false
      } else {
        errors.confirmPassword = ''
        successFields.confirmPassword = true
        return true
      }
    }
    
    // 表单验证
    const validateForm = () => {
      clearErrors()
      let isValid = true
      
      isValid = validateUsername(formData.username) && isValid
      isValid = validateEmail(formData.email) && isValid
      isValid = validatePassword(formData.password) && isValid
      isValid = validateConfirmPassword(formData.confirmPassword) && isValid
      
      return isValid
    }
    
    // 处理注册
    const handleRegister = async () => {
      if (!validateForm()) {
        return
      }
      
      isLoading.value = true
      registerError.value = ''
      registerSuccess.value = ''
      
      try {
        await userStore.userRegister({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
        
        registerSuccess.value = '注册成功！正在跳转到登录页面...'
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } catch (error) {
        registerError.value = error.message || '注册失败，请稍后重试'
      } finally {
        isLoading.value = false
      }
    }
    
    // 监听表单字段变化
    watch(() => formData.username, validateUsername)
    watch(() => formData.email, validateEmail)
    watch(() => formData.password, validatePassword)
    watch(() => formData.confirmPassword, validateConfirmPassword)
    
    return {
      formData,
      errors,
      successFields,
      isLoading,
      registerError,
      registerSuccess,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-page {
  margin: 0;
  min-height: 100vh;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  background: radial-gradient(ellipse at 20% 20%, #b6f0fa 0%, #a2d6f7 40%, #3a2d4a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-container {
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

.register-header {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.register-logo {
  margin-right: 18px;
}

.register-logo svg {
  width: 70px;
  height: 70px;
}

.register-title {
  font-size: 2.6rem;
  font-weight: bold;
  font-family: '优设标题黑', Arial, sans-serif;
  color: #111;
  letter-spacing: 2px;
  margin-right: 18px;
}

.register-welcome {
  color: #bbb;
  font-size: 1.05rem;
  margin-top: 2px;
  margin-left: 2px;
  font-weight: 400;
}

.register-form {
  width: 100%;
  margin-top: 38px;
}

.form-group {
  margin-bottom: 28px;
}

.form-label {
  font-size: 1.18rem;
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
}

.form-input {
  width: 100%;
  height: 44px;
  border: 2px solid #bbb;
  border-radius: 10px;
  font-size: 1.15rem;
  padding: 0 14px;
  outline: none;
  transition: border-color 0.2s;
  margin-bottom: 0;
}

.form-input:focus {
  border-color: #6ec6fa;
}

.form-input.error {
  border-color: #e74c3c;
}

.form-input.success {
  border-color: #2ecc71;
}

.input-status {
  display: flex;
  align-items: center;
  font-size: 1rem;
  margin-top: 4px;
  min-height: 22px;
}

.input-status i {
  margin-right: 6px;
}

.error-status {
  color: #e74c3c;
}

.success-status {
  color: #2ecc71;
}

.register-btn {
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

.register-btn:hover {
  background: #5bb5e9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(110, 198, 250, 0.3);
}

.register-btn:disabled {
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

.register-error {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 12px;
  text-align: center;
}

.register-success {
  color: #2ecc71;
  font-size: 0.9rem;
  margin-top: 12px;
  text-align: center;
}

.register-footer {
  margin-top: 24px;
  text-align: center;
  color: #666;
}

.register-footer a {
  color: #3498f7;
  text-decoration: none;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style> 