<template>
  <div class="mcp-subscription">
    <div class="page-header">
      <h1>MCP订阅服务</h1>
      <p>管理和配置MCP服务订阅</p>
    </div>
    
    <div class="subscription-content">
      <!-- 当前订阅状态 -->
      <div class="subscription-status">
        <h2>当前订阅状态</h2>
        <div class="status-card">
          <div class="status-indicator" :class="{ active: isSubscribed }">
            <i :class="isSubscribed ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
          </div>
          <div class="status-info">
            <h3>{{ isSubscribed ? '已订阅' : '未订阅' }}</h3>
            <p>{{ isSubscribed ? '您已成功订阅MCP服务' : '请选择订阅计划以启用MCP服务' }}</p>
          </div>
        </div>
      </div>
      
      <!-- 订阅计划 -->
      <div class="subscription-plans">
        <h2>订阅计划</h2>
        <div class="plans-grid">
          <div class="plan-card" :class="{ selected: selectedPlan === 'basic' }" @click="selectPlan('basic')">
            <div class="plan-header">
              <h3>基础版</h3>
              <div class="plan-price">
                <span class="price">¥99</span>
                <span class="period">/月</span>
              </div>
            </div>
            <ul class="plan-features">
              <li><i class="fas fa-check"></i> MCP协调器</li>
              <li><i class="fas fa-check"></i> DeepSeek-V3 AI对话</li>
              <li><i class="fas fa-check"></i> 基础意图识别</li>
              <li><i class="fas fa-check"></i> 简单上下文管理</li>
            </ul>
            <button class="plan-btn" @click="subscribe('basic')">
              选择基础版
            </button>
          </div>
          
          <div class="plan-card featured" :class="{ selected: selectedPlan === 'pro' }" @click="selectPlan('pro')">
            <div class="plan-badge">推荐</div>
            <div class="plan-header">
              <h3>专业版</h3>
              <div class="plan-price">
                <span class="price">¥199</span>
                <span class="period">/月</span>
              </div>
            </div>
            <ul class="plan-features">
              <li><i class="fas fa-check"></i> 所有基础版功能</li>
              <li><i class="fas fa-check"></i> 浏览器自动化</li>
              <li><i class="fas fa-check"></i> 高级意图识别</li>
              <li><i class="fas fa-check"></i> 完整上下文管理</li>
              <li><i class="fas fa-check"></i> 优先技术支持</li>
            </ul>
            <button class="plan-btn featured" @click="subscribe('pro')">
              选择专业版
            </button>
          </div>
          
          <div class="plan-card" :class="{ selected: selectedPlan === 'enterprise' }" @click="selectPlan('enterprise')">
            <div class="plan-header">
              <h3>企业版</h3>
              <div class="plan-price">
                <span class="price">¥399</span>
                <span class="period">/月</span>
              </div>
            </div>
            <ul class="plan-features">
              <li><i class="fas fa-check"></i> 所有专业版功能</li>
              <li><i class="fas fa-check"></i> 自定义模型训练</li>
              <li><i class="fas fa-check"></i> 高级API访问</li>
              <li><i class="fas fa-check"></i> 专属技术支持</li>
              <li><i class="fas fa-check"></i> SLA保障</li>
            </ul>
            <button class="plan-btn" @click="subscribe('enterprise')">
              选择企业版
            </button>
          </div>
        </div>
      </div>
      
      <!-- 服务配置 -->
      <div class="service-config">
        <h2>服务配置</h2>
        <div class="config-card">
          <div class="config-item">
            <label>API密钥</label>
            <input type="password" v-model="apiKey" placeholder="请输入API密钥" />
          </div>
          <div class="config-item">
            <label>服务器地址</label>
            <input type="text" v-model="serverUrl" placeholder="https://fractal.cpolar.cn:443" />
          </div>
          <div class="config-item">
            <label>模型配置</label>
            <select v-model="selectedModel">
              <option value="deepseek-v3">DeepSeek-V3</option>
              <option value="deepseek-chat">DeepSeek-Chat</option>
              <option value="gpt-4">GPT-4</option>
            </select>
          </div>
          <button class="save-btn" @click="saveConfig">
            保存配置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'McpSubscription',
  setup() {
    const isSubscribed = ref(false)
    const selectedPlan = ref('pro')
    const apiKey = ref('')
    const serverUrl = ref('https://fractal.cpolar.cn:443')
    const selectedModel = ref('deepseek-v3')
    
    const selectPlan = (plan) => {
      selectedPlan.value = plan
    }
    
    const subscribe = (plan) => {
      console.log(`订阅计划: ${plan}`)
      isSubscribed.value = true
      // 这里可以添加实际的订阅逻辑
    }
    
    const saveConfig = () => {
      console.log('保存配置:', {
        apiKey: apiKey.value,
        serverUrl: serverUrl.value,
        selectedModel: selectedModel.value
      })
      // 这里可以添加保存配置的逻辑
    }
    
    return {
      isSubscribed,
      selectedPlan,
      apiKey,
      serverUrl,
      selectedModel,
      selectPlan,
      subscribe,
      saveConfig
    }
  }
}
</script>

<style scoped>
.mcp-subscription {
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

.subscription-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.subscription-status {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.subscription-status h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-indicator {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
}

.status-indicator.active {
  background: #28a745;
}

.status-indicator i {
  font-size: 1.5rem;
  color: white;
}

.status-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.status-info p {
  margin: 0;
  color: #666;
}

.subscription-plans h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.plan-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.plan-card.selected {
  border: 2px solid #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.plan-card.featured {
  border: 2px solid #667eea;
}

.plan-badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: #667eea;
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.plan-header {
  text-align: center;
  margin-bottom: 2rem;
}

.plan-header h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
}

.price {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
}

.period {
  font-size: 1rem;
  color: #666;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  color: #666;
}

.plan-features i {
  color: #28a745;
  width: 16px;
}

.plan-btn {
  width: 100%;
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.plan-btn:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.plan-btn.featured {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.service-config h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.config-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.config-item {
  margin-bottom: 1.5rem;
}

.config-item label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.config-item input,
.config-item select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.config-item input:focus,
.config-item select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .mcp-subscription {
    padding: 1rem;
  }
  
  .plans-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
}
</style>
