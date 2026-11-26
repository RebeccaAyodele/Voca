import type { AudioRecording } from '@/services/audio/audio-types'

const DB_NAME = 'voca_audio_db'
const DB_VERSION = 2
const STORE_NAME = 'recordings'
const SESSIONS_STORE_NAME = 'session_results'

export interface SessionResult {
  id: string
  recId: string
  challengeId?: string
  challengeTitle?: string
  createdAt: string
  transcript: string
  wordsPerMinute: number
  wordCount: number
  fillerCount: number
  fillerPercentage: number
  pauseCount: number
  overallSummary: string
  priorityArea: string
  priorityRecommendation: string
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported in this environment'))
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(SESSIONS_STORE_NAME)) {
        db.createObjectStore(SESSIONS_STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// ----------------------------------------------------
// Audio Recordings Store
// ----------------------------------------------------

export async function saveAudioRecording(recording: AudioRecording): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.put(recording)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function getAudioRecording(id: string): Promise<AudioRecording | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(id)

    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllAudioRecordings(): Promise<AudioRecording[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

export async function deleteAudioRecording(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// ----------------------------------------------------
// Session Results & Speech Habit History Store
// ----------------------------------------------------

export async function saveSessionResult(result: SessionResult): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SESSIONS_STORE_NAME, 'readwrite')
    const store = tx.objectStore(SESSIONS_STORE_NAME)
    const request = store.put(result)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function getAllSessionResults(): Promise<SessionResult[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SESSIONS_STORE_NAME, 'readonly')
    const store = tx.objectStore(SESSIONS_STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () => {
      const results = (request.result || []) as SessionResult[]
      // Sort newest first
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      resolve(results)
    }
    request.onerror = () => reject(request.error)
  })
}

export async function getLatestSessionResult(): Promise<SessionResult | null> {
  const all = await getAllSessionResults()
  return all[0] || null
}
