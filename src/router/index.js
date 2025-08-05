import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/views/Landing.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Reset from '@/views/Reset.vue'
import VoiceSimulator from '@/views/VoiceSimulator.vue'
import DeviceManagement from '@/views/DeviceManagement.vue'
import VoiceSettings from '@/views/VoiceSettings.vue'
import McpSubscription from '@/views/McpSubscription.vue'
import DeviceBinding from '@/views/DeviceBinding.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/reset',
    name: 'Reset',
    component: Reset
  },
  {
    path: '/voice-simulator',
    name: 'VoiceSimulator',
    component: VoiceSimulator
  },
  {
    path: '/device-management',
    name: 'DeviceManagement',
    component: DeviceManagement
  },
  {
    path: '/voice-settings',
    name: 'VoiceSettings',
    component: VoiceSettings
  },
  {
    path: '/mcp-subscription',
    name: 'McpSubscription',
    component: McpSubscription
  },
  {
    path: '/device-binding',
    name: 'DeviceBinding',
    component: DeviceBinding
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 