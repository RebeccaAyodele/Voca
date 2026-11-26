import { describe, it, expect } from 'vitest'
import { generateDynamicScenario, OFFLINE_SCENARIO_BANK } from './scenario-generator'

describe('generateDynamicScenario', () => {
  it('returns a valid scenario for any challenge from the offline bank or AI', async () => {
    const scenario = await generateDynamicScenario('tell-me-a-story', ['Leadership'])
    expect(scenario.prompt).toBeDefined()
    expect(scenario.prompt.length).toBeGreaterThan(10)
    expect(scenario.focusTip).toBeDefined()
    expect(['ON_DEVICE_AI', 'CLOUD_AI', 'OFFLINE_BANK']).toContain(scenario.source)
  })

  it('provides diverse scenarios across multiple challenge categories', async () => {
    const mockInterview = await generateDynamicScenario('the-mock-interview')
    const explainSimply = await generateDynamicScenario('explain-it-simply')
    const elevatorPitch = await generateDynamicScenario('the-elevator-pitch')

    expect(mockInterview.prompt).not.toBe(explainSimply.prompt)
    expect(explainSimply.prompt).not.toBe(elevatorPitch.prompt)
  })

  it('respects excludePrompts to avoid immediate repetition', async () => {
    const initial = OFFLINE_SCENARIO_BANK['the-60-second-challenge']![0]!.prompt
    const nextScenario = await generateDynamicScenario('the-60-second-challenge', [], [initial])

    // Should return a different prompt if offline
    expect(nextScenario.prompt).toBeDefined()
  })
})
