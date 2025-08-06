import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 8080

// 静态文件服务
app.use(express.static(join(__dirname, 'dist')))

// 处理SPA路由
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`生产服务器运行在 http://localhost:${PORT}`)
  console.log('按 Ctrl+C 停止服务器')
}) 