import { describe, it, expect } from 'vitest'
import { calculateTranscriptMetrics } from './transcript-metrics'

describe('Transcript Metrics Calculator', () => {
  it('handles empty transcripts correctly without dividing by zero', () => {
    const metrics = calculateTranscriptMetrics('', 15, 12)
    expect(metrics.wordCount).toBe(0)
    expect(metrics.wordsPerMinute).toBe(0)
    expect(metrics.fillerWordCount).toBe(0)
    expect(metrics.fillerPercentage).toBe(0)
  })

  it('calculates speaking rate (WPM) accurately', () => {
    // 30 words in 15 seconds (0.25 min) = 120 WPM
    const words = Array(30).fill('hello').join(' ')
    const metrics = calculateTranscriptMetrics(words, 15, 15)
    expect(metrics.wordCount).toBe(30)
    expect(metrics.wordsPerMinute).toBe(120)
  })

  it('detects filler words strictly on word boundaries', () => {
    // "umbrella" and "alike" should NOT trigger "um" or "like"
    const text = 'Um, I was alike an umbrella, like you know, actually speaking.'
    const metrics = calculateTranscriptMetrics(text, 10, 8)

    expect(metrics.fillerBreakdown['um']).toBe(1)
    expect(metrics.fillerBreakdown['like']).toBe(1)
    expect(metrics.fillerBreakdown['you know']).toBe(1)
    expect(metrics.fillerBreakdown['actually']).toBe(1)
    expect(metrics.fillerWordCount).toBe(4)
  })

  it('computes vocabulary diversity as Type-Token Ratio', () => {
    const text = 'The quick brown fox jumps over the lazy dog'
    const metrics = calculateTranscriptMetrics(text, 10)
    // 9 words total, 8 unique ("the" repeated twice) -> 8/9 ≈ 0.89
    expect(metrics.vocabularyDiversity).toBeCloseTo(0.89, 1)
  })
})
