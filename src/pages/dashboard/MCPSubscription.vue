<template>
  <div class="mcp-subscription">
    <div class="subscription-content">
      <div class="subscription-card">
        <h2>当前订阅状态</h2>
        <div class="status-info">
          <div class="status-badge" :class="subscriptionStatus">
            {{ getStatusText() }}
          </div>
          <p class="status-description">{{ getStatusDescription() }}</p>
        </div>
        
        <div class="subscription-details">
          <div class="detail-item">
            <span class="detail-label">订阅计划:</span>
            <span class="detail-value">{{ subscription.plan }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">到期时间:</span>
            <span class="detail-value">{{ formatDate(subscription.expiryDate) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">使用量:</span>
            <span class="detail-value">{{ subscription.usage }}/{{ subscription.limit }}</span>
          </div>
        </div>
      </div>
      
      <div class="plans-card">
        <h2>订阅计划</h2>
        <div class="plans-grid">
          <div 
            v-for="plan in availablePlans" 
            :key="plan.id"
            class="plan-item"
            :class="{ active: subscription.plan === plan.id }"
          >
            <div class="plan-header">
              <h3>{{ plan.name }}</h3>
              <div class="plan-price">
                <span class="price">¥{{ plan.price }}</span>
                <span class="period">/月</span>
              </div>
            </div>
            <div class="plan-features">
              <ul>
                <li v-for="feature in plan.features" :key="feature">
                  <i class="fas fa-check"></i>
                  {{ feature }}
                </li>
              </ul>
            </div>
            <button 
              class="plan-btn"
              :class="{ 'active': subscription.plan === plan.id }"
              @click="selectPlan(plan.id)"
            >
              {{ subscription.plan === plan.id ? '当前计划' : '选择计划' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'MCPSubscription',
  setup() {
    const subscription = ref({
      plan: 'basic',
      expiryDate: '2024-12-31',
      usage: 150,
      limit: 500,
      status: 'active'
    })
    
    const availablePlans = ref([
      {
        id: 'basic',
        name: '基础版',
        price: 29,
        features: [
          '每月500次API调用',
          '基础语音功能',
          '邮件支持'
        ]
      },
      {
        id: 'pro',
        name: '专业版',
        price: 99,
        features: [
          '每月2000次API调用',
          '高级语音功能',
          '优先支持',
          '自定义音色'
        ]
      },
      {
        id: 'enterprise',
        name: '企业版',
        price: 299,
        features: [
          '无限API调用',
          '所有功能',
          '24/7支持',
          '专属客服',
          '定制化服务'
        ]
      }
    ])
    
    const subscriptionStatus = computed(() => {
      return subscription.value.status
    })
    
    const getStatusText = () => {
      const statusMap = {
        active: '活跃',
        expired: '已过期',
        pending: '待激活'
      }
      return statusMap[subscription.value.status] || '未知'
    }
    
    const getStatusDescription = () => {
      const descMap = {
        active: '您的订阅正在有效期内，可以正常使用所有功能。',
        expired: '您的订阅已过期，请续费以继续使用服务。',
        pending: '您的订阅正在处理中，请稍后查看。'
      }
      return descMap[subscription.value.status] || ''
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return '未设置'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch (error) {
        return '未知'
      }
    }
    
    const selectPlan = (planId) => {
      subscription.value.plan = planId
      // 这里可以添加更新订阅的逻辑
    }
    
    return {
      subscription,
      availablePlans,
      subscriptionStatus,
      getStatusText,
      getStatusDescription,
      formatDate,
      selectPlan
    }
  }
}
</script>

<style scoped>
.mcp-subscription {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
}



.subscription-content {
  display: grid;
  gap: 32px;
}

.subscription-card,
.plans-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
}

.subscription-card h2,
.plans-card h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 24px 0;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
}

.status-badge.active {
  background: #28a745;
}

.status-badge.expired {
  background: #dc3545;
}

.status-badge.pending {
  background: #ffc107;
  color: #333;
}

.status-description {
  color: #666;
  margin: 0;
}

.subscription-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;
}

.detail-label {
  font-weight: 500;
  color: #666;
}

.detail-value {
  font-weight: bold;
  color: #333;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.plan-item {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  background: #fff;
}

.plan-item:hover {
  border-color: #6ec6fa;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(110, 198, 250, 0.2);
}

.plan-item.active {
  border-color: #6ec6fa;
  background: #f8f9ff;
}

.plan-header {
  text-align: center;
  margin-bottom: 20px;
}

.plan-header h3 {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #6ec6fa;
}

.period {
  font-size: 1rem;
  color: #666;
}

.plan-features {
  margin-bottom: 24px;
}

.plan-features ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: #666;
}

.plan-features i {
  color: #28a745;
  font-size: 0.9rem;
}

.plan-btn {
  width: 100%;
  padding: 12px 24px;
  border: 2px solid #6ec6fa;
  border-radius: 8px;
  background: #fff;
  color: #6ec6fa;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.plan-btn:hover {
  background: #6ec6fa;
  color: #fff;
}

.plan-btn.active {
  background: #6ec6fa;
  color: #fff;
  cursor: default;
}

@media (max-width: 768px) {
  .mcp-subscription {
    padding: 20px;
  }
  
  .subscription-details {
    grid-template-columns: 1fr;
  }
  
  .plans-grid {
    grid-template-columns: 1fr;
  }
  
  .status-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style> 