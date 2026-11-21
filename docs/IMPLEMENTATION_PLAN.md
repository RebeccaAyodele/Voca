# Voca — Implementation Plan

**Target:** #BuildHybridAI 2026 Devpost Hackathon MVP  
**Source of Truth:** Google Stitch Project `Voca Design System` (`1140073762953586641`)  
**Design Direction:** Acoustic Sound Sphere mark, Voca Tangerine (`#F47B45`), `Bricolage Grotesque` headlines, `Plus Jakarta Sans` body.  
**Approach:** Vertical slices, working software, zero fabricated metrics.

## Design & Screen Reconciliation
- **Brand Asset:** Acoustic Sphere PNG (`src/assets/icon.png`, `public/icon.png`).
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
- [x] Query Stitch MCP and extract project `Voca Design System` (`1140073762953586641`), theme tokens, and acoustic sphere mark.

---

## Phase 1 — App Foundation & Stitch Design System Scaffolding (Completed)
- [x] Scaffold React 18 + TypeScript strict mode with Vite using `pnpm`.
- [x] Configure Tailwind CSS v4 and CSS custom properties matching Stitch tokens (`bg-voca-tangerine`, `bg-voca-canvas`, `text-voca-ink`, `Bricolage Grotesque`, `Plus Jakarta Sans`).
- [x] Save and integrate acoustic sphere mark (`src/assets/icon.png`).
- [x] Setup application router, responsive app shell, and navigation.
- [x] Setup Firebase client configuration (`app.ts`, `auth.ts`, `firestore.ts`, `ai.ts`, `app-check.ts`).
- [x] Configure Vitest test runner and verify clean build.

---

## Phase 2 — Authentication and Onboarding (S01, S02, S03) (Completed)
- [x] Build **S01 Welcome Screen** (`src/features/auth/WelcomeView.tsx`) matching Stitch.
- [x] Build **S02 Authentication Screen** (`src/features/auth/AuthView.tsx`) matching Stitch (Email/Password + Anonymous Demo access).
- [x] Build **S03 Goal Assessment Screen** (`src/features/onboarding/GoalAssessmentView.tsx`) matching Stitch.
- [x] Persist user profile and selected goals to Firestore `users/{uid}`.

---

## Phase 3 — Speaking Studio & Audio Engine (S04, S05, S08, S09) (Completed)
- [x] Build **S04 Baseline Setup UX** explaining audio recording and privacy.
- [x] Build **S05 / S08 Speaking Studio** matching Stitch `Voice Baseline Assessment`:
  - Microphone permission flow triggered on explicit user action.
  - `MediaRecorder` lifecycle (WebM/Opus) with elapsed timer and 2-minute safety cap.
  - Real-time Web Audio API waveform / volume visualizer.
  - Local recording storage in browser `IndexedDB`.
- [x] Build **S09 Recording Review**:
  - Playback from local IndexedDB audio buffer.
  - Discard and re-record controls.
  - Explicit submission consent modal.

---

## Phase 4 — Speech Analytics & Cloud Transcription (Completed)
- [x] Implement cloud audio transcription via `firebase/ai` multimodal `generateContent`.
- [x] Implement Web Audio API decoding and signal analytics (RMS volume variance, threshold-based pause detection).
- [x] Implement pure domain transcript metrics (word count, WPM calculation, regex filler word matching, vocabulary diversity).
- [x] Write unit test suite for all calculation algorithms.
- [x] Build **S10 & S11 Speech Analysis & Results** screen with articulate, human-coach copy and interactive transcript evidence.

---

## Phase 5 — Hybrid AI Coaching & Diagnostics (S11, S16) (Completed)
- [x] Implement Firebase AI Logic hybrid model using `InferenceMode.PREFER_ON_DEVICE`.
- [x] Chrome Prompt API / Gemini Nano capability detection and readiness check (`window.ai`).
- [x] Implement evidence-grounded coaching prompts with Zod validation.
- [x] Capture and record actual `inferenceSource` (`ON_DEVICE` vs `IN_CLOUD`).
- [x] Build **S16 Hybrid Diagnostics Drawer** for judges and developer inspection with live test runner.

---

## Phase 6 — Core Experience & Progress Tracking (S06, S11, S12, S13) (Completed)
- [x] Build **S11 Analysis & Results** matching Stitch `Baseline Speech Analysis & Results`:
  - Audio playback synced with transcript evidence quotes.
  - Strengths and targeted improvement recommendations.
- [x] Build **S06 Home Dashboard** with practice prompt launcher, daily challenge, and baseline status.
- [x] Build **S12 Skill Map** with 6 dimensions and honest handling of unavailable acoustic scores.
- [x] Build **S13 Progress & Session History** backed by real stored sessions.

---

## Phase 7 — Security, PWA & Polish (Completed)
- [x] Configure `firestore.rules` for strict user isolation (`request.auth.uid == userId`).
- [x] Configure `storage.rules` with MIME and size constraints for audio recordings.
- [x] Configure Firebase App Check with debug token support in `src/services/firebase/app-check.ts`.
- [x] Add PWA manifest and app shell service worker (`vite-plugin-pwa`).
- [x] Zero hardcoded hex colors; strictly enforce Tailwind semantic design tokens.
- [x] Clean typecheck (`tsc --noEmit`), Vitest suite (12 passing tests), and production build.

---

## Phase 8 — Hackathon Submission Readiness (In Progress)
- [x] Tracked on GitHub remote `https://github.com/RebeccaAyodele/Voca.git`.
- [x] MIT License added.
- [x] Comprehensive `README.md` documentation covering hybrid architecture, judge testing steps, and security model.
- [ ] Record and submit 3-minute demonstration video.
