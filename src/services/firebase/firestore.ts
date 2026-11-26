import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  type Firestore
} from 'firebase/firestore'
import { firebaseApp, isFirebaseConfigured } from './app'
import type { UserProfile } from '@/domain/user/types'

const MOCK_PROFILES_KEY = 'voca_mock_user_profiles'

function getMockProfiles(): Record<string, UserProfile> {
  const saved = localStorage.getItem(MOCK_PROFILES_KEY)
  if (!saved) return {}
  try {
    return JSON.parse(saved)
  } catch {
    return {}
  }
}

function saveMockProfile(profile: UserProfile) {
  const profiles = getMockProfiles()
  profiles[profile.uid] = profile
  localStorage.setItem(MOCK_PROFILES_KEY, JSON.stringify(profiles))
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  if (isFirebaseConfigured) {
    try {
      const db: Firestore = getFirestore(firebaseApp)
      const userDocRef = doc(db, 'users', profile.uid)
      await setDoc(userDocRef, profile, { merge: true })
      return
    } catch (err) {
      console.warn('Firestore saveUserProfile failed or permission denied, saving locally:', err)
    }
  }

  saveMockProfile(profile)
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured) {
    try {
      const db: Firestore = getFirestore(firebaseApp)
      const userDocRef = doc(db, 'users', uid)
      const snapshot = await getDoc(userDocRef)
      if (snapshot.exists()) {
        return snapshot.data() as UserProfile
      }
      return null
    } catch (err) {
      console.warn('Firestore getUserProfile failed, reading from local fallback:', err)
    }
  }

  const profiles = getMockProfiles()
  return profiles[uid] || null
}
