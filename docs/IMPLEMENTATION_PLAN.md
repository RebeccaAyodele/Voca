# Voca — Implementation Plan

**Target:** Hackathon MVP  
**Source of Truth:** Google Stitch Project `Voca Design System` (`1140073762953586641`)  
**Design Direction:** Acoustic Sound Sphere mark, Voca Tangerine (`#F47B45`), `Playfair Display` headlines, `Plus Jakarta Sans` body.  
**Approach:** Vertical slices, working software early.

## Design & Screen Reconciliation
- **Brand Asset:** `Voca Sound Sphere Logo (Clean)` (`f660051819c7404286db3f74dcf04465`) — Clean vector SVG from Stitch.
- **S01 Welcome:** Stitch screen `Welcome to Voca` (`77ab267bd3454cd5bd9fab10d9e724be`).
- **S02 Auth:** Stitch screen `Create Account` (`3ff5b4bd3f4d43d88c2f929fb637d70b`).
- **S03 Goals:** Stitch screen `Goal Assessment` (`e9e647816fa34056b9729d3ea7cadc4f`).
- **S04 / S05 / S08 Studio:** Stitch screen `Voice Baseline Assessment` (`358c0b54951542dca37bbcbe62c9f984`).
- **S10 / S11 Analysis:** Stitch screen `Baseline Speech Analysis & Results` (`a92eb3d5c57449c69ec214f9b57a60f4`).
- **S06 / S12 / S13 / S16:** Home dashboard, Skill Map, Progress history and Hybrid AI Diagnostics follow the Stitch theme tokens and component patterns.

---

## Phase 0 — Requirements & Design Validation (Completed)
- [x] Inspect workspace and review all specifications (`AGENTS.md`, `PRD.md`, `ARCHITECTURE.md`, `TECHNICAL_IMPLEMENTATION.md`, `DESIGN_SYSTEM.md`, `SCREEN_SPECIFICATIONS.md`).
- [x] Verify official #BuildHybridAI 2026 Devpost Hackathon requirements, deadline (Nov 30, 2026 at 2:00 PM PT), rules, and video length (<= 3 min).
- [x] Verify Firebase AI Logic hybrid inference SDK documentation (`firebase/ai`, `InferenceMode.PREFER_ON_DEVICE`, `inferenceSource`).
- [x] Query Stitch MCP and extract project `Voca Design System` (`1140073762953586641`), theme tokens, and clean Sound Sphere vector logo.

---

## Phase 1 — App Foundation & Stitch Design System Scaffolding
- [ ] Scaffold React 18 + TypeScript strict mode with Vite using `pnpm`.
- [ ] Configure Tailwind CSS and CSS custom properties matching Stitch tokens (`#F47B45`, `#FBF9F5`, `#1B1C1A`, `Playfair Display`, `Plus Jakarta Sans`, `ROUND_EIGHT`).
- [ ] Save and integrate official Stitch vector logo (`src/assets/logo.svg`).
- [ ] Setup application router, responsive app shell, and navigation.
- [ ] Setup Firebase client configuration (`app.ts`, `auth.ts`, `firestore.ts`, `ai.ts`, `app-check.ts`).
- [ ] Configure Vitest test runner and verify clean build.

---

## Phase 2 — Authentication and Onboarding (S01, S02, S03)
- [ ] Build **S01 Welcome Screen** (`src/features/auth/WelcomeView.tsx`) matching Stitch.
- [ ] Build **S02 Authentication Screen** (`src/features/auth/AuthView.tsx`) matching Stitch (Email/Password + Anonymous Demo access).
- [ ] Build **S03 Goal Assessment Screen** (`src/features/onboarding/GoalAssessmentView.tsx`) matching Stitch.
- [ ] Persist user profile and selected goals to Firestore `users/{uid}`.

---

## Phase 3 — Speaking Studio & Audio Engine (S04, S05, S08, S09)
- [ ] Build **S04 Baseline Setup UX** explaining audio recording and privacy.
- [ ] Build **S05 / S08 Speaking Studio** matching Stitch `Voice Baseline Assessment`:
  - Microphone permission flow triggered on explicit user action.
  - `MediaRecorder` lifecycle (WebM/Opus) with elapsed timer and 2-minute safety cap.
  - Real-time Web Audio API waveform / volume visualizer.
  - Local recording storage in browser `IndexedDB`.
- [ ] Build **S09 Recording Review**:
  - Playback from local IndexedDB audio buffer.
  - Discard and re-record controls.
  - Explicit submission consent modal.

---

## Phase 4 — Speech Analytics & Cloud Transcription
- [ ] Implement cloud audio transcription via `firebase/ai` multimodal `generateContent`.
- [ ] Implement Web Audio API decoding and signal analytics (RMS volume variance, threshold-based pause detection).
- [ ] Implement pure domain transcript metrics (word count, WPM calculation, regex filler word matching, lexical richness).
- [ ] Write unit test suite for all calculation algorithms.
- [ ] Persist session records to Firestore `users/{uid}/sessions/{sessionId}`.

---

## Phase 5 — Hybrid AI Coaching & Diagnostics (S11, S16)
- [ ] Implement Firebase AI Logic hybrid model using `InferenceMode.PREFER_ON_DEVICE`.
- [ ] Chrome Prompt API / Gemini Nano capability detection and readiness check.
- [ ] Implement evidence-grounded coaching prompts with Zod validation.
- [ ] Capture and record actual `inferenceSource` (`ON_DEVICE` vs `IN_CLOUD`).
- [ ] Build **S16 Hybrid Diagnostics Drawer** for judges and developer inspection.

---

## Phase 6 — Core Experience & Progress Tracking (S06, S11, S12, S13)
- [ ] Build **S11 Analysis & Results** matching Stitch `Baseline Speech Analysis & Results`:
  - Audio playback synced with transcript evidence quotes.
  - Strengths and targeted improvement recommendations.
- [ ] Build **S06 Home Dashboard** with practice prompt launcher and daily challenge.
- [ ] Build **S12 Skill Map** with 6 dimensions and honest handling of unavailable acoustic scores.
- [ ] Build **S13 Progress & Session History** with longitudinal trend charts.

---

## Phase 7 — Security, PWA & Polish
- [ ] Configure Firestore Security Rules for user isolation.
- [ ] Configure Firebase App Check with debug token support for local development and CI.
- [ ] Add PWA manifest and app shell service worker (zero caching of private user data).
- [ ] Complete accessibility, responsive mobile, and error-handling audit.
- [ ] Run full automated test suite and production build.

---

## Phase 8 — Hackathon Submission Readiness
- [ ] Public GitHub repository with open-source license.
- [ ] Deploy production build to Firebase Hosting.
- [ ] README documentation covering architecture, setup, and hybrid inference walkthrough.
- [ ] Record and verify 3-minute demonstration video highlighting live on-device Gemini Nano execution and cloud fallback.
- [ ] Complete Devpost submission form before November 30, 2026.
