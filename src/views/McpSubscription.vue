<template>
  <div class="mcp-subscription">
    <div class="page-header">
      <h1>MCP订阅</h1>
      <p>管理您的MCP服务订阅</p>
    </div>
    
    <div class="subscription-content">
      <div class="subscription-card">
        <h2>当前订阅</h2>
        <div class="current-plan">
          <div class="plan-info">
            <h3>{{ currentPlan.name }}</h3>
            <p class="plan-description">{{ currentPlan.description }}</p>
            <div class="plan-features">
              <div v-for="feature in currentPlan.features" :key="feature" class="feature-item">
                <i class="fa-solid fa-check"></i>
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>
          <div class="plan-price">
            <div class="price">¥{{ currentPlan.price }}/月</div>
            <div class="next-billing">下次扣费: {{ currentPlan.nextBilling }}</div>
          </div>
        </div>
      </div>
      
      <div class="subscription-card">
        <h2>升级计划</h2>
        <div class="plans-grid">
          <div 
            v-for="plan in availablePlans" 
            :key="plan.id"
            class="plan-card"
            :class="{ 'current': plan.id === currentPlan.id }"
          >
            <div class="plan-header">
              <h3>{{ plan.name }}</h3>
              <div class="plan-price">¥{{ plan.price }}/月</div>
            </div>
            <div class="plan-features">
              <div v-for="feature in plan.features" :key="feature" class="feature-item">
                <i class="fa-solid fa-check"></i>
                <span>{{ feature }}</span>
              </div>
            </div>
            <button 
              class="btn btn-primary"
              :disabled="plan.id === currentPlan.id"
              @click="upgradePlan(plan)"
            >
              {{ plan.id === currentPlan.id ? '当前计划' : '升级到此计划' }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="subscription-card">
        <h2>订阅管理</h2>
        <div class="management-actions">
          <button class="btn btn-secondary" @click="cancelSubscription">
            取消订阅
          </button>
          <button class="btn btn-secondary" @click="updatePayment">
            更新支付方式
          </button>
          <button class="btn btn-secondary" @click="viewBillingHistory">
            查看账单历史
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'McpSubscription',
  setup() {
    const currentPlan = reactive({
      id: 'pro',
      name: '专业版',
      description: '适合个人用户的完整功能套餐',
      price: 99,
      nextBilling: '2024-02-15',
      features: [
        '无限语音合成',
        '高级音色选择',
        '优先技术支持',
        'API访问权限'
      ]
    })
    
    const availablePlans = reactive([
      {
        id: 'basic',
        name: '基础版',
        price: 29,
        features: [
          '每月1000次语音合成',
          '基础音色',
          '邮件支持'
        ]
      },
      {
        id: 'pro',
        name: '专业版',
        price: 99,
        features: [
          '无限语音合成',
          '高级音色选择',
          '优先技术支持',
          'API访问权限'
        ]
      },
      {
        id: 'enterprise',
        name: '企业版',
        price: 299,
        features: [
          '无限语音合成',
          '所有音色',
          '专属技术支持',
          '完整API权限',
          '自定义音色训练'
        ]
      }
    ])
    
    const upgradePlan = (plan) => {
      console.log('升级到计划:', plan.name)
      alert(`确认升级到${plan.name}？`)
    }
    
    const cancelSubscription = () => {
      alert('确认取消订阅？')
    }
    
    const updatePayment = () => {
      alert('跳转到支付方式更新页面')
    }
    
    const viewBillingHistory = () => {
      alert('跳转到账单历史页面')
    }
    
    return {
      currentPlan,
      availablePlans,
      upgradePlan,
      cancelSubscription,
      updatePayment,
      viewBillingHistory
    }
  }
}
</script>

<style scoped>
.mcp-subscription {
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2d1ed6;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.subscription-content {
  max-width: 1200px;
}

.subscription-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid #e3d6f7;
}

.subscription-card h2 {
  color: #2d1ed6;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.current-plan {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #e3d6f7 0%, #f0f8ff 100%);
  border-radius: 12px;
  border: 2px solid #6ec6fa;
}

.plan-info h3 {
  color: #2d1ed6;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.plan-description {
  color: #666;
  margin-bottom: 1rem;
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
}

.feature-item i {
  color: #6ec6fa;
}

.plan-price {
  text-align: right;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #2d1ed6;
}

.next-billing {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.plan-card {
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.plan-card:hover {
  border-color: #6ec6fa;
  transform: translateY(-2px);
}

.plan-card.current {
  border-color: #6ec6fa;
  background: linear-gradient(135deg, #f0f8ff 0%, #e3d6f7 100%);
}

.plan-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.plan-header h3 {
  color: #2d1ed6;
  margin-bottom: 0.5rem;
}

.plan-header .plan-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d1ed6;
}

.management-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #6ec6fa 0%, #4bb6e6 100%);
  color: white;
  width: 100%;
  margin-top: 1rem;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(110, 198, 250, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #666;
  border: 2px solid #e1e5e9;
}

.btn-secondary:hover {
  background: #f8f9fa;
  border-color: #6ec6fa;
}

@media (max-width: 768px) {
  .current-plan {
    flex-direction: column;
    text-align: center;
  }
  
  .plans-grid {
    grid-template-columns: 1fr;
  }
}
</style> 