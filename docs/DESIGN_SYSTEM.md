# Voca — Design System and UI Direction

**Version:** 1.0  
**Brand:** Voca  
**Primary:** Tangerine `#F47B45`  
**Identity direction:** Resonant V / Soundform.

## 1. Brand character

Voca should feel:
- expressive, confident and warm;
- intelligent without looking clinical;
- premium but approachable;
- energetic without being noisy;
- encouraging without being childish.

Avoid:
- generic AI gradients and glowing robot imagery;
- animal mascots;
- excessive glassmorphism;
- excessive rounded cards everywhere;
- gamification that distracts from skill development;
- charts without meaningful labels or explanations.

## 2. Brand mark

Use a distinctive abstract non-animal symbol based on the agreed Resonant V / Soundform direction. The mark should suggest voice, resonance, articulation or sound waves without becoming a literal microphone icon.

Do not redesign the logo if approved artwork is supplied. Use supplied brand assets as the source of truth.

## 3. Colour tokens

```css
:root {
  --voca-tangerine: #F47B45;
  --voca-ink: #202020;
  --voca-muted: #777777;
  --voca-surface: #FFFFFF;
  --voca-surface-subtle: #F7F5F2;
  --voca-border: #EAE5DF;
  --voca-success: #25845B;
  --voca-warning: #B7791F;
  --voca-danger: #C44D4D;
}
```

Tangerine is the signature accent, not a background colour for every component. Ensure accessible text contrast. Use semantic tokens for status.

## 4. Typography

Use a clean contemporary sans-serif with strong legibility. Prefer a restrained type scale:
- display for major onboarding/dashboard moments;
- heading for page and section titles;
- body for explanations and coaching;
- compact labels for chart axes and metadata.

Use tabular numerals for metrics and scores. Avoid too many font weights.

## 5. Layout and navigation

Desktop-first Chrome experience with responsive adaptation:
- persistent sidebar or compact primary navigation on desktop;
- clear page header and one primary action;
- content widths that preserve reading comfort;
- mobile navigation adapted for narrow screens;
- consistent spacing and alignment.

Core destinations:
- Home
- Practise / Speaking Studio
- Progress
- Skill Map
- Profile / Settings

## 6. Key screen requirements

### Onboarding
- Clear value proposition and short setup.
- Goal selection.
- Optional self-reported confidence/experience.
- Baseline speaking prompt with clear privacy explanation.
- Progress indicator; avoid an unnecessarily long form.

### Home
- Greeting and primary “Start practising” action.
- One daily challenge.
- Small, meaningful progress snapshot.
- Skill preview.
- Recent sessions.
- Useful first-time empty state.

### Speaking Studio
- Prompt and preparation guidance.
- Large, unmistakable recording control.
- Live waveform/level visualisation when available.
- Timer and recording state.
- Pause/stop controls only if implemented correctly.
- Review, replay, discard and submit.
- Clear microphone and upload consent states.

### Analysis
- Clear overall summary.
- Measured metrics separated from AI interpretation.
- Transcript with evidence highlights where possible.
- Strengths and improvement priorities.
- Replay affordance.
- Next exercise action.
- Show unavailable metrics honestly.

### Skill Map
- Six communication dimensions with clear labels.
- Score definitions and evidence count.
- Trends over time.
- No fake precision or empty-state fabricated values.

### Progress
- Session history.
- Comparable time-series metrics.
- Weekly practice activity.
- Baseline comparison only when sufficient data exists.
- Earned achievements.

### Hybrid AI transparency
- Show local model readiness and setup state where appropriate.
- In a demo/diagnostics surface, display actual inference source and model.
- Do not overwhelm normal users with technical labels.
- Explain cloud fallback in plain language.

## 7. Interaction principles

- One clear primary action per screen.
- Immediate feedback for recording controls.
- Loading states that communicate the current stage.
- Empty states that explain what to do next.
- Error states with retry or recovery actions.
- Keyboard-accessible controls and visible focus.
- Respect reduced-motion preferences.
- Avoid auto-playing audio.
- Never submit or upload a recording without clear user intent.

## 8. Motion

Use motion to communicate state:
- subtle waveform response while recording;
- clear recording start/stop transitions;
- restrained progress animation;
- short transitions between analysis states.

Do not animate every card or score. Motion must not obscure controls or reduce accessibility.

## 9. Design handoff rules

Google Stitch is the intended UI/UX design tool. When screen designs, screenshots or design tokens are supplied:
1. inspect them before implementation;
2. preserve layout hierarchy, spacing, colour and typography;
3. build reusable components from repeated patterns;
4. do not replace intentional visual design with generic component-library defaults;
5. flag missing states rather than inventing major new flows.
