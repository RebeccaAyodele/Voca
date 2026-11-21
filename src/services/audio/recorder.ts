import type { AudioRecording } from './audio-types'

function getSupportedMimeType(): string {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4'
  ]

  for (const type of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
      return type
    }
  }

  return 'audio/webm'
}

export class AudioRecorderEngine {
  private mediaRecorder: MediaRecorder | null = null
  private audioStream: MediaStream | null = null
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private chunks: Blob[] = []
  private startTime = 0
  private mimeType = ''
  private animFrameId: number | null = null

  async start(onWaveformData?: (normalizedAmplitudes: number[]) => void): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Microphone audio capture is not supported in this browser.')
    }

    this.mimeType = getSupportedMimeType()
    this.chunks = []

    this.audioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    })

    // Setup Web Audio API Analyser for real-time live waveform
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      this.audioContext = new AudioContextClass()
      const source = this.audioContext.createMediaStreamSource(this.audioStream)
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 64
      this.analyser.smoothingTimeConstant = 0.8
      source.connect(this.analyser)

      if (onWaveformData) {
        const bufferLength = this.analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        const updateWaveform = () => {
          if (!this.analyser) return
          this.analyser.getByteFrequencyData(dataArray)

          // Sample 19 frequency bands
          const bands = 19
          const step = Math.max(1, Math.floor(bufferLength / bands))
          const amplitudes: number[] = []

          for (let i = 0; i < bands; i++) {
            const val = dataArray[i * step] || 0
            // Normalize between 10px and 52px height
            const normalized = Math.max(8, Math.round((val / 255) * 44 + 8))
            amplitudes.push(normalized)
          }

          onWaveformData(amplitudes)
          this.animFrameId = requestAnimationFrame(updateWaveform)
        }

        this.animFrameId = requestAnimationFrame(updateWaveform)
      }
    }

    this.mediaRecorder = new MediaRecorder(this.audioStream, {
      mimeType: this.mimeType
    })

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.chunks.push(e.data)
      }
    }

    this.startTime = Date.now()
    this.mediaRecorder.start(250) // slice every 250ms
  }

  async stop(): Promise<AudioRecording> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error('Recorder is not active'))
      }

      const durationSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000))

      this.mediaRecorder.onstop = () => {
        if (this.animFrameId) {
          cancelAnimationFrame(this.animFrameId)
          this.animFrameId = null
        }

        // Clean up audio context
        if (this.audioContext && this.audioContext.state !== 'closed') {
          this.audioContext.close().catch(() => {})
        }

        // Stop all microphone tracks to turn off the hardware recording light
        if (this.audioStream) {
          this.audioStream.getTracks().forEach((track) => track.stop())
          this.audioStream = null
        }

        const blob = new Blob(this.chunks, { type: this.mimeType })
        const recording: AudioRecording = {
          id: 'rec-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
          blob,
          mimeType: this.mimeType,
          durationSeconds,
          createdAt: new Date().toISOString()
        }

        resolve(recording)
      }

      this.mediaRecorder.stop()
    })
  }

  dispose(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId)
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop()
      } catch {}
    }
    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => track.stop())
      this.audioStream = null
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {})
    }
  }
}
