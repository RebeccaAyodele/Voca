import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from 'firebase/ai'
import { z } from 'zod'
import { firebaseApp, isFirebaseConfigured } from '@/services/firebase/app'

export interface GeneratedScenario {
  prompt: string
  context?: string
  focusTip: string
  source: 'ON_DEVICE_AI' | 'CLOUD_AI' | 'OFFLINE_BANK'
}

const GeneratedScenarioSchema = z.object({
  prompt: z.string().min(10),
  context: z.string().optional(),
  focusTip: z.string().min(5)
})

/**
 * Rich offline bank of diverse speaking scenarios across all 12 challenges.
 * Used when offline, during network latency, or as instant cache before AI streams.
 */
export const OFFLINE_SCENARIO_BANK: Record<string, Array<{ prompt: string; context?: string; focusTip: string }>> = {
  'the-60-second-challenge': [
    {
      prompt: 'If you could change one thing about how modern cities are designed, what would it be and why?',
      context: 'Urban design and living standards',
      focusTip: 'Keep your flow steady across the minute without freezing.'
    },
    {
      prompt: 'Is it better to master a single craft deeply or be proficient in ten different skills?',
      context: 'General philosophy & career growth',
      focusTip: 'State your stance in the opening 10 seconds and conclude with a decisive takeaway.'
    },
    {
      prompt: 'What is a book, movie, or song that genuinely shifted how you see the world, and what was that shift?',
      context: 'Culture and personal influence',
      focusTip: 'Avoid listing plot details; focus on your personal takeaway.'
    },
    {
      prompt: 'If humans could live comfortably on another planet, would you volunteer to be in the first colony?',
      context: 'Exploration and risk-taking',
      focusTip: 'Balance optimism with realism to maintain credibility.'
    },
    {
      prompt: 'Why do you think hobbies that require physical patience (like gardening or woodworking) are becoming popular again?',
      context: 'Modern society & digital burnout',
      focusTip: 'Use conversational transitions like "The deeper reason is..."'
    }
  ],

  'five-second-response': [
    {
      prompt: 'What is an underrated skill that everyone should learn in their twenties?',
      context: 'Immediate instinct challenge',
      focusTip: 'Commit immediately in your first sentence; do not stall with "well, uh".'
    },
    {
      prompt: 'Should companies have mandatory four-day work weeks?',
      context: 'Workplace policy',
      focusTip: 'Say "Yes" or "No" right away and back it up with your strongest point.'
    },
    {
      prompt: 'Is failure genuinely a better teacher than success?',
      context: 'Mindset & learning',
      focusTip: 'Deliver your opening sentence with a grounded downward pitch.'
    },
    {
      prompt: 'What piece of conventional advice do you think is completely wrong?',
      context: 'Counterintuitive thinking',
      focusTip: 'Do not apologize or hesitate; trust your instinct.'
    },
    {
      prompt: 'If you had to pick one quality that defines a great friend, what is it?',
      context: 'Relationships and values',
      focusTip: 'Pick one word immediately and expand on it.'
    }
  ],

  'make-your-point': [
    {
      prompt: 'Do you think people spend too much time worrying about what others think of them?',
      context: 'Social psychology & personal freedom',
      focusTip: 'Use Point -> Reason -> Example -> Point structure.'
    },
    {
      prompt: 'Should artificial intelligence be used to automate creative professions like writing and design?',
      context: 'Technology & human creativity',
      focusTip: 'Give one concrete real-world or hypothetical example to anchor your point.'
    },
    {
      prompt: 'Is remote work ultimately healthier or more isolating for teams?',
      context: 'Modern workplace dynamics',
      focusTip: 'End with a decisive concluding summary sentence.'
    },
    {
      prompt: 'Does higher education still provide the value it promises today?',
      context: 'Education and career readiness',
      focusTip: 'Separate your core argument from emotional bias.'
    },
    {
      prompt: 'Should children be taught financial literacy in primary school before algebra?',
      context: 'Curriculum & practical life skills',
      focusTip: 'Clearly state why this matters to the broader community.'
    }
  ],

  'explain-it-simply': [
    {
      prompt: 'Explain how cloud computing works to an eight-year-old child without using technical jargon.',
      context: 'Plain language analogy drill',
      focusTip: 'Use a relatable analogy (like a shared kitchen or library).'
    },
    {
      prompt: 'Explain what inflation is and why prices go up, using everyday groceries as your example.',
      context: 'Economic concepts made accessible',
      focusTip: 'Keep sentences short and conversational.'
    },
    {
      prompt: 'Explain what a computer algorithm is to someone who has never touched a smartphone.',
      context: 'Everyday deconstruction',
      focusTip: 'Compare an algorithm to a recipe or morning routine.'
    },
    {
      prompt: 'Explain why we need sleep to someone who claims sleeping 4 hours a night is fine.',
      context: 'Health and biological clarity',
      focusTip: 'Translate scientific functions into physical benefits anyone understands.'
    }
  ],

  'keep-the-conversation-alive': [
    {
      prompt: 'Do you believe social media has brought people closer together or made us more isolated?',
      context: 'Connection & Digital Life',
      focusTip: 'Acknowledge multiple angles before stating your personal experience.'
    },
    {
      prompt: 'Should society normalize taking digital detoxes, and how do you disconnect from screens?',
      context: 'Mental Health & Technology',
      focusTip: 'Share a concrete observation and end with an open takeaway.'
    },
    {
      prompt: 'How do you sustain meaningful friendships as life and work get busier?',
      context: 'Relationships & Community',
      focusTip: 'Speak with conversational warmth and everyday relatable examples.'
    }
  ],

  'first-impressions': [
    {
      prompt: 'Introduce yourself, what drives your work, and one value you never compromise on.',
      context: 'Authentic Self-Introduction',
      focusTip: 'Project approachable warmth and steady vocal pacing.'
    },
    {
      prompt: 'What is an idea or initiative you genuinely care about, and why does it matter to you?',
      context: 'Core Purpose & Mission',
      focusTip: 'Focus on what excites you rather than reciting credentials.'
    },
    {
      prompt: 'Share the most impactful lesson your background has taught you about working with people.',
      context: 'Personal Perspective',
      focusTip: 'Keep your delivery concise, confident, and grounded.'
    }
  ],

  'tell-me-a-story': [
    {
      prompt: 'Share a personal experience where a major setback ended up teaching you an invaluable lesson.',
      context: 'Overcoming Obstacles',
      focusTip: 'Set the context quickly, build to the turning point, and land on what you learned.'
    },
    {
      prompt: 'Tell the story of a person or mentor who unexpectedly shifted how you view the world.',
      context: 'Influence & Growth',
      focusTip: 'Describe the moment and reflection with emotional honesty.'
    },
    {
      prompt: 'Talk about a moment when you had to stand up for something you believed in.',
      context: 'Conviction & Courage',
      focusTip: 'Speak with calm conviction; let key sentences land before continuing.'
    },
    {
      prompt: 'Describe a moment in your life where stepping into the unknown opened up a new chapter.',
      context: 'Exploration & Change',
      focusTip: 'Use natural pauses to give the story narrative weight.'
    }
  ],

  'the-mini-presentation': [
    {
      prompt: 'Speak on why universal access to quality education is the most critical investment for the next decade.',
      context: 'Education & Global Future',
      focusTip: 'Structure into: the current gap, the human impact, and the long-term benefit.'
    },
    {
      prompt: 'Speak on how modern feminism is evolving to address workplace equity and equal opportunity.',
      context: 'Gender & Society',
      focusTip: 'Anchor your points with clear, balanced reasoning.'
    },
    {
      prompt: 'Why is protecting deep, focused attention essential in a world of constant notifications?',
      context: 'Focus & Productivity',
      focusTip: 'Signpost your points clearly: "First... Second... Finally...".'
    }
  ],

  'the-elevator-pitch': [
    {
      prompt: 'Pitch an initiative that would make higher education accessible and debt-free for every student.',
      context: 'Education Reform',
      focusTip: 'State the core problem in 10 seconds and articulate the solution clearly.'
    },
    {
      prompt: 'Pitch an initiative that empowers women in leadership and closes the compensation gap.',
      context: 'Equity & Leadership',
      focusTip: 'Focus on measurable positive outcomes and collective benefit.'
    },
    {
      prompt: 'Pitch a daily habit or practice that helps people manage stress and speak with genuine confidence.',
      context: 'Human Development',
      focusTip: 'Keep your message simple, memorable, and actionable.'
    }
  ],

  'read-it-with-expression': [
    {
      prompt: '“The greatest communication skill is not speaking with eloquence, but listening with presence. When we pause, when we let silence do the heavy lifting, our words carry weight. Rushing diminishes authority; composure amplifies it.”',
      context: 'Presence & Composure',
      focusTip: 'Pause deliberately for 1 full second at commas and 2 seconds at periods.'
    },
    {
      prompt: '“Education is not the learning of facts, but the training of the mind to think critically. When people are empowered with knowledge and the freedom to express it, society moves forward.”',
      context: 'Education & Critical Thought',
      focusTip: 'Emphasize operative words with purposeful pitch variation.'
    },
    {
      prompt: '“True equality is not a favor granted by society; it is the fundamental recognition of dignity, agency, and equal voice for every human being.”',
      context: 'Human Dignity & Equality',
      focusTip: 'Deliver with steady, grounded conviction and clean consonant articulation.'
    }
  ],

  'the-mock-interview': [
    {
      prompt: 'How do you approach a constructive disagreement when working with someone whose background is very different from yours?',
      context: 'Collaboration & Inclusion',
      focusTip: 'Focus on empathy, mutual respect, and how you find common ground.'
    },
    {
      prompt: 'Describe a challenging project where there was no playbook, and how you navigated the ambiguity.',
      context: 'Problem Solving',
      focusTip: 'Spend 70% of your time on the concrete actions you took.'
    },
    {
      prompt: 'What is a personal philosophy or rule of thumb that guides how you lead and make decisions?',
      context: 'Leadership & Principles',
      focusTip: 'Be direct, authentic, and avoid generic clichés.'
    },
    {
      prompt: 'How do you handle high pressure or unexpected setbacks without losing momentum?',
      context: 'Composure & Resilience',
      focusTip: 'Demonstrate emotional maturity and deliberate focus.'
    }
  ],

  'recover-gracefully': [
    {
      prompt: 'Speak on what resilience means to you, and how a significant mistake helped you mature.',
      context: 'Resilience & Self-Awareness',
      focusTip: 'Speak with calm confidence; owning mistakes projects genuine strength.'
    },
    {
      prompt: 'How can people maintain poise and clear thinking when conversations become tense or controversial?',
      context: 'Composure Under Pressure',
      focusTip: 'Keep your vocal pitch grounded and deliberate.'
    },
    {
      prompt: 'Why is embracing vulnerability and admitting what you do not know a vital sign of great leadership?',
      context: 'Authentic Leadership',
      focusTip: 'Pause for 1 second between ideas to let your points land.'
    }
  ]
}

