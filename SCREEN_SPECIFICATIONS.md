# Voca — Screen Specifications

**Version:** 1.0  
**Status:** Functional specification; visual implementation must follow approved Google Stitch designs.  
**Product:** Voca  
**Primary platform:** Responsive Web / Chrome, with PWA enhancement.

> **Design-source rule:** This document specifies screen purpose, behaviour, data, states and acceptance criteria. It does not authorise Antigravity to invent a new visual design. The approved Google Stitch screens, design tokens, assets and prototypes are the visual source of truth. Match their layout, hierarchy, spacing, typography, colours, components, iconography and motion. Where a design artifact is missing, do not guess at a replacement layout: identify the missing reference and ask for it or implement only the non-visual service/domain work.

## 0. Instructions for Antigravity

Before implementing any screen:

1. Inspect the repository for Stitch exports, screenshots, PDFs, design files, `design.md`, product brief, per-screen prompts, image assets and links documented in the project.
2. Read `docs/DESIGN_SYSTEM.md` and `docs/PRD.md`.
3. Build a design inventory: screen name → exact design reference → available states → assets → responsive variants.
4. Use the existing designs as the source of truth. Do not redesign, simplify, rearrange, add decorative cards, invent navigation, or change the brand direction.
5. If a screen's design is unavailable, report it as `DESIGN_REFERENCE_MISSING`. Do not fabricate the visual layout. You may implement its typed data/service logic and document the missing visual dependency.
6. Preserve the approved Voca identity: Tangerine `#F47B45`, Resonant V / Soundform mark, deep ink and warm neutral surfaces. Use the exact supplied tokens/assets where present.
7. Keep the interface responsive and accessible without changing the intended design hierarchy.
8. Implement real behaviour. Do not ship decorative controls that do nothing.
9. After each screen, compare the implementation against its Stitch reference and report any differences.

## 1. Screen inventory

The following is the functional screen inventory derived from the Voca product scope. It is not a substitute for the actual Stitch screen set. Antigravity must reconcile this inventory with the screens that have actually been designed and must not create extra screens merely because they appear here.

| ID | Screen | Purpose | Main action | Design reference |
|---|---|---|---|---|
| S01 | Welcome / entry | Explain Voca and begin | Get started / sign in | Use supplied Stitch design |
| S02 | Authentication | Create account or sign in | Continue securely | Use supplied Stitch design |
| S03 | Speaking goals | Personalise coaching | Save goals | Use supplied Stitch design |
| S04 | Baseline setup | Explain first assessment | Start baseline | Use supplied Stitch design |
| S05 | Baseline / Speaking Studio | Record initial response | Finish recording | Use supplied Studio design |
| S06 | Home dashboard | Show next best action and current progress | Start practising | Use supplied Stitch design |
| S07 | Practice selection / prompt | Choose a prompt or free practice | Begin exercise | Use supplied Stitch design, if present |
| S08 | Speaking Studio — recording | Capture speaking response | Stop / finish | Use supplied Studio design |
| S09 | Recording review | Replay, discard or submit | Submit for analysis | Use supplied design or documented Studio state |
| S10 | Analysis in progress | Explain processing stages | Wait / cancel if supported | Follow supplied loading-state design; otherwise derive from design system without new layout |
| S11 | Session analysis / feedback | Present transcript, metrics and coaching | Practise recommendation | Use supplied Stitch design |
| S12 | Skill Map | Show skill levels and evidence | Explore a skill | Use supplied Stitch design |
| S13 | Progress / history | Show past sessions and trends | Open a session | Use supplied Stitch design |
| S14 | Challenge detail / exercise | Explain targeted practice | Start challenge | Use supplied Stitch design, if present |
| S15 | Profile / settings | Manage goals, privacy and account | Save settings / sign out | Use supplied Stitch design, if present |
| S16 | Hybrid AI diagnostics (demo/developer surface) | Make actual inference route inspectable for judges | Run local/cloud test | Follow design system; keep separate from normal user experience unless a Stitch screen exists |

**Reconciliation rule:** If the Stitch design set uses different screen names or combines several states into one screen, preserve the Stitch structure and map these IDs to it. Do not force the designs into this table's proposed screen count.

## 2. Global application behaviour

### 2.1 Authentication and session
- Support Firebase Authentication flows specified in the PRD.
- Maintain an authenticated user context.
- Protect private routes and redirect unauthenticated users to the designed entry/auth flow.
- Support an anonymous/demo entry only if confirmed in the approved product flow and implemented with a clear account-linking strategy.
- Preserve a user's current recording/session state across route transitions where intended; never silently discard an active recording.

