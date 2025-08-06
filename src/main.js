import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)

// 配置Pinia状态管理
app.use(createPinia())

// 配置Vue Router
app.use(router)

// 挂载应用
app.mount('#app') 