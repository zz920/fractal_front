import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user.js'

// 页面组件导入
const Landing = () => import('../pages/Landing.vue')
const Login = () => import('../pages/auth/Login.vue')
const Register = () => import('../pages/auth/Register.vue')
const ResetPassword = () => import('../pages/auth/ResetPassword.vue')
const Dashboard = () => import('../pages/dashboard/Dashboard.vue')
const Overview = () => import('../pages/dashboard/Overview.vue')
const VoiceSimulator = () => import('../pages/dashboard/VoiceSimulator.vue')
const Device = () => import('../pages/dashboard/Device.vue')
const VoiceConfig = () => import('../pages/dashboard/VoiceConfig.vue')

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
    meta: {
      title: 'Fractal - 智能语音助手',
      requiresGuest: false // 任何人都可以访问
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录 - Fractal语音助手',
      requiresGuest: true // 需要未登录状态
    }
  },
  {
    path: '/register', 
    name: 'Register',
    component: Register,
    meta: {
      title: '注册 - Fractal语音助手',
      requiresGuest: true // 需要未登录状态
    }
  },
  {
    path: '/reset',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: {
      title: '重置密码 - Fractal语音助手',
      requiresGuest: true // 需要未登录状态
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: '控制台 - Fractal语音助手',
      requiresAuth: true // 需要登录状态
    },
    children: [
      {
        path: '',
        redirect: '/dashboard/overview'
      },
      {
        path: 'overview',
        name: 'Overview',
        component: Overview,
        meta: {
          title: '概览 - Fractal语音助手',
          requiresAuth: true
        }
      },
              {
          path: 'voice',
          name: 'VoiceSimulator', 
          component: VoiceSimulator,
          meta: {
            title: '语音模拟器 - Fractal语音助手',
            requiresAuth: true
          }
        },
        {
          path: 'device',
          name: 'Device',
          component: Device,
          meta: {
            title: '设备管理 - Fractal语音助手',
            requiresAuth: true
          }
        },
        {
          path: 'voice-config',
          name: 'VoiceConfig',
          component: VoiceConfig,
          meta: {
            title: '音色配置 - Fractal语音助手',
            requiresAuth: true
          }
        }
    ]
  },
  {
    // 404页面处理
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

// 创建路由器实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 页面切换时滚动到顶部
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 初始化用户状态（仅在首次加载时）
  if (!userStore.user && userStore.token) {
    try {
      await userStore.initUserState()
    } catch (error) {
      console.error('初始化用户状态失败:', error)
      // 如果初始化失败，清除认证数据
      userStore.clearAuthData()
    }
  }
  
  // 检查路由权限
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const isAuthenticated = userStore.isAuthenticated
  
  if (requiresAuth && !isAuthenticated) {
    // 需要登录但未登录，跳转到登录页面
    next('/login')
  } else if (requiresGuest && isAuthenticated) {
    // 需要未登录状态但已登录，跳转到Dashboard
    next('/dashboard')
  } else {
    // 权限检查通过，继续导航
    next()
  }
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 可以在这里添加页面切换后的逻辑
  console.log(`导航完成: ${from.path} -> ${to.path}`)
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  // 可以在这里添加错误处理逻辑
})

export default router 