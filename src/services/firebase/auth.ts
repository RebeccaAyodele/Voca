import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously as fbSignInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth'
import { firebaseApp, isFirebaseConfigured } from './app'

export interface AuthUser {
  uid: string
  email: string | null
  isAnonymous: boolean
}

// Local mock user storage for offline/demo development without Firebase keys
const MOCK_STORAGE_KEY = 'voca_mock_auth_user'

function getMockUser(): AuthUser | null {
  const saved = localStorage.getItem(MOCK_STORAGE_KEY)
  if (!saved) return null
  try {
    return JSON.parse(saved)
  } catch {
    return null
  }
}

function setMockUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(MOCK_STORAGE_KEY)
  }
}

let mockListeners: Array<(user: AuthUser | null) => void> = []

function notifyMockListeners(user: AuthUser | null) {
  mockListeners.forEach(listener => listener(user))
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthUser> {
  if (isFirebaseConfigured) {
    const auth = getAuth(firebaseApp)
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    return {
      uid: cred.user.uid,
      email: cred.user.email,
      isAnonymous: cred.user.isAnonymous
    }
  }

  // Graceful local demo mode
  const user: AuthUser = {
    uid: 'demo-user-' + Math.random().toString(36).substring(2, 9),
    email,
    isAnonymous: false
  }
  setMockUser(user)
  notifyMockListeners(user)
  return user
}

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  if (isFirebaseConfigured) {
    const auth = getAuth(firebaseApp)
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return {
      uid: cred.user.uid,
      email: cred.user.email,
      isAnonymous: cred.user.isAnonymous
    }
  }

  // Graceful local demo mode
  const user: AuthUser = {
    uid: 'demo-user-' + Math.random().toString(36).substring(2, 9),
    email,
    isAnonymous: false
  }
  setMockUser(user)
  notifyMockListeners(user)
  return user
}

export async function signInAsGuest(): Promise<AuthUser> {
  if (isFirebaseConfigured) {
    try {
      const auth = getAuth(firebaseApp)
      const cred = await fbSignInAnonymously(auth)
      return {
        uid: cred.user.uid,
        email: null,
        isAnonymous: true
      }
    } catch (fbErr) {
      console.warn('Firebase Anonymous Auth provider not enabled in console or failed, falling back to local demo session:', fbErr)
    }
  }

  // Graceful local demo mode
  const user: AuthUser = {
    uid: 'guest-' + Math.random().toString(36).substring(2, 9),
    email: null,
    isAnonymous: true
  }
  setMockUser(user)
  notifyMockListeners(user)
  return user
}

export async function signOut(): Promise<void> {
  if (isFirebaseConfigured) {
    const auth = getAuth(firebaseApp)
    await fbSignOut(auth)
  }
  setMockUser(null)
  notifyMockListeners(null)
}

export function subscribeToAuthState(callback: (user: AuthUser | null) => void): () => void {
  if (isFirebaseConfigured) {
    const auth = getAuth(firebaseApp)
    return onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          isAnonymous: user.isAnonymous
        })
      } else {
        callback(null)
      }
    })
  }

  mockListeners.push(callback)
  callback(getMockUser())
  return () => {
    mockListeners = mockListeners.filter(l => l !== callback)
  }
}
