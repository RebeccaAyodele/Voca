import { describe, it, expect, beforeEach } from 'vitest'
import { saveAudioRecording, getAudioRecording, deleteAudioRecording } from './indexed-db'
import type { AudioRecording } from '@/services/audio/audio-types'

// Mock indexedDB in memory for unit testing
class MockIDBDatabase {
  data = new Map<string, AudioRecording>()
  transaction() {
    return {
      objectStore: () => ({
        put: (item: AudioRecording) => {
          this.data.set(item.id, item)
          const req: { onsuccess?: () => void; onerror?: (e: unknown) => void; result?: unknown } = {}
          setTimeout(() => req.onsuccess?.(), 0)
          return req
        },
        get: (id: string) => {
          const req: { onsuccess?: () => void; onerror?: (e: unknown) => void; result?: unknown } = {
            result: this.data.get(id) || null
          }
          setTimeout(() => req.onsuccess?.(), 0)
          return req
        },
        delete: (id: string) => {
          this.data.delete(id)
          const req: { onsuccess?: () => void; onerror?: (e: unknown) => void; result?: unknown } = {}
          setTimeout(() => req.onsuccess?.(), 0)
          return req
        }
      })
    }
  }
}

describe('IndexedDB Audio Storage', () => {
  beforeEach(() => {
    const mockDB = new MockIDBDatabase()
    // Mock window.indexedDB for unit tests
    // @ts-ignore
    globalThis.indexedDB = {
      open: () => {
        const req = {
          onsuccess: undefined as (() => void) | undefined,
          onerror: undefined as (() => void) | undefined,
          result: mockDB as unknown as IDBDatabase
        }
        setTimeout(() => req.onsuccess?.(), 0)
        return req as unknown as IDBOpenDBRequest
      }
    } as unknown as IDBFactory
  })

  it('saves and retrieves an audio recording correctly', async () => {
    const fakeBlob = new Blob(['mock-audio-data'], { type: 'audio/webm' })
    const rec: AudioRecording = {
      id: 'rec-test-123',
      blob: fakeBlob,
      mimeType: 'audio/webm',
      durationSeconds: 15,
      createdAt: new Date().toISOString()
    }

    await saveAudioRecording(rec)
    const retrieved = await getAudioRecording('rec-test-123')

    expect(retrieved).not.toBeNull()
    expect(retrieved?.id).toBe('rec-test-123')
    expect(retrieved?.durationSeconds).toBe(15)
  })

  it('deletes an audio recording from storage', async () => {
    const fakeBlob = new Blob(['mock-audio-data'], { type: 'audio/webm' })
    const rec: AudioRecording = {
      id: 'rec-test-delete',
      blob: fakeBlob,
      mimeType: 'audio/webm',
      durationSeconds: 10,
      createdAt: new Date().toISOString()
    }

    await saveAudioRecording(rec)
    await deleteAudioRecording('rec-test-delete')
    const retrieved = await getAudioRecording('rec-test-delete')

    expect(retrieved).toBeNull()
  })
})
