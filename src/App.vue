<template>
  <div id="app">
    <!-- 着陆页和登录相关页面不显示侧边栏 -->
    <div v-if="showSidebar" class="container">
      <Sidebar />
      <div class="main-content">
        <router-view />
      </div>
    </div>
    
    <!-- 着陆页和登录相关页面直接显示内容 -->
    <div v-else>
      <router-view />
    </div>
    
    <SettingsModal />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import SettingsModal from '@/components/SettingsModal.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    SettingsModal
  },
  setup() {
    const route = useRoute()
    
    // 定义不需要侧边栏的页面
    const noSidebarRoutes = ['/', '/login', '/register', '/reset']
    
    const showSidebar = computed(() => {
      return !noSidebarRoutes.includes(route.path)
    })
    
    return {
      showSidebar
    }
  }
}
</script>

<style>
#app {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  min-height: 100vh;
  background: rgb(238, 235, 245);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 280px; /* 为侧边栏留出空间 */
  padding: 2rem;
  overflow-y: auto;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
}
</style> 