### 2.2 Navigation
- Implement only the navigation destinations shown in the approved designs.
- Keep active, hover, focus, disabled and mobile navigation states consistent with Stitch.
- Do not add navigation destinations solely because a feature exists in the PRD; use the designed information architecture.

### 2.3 Shared states
Every data-driven screen must account for:
- initial loading;
- populated state;
- first-use empty state;
- recoverable error with retry;
- offline or degraded state where relevant;
- permission-denied state where relevant;
- disabled/unavailable state where relevant.

Use the designed state variants if supplied. If not supplied, derive the smallest consistent state treatment from the existing design system; do not invent a new visual language.

### 2.4 Data integrity
- Show only data that exists.
- Do not invent default scores, streaks, achievements, transcripts or trends.
- Distinguish `not_assessed`, `insufficient_evidence`, `unavailable` and actual zero values.
- All dates/times should use the user's locale where appropriate.
- All metrics must expose understandable labels and units.

## 3. Screen-level specifications

### S01 — Welcome / entry

**User goal:** Understand what Voca helps with and begin the product journey.

**Behaviour**
- Present the product proposition and primary entry action as designed.
- Route new users into authentication or onboarding according to the Stitch flow.
- Existing users can access the sign-in path.
- Do not introduce marketing claims that are not in the PRD.

**Data:** None required.

**States:** Default; navigation/loading while moving into the next step.

**Acceptance**
- Primary and secondary actions route correctly.
- Layout and copy hierarchy match Stitch.
- Keyboard and screen-reader users can activate controls.

### S02 — Authentication

**User goal:** Access a personal Voca account.

**Behaviour**
- Implement only the authentication methods shown in the design and confirmed in product requirements.
- Validate fields and show useful errors.
- Handle loading, duplicate account, invalid credentials, network failure and sign-out.
- Never expose authentication internals or credentials in logs.

**Data:** Firebase Auth user identity.

**Acceptance**
- Successful sign-in returns the user to the intended next screen.
- Failed sign-in preserves safe form state and provides recovery.
- Private routes are protected.

### S03 — Speaking goals

**User goal:** Tell Voca what communication situations matter to them.

**Behaviour**
- Capture goals from the PRD: interviews, presentations, public speaking, everyday conversation and professional communication.
- Allow multiple selections if the approved design supports them.
- Capture optional self-reported confidence/experience only if shown in the design.
- Persist selections to the user's profile.
- Allow editing later from the designed settings/profile flow.

**Data:** `users/{uid}.goals`, optional self-reported context.

**Validation:** Require only fields that the approved flow marks as required.

**Acceptance**
- Selections persist after refresh/sign-in.
- User can proceed and return without losing selections.
- Self-reported values are never presented as measured ability.

### S04 — Baseline setup

**User goal:** Understand why the initial speaking sample is useful and what will happen to it.

**Behaviour**
- Explain the purpose and expected duration of the baseline exercise.
- Explain microphone permission and whether audio will be transmitted for transcription.
- Obtain explicit user action before requesting microphone permission or uploading audio.
- Start the baseline Studio flow.

**Data:** Baseline prompt/configuration and consent state.

**Acceptance**
- User knows what happens to the recording before starting.
- Permission is requested only after a user gesture.
- User can go back without creating a false completed assessment.

### S05 / S08 — Speaking Studio and recording

**User goal:** Practise speaking and record a response.

**Behaviour**
- Show the selected prompt, exercise instructions and any time guidance from the approved design.
- Request microphone permission only after the user initiates recording.
- Use `MediaRecorder`; select a supported MIME type at runtime and store the actual MIME type.
- Display clear recording state and elapsed time.
- Display live audio level/waveform only if the supplied design includes it and the implementation can power it accurately.
- Enforce the MVP maximum recording duration of 2 minutes for inline audio processing.
- Stop media tracks when recording ends or the component is disposed.
- Prevent duplicate recording starts and duplicate submissions.
- Support stop/finish and pause/resume only where browser support and the designed interaction allow it.
- Save the recording to IndexedDB locally by default.
- Do not upload automatically.

**Data**
- Session ID, user ID, prompt/category, start/end timestamps, duration, MIME type, local recording key, status.
- Raw audio stays local until the user explicitly submits.

**States**
- Idle / ready.
- Requesting permission.
- Permission denied.
- Recording.
- Paused, only if supported.
- Recording stopped.
- Maximum duration reached.
- Device unavailable / recording failure.
- Browser API unsupported.

**Acceptance**
- Recording can be started and stopped reliably.
- Actual duration and MIME type are stored.
- Audio can be replayed.
- All microphone tracks are stopped after use.
- No network upload occurs before explicit submission.
- A recording interrupted by navigation/unmount is handled safely.

