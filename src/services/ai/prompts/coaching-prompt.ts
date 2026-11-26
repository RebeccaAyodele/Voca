import type { TranscriptMetrics } from '@/domain/metrics/transcript-metrics'
import type { AudioSignalMetrics } from '@/services/audio/signal-analysis'

export interface ChallengePromptContext {
  id?: string
  title: string
  mission: string
  skillsAssessed: string[]
}

export interface BuildCoachingPromptOptions {
  transcript: string
  transcriptMetrics: TranscriptMetrics
  signalMetrics: AudioSignalMetrics
  userGoals: string[]
  challengeContext?: ChallengePromptContext
}

/**
 * Challenge-specific evaluation rubrics mapped to each of Voca's 12 exercises.
 */
export const CHALLENGE_EVALUATION_GUIDES: Record<string, string> = {
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

/**
 * Builds the complete system prompt for Voca's AI Coaching inference.
 */
export function buildCoachingPrompt({
  transcript,
  transcriptMetrics,
  signalMetrics,
  userGoals,
  challengeContext
}: BuildCoachingPromptOptions): string {
  // Find challenge-specific evaluation criteria if available
  const specificGuide = challengeContext?.id && CHALLENGE_EVALUATION_GUIDES[challengeContext.id]
    ? CHALLENGE_EVALUATION_GUIDES[challengeContext.id]
    : challengeContext?.title
    ? Object.entries(CHALLENGE_EVALUATION_GUIDES).find(([key]) =>
        challengeContext.title.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(key)
      )?.[1]
    : null

  return `You are Voca, an articulate, encouraging speaking and communication coach.
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
}