/**
 * Dynamically generates a fresh, contextual speaking scenario using Firebase AI Logic,
 * falling back to the rich offline scenario bank when offline.
 */
export async function generateDynamicScenario(
  challengeId: string,
  userGoals: string[] = [],
  excludePrompts: string[] = []
): Promise<GeneratedScenario> {
  const bank = OFFLINE_SCENARIO_BANK[challengeId] || OFFLINE_SCENARIO_BANK['the-60-second-challenge']!
  const availableOffline = bank.filter((item) => !excludePrompts.includes(item.prompt))
  const offlineFallback = availableOffline.length > 0
    ? availableOffline[Math.floor(Math.random() * availableOffline.length)]!
    : bank[Math.floor(Math.random() * bank.length)]!

  if (!isFirebaseConfigured) {
    return {
      prompt: offlineFallback.prompt,
      context: offlineFallback.context,
      focusTip: offlineFallback.focusTip,
      source: 'OFFLINE_BANK'
    }
  }

  try {
    const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() })
    const model = getGenerativeModel(ai, {
      mode: InferenceMode.PREFER_ON_DEVICE,
      inCloudParams: {
        model: 'gemini-1.5-flash'
      }
    })

    const promptInstruction = `You are Voca's speaking prompt generator.
Create ONE clean, direct, real-world speaking topic or question for the exercise: "${challengeId}".

User's communication goals: ${userGoals.length > 0 ? userGoals.join(', ') : 'Everyday presence, clarity, confident delivery'}

CRITICAL GUIDELINES:
- DO NOT invent complex roleplay scenarios. NEVER write "Imagine you are in a room...", "You are speaking to your colleagues...", or "Picture yourself at a conference...".
- Keep the prompt punchy, clean, and direct (1-2 sentences). Ask a compelling real-world question or topic to speak about (e.g. feminism, universal education, modern work-life balance, how technology impacts relationships, what makes a true leader, etc.).
- It must be completely different from these previously practiced prompts: ${JSON.stringify(excludePrompts.slice(-3))}

Return ONLY a valid JSON object matching this schema:
{
  "prompt": "The clean, direct speaking topic or question (1-2 sentences)",
  "context": "Short 2-3 word theme (e.g. 'Gender & Equality', 'Modern Education', 'Workplace Culture')",
  "focusTip": "One practical speaking tip (e.g. 'State your main stance in your very first sentence')"
}`

    const result = await model.generateContent(promptInstruction)
    const rawText = result.response.text()
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleanJson)
    const validated = GeneratedScenarioSchema.parse(parsed)

    const actualSource = (result.response as unknown as { inferenceSource?: 'ON_DEVICE' | 'IN_CLOUD' }).inferenceSource
    return {
      prompt: validated.prompt,
      context: validated.context || offlineFallback.context,
      focusTip: validated.focusTip,
      source: actualSource === 'ON_DEVICE' ? 'ON_DEVICE_AI' : 'CLOUD_AI'
    }
  } catch (error) {
    console.warn('Dynamic scenario generation used offline bank fallback:', error)
    return {
      prompt: offlineFallback.prompt,
      context: offlineFallback.context,
      focusTip: offlineFallback.focusTip,
      source: 'OFFLINE_BANK'
    }
  }
}
