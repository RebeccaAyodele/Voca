import type { Challenge, ChallengeCategory } from './types'

export const CHALLENGE_CATEGORIES: ChallengeCategory[] = [
  {
    id: 'spontaneous-speaking',
    title: 'Spontaneous speaking',
    tagline: 'Think quickly. Speak naturally.',
    challengeCount: 2
  },
  {
    id: 'thought-organisation',
    title: 'Thought organisation',
    tagline: 'Structure your ideas clearly.',
    challengeCount: 2
  },
  {
    id: 'everyday-conversation',
    title: 'Everyday conversation',
    tagline: 'Connect and communicate.',
    challengeCount: 2
  },
  {
    id: 'storytelling',
    title: 'Storytelling',
    tagline: 'Make your stories engaging.',
    challengeCount: 1
  },
  {
    id: 'public-speaking',
    title: 'Public speaking',
    tagline: 'Present with confidence.',
    challengeCount: 2
  },
  {
    id: 'voice-and-delivery',
    title: 'Voice and delivery',
    tagline: 'Improve how you sound.',
    challengeCount: 1
  },
  {
    id: 'professional-communication',
    title: 'Professional communication',
    tagline: 'Communicate effectively at work.',
    challengeCount: 1
  },
  {
    id: 'confidence-under-pressure',
    title: 'Confidence under pressure',
    tagline: 'Stay composed when speaking.',
    challengeCount: 1
  }
]

