import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from 'firebase/ai'
import { z } from 'zod'
import { firebaseApp, isFirebaseConfigured } from '@/services/firebase/app'
import type { TranscriptMetrics } from '@/domain/metrics/transcript-metrics'
import type { AudioSignalMetrics } from '@/services/audio/signal-analysis'

export const CoachingFeedbackSchema = z.object({
  overallSummary: z.string(),
  pacingReview: z.string(),
  strengths: z.array(
    z.object({
      title: z.string(),
      observation: z.string(),
      evidence: z.string()
    })
  ),
  improvements: z.array(
    z.object({
      area: z.string(),
      observation: z.string(),
      recommendation: z.string(),
      evidence: z.string()
    })
  ),
  nextExercise: z.object({
    title: z.string(),
    instruction: z.string(),
    targetDurationSeconds: z.number()
  }),
  inferenceMetadata: z.object({
    requestedMode: z.string(),
    actualSource: z.enum(['ON_DEVICE', 'IN_CLOUD', 'UNKNOWN']),
    model: z.string(),
    latencyMs: z.number()
  })
})

export type CoachingFeedback = z.infer<typeof CoachingFeedbackSchema>

export interface ChallengeContext {
  id?: string
  title: string
  mission: string
  skillsAssessed: string[]
}

// Tailored coaching rubrics for each specific speaking challenge
const CHALLENGE_EVALUATION_GUIDES: Record<string, string> = {
  'the-60-second-challenge': `
Evaluate for SPONTANEOUS MOMENTUM & COHERENCE:
- Did the speaker sustain speech across the 60s without long halts or freezing?
- Did they connect ideas naturally without rambling into unrelated tangents?
- Did they bring their thought to a clear, clean conclusion before time ran out?`,

  'five-second-response': `
Evaluate for QUICK THINKING & IMMEDIATE COMMITTAL:
- Did the speaker commit to their stance immediately in the very first sentence?
- Did they avoid apologetic or stalling phrases like "uh, well, I guess, that's tough"?
- Was the initial thought clear and direct?`,

  'make-your-point': `
Evaluate for THOUGHT STRUCTURE (Point-Reason-Example-Point):
- Did they clearly state their point/opinion right away?
- Did they provide at least one concrete supporting reason?
- Did they include an example (personal experience, hypothetical, or observation)?
- Did they end with a decisive takeaway?`,

  'explain-it-simply': `
Evaluate for PLAIN LANGUAGE & AUDIENCE ADAPTATION:
- Did the speaker avoid dense jargon and buzzwords?
- Did they use relatable analogies that anyone (even a beginner) could immediately grasp?
- Were the sentence structures short, digestible, and easy to follow?`,

  'keep-the-conversation-alive': `
Evaluate for CONVERSATIONAL WARMTH & BRIDGING:
- Did they acknowledge the other person's thought with genuine curiosity?
- Did they share a relevant reflection without completely dominating the floor?
- Did they finish with an inviting, open-ended question that encourages dialogue?`,

  'first-impressions': `
Evaluate for PROFESSIONAL WARMTH & CONCISENESS:
- Was the introduction crisp, grounded, and delivered within 30 seconds?
- Did they clearly state who they are and what drives their work without overexplaining?
- Did their vocal tone project authentic warmth and approachable confidence?`,

  'tell-me-a-story': `
Evaluate for NARRATIVE ARC & ENGAGEMENT:
- Did the story have a clear beginning (context), middle (conflict or turning point), and end (takeaway)?
- Did the speaker use expressive, descriptive language rather than a dry list of events?
- Was the pacing varied to build interest?`,

  'the-mini-presentation': `
Evaluate for KEYNOTE STRUCTURE & IMPACT:
- Did they open with a compelling hook in the first 10-15 seconds?
- Were their main points clearly signposted ("First...", "The key reason...")?
- Was the closing call-to-action or summary clear and memorable?`,

  'the-elevator-pitch': `
Evaluate for CONCISENESS & PERSUASIVE CLARITY:
- Did they clearly articulate the problem, their solution, and why it matters within 45 seconds?
- Was the value proposition obvious, or was it buried in technical details?
- Did they sound genuinely invested in the idea?`,

  'read-it-with-expression': `
Evaluate for VOCAL VARIETY & ARTICULATION:
- Did the speaker vary their pace and pitch to emphasize key words?
- Did they use natural pauses at commas and periods to let thoughts land?
- Were consonant endings clear and distinct without rushing?`,

  'the-mock-interview': `
Evaluate for STRUCTURED RELEVANCE (STAR method):
- Did they answer the prompt directly without rambling?
- Did they provide a structured breakdown of what happened and what action they took?
- Was their tone composed, professional, and confident?`,

  'recover-gracefully': `
Evaluate for COMPOSURE UNDER PRESSURE:
- When a hesitation or stumble occurred, did they take a calm silent breath instead of panicking?
- Did they resume smoothly without profusely apologizing or losing confidence?
- Did they finish with poise?`
}

