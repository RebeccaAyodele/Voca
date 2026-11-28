import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai'
import { firebaseApp, isFirebaseConfigured } from '@/services/firebase/app'

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      // Extract base64 part after comma
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64 || '')
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function transcribeAudio(audioBlob: Blob, liveWebTranscript?: string): Promise<string> {
  // If cloud AI is configured, attempt high-fidelity transcription via Gemini Flash
  if (isFirebaseConfigured) {
    try {
      const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() })
      const model = getGenerativeModel(ai, { model: 'gemini-1.5-flash' })

      const base64Data = await blobToBase64(audioBlob)
      const mimeType = audioBlob.type || 'audio/webm'

      const audioPart = {
        type: 'inlineData' as const,
        inlineData: {
          data: base64Data,
          mimeType
        }
      }

      const prompt =
        'Transcribe what is spoken in this audio recording verbatim. Provide only the clean spoken transcript without commentary, quotes, timestamps, or headers.'

      const result = await model.generateContent([prompt, audioPart])
      const text = result.response.text()
      if (text && text.trim().length > 0) {
        return text.trim()
      }
    } catch (err) {
      console.warn('Firebase AI cloud transcription unavailable, falling back to local speech capture:', err)
    }
  }

  // If live on-device speech recognition was captured during recording, return the user's real spoken words
  if (liveWebTranscript && liveWebTranscript.trim().length > 0) {
    return liveWebTranscript.trim()
  }

  // Honest fallback message per Voca product principles: never fabricate fake speech transcripts
  return '[Speech recorded. Acoustic cadence, pausing, and delivery were measured directly from the physical audio signal.]'
}
