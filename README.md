# 小智固件模拟器

一个基于Vue.js和WebSocket的前端应用，用于模拟小智固件的功能，提供麦克风控制和状态显示功能。

## 功能特性

- 🎤 麦克风开关控制
- 🔌 WebSocket连接状态监控
- 📊 实时系统状态显示
- 🎨 简约现代的用户界面
- 📱 响应式设计，支持移动端

## 技术栈

- **前端框架**: Vue.js 3
- **构建工具**: Vite
- **通信协议**: WebSocket
- **样式**: CSS3 + 现代布局

## 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm 8.0 或更高版本

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

构建文件将输出到 `dist/` 目录。

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
fractal_front/
├── src/
│   ├── components/          # Vue组件
│   │   ├── MicrophoneControl.vue
│   │   └── StatusDisplay.vue
│   ├── services/           # 服务模块
│   │   ├── websocket.js
│   │   └── audio.js
│   ├── assets/             # 静态资源
│   │   └── main.css
│   ├── App.vue             # 根组件
│   └── main.js             # 应用入口
├── index.html              # HTML模板
├── vite.config.js          # Vite配置
├── package.json            # 项目配置
└── README.md               # 项目说明
```

## 使用说明

### 麦克风控制

1. 点击"开启麦克风"按钮
2. 浏览器会请求麦克风权限
3. 授权后麦克风状态将显示为"已激活"
4. 点击"关闭麦克风"按钮可停止麦克风

### WebSocket连接

- 应用启动时会自动尝试建立WebSocket连接
- 连接状态会在状态面板中实时显示
- 目前使用模拟连接，实际使用时需要配置真实的WebSocket服务器地址

## 开发说明

### 添加新的WebSocket服务器

在 `src/services/websocket.js` 中修改WebSocket服务器地址：

```javascript
// 将模拟连接替换为真实连接
ws = new WebSocket('ws://your-server-address:port')
```

### 自定义样式

全局样式在 `src/assets/main.css` 中定义，组件样式在各组件的 `<style>` 标签中定义。

### 添加新功能

1. 在 `src/components/` 中创建新的Vue组件
2. 在 `src/services/` 中添加相关的服务逻辑
3. 在 `src/App.vue` 中引入新组件

## 浏览器兼容性

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。 