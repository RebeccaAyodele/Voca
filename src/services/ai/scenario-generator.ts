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
      prompt: 'Your colleague says: "I just came back from a two-week solo trip across Japan and it completely reset how I think about my daily routine."',
      context: 'Conversational warmth & active listening',
      focusTip: 'Acknowledge their trip with genuine curiosity, share a quick reflection, then ask an open-ended question.'
    },
    {
      prompt: 'A friend mentions: "I am thinking about quitting my stable job to start a coffee roasting business, but my family thinks I am crazy."',
      context: 'Empathetic validation & constructive inquiry',
      focusTip: 'Validate their courage without rushing into unsolicited advice, then invite them to elaborate.'
    },
    {
      prompt: 'At a team lunch, someone says: "I read an article arguing that social media has permanently eroded our attention spans."',
      context: 'Casual debate & group bridging',
      focusTip: 'Connect their point to your own experience without dominating the floor.'
    }
  ],

  'first-impressions': [
    {
      prompt: 'Introduce yourself at an executive design and technology conference. State who you are, what you care about, and why you are here within 30 seconds.',
      context: 'Professional elevator introduction',
      focusTip: 'Project approachable warmth and grounded vocal tone.'
    },
    {
      prompt: 'You are joining a new cross-functional team. Introduce yourself on a kickoff call in 30 seconds without listing your resume chronologically.',
      context: 'Team kickoff presence',
      focusTip: 'Focus on what excites you about collaborating with this team.'
    },
    {
      prompt: 'Introduce yourself to a potential mentor you admire at a networking reception.',
      context: 'High-stakes networking',
      focusTip: 'Be concise, respectful of their time, and clear about your curiosity.'
    }
  ],

  'tell-me-a-story': [
    {
      prompt: 'Tell the story of a time when a simple plan went completely off the rails, and how you had to improvise on the spot.',
      context: 'Narrative arc: Setup, turning point, resolution',
      focusTip: 'Vary your speaking pace to build tension and land the humorous or meaningful takeaway.'
    },
    {
      prompt: 'Tell the story of a mentor or leader whose advice seemed wrong or confusing at first, but ended up changing your perspective.',
      context: 'Character & reflection story',
      focusTip: 'Bring the listener into the exact room or moment where that conversation happened.'
    },
    {
      prompt: 'Tell the story of an unexpected victory or breakthrough that happened right when you were about to give up.',
      context: 'Resilience narrative',
      focusTip: 'Describe the sensory details and feelings rather than a dry sequence of dates.'
    },
    {
      prompt: 'Tell the story of your first big public mistake at work or school, and what it taught you about accountability.',
      context: 'Vulnerability and growth',
      focusTip: 'Speak with calm self-assurance; owning mistakes projects confidence.'
    }
  ],

  'the-mini-presentation': [
    {
      prompt: 'Deliver a 90-second keynote opening advocating for Why Deep, Focused Work is the Most Valuable Currency in the Modern Economy.',
      context: 'Presentation hook and signposting',
      focusTip: 'Open with an arresting question or statistic in the first 10 seconds.'
    },
    {
      prompt: 'Pitch your team on adopting an asynchronous communication culture to replace excessive status meetings.',
      context: 'Internal workplace presentation',
      focusTip: 'Signpost your points clearly: "First... Second... Finally...".'
    },
    {
      prompt: 'Deliver a 90-second talk on The Art of Saying No Respectfully in Professional Relationships.',
      context: 'Thought leadership presentation',
      focusTip: 'Close with an inspiring and memorable call-to-action.'
    }
  ],

  'the-elevator-pitch': [
    {
      prompt: 'Pitch Voca to a product investor in 45 seconds: articulate the core problem (speech anxiety & clinical tools), your solution, and why it wins.',
      context: 'Product pitch under 45 seconds',
      focusTip: 'Keep your value proposition front and center without drowning in technical details.'
    },
    {
      prompt: 'Pitch an initiative to create a company-wide paid learning day every month to your executive board.',
      context: 'Internal business case pitch',
      focusTip: 'Focus on business return on investment: retention, innovation, and morale.'
    },
    {
      prompt: 'Pitch yourself for a promotion to lead a high-stakes initiative in 45 seconds.',
      context: 'Personal career pitch',
      focusTip: 'Emphasize your track record of delivery and vision for the team.'
    }
  ],

  'read-it-with-expression': [
    {
      prompt: '“The greatest communication skill is not speaking with eloquence, but listening with presence. When we pause, when we let silence do the heavy lifting, our words carry weight. Rushing diminishes authority; composure amplifies it.”',
      context: 'Vocal modulation and punctuation pacing drill',
      focusTip: 'Pause deliberately for 1 full second at every comma and 2 seconds at the periods.'
    },
    {
      prompt: '“There is a difference between speaking because you have to say something, and speaking because you have something to say. Great speakers do not fill every second with noise; they let key thoughts resonate before moving to the next.”',
      context: 'Pacing and downward inflection drill',
      focusTip: 'Drop your pitch on the final word "next" to signal grounded conviction.'
    },
    {
      prompt: '“Confidence is not the absence of nervousness. It is the decision that your message matters more than your hesitation. Take a breath, plant your feet, and deliver your truth.”',
      context: 'Vocal projection and clarity',
      focusTip: 'Articulate consonant endings with crisp distinctness.'
    }
  ],

  'the-mock-interview': [
    {
      prompt: '“Tell me about a time you had to deliver difficult feedback to a peer or manager. How did you approach the conversation, and what was the outcome?”',
      context: 'Behavioral interview (STAR Method: Situation, Task, Action, Result)',
      focusTip: 'Spend 70% of your time on the Action and Result, not just describing the problem.'
    },
    {
      prompt: '“Describe a project where the requirements or constraints changed drastically halfway through. How did you adapt your plan and lead your team forward?”',
      context: 'Adaptability and crisis composure',
      focusTip: 'Highlight how you maintained calm momentum during uncertainty.'
    },
    {
      prompt: '“What has been your biggest professional failure so far, and how did it change your operating philosophy?”',
      context: 'Self-awareness & growth mindset',
      focusTip: 'Be honest and direct; avoid humblebrags like "I worked too hard".'
    },
    {
      prompt: '“Tell me about a time you disagreed with a decision made by leadership. What did you do, and how did you handle the final resolution?”',
      context: 'Disagreement and constructive committal',
      focusTip: 'Demonstrate disagreement with respect, followed by 100% commitment.'
    }
  ],

  'recover-gracefully': [
    {
      prompt: 'You are presenting an annual project update to the board. Halfway through, you completely lose your train of thought and your slides fail. Recover your composure, take a calm breath out loud, and smoothly steer the conversation back to your core message.',
      context: 'Composure under pressure drill',
      focusTip: 'Do NOT apologize profusely or freeze; breathe calmly, acknowledge simply, and continue with poise.'
    },
    {
      prompt: 'A client interrupts your proposal presentation with a sharp, skeptical challenge: "This numbers look completely unrealistic. Why should we believe this?" Recover, acknowledge their concern without becoming defensive, and bridge to your evidence.',
      context: 'Handling aggressive skepticism',
      focusTip: 'Keep your vocal pitch low and calm; defensiveness makes your voice rise in pitch.'
    },
    {
      prompt: 'You mispronounce a key client’s name and stumble over a critical figure in front of the entire company. Recover in real time with warmth and zero panic.',
      context: 'Vocal stumble recovery',
      focusTip: 'Pause for 1 second, correct with a warm smile in your voice, and proceed immediately.'
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

    const promptInstruction = `You are Voca's dynamic challenge scenario generator.
Create ONE fresh, engaging, highly realistic speaking prompt for the speaking exercise: "${challengeId}".

User's communication goals: ${userGoals.length > 0 ? userGoals.join(', ') : 'Professional eloquence, everyday presence, clear articulation'}

Guidelines for the prompt:
- Make it realistic, thought-provoking, and tailored to the exercise style (e.g. story arc for storytelling, behavioral challenge for mock interview, concrete question for make-your-point).
- Avoid cliché or robotic interview questions.
- It must be completely different from these previously practiced prompts: ${JSON.stringify(excludePrompts.slice(-3))}

Return ONLY a valid JSON object matching this schema:
{
  "prompt": "The exact question or speaking scenario prompt (1-3 sentences)",
  "context": "Short 2-4 word theme or domain (e.g. 'Team Leadership & Trust')",
  "focusTip": "One practical speaking focus tip (e.g. 'Commit immediately in your opening sentence')"
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
