# Voca — Antigravity Project Instructions

You are implementing Voca, a polished AI-powered speaking and communication-development web application.

## Product principles
- Voca is a speaking coach, not a generic chatbot or transcription utility.
- The core loop is: practise → measure → understand → improve → track progress.
- Prioritise a complete, reliable, polished hackathon MVP over breadth.
- Never fabricate speech measurements, transcript evidence, model execution, or progress.
- Clearly distinguish deterministic audio measurements from AI-generated assessments.
- Never claim on-device inference occurred unless the SDK reports that source.
- Do not silently upload recordings. Make recording upload/retention explicit and user-controlled.
- Keep recording content out of analytics and diagnostic logs.

## Product and brand
- Name: Voca
- Primary colour: Tangerine `#F47B45`
- Brand direction: Resonant V / Soundform; distinctive abstract non-animal mark.
- Personality: confident, warm, intelligent, encouraging, modern; avoid childish gamification and generic AI aesthetics.
- Google Stitch is the source of truth for approved screen designs. Follow supplied designs and design tokens; do not invent a different visual system.

## Engineering rules
- TypeScript strict mode.
- React + Vite; pnpm package manager.
- Feature-oriented architecture; keep UI, domain logic, infrastructure and AI services separate.
- Validate external/model outputs with Zod before using or persisting them.
- Use Firebase AI Logic for generative inference. Do not add a separate LLM provider unless explicitly approved.
- Use Firebase Auth, Firestore, App Check and Firebase Hosting; use Firebase Storage only where persistent cloud audio storage is necessary.
- Use Web Audio API and MediaRecorder for browser audio capture and deterministic signal measurements.
- Keep secrets out of client code. Never put service-account credentials or private API keys in Vite environment variables.
- Firestore security rules must enforce user ownership. Add tests for access isolation.
- Handle unsupported browsers, microphone denial, model unavailability, quota/rate limits, network loss and malformed model responses.
- Add meaningful tests for domain calculations, schema validation, AI routing and critical user flows.
- Do not build placeholder controls that look functional but do nothing.
- Do not claim features are complete unless they run and have been tested.

## Hybrid AI / hackathon constraints
- Treat the official Firebase Hybrid AI Hackathon rules and resources as binding. Verify details against the current official pages before final submission.
- Firebase AI Logic must be genuinely imported and invoked at runtime.
- App Check is required for Firebase AI Logic.
- Implement meaningful on-device and cloud inference paths using the supported Firebase AI Logic hybrid APIs and supported web platform.
- On-device support is capability-dependent. Detect availability, initialise after a user gesture where required, handle model download/readiness, and provide an honest cloud fallback.
- Record the actual `inferenceSource` returned by the SDK; never infer source from requested mode.
- Do not describe browser audio signal processing as AI inference.
- Do not claim Gemini Nano processes audio locally if the supported web model path only handles text and supported image inputs.
- Keep cloud audio transcription/analysis separate from local transcript-based coaching.
- Include an in-app or developer-visible hybrid inference demonstration that makes the actual route inspectable.
- Before submission verify supported Chrome version, Firebase JS SDK version, model availability, rules, public repo/licence, demo video length and all current eligibility/deadline requirements.

## Working style
1. Read `README.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/TECHNICAL_IMPLEMENTATION.md` and `docs/DESIGN_SYSTEM.md` before making substantial changes. Always thoroughly read all relevant project documents and crosscheck dependencies before executing any changes.
2. Inspect the existing repository before editing; do not overwrite working code or design decisions.
3. Implement in small vertical slices. After each slice, run typecheck, tests and build.
4. Update `docs/IMPLEMENTATION_PLAN.md` and `README.md` as implementation changes.
5. If a requirement is ambiguous, choose the smallest reversible implementation consistent with the docs and record the assumption. Ask only when a decision materially changes product, security, cost or competition eligibility.
6. Do not expand scope without a clear reason. Complete the critical happy path before adding secondary features.
