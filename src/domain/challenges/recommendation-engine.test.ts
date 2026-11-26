import { describe, it, expect } from 'vitest'
import { getAdaptiveRecommendation } from './recommendation-engine'
import type { SessionResult } from '@/services/persistence/indexed-db'

describe('Adaptive Recommendation Engine', () => {
  it('recommends onboarding challenge based on user goal when no prior sessions exist', () => {
    const recPublicSpeaking = getAdaptiveRecommendation(null, 'public-speaking')
    expect(recPublicSpeaking.challenge.id).toBe('the-60-second-challenge')
    expect(recPublicSpeaking.isBasedOnHabits).toBe(false)

    const recInterview = getAdaptiveRecommendation(null, 'interview-pitch')
    expect(recInterview.challenge.id).toBe('the-elevator-pitch')

    const recClarity = getAdaptiveRecommendation(null, 'clarity-articulation')
    expect(recClarity.challenge.id).toBe('make-your-point')
  })

  it('recommends pacing & pause drills when previous session was fast (>165 WPM)', () => {
    const mockFastSession: SessionResult = {
      id: 'session-1',
      recId: 'rec-1',
      createdAt: new Date().toISOString(),
      transcript: 'I talk really fast when I get excited or nervous about things.',
      wordsPerMinute: 182,
      wordCount: 13,
      fillerCount: 0,
      fillerPercentage: 0,
      pauseCount: 1,
      overallSummary: 'Fast pace',
      priorityArea: 'Pacing',
      priorityRecommendation: 'Slow down and insert pauses'
    }

    const rec = getAdaptiveRecommendation(mockFastSession, 'public-speaking')
    expect(rec.isBasedOnHabits).toBe(true)
    expect(rec.habitObserved).toContain('182 words/min')
    expect(rec.challenge.id).toBe('make-your-point')
  })

  it('recommends pause and filler recovery when previous session had high filler percentage', () => {
    const mockFillerSession: SessionResult = {
      id: 'session-2',
      recId: 'rec-2',
      createdAt: new Date().toISOString(),
      transcript: 'Um, like, basically we should, uh, launch tomorrow.',
      wordsPerMinute: 135,
      wordCount: 8,
      fillerCount: 3,
      fillerPercentage: 37.5,
      pauseCount: 2,
      overallSummary: 'Good ideas with some fillers',
      priorityArea: 'Word Fillers',
      priorityRecommendation: 'Use silent pause instead of um'
    }

    const rec = getAdaptiveRecommendation(mockFillerSession, 'public-speaking')
    expect(rec.isBasedOnHabits).toBe(true)
    expect(rec.habitObserved).toContain('Transition fillers')
    expect(rec.challenge.id).toBe('recover-gracefully')
  })

  it('recommends spontaneous quick thinking when user overthought or spoke very few words', () => {
    const mockHesitantSession: SessionResult = {
      id: 'session-3',
      recId: 'rec-3',
      createdAt: new Date().toISOString(),
      transcript: 'I think that... well...',
      wordsPerMinute: 92,
      wordCount: 5,
      fillerCount: 0,
      fillerPercentage: 0,
      pauseCount: 3,
      overallSummary: 'Cautious delivery',
      priorityArea: 'Spontaneity',
      priorityRecommendation: 'Trust your first thought'
    }

    const rec = getAdaptiveRecommendation(mockHesitantSession, 'public-speaking')
    expect(rec.isBasedOnHabits).toBe(true)
    expect(rec.challenge.id).toBe('five-second-response')
  })
})
