import { ref } from 'vue'
import Recorder from 'opus-recorder'
import { OpusDecoderWebWorker } from 'opus-decoder'

// 动态计算encoderWorker.min.js的路径
const getEncoderPath = () => {
  // 使用Vite内置的BASE_URL环境变量来构建正确的路径
  const baseUrl = import.meta.env.BASE_URL || '/'
  const encoderPath = baseUrl.endsWith('/') ? 
    `${baseUrl}encoderWorker.min.js` : 
    `${baseUrl}/encoderWorker.min.js`
  
  console.log('Encoder路径计算:', {
    baseUrl,
    encoderPath,
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE
  })
  
  return encoderPath
}

const microphoneStatus = ref('inactive')
const microphoneEnabled = ref(false)
let recorder = null
let stream = null

// Opus音频播放管理器
class OpusAudioPlayer {
  constructor() {
    this.audioContext = null
    this.decoder = null // OpusDecoderWebWorker实例
    this.isInitialized = false
    this.audioQueue = []
    this.maxQueueSize = 100 // 最大队列长度（参考嵌入式设备的10帧限制）
    
    // 播放控制状态
    this.isPlaying = false
    this.currentSource = null
    this.busyDecoding = false // 防重复解码标志
    
    // 定时驱动播放
    this.outputTimer = null
    this.outputInterval = 30 // 30ms定时检查（参考嵌入式设备）
    
    // 连续播放时间计算
    this.nextPlayTime = 0
    this.isFirstPlay = true
    this.lastOutputTime = 0
    
    this.init()
  }
  
  // 初始化音频播放器
  async init() {
    try {
      // 创建AudioContext
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // 创建opus-decoder解码器
      this.decoder = new OpusDecoderWebWorker({
        sampleRate: 16000,
        channels: 1
      })
      
      // 等待解码器准备就绪
      await this.decoder.ready
      
      this.isInitialized = true
      console.log('OpusAudioPlayer初始化成功，使用OpusDecoderWebWorker')
      
      // 启动定时驱动的音频输出
      this.startOutputTimer()
    } catch (error) {
      console.error('OpusAudioPlayer初始化失败:', error)
      this.isInitialized = false
    }
  }
  
  // 启动定时驱动的音频输出
  startOutputTimer() {
    if (this.outputTimer) {
      return
    }
    
    this.outputTimer = setInterval(() => {
      this.onAudioOutput()
    }, this.outputInterval)
  }
  
  // 停止定时驱动的音频输出
  stopOutputTimer() {
    if (this.outputTimer) {
      clearInterval(this.outputTimer)
      this.outputTimer = null
    }
  }
  
  // 定时驱动的音频输出处理（模拟嵌入式设备的OnAudioOutput）
  onAudioOutput() {
    if (this.busyDecoding) {
      return
    }
    
    const now = Date.now()
    const maxSilenceMs = 10000 // 10秒无音频后停止
    
    // 如果队列为空，检查是否需要停止播放
    if (this.audioQueue.length === 0) {
      if (this.isPlaying && (now - this.lastOutputTime > maxSilenceMs)) {
        this.isPlaying = false
        console.log('长时间无音频数据，停止播放')
      }
      return
    }
    
    // 如果当前没有播放，开始播放
    if (!this.isPlaying) {
      this.playNextFromQueue()
    }
  }
  
  // 从队列中播放下一个音频片段
  playNextFromQueue() {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false
      return false
    }
    
    // 从队列中取出PCM数据
    const pcmData = this.audioQueue.shift()
    
    // 创建AudioBuffer
    const audioBuffer = this.createAudioBuffer(pcmData)
    if (!audioBuffer) {
      console.warn('创建AudioBuffer失败，跳过此片段')
      // 继续播放下一个片段
      this.playNextFromQueue()
      return false
    }
    
    // 播放音频片段
    const success = this.playAudioBuffer(audioBuffer)
    if (success) {
      this.isPlaying = true
      this.lastOutputTime = Date.now()
    } else {
      // 播放失败，继续播放下一个片段
      this.playNextFromQueue()
    }
    
