# Voca — Technical Implementation Specification

**Version:** 1.0  
**Stack:** React, TypeScript, Vite, pnpm, Firebase.

## 1. Runtime and dependencies

- Node.js LTS compatible with current Vite.
- pnpm.
- React + TypeScript with strict compiler options.
- Vite.
- Firebase JS SDK version meeting the current Firebase AI Logic hybrid web minimum (verify official documentation at implementation time; current documented minimum is 12.5.0).
- Tailwind CSS.
- React Router.
- Zustand only for genuinely shared client state; prefer local state for local interactions.
- Zod for runtime validation.
- Recharts for charts if the design requires it.
- Vitest and Testing Library.
- PWA plugin only after core web app is stable.

Do not install large libraries without a concrete use case. Inspect current package versions and official compatibility before adding them.

## 2. Suggested source layout

```text
src/
  app/
    App.tsx
    router.tsx
    providers/
  components/
    ui/
    layout/
  features/
    auth/
    onboarding/
    dashboard/
    speaking-studio/
    sessions/
    speech-analysis/
    coaching/
    skill-map/
    challenges/
    progress/
    settings/
  domain/
    session/
    assessment/
    skills/
    challenges/
  services/
    firebase/
      app.ts
      auth.ts
      firestore.ts
      storage.ts
      app-check.ts
      remote-config.ts
    ai/
      model-config.ts
      hybrid-inference.ts
      transcription.ts
      coaching.ts
      schemas.ts
    audio/
      recorder.ts
      decoder.ts
      signal-analysis.ts
      audio-types.ts
    persistence/
      indexed-db.ts
  hooks/
  lib/
  styles/
  types/
```

## 3. Domain contracts

Use discriminated unions and avoid loosely typed `any`.

```ts
type SessionStatus =
  | "recording"
  | "recorded"
  | "processing"
  | "completed"
  | "failed";

type InferenceSource = "ON_DEVICE" | "IN_CLOUD" | "UNKNOWN";

interface AudioFeatures {
  durationSeconds: number;
  pauseCount?: number;
  pauseDurationsSeconds?: number[];
  rmsMean?: number;
  rmsVariation?: number;
  sampleRateHz: number;
  analysisVersion: string;
}

interface TranscriptMetrics {
  wordCount: number;
  wordsPerMinute: number;
  fillerWordCount: number;
  fillerWords: Record<string, number>;
  vocabularyDiversity?: number;
  analysisVersion: string;
}

interface EvidenceItem {
  kind: "transcript_quote" | "audio_metric" | "derived_metric";
  label: string;
  value: string | number;
  startSeconds?: number;
  endSeconds?: number;
}

interface SkillAssessment {
  skill: "fluency" | "vocabulary" | "structure" | "pace" | "conciseness" | "clarity";
  score?: number;
  rubricVersion: string;
  evidence: EvidenceItem[];
  confidence: "low" | "medium" | "high";
  unavailableReason?: string;
}
```

A skill score is optional because some skills cannot responsibly be scored from a transcript or limited audio features. Never manufacture a score to fill a dashboard.

## 4. Audio capture

Use `navigator.mediaDevices.getUserMedia({ audio: ... })` and `MediaRecorder`.

Requirements:
- check API availability;
- request microphone permission only after a user action;
- inspect supported MIME types with `MediaRecorder.isTypeSupported`;
- record actual MIME type and codec;
- stop all media tracks after recording;
- handle permission denied, device unavailable, device disconnected and interrupted recording;
- provide elapsed time and clear recording state;
- enforce a maximum recording duration and file size;
- allow playback and discard before submit;
- do not upload until user explicitly submits.

Use Web Audio API to decode supported audio for local feature extraction. Define and version signal algorithms. Pause detection must specify the amplitude threshold, minimum silence duration, minimum speech segment and any noise-floor handling. Treat thresholds as heuristics and expose methodology in code/docs.

## 5. Metric definitions

