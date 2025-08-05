# Fractal 语音助手前端应用

这是一个基于 Vue 3 + Vite 构建的现代化语音助手前端应用。

## 🚀 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Vue Router 4** - 官方路由管理器
- **Pinia** - Vue 的状态管理库
- **Font Awesome** - 图标库
- **Google Fonts** - 字体库

## 📦 安装和运行

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 🏗️ 项目结构

```
src/
├── assets/          # 静态资源
│   └── main.css     # 全局样式
├── components/      # 公共组件
│   ├── Sidebar.vue      # 侧边栏组件
│   └── SettingsModal.vue # 设置模态框组件
├── stores/         # Pinia 状态管理
│   └── user.js     # 用户状态管理
├── views/          # 页面组件
│   ├── Home.vue           # 首页
│   ├── Login.vue          # 登录页
│   ├── Register.vue       # 注册页
│   ├── Reset.vue          # 重置密码页
│   ├── VoiceSimulator.vue # 语音模拟器
│   ├── DeviceManagement.vue # 设备管理
│   ├── VoiceSettings.vue  # 音色设置
│   ├── McpSubscription.vue # MCP订阅
│   └── DeviceBinding.vue  # 设备绑定
├── router/         # 路由配置
│   └── index.js    # 路由定义
├── App.vue         # 根组件
└── main.js         # 应用入口
```

## 🎨 功能特性

### ✅ 已实现功能
- [x] 响应式侧边栏导航
- [x] 设置模态框
- [x] 用户状态管理
- [x] 路由管理
- [x] 按钮动效
- [x] BEME Logo 像素风格
- [x] 移动端适配

### 🔄 待实现功能
- [ ] 登录/注册页面
- [ ] 语音模拟器页面
- [ ] 设备管理页面
- [ ] 音色设置页面
- [ ] MCP订阅页面
- [ ] 设备绑定页面

## 🎯 组件说明

### Sidebar 组件
- 包含 BEME Logo 和导航菜单
- 支持路由高亮
- 响应式设计

### SettingsModal 组件
- 完整的设置界面
- 用户信息管理
- 应用设置配置
- 数据管理功能

### Home 组件
- 欢迎界面
- 用户信息展示
- 快速操作按钮
- 丰富的动效

## 🎨 设计特色

### 视觉设计
- 渐变背景
- 毛玻璃效果
- 圆角设计
- 阴影效果

### 交互动效
- 按钮悬停效果
- 脉冲动画
- 3D 变换
- 波纹效果

### 响应式布局
- 桌面端优化
- 平板端适配
- 移动端友好

## 🔧 开发指南

### 添加新页面
1. 在 `src/views/` 创建新的 Vue 组件
2. 在 `src/router/index.js` 添加路由配置
3. 在侧边栏菜单中添加导航项

### 添加新组件
1. 在 `src/components/` 创建组件
2. 在需要使用的页面中导入
3. 注册组件并使用

### 状态管理
- 使用 Pinia 进行状态管理
- 在 `src/stores/` 中定义 store
- 在组件中使用 `useStore()` 访问状态

## 📱 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 邮箱：your-email@example.com
- GitHub：https://github.com/your-username/fractal-voice-assistant 