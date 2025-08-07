<template>
  <div class="mcp-features">
    <div class="page-header">
      <h1>MCP功能</h1>
      <p>多服务协调平台功能展示</p>
    </div>
    
    <div class="features-grid">
      <!-- MCP协调器 -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-cogs"></i>
        </div>
        <h3>MCP协调器</h3>
        <p>智能消息路由和意图分析，协调多个服务</p>
        <button @click="openMcpCoordinator" class="feature-btn">
          打开协调器
        </button>
      </div>
      
      <!-- DeepSeek-V3 AI -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-brain"></i>
        </div>
        <h3>DeepSeek-V3 AI</h3>
        <p>强大的语言模型，支持智能对话和上下文管理</p>
        <button @click="openDeepSeekDialog" class="feature-btn">
          开始对话
        </button>
      </div>
      
      <!-- 浏览器自动化 -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-globe"></i>
        </div>
        <h3>浏览器自动化</h3>
        <p>智能网页操作和内容提取</p>
        <button @click="openBrowserAutomation" class="feature-btn">
          开始自动化
        </button>
      </div>
      
      <!-- 导航服务 -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-route"></i>
        </div>
        <h3>导航服务</h3>
        <p>智能页面导航和路由管理</p>
        <button @click="openNavigationService" class="feature-btn">
          导航管理
        </button>
      </div>
      
      <!-- 意图识别 -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-search"></i>
        </div>
        <h3>意图识别</h3>
        <p>智能理解用户意图和需求</p>
        <button @click="openIntentRecognition" class="feature-btn">
          意图分析
        </button>
      </div>
      
      <!-- 上下文管理 -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-layer-group"></i>
        </div>
        <h3>上下文管理</h3>
        <p>智能维护对话历史和上下文</p>
        <button @click="openContextManagement" class="feature-btn">
          上下文管理
        </button>
      </div>
    </div>
    
    <!-- MCP对话框 -->
    <DeepSeekDialog v-if="showDeepSeekDialog" @close="showDeepSeekDialog = false" />
  </div>
</template>

<script>
import { ref } from 'vue'
import DeepSeekDialog from '../components/DeepSeekDialog.vue'

export default {
  name: 'McpFeatures',
  components: {
    DeepSeekDialog
  },
  setup() {
    const showDeepSeekDialog = ref(false)
    
    const openMcpCoordinator = () => {
      console.log('打开MCP协调器')
      // 这里可以添加打开MCP协调器的逻辑
    }
    
    const openDeepSeekDialog = () => {
      showDeepSeekDialog.value = true
    }
    
    const openBrowserAutomation = () => {
      console.log('打开浏览器自动化')
      // 这里可以添加浏览器自动化的逻辑
    }
    
    const openNavigationService = () => {
      console.log('打开导航服务')
      // 这里可以添加导航服务的逻辑
    }
    
    const openIntentRecognition = () => {
      console.log('打开意图识别')
      // 这里可以添加意图识别的逻辑
    }
    
    const openContextManagement = () => {
      console.log('打开上下文管理')
      // 这里可以添加上下文管理的逻辑
    }
    
    return {
      showDeepSeekDialog,
      openMcpCoordinator,
      openDeepSeekDialog,
      openBrowserAutomation,
      openNavigationService,
      openIntentRecognition,
      openContextManagement
    }
  }
}
</script>

<style scoped>
.mcp-features {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-header p {
  font-size: 1.1rem;
  color: #666;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.feature-icon i {
  font-size: 2rem;
  color: white;
}

.feature-card h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.feature-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .mcp-features {
    padding: 1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
}
</style>
