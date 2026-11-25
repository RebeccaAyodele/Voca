export type ChallengeDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export type ChallengeCategoryId =
  | 'spontaneous-speaking'
  | 'thought-organisation'
  | 'everyday-conversation'
  | 'storytelling'
  | 'public-speaking'
  | 'voice-and-delivery'
  | 'professional-communication'
  | 'confidence-under-pressure'

export interface ChallengeCategory {
  id: ChallengeCategoryId
  title: string
  tagline: string
  challengeCount: number
}

export interface Challenge {
  id: string
  title: string
  categoryId: ChallengeCategoryId
  difficulty: ChallengeDifficulty
  estimatedMinutes: string
  tagline: string
  skillsAssessed: string[]
  mission: string
  speakingPrompt: string
  focusPoints: string[]
  prepDurationSeconds: number
  speakingDurationSeconds: number
}