    return success
  }
  
  // 清理资源
  async cleanup() {
    // 停止定时器
    this.stopOutputTimer()
    
    // 停止当前播放的音频源
    if (this.currentSource) {
      try {
        this.currentSource.stop()
        this.currentSource.disconnect()
      } catch (error) {
        console.warn('停止当前音频源失败:', error)
      }
      this.currentSource = null
    }
    
    if (this.decoder) {
      try {
        // 释放解码器资源
        await this.decoder.free()
        this.decoder = null
      } catch (error) {
        console.warn('解码器清理失败:', error)
      }
    }
    
    if (this.audioContext) {
      try {
        this.audioContext.close()
      } catch (error) {
        console.warn('AudioContext关闭失败:', error)
      }
      this.audioContext = null
    }
    
    this.isInitialized = false
    this.isPlaying = false
    this.busyDecoding = false
    this.audioQueue = []
    
    // 重置连续播放状态
    this.nextPlayTime = 0
    this.isFirstPlay = true
    this.lastOutputTime = 0
    
    console.log('OpusAudioPlayer资源已清理')
  }
  
  // 解码opus裸帧并播放（单帧立即解码）
  decodeAndPlay(opusFrame) {
    if (!this.isInitialized || !this.decoder) {
      console.warn('音频播放器未初始化，跳过音频帧')
      return false
    }
    
    if (this.busyDecoding) {
      console.warn('正在解码中，跳过音频帧')
      return false
    }
    
    try {
      // 确保AudioContext处于运行状态
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume()
      }
      
      // 将ArrayBuffer转换为TypedArray
      const uint8Data = new Uint8Array(opusFrame)
      
      // 立即解码单帧（模拟嵌入式设备的单帧处理）
      this.decodeSingleFrame(uint8Data)
      
      return true
    } catch (error) {
      console.error('Opus帧处理失败:', error)
      return false
    }
  }
  
  // 解码单个opus帧
  async decodeSingleFrame(frameData) {
    if (this.busyDecoding) {
      return
    }
    
    this.busyDecoding = true
    
    try {
      // 使用opus-decoder解码单帧
      const result = await this.decoder.decodeFrame(frameData)
      
      // 检查是否有错误
      if (result.error) {
        console.warn('解码错误:', result.error)
        return
      }
      
      // 检查队列长度限制
      if (this.audioQueue.length >= this.maxQueueSize) {
        console.warn('播放队列已满，移除最旧的数据')
        this.audioQueue.shift()
      }
      
      // 将PCM数据添加到播放队列
      this.audioQueue.push(result.channelData[0])
      
    } catch (error) {
      console.error('单帧解码失败:', error)
    } finally {
      this.busyDecoding = false
    }
  }
  

  
  // 创建AudioBuffer
  createAudioBuffer(pcmData) {
    if (!this.audioContext || !pcmData || pcmData.length === 0) {
      return null
    }
    
    try {
      // 创建AudioBuffer，使用固定的采样率（与解码器配置一致）
      const sampleRate = 16000 // 固定使用16kHz采样率
      const audioBuffer = this.audioContext.createBuffer(1, pcmData.length, sampleRate)
      
      // 将PCM数据复制到AudioBuffer
      const channelData = audioBuffer.getChannelData(0)
      channelData.set(pcmData)
      
      return audioBuffer
    } catch (error) {
      console.error('创建AudioBuffer失败:', error)
      return null
    }
  }
  
  // 播放AudioBuffer
  playAudioBuffer(audioBuffer) {
    if (!this.audioContext || !audioBuffer) {
      return false
    }
    
    try {
      // 创建AudioBufferSourceNode
      const source = this.audioContext.createBufferSource()
      source.buffer = audioBuffer
      
      // 连接到音频输出
      source.connect(this.audioContext.destination)
      
      // 计算播放时间（改进的时间计算）
      let startTime
      const currentTime = this.audioContext.currentTime
      
      if (this.isFirstPlay) {
        // 第一次播放，立即开始
        startTime = currentTime
        this.nextPlayTime = startTime + audioBuffer.duration
        this.isFirstPlay = false
      } else {
        // 后续播放，确保无缝连接
        startTime = Math.max(this.nextPlayTime, currentTime)
        this.nextPlayTime = startTime + audioBuffer.duration
      }
      
      // 播放完成后处理
      source.onended = () => {
        this.currentSource = null
        
        // 检查队列中是否还有数据，如果有则继续播放
        if (this.audioQueue.length > 0) {
          this.playNextFromQueue()
        } else {
          this.isPlaying = false
        }
      }
      
      // 播放音频
      source.start(startTime)
      
      // 保存当前播放的source引用
      this.currentSource = source
      return true
    } catch (error) {
      console.error('播放AudioBuffer失败:', error)
      this.currentSource = null
      return false
    }
  }
  
  // 获取播放状态
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      audioContextState: this.audioContext ? this.audioContext.state : 'closed',
      queueLength: this.audioQueue.length,
      isPlaying: this.isPlaying,
      currentSourceActive: this.currentSource !== null,
      busyDecoding: this.busyDecoding,
      maxQueueSize: this.maxQueueSize,
      outputTimer: this.outputTimer !== null
    }
  }
  
  // 暂停播放
  pause() {
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend()
      console.log('音频播放已暂停')
    }
  }
  
  // 恢复播放
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
      console.log('音频播放已恢复')
    }
  }
  
  // 重置播放时间（用于新的音频流）
  resetPlayTime() {
    this.nextPlayTime = 0
    this.isFirstPlay = true
    this.lastOutputTime = 0
    this.audioQueue = []
    this.isPlaying = false
    console.log('播放时间已重置')
  }
  
  // 重新初始化（用于错误恢复）
  async reinitialize() {
    console.log('重新初始化音频播放器')
    await this.cleanup()
    await this.init()
  }
}