### S09 — Recording review

**User goal:** Listen to the recording and decide whether to submit it.

**Behaviour**
- Provide playback using the locally stored recording.
- Allow discard and re-record.
- Explain that submission sends audio to the cloud transcription model.
- Obtain explicit submit action before sending audio.
- On submit, create/update session status to `processing`.
- Disable duplicate submission while a request is in flight.

**Data:** Local audio blob, session metadata and explicit submission event.

**Acceptance**
- Discard removes the local recording and safely updates session state.
- Submit sends only the selected recording.
- Upload/transcription failure leaves the local recording available for retry unless the user deletes it.
- Privacy explanation is visible before submit.

### S10 — Analysis in progress

**User goal:** Understand what Voca is doing while the recording is analysed.

**Behaviour**
- Show truthful stages, such as preparing audio, transcribing, calculating speech metrics and generating coaching.
- Do not imply that all stages are AI or on-device.
- Provide cancellation only if cancellation is correctly implemented.
- Handle timeout, network loss, quota limits and malformed model output.
- Retry safely without creating duplicate assessment records.

**Data:** Session status and processing stage.

**Acceptance**
- Progress messages reflect actual service state.
- Failure gives a recovery action.
- No fake percentage progress unless backed by measurable work.

### S11 — Session analysis / feedback

**User goal:** Understand how the speaking attempt went and what to do next.

**Behaviour**
- Present overall coaching summary.
- Separate deterministic metrics from AI interpretation.
- Present strengths and up to three priority improvements.
- Every improvement should include transcript or metric evidence.
- Link transcript evidence to audio timestamps only when timestamps are actually available.
- Allow replay of the recording.
- Present a next exercise generated or selected for the user's goals and observed weaknesses.
- Clearly label unavailable or insufficient-evidence metrics.

**Data**
- Transcript and transcript metrics.
- Audio features.
- Coaching output and prompt version.
- Inference source and model metadata.
- Session reference.

**Acceptance**
- No fabricated transcript quotes, timestamps, metrics or scores.
- User can replay the source recording.
- Feedback is grounded in the actual submitted sample.
- Actual inference source is stored for hybrid coaching.
- The next exercise has a working start action.

### S12 — Skill Map

**User goal:** Understand current communication strengths and areas to develop.

**Initial dimensions**
- Fluency.
- Vocabulary and expression.
- Structure and coherence.
- Pace and delivery.
- Conciseness.
- Clarity/articulation only where the available evidence supports it; otherwise unavailable with a reason.

**Behaviour**
- Show score, rubric version, evidence count and confidence/coverage where available.
- Show historical direction only when comparable completed assessments exist.
- Explain what a skill dimension means.
- Allow the user to open relevant sessions/evidence if designed.
- Never create a score from missing evidence.

**Data:** Skill assessments and snapshots.

**Acceptance**
- Empty/new-user state is honest.
- Unavailable is distinct from zero.
- Trend lines use actual dated records.
- Score calculations are versioned and testable.

### S13 — Progress / history

**User goal:** Review practice history and measurable development.

**Behaviour**
- List completed sessions with date, category and duration.
- Support pagination or bounded queries.
- Show trends only where enough comparable data exists.
- Compare with baseline only when baseline and later assessments are valid and comparable.
- Show practice time and streaks only from actual session data.
- Open a session into S11.

**Data:** Session and assessment records.

**Acceptance**
- No fabricated streaks or achievements.
- Empty state guides the user to practise.
- Session detail links resolve to the correct user's records.

### S14 — Challenge detail / exercise

**User goal:** Complete a targeted exercise.

**Behaviour**
- Explain the target skill and instructions.
- Provide a duration or repetition target if specified.
- Start the appropriate Studio flow.
- Mark completion only after the required action is completed.
- Update challenge progress idempotently.

**Data:** Challenge definition, target skill, assigned/completed status.

**Acceptance**
- Challenge is relevant to a goal or observed weakness.
- Completion is persisted once.
- Challenge does not award unearned progress.

### S15 — Profile / settings

**User goal:** Manage personal goals, privacy and account.

**Behaviour**
- Edit communication goals.
- Manage recording retention/deletion where implemented.
- Sign out.
- Provide account/data deletion route if supported.
- Explain local versus cloud storage.
- Do not expose technical diagnostics in ordinary settings unless included in the design.

**Data:** User profile, preferences and account identity.

**Acceptance**
- Changes persist.
- Destructive actions require confirmation.
- User can understand and control recording retention.

### S16 — Hybrid AI diagnostics (demo/developer surface)

