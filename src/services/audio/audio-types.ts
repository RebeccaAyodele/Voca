export interface AudioRecording {
  id: string
  blob: Blob
  mimeType: string
  durationSeconds: number
  createdAt: string
}

export type RecorderStatus = 'idle' | 'requesting' | 'recording' | 'paused' | 'stopped' | 'error'
