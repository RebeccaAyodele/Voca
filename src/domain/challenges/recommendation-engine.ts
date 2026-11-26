import { CHALLENGES, getChallengeById } from './catalog'
import type { Challenge } from './types'
import type { SessionResult } from '@/services/persistence/indexed-db'

export interface AdaptiveChallengeRecommendation {
  challenge: Challenge
  habitObserved: string
  recommendationReason: string
  focusTip: string
  isBasedOnHabits: boolean
}

/**
 * Adaptive Recommendation Engine
 * Analyzes the user's historical speech habits (measured talking speed,
 * filler frequency, pause control, and AI coach priority areas) to prescribe
 * the exact challenge that targets their current growth edge.
 *
 * Runs locally and works 100% offline without cloud round-trips.
 */
export function getAdaptiveRecommendation(
  latestSession: SessionResult | null,
  primaryGoal?: string
): AdaptiveChallengeRecommendation {
  // If no sessions yet, provide onboarding recommendation based on goal
  if (!latestSession) {
    if (primaryGoal === 'interview-pitch') {
      const c = getChallengeById('the-elevator-pitch') || CHALLENGES[0]!
      return {
        challenge: c,
        habitObserved: 'New speaker setup',
        recommendationReason: 'Start by crafting a crisp 30-second introduction to establish your professional baseline.',
        focusTip: 'State who you are and what drives you in your opening sentence.',
        isBasedOnHabits: false
      }
    }
    if (primaryGoal === 'clarity-articulation') {
      const c = getChallengeById('make-your-point') || CHALLENGES[0]!
      return {
        challenge: c,
        habitObserved: 'New speaker setup',
        recommendationReason: 'Practice structuring opinions with the Point-Reason-Example framework.',
        focusTip: 'State your opinion clearly before giving supporting reasons.',
        isBasedOnHabits: false
      }
    }
    if (primaryGoal === 'social-confidence') {
      const c = getChallengeById('five-second-response') || CHALLENGES[0]!
      return {
        challenge: c,
        habitObserved: 'New speaker setup',
        recommendationReason: 'Train your instincts to speak without overthinking by answering within five seconds.',
        focusTip: 'Commit to your first thought and avoid apologetic qualifiers.',
        isBasedOnHabits: false
      }
    }

    const c = CHALLENGES[0]! // The 60-Second Challenge
    return {
      challenge: c,
      habitObserved: 'Vocal baseline kickoff',
      recommendationReason: 'Build spontaneous momentum by speaking about a single idea for one full minute.',
      focusTip: 'Keep your delivery steady without halting or feeling rushed.',
      isBasedOnHabits: false
    }
  }

  // -----------------------------------------------------------
  // HABIT ANALYSIS 1: Rushed Talking Speed (> 165 words/min)
  // Needs: Pacing control, deliberate pauses, down-talk cadence
  // -----------------------------------------------------------
  if (latestSession.wordsPerMinute > 165) {
    const c = getChallengeById('make-your-point') || CHALLENGES[0]!
    return {
      challenge: c,
      habitObserved: `Brisk talking speed (${latestSession.wordsPerMinute} words/min)`,
      recommendationReason: `In your last take, your cadence was fast (${latestSession.wordsPerMinute} WPM). Today, focus on inserting a calm 1-second breath pause after every key point.`,
      focusTip: 'Plant a clean pause after stating your opinion before moving to your reason.',
      isBasedOnHabits: true
    }
  }

  // -----------------------------------------------------------
  // HABIT ANALYSIS 2: High Filler Words (> 3% or > 2 fillers)
  // Needs: Replacing verbal crutches with silent pauses
  // -----------------------------------------------------------
  if (latestSession.fillerPercentage > 3 || latestSession.fillerCount >= 2) {
    const c = getChallengeById('recover-gracefully') || getChallengeById('the-60-second-challenge') || CHALLENGES[0]!
    return {
      challenge: c,
      habitObserved: `Transition fillers (${latestSession.fillerCount} detected in last session)`,
      recommendationReason: `You tended to bridge ideas with fillers like "${latestSession.priorityArea}". Practice holding comfortable silence instead of vocalizing transitions.`,
      focusTip: 'Whenever you feel like saying "um" or "like", close your lips and take a silent breath.',
      isBasedOnHabits: true
    }
  }

  // -----------------------------------------------------------
  // HABIT ANALYSIS 3: Hesitation / Few Words Spoken (Under 115 WPM or < 25 words)
  // Needs: Spontaneity, quick thinking, overcoming paralysis
  // -----------------------------------------------------------
  if (latestSession.wordsPerMinute < 115 || latestSession.wordCount < 25) {
    const c = getChallengeById('five-second-response') || CHALLENGES[0]!
    return {
      challenge: c,
      habitObserved: 'Overthinking before speaking',
      recommendationReason: 'Your last session had pauses while searching for words. Today, let instinct take over with rapid 5-second response drills.',
      focusTip: 'Do not wait for the perfect word; state your immediate thought and build from there.',
      isBasedOnHabits: true
    }
  }

  // -----------------------------------------------------------
  // HABIT ANALYSIS 4: Good Pace & Low Fillers
  // Needs: Advanced storytelling or elevator pitch mastery
  // -----------------------------------------------------------
  if (primaryGoal === 'interview-pitch') {
    const c = getChallengeById('the-elevator-pitch') || CHALLENGES[0]!
    return {
      challenge: c,
      habitObserved: 'Solid pacing foundation',
      recommendationReason: 'Your delivery rhythm is steady. Now practice high-impact conciseness: articulate a problem and value proposition in 45 seconds.',
      focusTip: 'Hook your listener in the first 10 seconds before detailing the solution.',
      isBasedOnHabits: true
    }
  }

  const c = getChallengeById('tell-me-a-story') || getChallengeById('the-mini-presentation') || CHALLENGES[0]!
  return {
    challenge: c,
    habitObserved: 'Balanced rhythm & clear flow',
    recommendationReason: 'With your pacing balanced, step up to narrative structure: guide listeners through context, turning point, and takeaway.',
    focusTip: 'Vary your voice slightly when describing the turning point.',
    isBasedOnHabits: true
  }
}
