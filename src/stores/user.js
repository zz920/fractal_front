import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userInfo: {
      username: 'User name',
      email: 'e-mail.address@163.com',
      avatar: 'U'
    },
    settings: {
      notifications: true,
      sound: true,
      autoSave: true,
      darkMode: false,
      language: 'zh',
      theme: 'light'
    }
  }),

  getters: {
    getUserInfo: (state) => state.userInfo,
    getSettings: (state) => state.settings,
    isAuthenticated: (state) => state.isLoggedIn
  },

  actions: {
    login(userData) {
      this.isLoggedIn = true
      this.userInfo = { ...this.userInfo, ...userData }
      localStorage.setItem('userToken', 'user-token')
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    },

    logout() {
      this.isLoggedIn = false
      this.userInfo = {
        username: 'User name',
        email: 'e-mail.address@163.com',
        avatar: 'U'
      }
      localStorage.removeItem('userToken')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userInfo')
    },

    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings }
      localStorage.setItem('userSettings', JSON.stringify(this.settings))
    },

    updateUserInfo(newInfo) {
      this.userInfo = { ...this.userInfo, ...newInfo }
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    },

    initializeFromStorage() {
      const storedUserInfo = localStorage.getItem('userInfo')
      const storedSettings = localStorage.getItem('userSettings')
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

      if (storedUserInfo) {
        this.userInfo = JSON.parse(storedUserInfo)
      }
      if (storedSettings) {
        this.settings = JSON.parse(storedSettings)
      }
      this.isLoggedIn = isLoggedIn
    }
  }
}) 