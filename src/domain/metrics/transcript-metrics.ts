export interface FillerOccurrence {
  word: string
  count: number
}

export interface TranscriptMetrics {
  wordCount: number
  wordsPerMinute: number
  speakingDurationSeconds: number
  totalDurationSeconds: number
  fillerWordCount: number
  fillerPercentage: number
  fillerBreakdown: Record<string, number>
  vocabularyDiversity: number // 0.0 to 1.0 (Type-Token Ratio)
  uniqueWordsCount: number
  analysisVersion: string
}

const DEFAULT_FILLER_LEXICON = [
  'um',
  'uh',
  'er',
  'ah',
  'like',
  'you know',
  'actually',
  'basically',
  'sort of',
  'kind of',
  'i mean',
  'right'
]

export function calculateTranscriptMetrics(
  transcript: string,
  totalDurationSeconds: number,
  speakingDurationSeconds?: number,
  fillerLexicon = DEFAULT_FILLER_LEXICON
): TranscriptMetrics {
  const effectiveSpeechSeconds = Math.max(1, speakingDurationSeconds || totalDurationSeconds)
  const cleanText = transcript.trim()

  if (!cleanText) {
    return {
      wordCount: 0,
      wordsPerMinute: 0,
      speakingDurationSeconds: effectiveSpeechSeconds,
      totalDurationSeconds,
      fillerWordCount: 0,
      fillerPercentage: 0,
      fillerBreakdown: {},
      vocabularyDiversity: 0,
      uniqueWordsCount: 0,
      analysisVersion: '1.0.0-token'
    }
  }

  // Tokenize words
  const words = cleanText
    .toLowerCase()
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0)

  const wordCount = words.length
  const speechMinutes = effectiveSpeechSeconds / 60
  const wordsPerMinute = Math.round(wordCount / speechMinutes)

  // Filler detection using strict word boundaries
  const fillerBreakdown: Record<string, number> = {}
  let totalFillers = 0

  for (const filler of fillerLexicon) {
    // Regex matching whole phrase with word boundaries
    const escaped = filler.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi')
    const matches = cleanText.match(regex)
    if (matches && matches.length > 0) {
      fillerBreakdown[filler] = matches.length
      totalFillers += matches.length
    }
  }

  const fillerPercentage =
    wordCount > 0 ? parseFloat(((totalFillers / wordCount) * 100).toFixed(1)) : 0

  // Vocabulary Diversity (Type-Token Ratio)
  const uniqueWords = new Set(words)
  const uniqueWordsCount = uniqueWords.size
  const vocabularyDiversity =
    wordCount > 0 ? parseFloat((uniqueWordsCount / wordCount).toFixed(2)) : 0

  return {
    wordCount,
    wordsPerMinute,
    speakingDurationSeconds: parseFloat(effectiveSpeechSeconds.toFixed(1)),
    totalDurationSeconds: parseFloat(totalDurationSeconds.toFixed(1)),
    fillerWordCount: totalFillers,
    fillerPercentage,
    fillerBreakdown,
    vocabularyDiversity,
    uniqueWordsCount,
    analysisVersion: '1.0.0-token'
  }
}
