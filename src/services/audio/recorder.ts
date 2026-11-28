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

// Minimal interface for browser SpeechRecognition
interface SpeechRecognitionInstance {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: unknown) => void) | null
}

interface SpeechRecognitionEventLike {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string
      }
      isFinal?: boolean
    }
    length: number
  }
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
  private recognition: SpeechRecognitionInstance | null = null
  private speechTranscript = ''

  async start(onWaveformData?: (normalizedAmplitudes: number[]) => void): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Microphone audio capture is not supported in this browser.')
    }

    this.mimeType = getSupportedMimeType()
    this.chunks = []
    this.speechTranscript = ''

    this.audioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    })

    // Setup Web Audio API Analyser for real-time live waveform
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
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

    // Try starting native browser speech recognition for zero-latency local transcription
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass() as SpeechRecognitionInstance
        this.recognition.continuous = true
        this.recognition.interimResults = true
        this.recognition.lang = 'en-US'

        this.recognition.onresult = (event: SpeechRecognitionEventLike) => {
          let accumulated = ''
          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i]
            if (result && result[0]) {
              accumulated += result[0].transcript + ' '
            }
          }
          this.speechTranscript = accumulated.trim()
        }

        this.recognition.onerror = () => {
          // Non-blocking: fail quietly if browser recognition encounters mic conflict
        }

        this.recognition.start()
      }
    } catch {
      // Non-fatal if SpeechRecognition is blocked or unsupported
      this.recognition = null
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

  pause(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause()
    }
  }

  resume(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume()
    }
  }

  get state(): RecordingState | 'inactive' {
    return this.mediaRecorder ? this.mediaRecorder.state : 'inactive'
  }

  async stop(): Promise<AudioRecording> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error('Recorder is not active'))
      }

      const durationSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000))

      if (this.recognition) {
        try {
          this.recognition.stop()
        } catch {}
      }

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
          createdAt: new Date().toISOString(),
          liveTranscript: this.speechTranscript ? this.speechTranscript.trim() : undefined
        }

        resolve(recording)
      }

      this.mediaRecorder.stop()
    })
  }

  dispose(): void {
    if (this.recognition) {
      try {
        this.recognition.abort()
      } catch {}
      this.recognition = null
    }
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
