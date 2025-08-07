import { createRouter, createWebHistory } from 'vue-router'

// 异步组件加载，带错误处理
const asyncComponent = (componentName) => {
  return () => import(`@/pages/${componentName}.vue`).catch(error => {
    console.error(`❌ 组件加载失败: ${componentName}`, error)
    // 返回一个简单的错误组件
    return Promise.resolve({
      template: `
        <div style="padding: 2rem; text-align: center; color: #666;">
          <h3>页面加载失败</h3>
          <p>抱歉，${componentName} 页面暂时无法加载。</p>
          <p>请刷新页面或稍后重试。</p>
          <button @click="$router.go(-1)" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            返回上一页
          </button>
        </div>
      `
    })
  })
}

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: asyncComponent('Landing')
  },
  {
    path: '/home',
    name: 'Home',
    component: asyncComponent('Home')
  },
  {
    path: '/login',
    name: 'Login',
    component: asyncComponent('Login')
  },
  {
    path: '/register',
    name: 'Register',
    component: asyncComponent('Register')
  },
  {
    path: '/reset',
    name: 'Reset',
    component: asyncComponent('Reset')
  },
  {
    path: '/voice-simulator',
    name: 'VoiceSimulator',
    component: asyncComponent('VoiceSimulator')
  },
  {
    path: '/device-management',
    name: 'DeviceManagement',
    component: asyncComponent('DeviceManagement')
  },
  {
    path: '/voice-settings',
    name: 'VoiceSettings',
    component: asyncComponent('VoiceSettings')
  },
  {
    path: '/mcp-subscription',
    name: 'McpSubscription',
    component: asyncComponent('McpSubscription')
  },
  {
    path: '/mcp-features',
    name: 'McpFeatures',
    component: asyncComponent('McpFeatures')
  },
  {
    path: '/device-binding',
    name: 'DeviceBinding',
    component: asyncComponent('DeviceBinding')
  },
  {
    path: '/server-connection',
    name: 'ServerConnection',
    component: asyncComponent('ServerConnection')
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
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 权限检查通过，继续导航
  next()
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