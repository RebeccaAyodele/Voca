import { describe, it, expect } from 'vitest'
import { CoachingFeedbackSchema, generateCoachingFeedback } from './coaching'
import type { TranscriptMetrics } from '@/domain/metrics/transcript-metrics'
import type { AudioSignalMetrics } from '@/services/audio/signal-analysis'

describe('CoachingFeedbackSchema', () => {
  it('validates a conformant coaching feedback object', () => {
    const validData = {
      overallSummary: 'Strong, steady cadence with natural tonal warmth.',
      pacingReview: 'At 140 WPM, your delivery was comfortably within the optimal range.',
      strengths: [
        {
          title: 'Steady Rhythm',
          observation: 'Maintained composure throughout key ideas.',
          evidence: '140 WPM'
        }
      ],
      improvements: [
        {
          area: 'Filler Awareness',
          observation: 'Slight reliance on "um" when transitioning between thoughts.',
          recommendation: 'Embrace a quiet one-second pause instead of vocalizing.',
          evidence: '2 fillers detected'
        }
      ],
      nextExercise: {
        title: 'The Intentional Pause',
        instruction: 'Deliver a 15-second response inserting silence before every bullet point.',
        targetDurationSeconds: 15
      },
      inferenceMetadata: {
        requestedMode: 'PREFER_ON_DEVICE',
        actualSource: 'ON_DEVICE' as const,
        model: 'gemini-nano',
        latencyMs: 142
      }
    }

    const result = CoachingFeedbackSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects incomplete or malformed coaching data', () => {
    const invalidData = {
      overallSummary: 'Good talk',
      // missing pacingReview, strengths, improvements, nextExercise, inferenceMetadata
    }

    const result = CoachingFeedbackSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('generateCoachingFeedback fallback', () => {
  it('generates an evidence-grounded coaching assessment using local fallback', async () => {
    const mockTranscript = 'Good morning everyone. Today I want to walk through our quarterly product strategy. Um, we have seen exceptional adoption.'
    const mockTranscriptMetrics: TranscriptMetrics = {
      wordCount: 18,
      wordsPerMinute: 120,
      speakingDurationSeconds: 9.0,
      totalDurationSeconds: 10.0,
      fillerWordCount: 1,
      fillerPercentage: 5.6,
      fillerBreakdown: { um: 1 },
      vocabularyDiversity: 0.94,
      uniqueWordsCount: 17,
      analysisVersion: '1.0.0'
    }
    const mockSignalMetrics: AudioSignalMetrics = {
      durationSeconds: 9.0,
      speakingDurationSeconds: 8.1,
      pauseCount: 2,
      averagePauseDuration: 0.45,
      pauseDurations: [0.4, 0.5],
      rmsMean: 0.08,
      rmsVariation: 0.03,
      analysisVersion: '1.0.0'
    }

    const feedback = await generateCoachingFeedback(
      mockTranscript,
      mockTranscriptMetrics,
      mockSignalMetrics,
      ['executive-presence']
    )

    expect(feedback).toBeDefined()
    expect(feedback.overallSummary).toBeTruthy()
    expect(feedback.pacingReview).toBeTruthy()
    expect(feedback.strengths.length).toBeGreaterThan(0)
    expect(feedback.improvements.length).toBeGreaterThan(0)
    expect(feedback.nextExercise.title).toBeTruthy()
    expect(feedback.inferenceMetadata).toBeDefined()
    expect(['ON_DEVICE', 'IN_CLOUD', 'UNKNOWN']).toContain(feedback.inferenceMetadata.actualSource)
  })
})
