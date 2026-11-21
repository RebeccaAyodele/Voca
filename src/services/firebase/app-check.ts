import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from 'firebase/app-check'
import { firebaseApp, isFirebaseConfigured } from './app'

let appCheckInstance: AppCheck | null = null

/**
 * Initializes Firebase App Check as required by Firebase AI Logic.
 * In development, enables debug token if provided.
 * In production, uses ReCaptchaV3.
 */
export function initAppCheck(): AppCheck | null {
  if (appCheckInstance) return appCheckInstance
  if (!isFirebaseConfigured) {
    return null
  }

  try {
    const recaptchaSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_KEY
    const debugToken = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN

    if (debugToken && typeof window !== 'undefined') {
      // Configure debug token for local development/emulator testing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken === 'true' ? true : debugToken
    }

    if (recaptchaSiteKey) {
      appCheckInstance = initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true
      })
    }
  } catch (error) {
    console.warn('App Check initialization failed (running in fallback mode):', error)
  }

  return appCheckInstance
}

export function getAppCheck(): AppCheck | null {
  return appCheckInstance
}
