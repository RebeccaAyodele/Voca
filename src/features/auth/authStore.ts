import { create } from 'zustand'
import type { AuthUser } from '@/services/firebase/auth'
import type { UserProfile, SpeakingGoal } from '@/domain/user/types'
import {
  subscribeToAuthState,
  signOut as authSignOut,
  signInAsGuest as authSignInAsGuest,
  signInWithEmail as authSignInWithEmail,
  signUpWithEmail as authSignUpWithEmail
} from '@/services/firebase/auth'
import { getUserProfile, saveUserProfile } from '@/services/firebase/firestore'

interface AuthState {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  initialized: boolean

  init: () => () => void
  signInAsGuest: () => Promise<void>
  signInWithEmail: (email: string, pass: string) => Promise<void>
  signUpWithEmail: (email: string, pass: string) => Promise<void>
  signOut: () => Promise<void>
  updateGoals: (goals: SpeakingGoal[]) => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,
  initialized: false,

  init: () => {
    return subscribeToAuthState(async (authUser) => {
      if (authUser) {
        set({ user: authUser, loading: true })
        let profile = await getUserProfile(authUser.uid)
        if (!profile) {
          profile = {
            uid: authUser.uid,
            email: authUser.email,
            isAnonymous: authUser.isAnonymous,
            goals: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          await saveUserProfile(profile)
        }
        set({ user: authUser, profile, loading: false, initialized: true })
      } else {
        set({ user: null, profile: null, loading: false, initialized: true })
      }
    })
  },

  signInAsGuest: async () => {
    try {
      set({ loading: true, error: null })
      const user = await authSignInAsGuest()
      let profile = await getUserProfile(user.uid)
      if (!profile) {
        profile = {
          uid: user.uid,
          email: null,
          isAnonymous: true,
          goals: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        await saveUserProfile(profile)
      }
      set({ user, profile, loading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in as guest'
      set({ error: message, loading: false })
      throw err
    }
  },

  signInWithEmail: async (email: string, pass: string) => {
    try {
      set({ loading: true, error: null })
      const user = await authSignInWithEmail(email, pass)
      const profile = await getUserProfile(user.uid)
      set({ user, profile, loading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid email or password'
      set({ error: message, loading: false })
      throw err
    }
  },

  signUpWithEmail: async (email: string, pass: string) => {
    try {
      set({ loading: true, error: null })
      const user = await authSignUpWithEmail(email, pass)
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email,
        isAnonymous: false,
        goals: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      await saveUserProfile(profile)
      set({ user, profile, loading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create account'
      set({ error: message, loading: false })
      throw err
    }
  },

  signOut: async () => {
    await authSignOut()
    set({ user: null, profile: null, loading: false })
  },

  updateGoals: async (goals: SpeakingGoal[]) => {
    const { user, profile } = get()
    if (!user || !profile) return

    const updated: UserProfile = {
      ...profile,
      goals,
      updatedAt: new Date().toISOString()
    }
    await saveUserProfile(updated)
    set({ profile: updated })
  },

  clearError: () => set({ error: null })
}))
