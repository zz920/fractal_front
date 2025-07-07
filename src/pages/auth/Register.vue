<template>
  <div class="register-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>注册</h1>
          <p>创建您的 Fractal 语音助手账户</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              :class="{ 'error': errors.username }"
              placeholder="请输入用户名"
              required
            />
            <span v-if="errors.username" class="error-message">
              {{ errors.username }}
            </span>
          </div>
          
          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              :class="{ 'error': errors.email }"
              placeholder="请输入邮箱地址"
              required
            />
            <span v-if="errors.email" class="error-message">
              {{ errors.email }}
            </span>
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              :class="{ 'error': errors.password }"
              placeholder="请输入密码（8-30位，包含数字和字母）"
              required
            />
            <span v-if="errors.password" class="error-message">
              {{ errors.password }}
            </span>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              :class="{ 'error': errors.confirmPassword }"
              placeholder="请再次输入密码"
              required
            />
            <span v-if="errors.confirmPassword" class="error-message">
              {{ errors.confirmPassword }}
            </span>
          </div>
          
          <div class="form-actions">
            <button
              type="submit"
              class="auth-button primary"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="loading-spinner"></span>
              {{ isLoading ? '注册中...' : '注册' }}
            </button>
          </div>
          
          <div v-if="registerError" class="auth-error">
            {{ registerError }}
          </div>
          
          <div v-if="registerSuccess" class="auth-success">
            {{ registerSuccess }}
          </div>
        </form>
        
        <div class="auth-footer">
          <p>已有账号？ <router-link to="/login">立即登录</router-link></p>
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
    
    // 注册成功信息
    const registerSuccess = ref('')
    
    // 清除错误信息
    const clearErrors = () => {
      errors.username = ''
      errors.email = ''
      errors.password = ''
      errors.confirmPassword = ''
      registerSuccess.value = ''
      userStore.clearErrors()
    }
    
    // 邮箱验证
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }
    
    // 密码强度验证
    const validatePassword = (password) => {
      // 检查长度：8-30位
      if (password.length < 8 || password.length > 30) {
        return false
      }
      
      // 检查是否包含数字和字母
      const hasNumber = /\d/.test(password)
      const hasLetter = /[a-zA-Z]/.test(password)
      
      return hasNumber && hasLetter
    }
    
    // 表单验证
    const validateForm = () => {
      clearErrors()
      let isValid = true
      
      // 用户名验证：3-50位
      if (!formData.username.trim()) {
        errors.username = '请输入用户名'
        isValid = false
      } else if (formData.username.length < 3) {
        errors.username = '用户名至少3个字符'
        isValid = false
      } else if (formData.username.length > 50) {
        errors.username = '用户名不能超过50个字符'
        isValid = false
      }
      
      // 邮箱验证
      if (!formData.email.trim()) {
        errors.email = '请输入邮箱地址'
        isValid = false
      } else if (!validateEmail(formData.email)) {
        errors.email = '请输入有效的邮箱地址'
        isValid = false
      }
      
      // 密码验证：8-30位，数字字母组合
      if (!formData.password.trim()) {
        errors.password = '请输入密码'
        isValid = false
      } else if (!validatePassword(formData.password)) {
        if (formData.password.length < 8) {
          errors.password = '密码至少8个字符'
        } else if (formData.password.length > 30) {
          errors.password = '密码不能超过30个字符'
        } else {
          errors.password = '密码必须包含数字和字母'
        }
        isValid = false
      }
      
      // 确认密码验证
      if (!formData.confirmPassword.trim()) {
        errors.confirmPassword = '请确认密码'
        isValid = false
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = '两次输入的密码不一致'
        isValid = false
      }
      
      return isValid
    }
    
    // 处理注册
    const handleRegister = async () => {
      if (!validateForm()) {
        return
      }
      
      try {
        await userStore.userRegister({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
        
        // 注册成功
        registerSuccess.value = '注册成功！即将跳转到登录页面...'
        
        // 3秒后跳转到登录页面
        setTimeout(() => {
          router.push('/login')
        }, 3000)
        
      } catch (error) {
        console.error('注册失败:', error)
        
        // 处理特定的用户已存在错误
        const errorMessage = error.message || ''
        if (errorMessage.includes('用户已存在') || errorMessage.includes('用户API错误')) {
          // 检查是用户名还是邮箱冲突
          if (errorMessage.includes('用户名') || formData.username) {
            errors.username = '该用户名已被注册，请使用其他用户名'
          }
          if (errorMessage.includes('邮箱') || formData.email) {
            errors.email = '该邮箱已被注册，请使用其他邮箱'
          }
          // 如果不能确定具体冲突字段，显示通用提示
          if (!errors.username && !errors.email) {
            errors.username = '该用户名已被注册'
            errors.email = '该邮箱可能已被注册'
          }
        }
        // 其他错误信息已经在store中处理
      }
    }
    
    return {
      formData,
      errors,
      registerSuccess,
      handleRegister,
      isLoading: userStore.isLoading,
      registerError: userStore.registerError
    }
  }
}
</script>

<style scoped>
.register-page {
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

.auth-success {
  background: #d4edda;
  color: #155724;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.9rem;
  border: 1px solid #c3e6cb;
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
  .register-page {
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