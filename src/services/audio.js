import { ref } from 'vue'
import Recorder from 'opus-recorder'
import { OpusDecoderWebWorker } from 'opus-decoder'

// 动态计算encoderWorker.min.js的路径
const getEncoderPath = () => {
  // 获取当前页面的base URL
  const baseUrl = window.location.pathname.replace(/\/[^/]*$/, '')
  // 确保路径以/开头，并且正确处理根路径
  const encoderPath = baseUrl === '' ? '/encoderWorker.min.js' : `${baseUrl}/encoderWorker.min.js`
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
    this.maxQueueSize = 10 // 最大队列长度
    
    // 队列播放相关状态变量
    this.isQueuePlaying = false // 队列是否正在播放
    this.currentSource = null // 当前播放的AudioBufferSourceNode
    this.queueProcessing = false // 是否正在处理队列
    
    // 帧缓冲相关状态变量
    this.frameBuffer = [] // 存储待解码的opus帧
    this.frameBufferSize = 5 // 每5帧合并解码
    this.isDecoding = false // 是否正在解码中
    
    // 连续播放相关状态变量
    this.nextPlayTime = 0 // 下一个音频片段的播放时间
    this.isFirstPlay = true // 是否是第一次播放
    
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
    } catch (error) {
      console.error('OpusAudioPlayer初始化失败:', error)
      this.isInitialized = false
    }
  }
  
  // 添加PCM数据到播放队列
  addToQueue(pcmData) {
    if (!pcmData || pcmData.length === 0) {
      console.warn('无效的PCM数据，跳过添加到队列')
      return false
    }
    
    // 检查队列长度限制
    if (this.audioQueue.length >= this.maxQueueSize) {
      console.warn('播放队列已满，移除最旧的数据')
      this.audioQueue.shift() // 移除最旧的数据
    }
    
    // 将PCM数据添加到队列
    this.audioQueue.push(pcmData)
    
    return true
  }
  
  // 处理播放队列
  processQueue() {
    // 防止重复处理
    if (this.queueProcessing) {
      return
    }
    
    this.queueProcessing = true
    
    try {
      // 如果当前没有播放且队列中有数据，开始播放
      if (!this.isQueuePlaying && this.audioQueue.length > 0) {
        this.playNextInQueue()
      }
    } catch (error) {
      console.error('处理播放队列时发生错误:', error)
    } finally {
      this.queueProcessing = false
    }
  }
  
  // 播放队列中的下一个音频片段
  playNextInQueue() {
    if (this.audioQueue.length === 0) {
      this.isQueuePlaying = false
      console.log('播放队列为空，停止播放')
      return false
    }
    
    // 从队列中取出PCM数据
    const pcmData = this.audioQueue.shift()
    
    // 创建AudioBuffer
    const audioBuffer = this.createAudioBuffer(pcmData)
    if (!audioBuffer) {
      console.warn('创建AudioBuffer失败，跳过此片段')
      // 继续播放下一个片段
      this.playNextInQueue()
      return false
    }
    
    // 播放音频片段
    const success = this.playAudioBuffer(audioBuffer)
    if (success) {
      this.isQueuePlaying = true
    } else {
      // 播放失败，继续播放下一个片段
      this.playNextInQueue()
    }
    
    return success
  }
  
  // 清理资源
  async cleanup() {
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
    this.isQueuePlaying = false
    this.queueProcessing = false
    this.audioQueue = []
    
    // 清理帧缓冲区
    this.frameBuffer = []
    this.isDecoding = false
    
    // 重置连续播放状态
    this.nextPlayTime = 0
    this.isFirstPlay = true
    
    console.log('OpusAudioPlayer资源已清理')
  }
  
  // 解码opus裸帧并播放
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
      
      // 将帧添加到缓冲区
      this.frameBuffer.push(uint8Data)
      
      // 检查是否达到解码条件
      if (this.frameBuffer.length >= this.frameBufferSize && !this.isDecoding) {
        this.decodeFrameBuffer()
      }
      
      return true
    } catch (error) {
      console.error('Opus帧处理失败:', error)
      return false
    }
  }
  
  // 解码帧缓冲区
  async decodeFrameBuffer() {
    if (this.isDecoding || this.frameBuffer.length === 0) {
      return
    }
    
    this.isDecoding = true
    
    try {
      // 取出缓冲区中的所有帧
      const framesToDecode = this.frameBuffer.splice(0, this.frameBuffer.length)
      
      // 使用opus-decoder解码多帧
      const result = await this.decoder.decodeFrames(framesToDecode)
      
      // 检查是否有错误
      if (result.errors && result.errors.length > 0) {
        console.warn('解码过程中出现错误:', result.errors)
      }
      
      // 将PCM数据添加到播放队列
      this.addToQueue(result.channelData[0])
      
      // 触发队列处理
      this.processQueue()
      
    } catch (error) {
      console.error('帧缓冲区解码失败:', error)
    } finally {
      this.isDecoding = false
      
      // 如果缓冲区中还有帧，继续解码
      if (this.frameBuffer.length >= this.frameBufferSize) {
        this.decodeFrameBuffer()
      }
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
      
      // 计算播放时间
      let startTime
      if (this.isFirstPlay) {
        // 第一次播放，立即开始
        startTime = this.audioContext.currentTime
        this.isFirstPlay = false
      } else {
        // 后续播放，使用预计算的开始时间
        startTime = this.nextPlayTime
      }
      
      // 计算下一个片段的开始时间
      this.nextPlayTime = startTime + audioBuffer.duration
      
      // 播放完成后处理
      source.onended = () => {
        this.currentSource = null
        
        // 检查队列中是否还有数据，如果有则继续播放
        if (this.audioQueue.length > 0) {
          this.playNextInQueue()
        } else {
          this.isQueuePlaying = false
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
      isQueuePlaying: this.isQueuePlaying,
      currentSourceActive: this.currentSource !== null,
      queueProcessing: this.queueProcessing,
      maxQueueSize: this.maxQueueSize
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
  }
  
  // 刷新帧缓冲区（处理剩余的帧）
  async flushFrameBuffer() {
    if (this.frameBuffer.length > 0 && !this.isDecoding) {
      console.log(`刷新帧缓冲区，剩余${this.frameBuffer.length}帧`)
      await this.decodeFrameBuffer()
    }
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
        recorder = new Recorder({
          encoderSampleRate: 16000,
          encoderPath: getEncoderPath(),
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
        recorder.start(stream)
      }
      return true
    } catch (error) {
      console.error('启动opus-recorder失败:', error)
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