export const CHALLENGES: Challenge[] = [
  {
    id: 'the-60-second-challenge',
    title: 'The 60-Second Challenge',
    categoryId: 'spontaneous-speaking',
    difficulty: 'Beginner',
    estimatedMinutes: '2–3 min',
    tagline: 'Speak about a random topic for one minute without preparation.',
    skillsAssessed: ['Fluency', 'Vocabulary', 'Coherence'],
    mission: 'Speak continuously about the prompt for 60 seconds without long halts. Express a complete thought from start to finish.',
    speakingPrompt: 'If you could change one thing about how modern cities are designed, what would it be and why?',
    focusPoints: [
      'Keep your flow steady without feeling rushed.',
      'Connect thoughts with natural transitions.',
      'Conclude cleanly before the timer ends.'
    ],
    prepDurationSeconds: 15,
    speakingDurationSeconds: 60
  },
  {
    id: 'five-second-response',
    title: 'Five-Second Response',
    categoryId: 'spontaneous-speaking',
    difficulty: 'Intermediate',
    estimatedMinutes: '3–5 min',
    tagline: 'Answer unexpected questions within five seconds.',
    skillsAssessed: ['Spontaneity', 'Response organisation'],
    mission: 'You have only 5 seconds to think before your mic goes live. Trust your instincts and construct an immediate answer.',
    speakingPrompt: 'What is an underrated skill that everyone should learn in their twenties?',
    focusPoints: [
      'Do not freeze; commit to your first thought.',
      'State your thesis in the very first sentence.',
      'Wrap up with one strong takeaway.'
    ],
    prepDurationSeconds: 5,
    speakingDurationSeconds: 45
  },
  {
    id: 'make-your-point',
    title: 'Make Your Point',
    categoryId: 'thought-organisation',
    difficulty: 'Intermediate',
    estimatedMinutes: '3–5 min',
    tagline: 'Clearly state your opinion, explain why you believe it and give an example.',
    skillsAssessed: ['Structure', 'Clarity', 'Reasoning'],
    mission: 'Answer the question below. Clearly state your opinion, explain why you believe it and give an example.',
    speakingPrompt: 'Do you think people spend too much time worrying about what others think of them?',
    focusPoints: [
      'Start with a clear opinion.',
      'Give at least one supporting reason.',
      'Include a real or hypothetical example.',
      'End with a conclusion.'
    ],
    prepDurationSeconds: 15,
    speakingDurationSeconds: 60
  },
  {
    id: 'explain-it-simply',
    title: 'Explain It Simply',
    categoryId: 'thought-organisation',
    difficulty: 'Intermediate',
    estimatedMinutes: '3–5 min',
    tagline: 'Take a complex concept and explain it so a 10-year-old would understand.',
    skillsAssessed: ['Clarity', 'Vocabulary', 'Audience adaptation'],
    mission: 'Deconstruct an intricate idea using vivid metaphors and zero unnecessary jargon.',
    speakingPrompt: 'Explain how the Internet works as if you are explaining it to a curious 10-year-old.',
    focusPoints: [
      'Use a relatable physical metaphor (like postal letters or roads).',
      'Avoid technical jargon.',
      'Ensure the core mechanism is crystal clear.'
    ],
    prepDurationSeconds: 20,
    speakingDurationSeconds: 60
  },
  {
    id: 'keep-the-conversation-alive',
    title: 'Keep the Conversation Alive',
    categoryId: 'everyday-conversation',
    difficulty: 'Beginner',
    estimatedMinutes: '3–5 min',
    tagline: 'Answer warmly and toss the conversational ball back.',
    skillsAssessed: ['Responsiveness', 'Listening', 'Conversational flow'],
    mission: 'Respond to a casual remark, share a personal touchpoint, and end with an open question to invite connection.',
    speakingPrompt: "A colleague says: 'I'm thinking of unplugging and going on a solo camping trip this weekend to clear my head.'",
    focusPoints: [
      'Acknowledge their thought with genuine warmth.',
      'Share a quick relevant observation or thought.',
      'Toss the ball back with an open-ended question.'
    ],
    prepDurationSeconds: 15,
    speakingDurationSeconds: 60
  },
  {
    id: 'first-impressions',
    title: 'First Impressions',
    categoryId: 'everyday-conversation',
    difficulty: 'Beginner',
    estimatedMinutes: '2–3 min',
    tagline: 'Introduce yourself memorably in under 45 seconds.',
    skillsAssessed: ['Confidence', 'Clarity', 'Introductions'],
    mission: 'Deliver a warm, concise self-introduction that highlights who you are, what you care about, and sparks curiosity.',
    speakingPrompt: "You're at a networking gathering or team kickoff. Introduce who you are and one thing you're genuinely excited about right now.",
    focusPoints: [
      'State your name with clear vocal presence.',
      'Focus on what excites you, not just credentials.',
      'Keep your tone warm and inviting.'
    ],
    prepDurationSeconds: 15,
    speakingDurationSeconds: 45
  },
  {
    id: 'tell-me-a-story',
    title: 'Tell Me a Story',
    categoryId: 'storytelling',
    difficulty: 'Intermediate',
    estimatedMinutes: '3–5 min',
    tagline: 'Make your stories engaging with clear narrative arc.',
    skillsAssessed: ['Narrative structure', 'Expression'],
    mission: 'Craft a vivid 90-second story with setting, a turning point or conflict, and a meaningful resolution.',
    speakingPrompt: 'Tell a story about a time something went completely off-script, and how you navigated it.',
    focusPoints: [
      'Set the scene in the first 10 seconds.',
      'Build to the decisive moment or turning point.',
      'Share what changed or what was learned.'
    ],
    prepDurationSeconds: 25,
    speakingDurationSeconds: 90
  },
  {
    id: 'the-mini-presentation',
    title: 'The Mini Presentation',
    categoryId: 'public-speaking',
    difficulty: 'Intermediate',
    estimatedMinutes: '3–5 min',
    tagline: 'Present with confidence, structure, and audience engagement.',
    skillsAssessed: ['Structure', 'Delivery', 'Audience engagement'],
    mission: 'Present an idea cleanly to a group: capture attention, articulate two supporting points, and leave a memorable closing.',
    speakingPrompt: 'Present why regular walking or movement during the workday dramatically improves creative problem solving.',
    focusPoints: [
      'Open with a compelling hook or provocative question.',
      'Deliver two distinct, well-paced arguments.',
      'End with an actionable call to action.'
    ],
    prepDurationSeconds: 25,
    speakingDurationSeconds: 90
  },
  {
    id: 'read-it-with-expression',
    title: 'Read It With Expression',
    categoryId: 'voice-and-delivery',
    difficulty: 'Beginner',
    estimatedMinutes: '2–3 min',
    tagline: 'Improve how you sound through vocal variety and pacing.',
    skillsAssessed: ['Articulation', 'Pacing', 'Vocal variation'],
    mission: 'Read the supplied passage aloud. Avoid robotic cadence; modulate your tempo and emphasize operative verbs and nouns.',
    speakingPrompt: "“We do not learn from experience... we learn from reflecting on experience. When we rush from one commitment to the next, we collect moments without extracting their meaning. The courage to pause is the real catalyst of wisdom.”",
    focusPoints: [
      'Vary your pitch between sentences.',
      'Pause after pivotal words for emphasis.',
      'Articulate consonant endings crisply.'
    ],
    prepDurationSeconds: 20,
    speakingDurationSeconds: 60
  },
  {
    id: 'the-elevator-pitch',
    title: 'The Elevator Pitch',
    categoryId: 'professional-communication',
    difficulty: 'Advanced',
    estimatedMinutes: '2–3 min',
    tagline: 'Distill a high-impact proposition in 45 seconds flat.',
    skillsAssessed: ['Conciseness', 'Persuasion', 'Clarity'],
    mission: 'Hook the listener with a painful problem, introduce the elegant solution, and state the value clearly.',
    speakingPrompt: 'Pitch an innovative product, service, or tool that solves a daily frustration you deal with regularly.',
    focusPoints: [
      'Hook with the specific friction.',
      'Clearly explain the unique advantage.',
      'Close with a decisive, memorable vision.'
    ],
    prepDurationSeconds: 15,
    speakingDurationSeconds: 45
  },
  {
    id: 'the-mock-interview',
    title: 'The Mock Interview',
    categoryId: 'public-speaking',
    difficulty: 'Advanced',
    estimatedMinutes: '3–5 min',
    tagline: 'Structure a behavioral interview response with composure.',
    skillsAssessed: ['Structure', 'Responsiveness', 'Composure'],
    mission: 'Answer a classic behavioral question with composure: Situation, Task, Action, and Result.',
    speakingPrompt: 'Tell me about a time you had a strong disagreement with a team member or leader. How did you handle it?',
    focusPoints: [
      'Give quick context without getting bogged down in backstory.',
      'Focus 60% of your time on YOUR specific actions.',
      'Highlight the concrete resolution or lesson.'
    ],
    prepDurationSeconds: 25,
    speakingDurationSeconds: 90
  },
  {
    id: 'recover-gracefully',
    title: 'Recover Gracefully',
    categoryId: 'confidence-under-pressure',
    difficulty: 'Advanced',
    estimatedMinutes: '2–3 min',
    tagline: 'Stay composed when speaking and pivot smoothly under pressure.',
    skillsAssessed: ['Composure', 'Adaptability', 'Fluency'],
    mission: 'Start speaking, deliberately pause at 20 seconds as if you lost your thought, take a calm breath, and bridge back smoothly without apologizing profusely.',
    speakingPrompt: "Explain an idea you find fascinating. Halfway through, take a 2-second silent breath, reset your posture, and bridge back with 'What this highlights most is...' and finish strong.",
    focusPoints: [
      "Do not say 'Sorry' or panic.",
      'Use silence as a sign of poise.',
      'Bridge seamlessly back to your core point.'
    ],
    prepDurationSeconds: 10,
    speakingDurationSeconds: 60
  }
]

export function getChallengeById(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id)
}

export function getChallengesByCategory(categoryId: string): Challenge[] {
  return CHALLENGES.filter((c) => c.categoryId === categoryId)
}

export function getRecommendedDailyChallenge(primaryGoal?: string): Challenge {
  if (primaryGoal === 'interview-pitch') {
    return CHALLENGES.find((c) => c.id === 'the-elevator-pitch') || CHALLENGES[0]!
  }
  if (primaryGoal === 'clarity-articulation') {
    return CHALLENGES.find((c) => c.id === 'make-your-point') || CHALLENGES[0]!
  }
  if (primaryGoal === 'social-confidence') {
    return CHALLENGES.find((c) => c.id === 'five-second-response') || CHALLENGES[0]!
  }
  // Default for public-speaking or unset
  return CHALLENGES[0]! // The 60-Second Challenge
}

export const TODAY_DAILY_CHALLENGE: Challenge = CHALLENGES[0]! // The 60-Second Challenge
