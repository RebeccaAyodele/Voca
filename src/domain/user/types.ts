export type SpeakingGoal =
  | 'public-speaking'
  | 'social-confidence'
  | 'clarity-articulation'
  | 'interviews-pitches'

export interface UserProfile {
  uid: string
  email: string | null
  displayName?: string | null
  isAnonymous: boolean
  goals: SpeakingGoal[]
  createdAt: string
  updatedAt: string
}
