<template>
  <div class="login-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>登录</h1>
          <p>欢迎回到 Fractal 语音助手</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="usernameOrEmail">用户名或邮箱</label>
            <input
              id="usernameOrEmail"
              v-model="formData.usernameOrEmail"
              type="text"
              :class="{ 'error': errors.usernameOrEmail }"
              placeholder="请输入用户名或邮箱"
              required
            />
            <span v-if="errors.usernameOrEmail" class="error-message">
              {{ errors.usernameOrEmail }}
            </span>
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              :class="{ 'error': errors.password }"
              placeholder="请输入密码"
              required
            />
            <span v-if="errors.password" class="error-message">
              {{ errors.password }}
            </span>
          </div>
          
          <div class="form-actions">
            <button
              type="submit"
              class="auth-button primary"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="loading-spinner"></span>
              {{ isLoading ? '登录中...' : '登录' }}
            </button>
          </div>
          
          <div v-if="loginError" class="auth-error">
            {{ loginError }}
          </div>
        </form>
        
        <div class="auth-footer">
          <p>还没有账号？ <router-link to="/register">立即注册</router-link></p>
        </div>
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
    
    // 清除错误信息
    const clearErrors = () => {
      errors.usernameOrEmail = ''
      errors.password = ''
      userStore.clearErrors()
    }
    
    // 表单验证
    const validateForm = () => {
      clearErrors()
      let isValid = true
      
      if (!formData.usernameOrEmail.trim()) {
        errors.usernameOrEmail = '请输入用户名或邮箱'
        isValid = false
      } else if (formData.usernameOrEmail.length < 3) {
        errors.usernameOrEmail = '用户名至少3个字符'
        isValid = false
      }
      
      if (!formData.password.trim()) {
        errors.password = '请输入密码'
        isValid = false
      } else if (formData.password.length < 8) {
        errors.password = '密码至少8个字符'
        isValid = false
      }
      
      return isValid
    }
    
    // 处理登录
    const handleLogin = async () => {
      if (!validateForm()) {
        return
      }
      
      try {
        await userStore.userLogin({
          usernameOrEmail: formData.usernameOrEmail,
          password: formData.password
        })
        
        // 登录成功，跳转到仪表板
        router.push('/dashboard')
      } catch (error) {
        console.error('登录失败:', error)
        // 错误信息已经在store中处理
      }
    }
    
    return {
      formData,
      errors,
      handleLogin,
      isLoading: userStore.isLoading,
      loginError: userStore.loginError
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.auth-container {
  width: 100%;
  max-width: 400px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  padding: 2rem;
  animation: fadeIn 0.5s ease-out;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #6c757d;
  font-size: 0.9rem;
}

.auth-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error {
  border-color: #dc3545;
}

.form-group input.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  margin-top: 2rem;
}

.auth-button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.auth-button.primary {
  background: #667eea;
  color: white;
}

.auth-button.primary:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-error {
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.9rem;
  border: 1px solid #f5c6cb;
}

.auth-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.auth-footer p {
  color: #6c757d;
  font-size: 0.9rem;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  color: #5a6fd8;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
  }
  
  .auth-card {
    padding: 1.5rem;
  }
  
  .auth-header h1 {
    font-size: 1.5rem;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 