- `durationSeconds`: recording end minus start, adjusted for actual audio duration when decoded.
- `wordCount`: token count from normalised transcript, with documented tokenisation.
- `wordsPerMinute`: `wordCount / (speechDurationSeconds / 60)`; distinguish total recording duration from estimated speaking duration. Do not divide by zero.
- `fillerWordCount`: count from a configurable list and token-boundary matching. Avoid counting substrings inside other words.
- `pauseCount`: number of silence intervals meeting the documented threshold.
- `averagePauseDuration`: mean of qualifying intervals.
- `volumeConsistency`: use a documented RMS or loudness-variation feature. Do not label it confidence or vocal strength.
- `vocabularyDiversity`: define whether type-token ratio or a length-adjusted alternative is used; label as an estimate and avoid overinterpreting short samples.

Unit tests must cover empty transcript, one-word transcript, punctuation, contractions, filler substrings, silence, background noise and zero-duration input.

## 6. Firebase AI Logic

Implement AI operations behind typed service functions. UI components must never import model SDKs directly.

Required operations:
- audio transcription via the supported Firebase AI Logic cloud model route;
- hybrid coaching from transcript + metrics + goals;
- hybrid next-exercise generation.

For each model:
- use the current documented Firebase AI Logic SDK API;
- select supported model IDs from current Firebase docs;
- use structured output/schema where supported;
- set bounded output tokens and reasonable timeouts;
- validate response using Zod;
- handle blocked/empty/partial output;
- avoid including unnecessary profile or historical data.

For hybrid inference:
- follow official web hybrid initialisation flow;
- initialise after an explicit user interaction when required;
- show model readiness/download state;
- choose documented inference mode;
- inspect actual response inference source;
- expose fallback reason where available;
- never equate preferred source with actual source.

Do not invent API names. The agent must read the current Firebase hybrid web guide and use its exact current SDK signatures.

## 7. Prompt design

System instructions for coaching:
- be supportive, precise and specific;
- use only supplied evidence;
- distinguish measured facts from interpretation;
- never infer confidence, personality, intelligence, accent quality or emotion without valid evidence;
- do not invent transcript quotes or timestamps;
- give at most three priority improvements;
- make recommendations concrete and achievable;
- include one targeted next exercise;
- if input is insufficient, return an insufficient-evidence state.

Require structured JSON matching the app schema. Add prompt version metadata to saved assessments.

## 8. Firestore implementation

- use typed converters or repository mappers;
- use server timestamps for authoritative creation/update fields;
- paginate session history;
- avoid unbounded collection reads;
- use batched writes/transactions only where consistency requires them;
- create indexes from actual query patterns;
- use security rules and emulator tests;
- avoid storing redundant derived aggregates unless needed for dashboard performance.

## 9. PWA

PWA is progressive enhancement of the full web application:
- valid web manifest and app icons;
- service worker caches app shell and static assets;
- no caching of private Firestore responses, audio, transcripts or AI responses by default;
- clear update lifecycle;
- offline page explains which functions are unavailable;
- app remains fully usable at its normal HTTPS URL without installation.

PWA status must not be used to imply offline AI inference or offline transcription.

## 10. Testing gates

Before merging each vertical slice:
- `pnpm lint` (if configured);
- `pnpm typecheck`;
- `pnpm test`;
- `pnpm build`.

Test:
- metric algorithms;
- schema validation;
- prompt construction without sensitive extras;
- hybrid source handling and fallback logic;
- user data isolation in Firestore rules;
- recording lifecycle;
- main user journey.

Use Firebase emulators where practical. Never run production destructive tests against real user data.

## 11. Environment variables

Use `.env.example` for public Firebase web app configuration placeholders only. Firebase web config is not a server secret; protect services with rules and App Check. Do not place service-account JSON, admin credentials or private keys in `VITE_*` variables.

## 12. Technical risks

- Gemini Nano availability is device/browser dependent.
- Local model downloads may be large or unavailable.
- Cloud inference incurs quota/cost and network latency.
- Audio transcription model support, MIME formats, payload sizes and response formats must be verified against current Firebase AI Logic documentation.
- Browser audio codec support varies.
- Audio signal metrics are sensitive to microphone, room and background noise.
- AI skill scoring may be inconsistent; use explicit rubrics and evidence.
- Firestore rules and App Check require real integration testing.