**Purpose:** Demonstrate real hybrid inference to judges and aid debugging.

**Visibility:** Developer/demo-only surface or controlled diagnostics entry. Do not add it to primary user navigation unless the approved designs explicitly include it.

**Behaviour**
- Show browser and model capability/readiness.
- Show model initialisation/download status.
- Allow a real test prompt to be run with the documented Firebase AI Logic hybrid configuration.
- Provide a separate cloud-directed test where appropriate.
- Display requested inference mode separately from actual response `inferenceSource`.
- Display model identifier, latency, success/failure and fallback information when available.
- Do not display user transcripts or raw recording content.
- Make clear that audio transcription uses the cloud route and transcript coaching may use the hybrid route.

**Acceptance**
- Panel calls the real SDK service; no simulated results.
- Actual source comes from SDK response metadata.
- Unsupported model/device state is reported honestly.
- Judges can reproduce the test using README instructions.

## 4. Cross-screen data and state contracts

Use shared typed domain contracts. Suggested minimum entities:

```ts
type SessionStatus =
  | "recording"
  | "recorded"
  | "processing"
  | "completed"
  | "failed";

type MetricAvailability =
  | "available"
  | "insufficient_evidence"
  | "unavailable";

interface MetricValue {
  value: number | string | null;
  unit?: string;
  availability: MetricAvailability;
  method: string;
  algorithmVersion?: string;
}

interface SessionSummary {
  id: string;
  category: string;
  title: string;
  durationSeconds: number;
  status: SessionStatus;
  createdAt: string;
}

interface InferenceMetadata {
  requestedMode: string;
  actualSource: "ON_DEVICE" | "IN_CLOUD" | "UNKNOWN";
  model: string;
  latencyMs?: number;
  fallbackReason?: string;
}

interface AssessmentSummary {
  sessionId: string;
  transcript?: string;
  metrics: Record<string, MetricValue>;
  strengths: string[];
  improvements: Array<{
    area: string;
    evidence: string;
    recommendation: string;
  }>;
  nextExercise?: {
    title: string;
    instruction: string;
    durationSeconds: number;
  };
  inference?: InferenceMetadata;
}
```

The final schema may be refined in `TECHNICAL_IMPLEMENTATION.md`, but screens must consume typed data rather than hardcoded mock values in production.

## 5. Design fidelity checklist

For every implemented screen, Antigravity must check:

- [ ] Correct Stitch reference identified.
- [ ] Same information hierarchy and primary action.
- [ ] Same layout structure and responsive intent.
- [ ] Correct brand mark and supplied assets.
- [ ] Correct Tangerine and neutral tokens.
- [ ] Typography and type hierarchy match.
- [ ] Spacing, sizing, alignment and radii match.
- [ ] Components and iconography match.
- [ ] Interactions match the supplied prototype or annotations.
- [ ] Loading, empty, error and disabled states are handled consistently.
- [ ] Mobile adaptation does not alter the product's core hierarchy.
- [ ] No invented content, scores or decorative UI.
- [ ] Screenshot comparison completed and deviations recorded.

## 6. Required design handoff inventory

Before pixel-level screen implementation, populate this table from the actual Stitch artifacts:

| Screen / Stitch frame name | Source link or file | Desktop variant | Mobile variant | Interaction prototype | Assets |
|---|---|---|---|---|---|
| Welcome | To be filled from supplied design | Verify | Verify | Verify | Verify |
| Authentication | To be filled from supplied design | Verify | Verify | Verify | Verify |
| Onboarding / goals | To be filled from supplied design | Verify | Verify | Verify | Verify |
| Home | To be filled from supplied design | Verify | Verify | Verify | Verify |
| Speaking Studio | To be filled from supplied design | Verify | Verify | Verify | Verify |
| Analysis | To be filled from supplied design | Verify | Verify | Verify | Verify |
| Skill Map | To be filled from supplied design | Verify | Verify | Verify | Verify |
| Progress | To be filled from supplied design | Verify | Verify | Verify | Verify |
| Other designed frames | Add exact names | Verify | Verify | Verify | Verify |

Do not treat the rows above as proof that each screen has already been designed. This inventory must be reconciled with the actual Stitch project.

## 7. Antigravity implementation instruction

Implement the screen specifications only after identifying the supplied Stitch designs. First return a design inventory listing the exact frame names and available assets, and map each frame to the functional screen IDs above. If the design files/links are not present in the workspace, stop before inventing screen layouts and request the missing design references. Once references are available, implement one vertical slice at a time, matching the designs and wiring real data/services. Keep `README.md`, `IMPLEMENTATION_PLAN.md` and this document updated as the implementation evolves.