export function useAudio() {
  // 帧计数器状态管理
  let frameCounter = 0
  const skipHeaderFrames = 2 // 跳过前两帧头部数据（识别头和注释头）
  
  // Ogg解封装函数：从Ogg封装数据中提取裸Opus帧
  const extractOpusFromOgg = (oggData) => {
    try {
      const dataView = new DataView(oggData.buffer, oggData.byteOffset, oggData.byteLength)
      
      // 检查Ogg页面头标识 "OggS"
      if (dataView.getUint32(0, false) !== 0x4F676753) { // "OggS" in little-endian
        console.warn('不是有效的Ogg页面头')
        return null
      }
      
      // 解析Ogg页面头
      const version = dataView.getUint8(4)
      const headerType = dataView.getUint8(5)
      const granulePosition = dataView.getBigUint64(6, true)
      const bitstreamSerialNumber = dataView.getUint32(14, true)
      const pageSequenceNumber = dataView.getUint32(18, true)
      const checksum = dataView.getUint32(22, true)
      const pageSegments = dataView.getUint8(26)
      
      // 计算页面头大小
      const headerSize = 27 + pageSegments
      
      // 解析段表
      let totalDataSize = 0
      for (let i = 0; i < pageSegments; i++) {
        const segmentSize = dataView.getUint8(27 + i)
        totalDataSize += segmentSize
      }
      
      // 提取Opus数据（跳过页面头）
      const opusDataStart = headerSize
      const opusDataEnd = opusDataStart + totalDataSize
      
      if (opusDataEnd > oggData.length) {
        console.warn('Ogg页面数据不完整')
        return null
      }
      
      // 创建裸Opus帧的ArrayBuffer
      const opusFrame = oggData.slice(opusDataStart, opusDataEnd)
      
      return opusFrame.buffer
    } catch (error) {
      console.error('Ogg解封装失败:', error)
      return null
    }
  }

  const requestMicrophonePermission = async () => {
    try {
      // 使用更宽松的音频配置，提高权限获取成功率
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // 移除严格的采样率限制，让浏览器使用默认值
          // sampleRate: 16000,
          // 移除严格的声道数限制，支持立体声设备
          // channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      })
      
      // 检查获取到的音频流参数
      const audioTrack = stream.getAudioTracks()[0]
      const settings = audioTrack.getSettings()
      console.log('获取到的音频流参数:', settings)
      
      microphoneStatus.value = 'active'
      microphoneEnabled.value = true
      console.log('麦克风权限已获取成功')
      return true
    } catch (error) {
      console.error('获取麦克风权限失败:', error)
      
      // 提供更详细的错误信息
      let errorMessage = '获取麦克风权限失败'
      if (error.name === 'NotAllowedError') {
        errorMessage = '用户拒绝了麦克风权限请求'
      } else if (error.name === 'NotFoundError') {
        errorMessage = '未找到麦克风设备'
      } else if (error.name === 'NotSupportedError') {
        errorMessage = '浏览器不支持音频配置'
      } else if (error.name === 'NotReadableError') {
        errorMessage = '麦克风设备被其他应用占用'
      }
      
      console.error('详细错误信息:', errorMessage)
      microphoneStatus.value = 'error'
      microphoneEnabled.value = false
      return false
    }
  }

  const stopMicrophone = () => {
    if (recorder) {
      recorder.stop()
      recorder = null
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      stream = null
    }
    microphoneStatus.value = 'inactive'
    microphoneEnabled.value = false
    console.log('麦克风已关闭')
  }

  const toggleMicrophone = async () => {
    if (microphoneEnabled.value) {
      stopMicrophone()
      return true
    } else {
      const success = await requestMicrophonePermission()
      if (!success) {
        console.error('开启麦克风失败')
        // 确保状态正确设置
        microphoneStatus.value = 'error'
        microphoneEnabled.value = false
      }
      return success
    }
  }

  // 启动opus-recorder实时推流
  const startAudioStream = (onAudioData) => {
    if (!stream) {
      console.error('没有可用的音频流')
      return false
    }
    
    // 重置帧计数器
    frameCounter = 0
    console.log('开始音频流，已重置帧计数器')
    
    try {
      if (recorder) {
        recorder.resume()
      } else {
        // 获取encoder路径并验证
        const encoderPath = getEncoderPath()
        
        recorder = new Recorder({
          encoderSampleRate: 16000,
          encoderPath: encoderPath,
          streamPages: true,
          encoderApplication: 2048,
          numberOfChannels: 1,
          maxFramesPerPage: 1,
          resampleQuality: 10,
          encoderFrameSize: 60,
          recordingGain: 1,
        })
        
        recorder.ondataavailable = (typedArray) => {
          if (onAudioData && typedArray && typedArray.length > 0) {
            // 跳过前两帧头部数据（识别头和注释头）
            if (frameCounter < skipHeaderFrames) {
              frameCounter++
              return
            }
            
            // 使用Ogg解封装函数提取裸Opus帧
            const opusFrame = extractOpusFromOgg(typedArray)
            
            if (opusFrame) {
              frameCounter++
              onAudioData(opusFrame)
            } else {
              console.warn('Ogg解封装失败，跳过此帧')
            }
          }
        }
        
        recorder.onerror = (error) => {
          console.error('opus-recorder发生错误:', error)
          // 清理资源
          stopMicrophone()
        }
        
        recorder.start(stream)
      }
      return true
    } catch (error) {
      console.error('启动opus-recorder失败:', error)
      console.error('错误详情:', error.message)
      console.error('错误类型:', error.name)
      
      // 清理可能部分创建的recorder
      if (recorder) {
        try {
          recorder.stop()
        } catch (cleanupError) {
          console.warn('清理recorder时发生错误:', cleanupError)
        }
        recorder = null
      }
      
      // 设置麦克风状态为错误
      microphoneStatus.value = 'error'
      microphoneEnabled.value = false
      
      return false
    }
  }

  // 停止opus-recorder
  const stopAudioStream = () => {
    if (recorder) {
      recorder.pause()
      console.log('opus-recorder已暂停')
    }
    
    // 清理帧计数器状态
    frameCounter = 0
  }

  return {
    microphoneStatus,
    microphoneEnabled,
    requestMicrophonePermission,
    stopMicrophone,
    toggleMicrophone,
    startAudioStream,
    stopAudioStream,
  }
}

// 导出OpusAudioPlayer类
export { OpusAudioPlayer } 