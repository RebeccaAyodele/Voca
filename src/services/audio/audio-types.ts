export interface AudioRecording {
  id: string
  blob: Blob
  mimeType: string
  durationSeconds: number
  createdAt: string
  liveTranscript?: string
}

export type RecorderStatus = 'idle' | 'requesting' | 'recording' | 'paused' | 'stopped' | 'error'