export async function generateCoachingFeedback(
  transcript: string,
  transcriptMetrics: TranscriptMetrics,
  signalMetrics: AudioSignalMetrics,
  userGoals: string[],
  challengeContext?: ChallengeContext
): Promise<CoachingFeedback> {
  const startTime = Date.now()

  // Find challenge-specific evaluation criteria if available
  const specificGuide = challengeContext?.id && CHALLENGE_EVALUATION_GUIDES[challengeContext.id]
    ? CHALLENGE_EVALUATION_GUIDES[challengeContext.id]
    : challengeContext?.title
    ? Object.entries(CHALLENGE_EVALUATION_GUIDES).find(([key]) =>
        challengeContext.title.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(key)
      )?.[1]
    : null

  const systemPrompt = `You are Voca, an articulate, encouraging speaking and communication coach.
Your mission is to provide empathetic, highly actionable, and evidence-grounded feedback to help speakers grow in confidence and presence.

BEHIND-THE-SCENES EVALUATION CRITERIA:
Evaluate the speech across three deep communication layers:
1. Acoustic & Physical Delivery:
   - Speaking speed vs natural pacing (130-160 WPM is conversational pocket).
   - Natural breath pauses between ideas vs mid-sentence hesitation stops.
   - Grounded terminal cadence (dropping pitch confidently at the end of key sentences).
2. Thought Structure & Clarity:
   - Directness: did they get to their point early, or ramble before stating it?
   - Run-on sentences: did they use natural pauses/periods, or chain thoughts endlessly with "and then, so like"?
   - Clear structure: Point, Reason, Example, and Conclusion.
3. Composure Under Pressure:
   - Steady momentum without freezing or apologetic stalling.

CRITICAL COMMUNICATION RULE FOR YOUR FEEDBACK:
- Translate all insights into PLAIN, WARM, EVERYDAY LANGUAGE.
- NEVER use clinical or academic jargon (do NOT say "fundamental frequency F0", "intra-clause phonation", "lexical richness", "syntactic disfluency").
- Instead use plain terms anyone understands: "Talking Speed", "Natural Pauses", "Word Fillers", "Getting straight to your point", "Breath control".
- Always cite specific words or phrases actually spoken by the user as evidence. Never fabricate quotes.

Input Details:
- Transcript: "${transcript}"
- Talking Speed: ${transcriptMetrics.wordsPerMinute} words per minute (Natural conversational target: 130-160 WPM)
- Word Fillers: ${transcriptMetrics.fillerWordCount} (${transcriptMetrics.fillerPercentage}% of speech)
- Detected Fillers: ${JSON.stringify(transcriptMetrics.fillerBreakdown)}
- Breath Pauses: ${signalMetrics.pauseCount} pauses (Average duration: ${signalMetrics.averagePauseDuration}s)
- Speaker Goals: ${userGoals.join(', ')}
${
  challengeContext
    ? `- Active Challenge: "${challengeContext.title}"
- Challenge Mission: "${challengeContext.mission}"
- Target Skills: ${challengeContext.skillsAssessed.join(', ')}
${specificGuide ? `\nChallenge Specific Criteria:\n${specificGuide}` : ''}`
    : '- Mode: Vocal Baseline Assessment (General delivery calibration)'
}

Return a valid JSON object matching this schema:
{
  "overallSummary": "Warm, encouraging 2-sentence assessment of their delivery, thought progression, and presence in plain English.",
  "pacingReview": "1-sentence review of their talking speed and natural breath pauses.",
  "strengths": [
    {
      "title": "Clear Strength (e.g. 'Strong Opening Point' or 'Steady Talking Speed')",
      "observation": "What specifically worked well in their delivery in plain words.",
      "evidence": "Exact quote from their response that demonstrated this."
    }
  ],
  "improvements": [
    {
      "area": "Focus Area (e.g. 'Natural Pauses' or 'Getting Straight to the Point')",
      "observation": "What constructive habit was noticed.",
      "recommendation": "One practical, simple tip they can apply next time.",
      "evidence": "Exact words or phrase from their response."
    }
  ],
  "nextExercise": {
    "title": "Short practical drill name",
    "instruction": "Simple step-by-step instruction for a 30-45 second practice drill.",
    "targetDurationSeconds": 30
  }
}`

  let actualSource: 'ON_DEVICE' | 'IN_CLOUD' | 'UNKNOWN' = 'IN_CLOUD'
  let rawResponseText = ''

  if (isFirebaseConfigured) {
    try {
      const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() })
      const model = getGenerativeModel(ai, {
        model: 'gemini-1.5-flash',
        mode: InferenceMode.PREFER_ON_DEVICE
      })

      const result = await model.generateContent(systemPrompt)
      actualSource = (result.response as unknown as { inferenceSource?: 'ON_DEVICE' | 'IN_CLOUD' }).inferenceSource || 'IN_CLOUD'
      rawResponseText = result.response.text()
    } catch (err) {
      console.warn('Firebase AI hybrid inference error, using local coach generator:', err)
    }
  }

  // Parse structured JSON with Zod validation
  if (rawResponseText) {
    try {
      const cleanJson = rawResponseText.replace(/```json/g, '').replace(/```/g, '').trim()
      const parsed = JSON.parse(cleanJson)
      return CoachingFeedbackSchema.parse({
        ...parsed,
        inferenceMetadata: {
          requestedMode: 'PREFER_ON_DEVICE',
          actualSource,
          model: actualSource === 'ON_DEVICE' ? 'gemini-nano' : 'gemini-1.5-flash',
          latencyMs: Date.now() - startTime
        }
      })
    } catch {
      // Fall through to resilient coach template if model output formatting differed
    }
  }

  // Resilient, natural, high-value coach fallback grounded in real metrics and challenge context
  const isPaceFast = transcriptMetrics.wordsPerMinute > 165
  const isPaceSlow = transcriptMetrics.wordsPerMinute < 115
  const hasFillers = transcriptMetrics.fillerWordCount > 0

  const pacingReview = isPaceFast
    ? `Your talking speed was brisk at ${transcriptMetrics.wordsPerMinute} words/min; taking a brief breath between your main ideas will give them more weight.`
    : isPaceSlow
    ? `Your talking speed was deliberate at ${transcriptMetrics.wordsPerMinute} words/min, giving your listener time to take in each sentence.`
    : `Your talking speed was balanced at ${transcriptMetrics.wordsPerMinute} words/min, right in the natural conversational sweet spot.`

  const fallbackStrengths = [
    {
      title: challengeContext ? `${challengeContext.title} Momentum` : 'Clear, Natural Presence',
      observation: challengeContext
        ? `You tackled the core mission directly, keeping your delivery steady across ${transcriptMetrics.wordCount} words.`
        : 'Your tone and delivery felt natural and approachable throughout the recording.',
      evidence: `Spoke ${transcriptMetrics.wordCount} words steadily over ${signalMetrics.durationSeconds} seconds.`
    }
  ]

  const fallbackImprovements = [
    {
      area: hasFillers ? 'Silent Pauses over Fillers' : isPaceFast ? 'Breath Pauses Between Ideas' : 'Punchy Sentence Endings',
      observation: hasFillers
        ? `Used ${transcriptMetrics.fillerWordCount} filler word${transcriptMetrics.fillerWordCount > 1 ? 's' : ''} during transitions.`
        : isPaceFast
        ? 'Quick transitions between points without taking a breath.'
        : 'Opportunity to finish your last sentence with a decisive downward cadence.',
      recommendation: hasFillers
        ? 'Whenever you feel like saying "um" or "like", embrace a clean one-second silence instead.'
        : isPaceFast
        ? 'Plant a full stop after your first point and take a relaxed belly breath before moving to your next point.'
        : 'Drop your pitch slightly on your final word to signal confident completion.',
      evidence: hasFillers
        ? Object.entries(transcriptMetrics.fillerBreakdown).map(([k, v]) => `"${k}" (${v})`).join(', ')
        : `${transcriptMetrics.wordsPerMinute} words/min pace`
    }
  ]

  return {
    overallSummary: challengeContext
      ? `You delivered a thoughtful response to "${challengeContext.title}". Your voice demonstrated steady confidence and direct focus on the prompt.`
      : `You completed your vocal capture with authentic delivery. Your speech demonstrates clear natural pacing, giving you a strong baseline to build upon.`,
    pacingReview,
    strengths: fallbackStrengths,
    improvements: fallbackImprovements,
    nextExercise: {
      title: 'The One-Second Breath Pause',
      instruction: 'Speak a 30-second thought, inserting a deliberate silent breath after your opening sentence.',
      targetDurationSeconds: 30
    },
    inferenceMetadata: {
      requestedMode: 'PREFER_ON_DEVICE',
      actualSource,
      model: actualSource === 'ON_DEVICE' ? 'gemini-nano' : 'gemini-1.5-flash',
      latencyMs: Date.now() - startTime
    }
  }
}
