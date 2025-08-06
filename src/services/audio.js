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
    this.maxQueueSize = 10 // 最大队列长度（参考嵌入式设备的10帧限制）
    
    // 播放控制状态
    this.isPlaying = false
    this.currentSource = null
    this.busyDecoding = false // 防重复解码标志
    this.pendingFrames = [] // 待解码帧队列
    
    // 定时驱动播放
    this.outputTimer = null
    this.outputInterval = 5 // 进一步减少到5ms，确保更快响应
    
    // 连续播放时间计算
    this.nextPlayTime = 0
    this.isFirstPlay = true
    this.lastOutputTime = 0
    this.baseTime = 0 // AudioContext基准时间
    
    // 流式播放优化
    this.minQueueLength = 3 // 最小队列长度，确保连续播放
    this.scheduledSources = [] // 已调度的音频源队列
    
    this.init()
  }
  
  // 初始化音频播放器
  async init() {
    try {
      // 创建AudioContext
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // 设置AudioContext基准时间
      this.baseTime = this.audioContext.currentTime
      
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
  
  // 处理待解码帧队列
  processPendingFrames() {
    // 如果正在解码或没有待解码帧，直接返回
    if (this.busyDecoding || this.pendingFrames.length === 0) {
      return
    }
    
    // 处理第一个待解码帧
    const frameData = this.pendingFrames.shift()
    this.decodeSingleFrame(frameData)
  }

  // 清理已完成的音频源
  cleanupFinishedSources() {
    const currentTime = this.audioContext ? this.audioContext.currentTime : 0
    this.scheduledSources = this.scheduledSources.filter(sourceInfo => {
      // 如果音频源已经播放完成，从列表中移除
      if (sourceInfo.endTime <= currentTime) {
        return false
      }
      return true
    })
  }

  // 调度下一个音频片段
  scheduleNextAudio() {
    if (this.audioQueue.length === 0) {
      return false
    }

    // 从队列中取出PCM数据
    const pcmData = this.audioQueue.shift()
    
    // 创建AudioBuffer
    const audioBuffer = this.createAudioBuffer(pcmData)
    if (!audioBuffer) {
      console.warn('创建AudioBuffer失败，跳过此片段')
      return false
    }

    // 调度播放
    return this.scheduleAudioBuffer(audioBuffer)
  }

  // 开始连续播放
  startContinuousPlayback() {
    if (this.isPlaying) {
      return
    }

    // 预先调度多个音频片段确保无缝播放
    let scheduledCount = 0
    while (this.audioQueue.length > 0 && scheduledCount < this.minQueueLength) {
      if (this.scheduleNextAudio()) {
        scheduledCount++
      } else {
        break
      }
    }

    if (scheduledCount > 0) {
      this.isPlaying = true
      this.lastOutputTime = Date.now()
      console.log(`开始连续播放，已调度 ${scheduledCount} 个音频片段`)
    }
  }

  // 定时驱动的音频输出处理（模拟嵌入式设备的OnAudioOutput）
  onAudioOutput() {
    const now = Date.now()
    const maxSilenceMs = 10000 // 10秒无音频后停止
    
    // 处理待解码帧队列
    this.processPendingFrames()
    
    // 清理已完成的音频源
    this.cleanupFinishedSources()
    
    // 如果队列为空，检查是否需要停止播放
    if (this.audioQueue.length === 0) {
      if (this.isPlaying && (now - this.lastOutputTime > maxSilenceMs)) {
        this.isPlaying = false
        console.log('长时间无音频数据，停止播放')
      }
      return
    }
    
    // 确保连续播放 - 当队列有数据且调度的源少于最小数量时，继续调度播放
    if (this.audioQueue.length > 0 && this.scheduledSources.length < this.minQueueLength) {
      this.scheduleNextAudio()
    }
    
    // 如果当前没有播放，开始播放
    if (!this.isPlaying && this.audioQueue.length >= this.minQueueLength) {
      this.startContinuousPlayback()
    }
  }
  

  
  // 清理资源
  async cleanup() {
    // 停止定时器
    this.stopOutputTimer()
    
    // 停止所有已调度的音频源
    this.scheduledSources.forEach(sourceInfo => {
      try {
        sourceInfo.source.stop()
        sourceInfo.source.disconnect()
      } catch (error) {
        console.warn('停止调度音频源失败:', error)
      }
    })
    this.scheduledSources = []
    
    // 停止当前播放的音频源（兼容性处理）
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
    this.pendingFrames = [] // 清理待解码帧队列
    this.scheduledSources = [] // 清理调度源队列
    
    // 重置连续播放状态
    this.nextPlayTime = 0
    this.isFirstPlay = true
    this.lastOutputTime = 0
    this.baseTime = 0
    
    console.log('OpusAudioPlayer资源已清理')
  }
  
  // 解码opus裸帧并播放（单帧立即解码）
  decodeAndPlay(opusFrame) {
    if (!this.isInitialized || !this.decoder) {
      console.warn('音频播放器未初始化，跳过音频帧')
      return false
    }
    
    try {
      // 确保AudioContext处于运行状态
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume()
      }
      
      // 将ArrayBuffer转换为TypedArray
      const uint8Data = new Uint8Array(opusFrame)
      
      // 如果正在解码，将帧加入待解码队列
      if (this.busyDecoding) {
        // 限制待解码队列大小，防止内存溢出
        if (this.pendingFrames.length < 20) {
          this.pendingFrames.push(uint8Data)
          console.log('正在解码中，帧已加入待解码队列，队列长度:', this.pendingFrames.length)
        } else {
          console.warn('待解码队列已满，跳过此帧')
        }
        return true
      }
      
      // 立即解码单帧
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
  
  // 调度AudioBuffer播放（新的无缝播放核心方法）
  scheduleAudioBuffer(audioBuffer) {
    if (!this.audioContext || !audioBuffer) {
      return false
    }
    
    try {
      // 创建AudioBufferSourceNode
      const source = this.audioContext.createBufferSource()
      source.buffer = audioBuffer
      
      // 连接到音频输出
      source.connect(this.audioContext.destination)
      
      // 精确的时间计算，确保完全无缝连接
      let startTime
      const currentContextTime = this.audioContext.currentTime
      
      if (this.isFirstPlay) {
        // 第一次播放，设置基准时间
        this.baseTime = currentContextTime
        startTime = currentContextTime + 0.005 // 5ms缓冲，避免过早播放
        this.nextPlayTime = startTime + audioBuffer.duration
        this.isFirstPlay = false
      } else {
        // 后续播放，精确连接到上一个音频片段的结束时间
        startTime = this.nextPlayTime
        this.nextPlayTime = startTime + audioBuffer.duration
        
        // 防止播放时间落后于当前时间
        if (startTime < currentContextTime) {
          console.warn('播放时间校正: 从', startTime, '调整到', currentContextTime)
          startTime = currentContextTime
          this.nextPlayTime = startTime + audioBuffer.duration
        }
      }
      
      const endTime = startTime + audioBuffer.duration
      
      // 播放完成后的清理处理
      source.onended = () => {
        // 检查是否还有队列中的数据需要继续调度
        if (this.audioQueue.length > 0 && this.scheduledSources.length < this.minQueueLength) {
          this.scheduleNextAudio()
        }
        
        // 如果没有更多调度的音频源，停止播放
        if (this.scheduledSources.length === 0) {
          this.isPlaying = false
          console.log('所有音频片段播放完成')
        }
      }
      
      // 启动播放
      source.start(startTime)
      
      // 记录调度信息
      this.scheduledSources.push({
        source: source,
        startTime: startTime,
        endTime: endTime,
        duration: audioBuffer.duration
      })
      
      console.log(`调度音频播放: 开始时间=${startTime.toFixed(3)}s, 持续时间=${audioBuffer.duration.toFixed(3)}s, 队列中剩余=${this.audioQueue.length}`)
      
      return true
    } catch (error) {
      console.error('调度AudioBuffer播放失败:', error)
      return false
    }
  }

  // 兼容性方法：播放AudioBuffer（用于向后兼容）
  playAudioBuffer(audioBuffer) {
    return this.scheduleAudioBuffer(audioBuffer)
  }
  
  // 获取播放状态
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      audioContextState: this.audioContext ? this.audioContext.state : 'closed',
      queueLength: this.audioQueue.length,
      pendingFramesLength: this.pendingFrames.length,
      scheduledSourcesLength: this.scheduledSources.length,
      isPlaying: this.isPlaying,
      currentSourceActive: this.currentSource !== null,
      busyDecoding: this.busyDecoding,
      maxQueueSize: this.maxQueueSize,
      outputTimer: this.outputTimer !== null,
      outputInterval: this.outputInterval,
      minQueueLength: this.minQueueLength,
      nextPlayTime: this.nextPlayTime,
      baseTime: this.baseTime
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
    // 停止所有已调度的音频源
    this.scheduledSources.forEach(sourceInfo => {
      try {
        sourceInfo.source.stop()
      } catch (error) {
        // 忽略已经停止的源
      }
    })
    this.scheduledSources = []
    
    this.nextPlayTime = 0
    this.isFirstPlay = true
    this.lastOutputTime = 0
    this.audioQueue = []
    this.pendingFrames = [] // 清理待解码帧队列
    this.isPlaying = false
    if (this.audioContext) {
      this.baseTime = this.audioContext.currentTime
    }
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