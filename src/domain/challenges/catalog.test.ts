import { describe, it, expect } from 'vitest'
import {
  CHALLENGES,
  CHALLENGE_CATEGORIES,
  TODAY_DAILY_CHALLENGE,
  getChallengeById,
  getChallengesByCategory
} from './catalog'

describe('Challenges Catalog', () => {
  it('contains exactly 12 structured challenges', () => {
    expect(CHALLENGES.length).toBe(12)
  })

  it('contains exactly 8 core communication categories', () => {
    expect(CHALLENGE_CATEGORIES.length).toBe(8)
  })

  it('every challenge has valid category, mission, prompt, focus points, and skills', () => {
    const validCategoryIds = new Set(CHALLENGE_CATEGORIES.map((c) => c.id))

    for (const challenge of CHALLENGES) {
      expect(validCategoryIds.has(challenge.categoryId)).toBe(true)
      expect(challenge.title).toBeTruthy()
      expect(challenge.mission).toBeTruthy()
      expect(challenge.speakingPrompt).toBeTruthy()
      expect(challenge.focusPoints.length).toBeGreaterThan(0)
      expect(challenge.skillsAssessed.length).toBeGreaterThan(0)
      expect(challenge.speakingDurationSeconds).toBeGreaterThanOrEqual(45)
      expect(challenge.prepDurationSeconds).toBeGreaterThanOrEqual(5)
    }
  })

  it('retrieves challenge by id correctly', () => {
    const challenge = getChallengeById('the-60-second-challenge')
    expect(challenge).toBeDefined()
    expect(challenge?.title).toBe('The 60-Second Challenge')
    expect(challenge?.difficulty).toBe('Beginner')
    expect(challenge?.skillsAssessed).toContain('Fluency')
  })

  it('retrieves challenges by category correctly', () => {
    const spontaneous = getChallengesByCategory('spontaneous-speaking')
    expect(spontaneous.length).toBe(2)
    expect(spontaneous.map((c) => c.id)).toContain('the-60-second-challenge')
    expect(spontaneous.map((c) => c.id)).toContain('five-second-response')
  })

  it('provides a curated default daily challenge', () => {
    expect(TODAY_DAILY_CHALLENGE).toBeDefined()
    expect(TODAY_DAILY_CHALLENGE.id).toBe('the-60-second-challenge')
  })
})
