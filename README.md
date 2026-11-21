# Voca — AI Speaking & Communication Coach

Voca is a personal speaking and communication coach built for the **#BuildHybridAI 2026 Hackathon**. It helps professionals, speakers, and learners improve their vocal delivery through real-time practice, deterministic acoustic measurement, and hybrid AI coaching.

---

## The Core Loop

$$\text{Practise} \longrightarrow \text{Measure} \longrightarrow \text{Understand} \longrightarrow \text{Improve} \longrightarrow \text{Track Progress}$$

1. **Practise**: Speak naturally in the browser using the interactive Speaking Studio with live frequency visualization.
2. **Measure**: Deterministic client-side audio signal analysis measures words per minute (WPM), speech pauses, volume consistency, and filler word distribution.
3. **Understand**: Multimodal cloud audio transcription pairs with hybrid AI coaching to provide evidence-grounded feedback with direct quotes.
4. **Improve**: Receive focused, actionable drills tailored to your specific goals (e.g. executive presence, pacing, filler reduction).
5. **Track Progress**: Monitor longitudinal growth across key communication dimensions on your personal Skill Map.

---

## Hybrid AI Architecture

Voca leverages Firebase AI Logic (`firebase/ai`) to create a private, low-latency, and resilient speaking coach experience:

### 1. On-Device First (Chrome Built-in AI / Gemini Nano)
- Text-based speech coaching runs locally on the user's machine using the Chrome Prompt API (`window.ai`).
- Delivers rapid response times without sending personal speaking transcripts across the network.
- Configured using `InferenceMode.PREFER_ON_DEVICE`.

### 2. Cloud Fallback (Gemini Flash via Firebase AI Logic)
- Automatically engages when on-device hardware acceleration or model weights are unavailable.
- Provides consistent coaching quality across any modern browser.

### 3. Multimodal Audio Transcription
- Raw audio buffers are processed by Gemini Flash in the cloud via inline multimodal parts to generate accurate speech transcripts.
- Strict separation: on-device text models are never misrepresented as local audio decoders.

### 4. Transparent Hybrid Telemetry
- Voca captures the actual `inferenceSource` (`ON_DEVICE` vs `IN_CLOUD`) returned by the Firebase AI SDK.
- Users and judges can inspect the live route at any time using the **Hybrid AI Diagnostics Drawer** accessible from the top navigation bar.

---

## Key Features

- **Personalized Onboarding**: Calibrate drills for Executive Presence, Public Speaking, Social Confidence, Articulation, or Interview Mastery.
- **Speaking Studio**: Real-time Web Audio API frequency visualizer, safety timer, and local browser audio persistence via IndexedDB.
- **Cadence & Filler Analytics**: Deterministic WPM scoring, regex boundary matching for common fillers (`um`, `uh`, `like`, `you know`), and pause duration detection.
- **Evidence-Grounded Feedback**: Structured coaching schema validated at runtime with Zod to ensure reliable, actionable guidance.
- **Interactive Transcript & Audio Sync**: Review words spoken with synchronized audio playback and visual highlighting for filler words.
- **Honest Skill Mapping**: 6-dimension skill radar that explicitly indicates when specific acoustic phoneme features are unavailable rather than fabricating scores.
- **Judge Diagnostics Drawer**: Live hybrid AI tester allowing reviewers to test both `PREFER_ON_DEVICE` and `ONLY_IN_CLOUD` modes in real time.

---

## Tech Stack

- **Frontend**: React 18, TypeScript (strict mode), Vite 6, Tailwind CSS v4
- **Backend & Cloud**: Firebase Authentication, Cloud Firestore, Firebase App Check, Firebase Storage, Firebase Hosting
- **AI & ML**: Firebase AI Logic (`firebase/ai`), Google Chrome Built-in AI Prompt API (Gemini Nano), Gemini 1.5 Flash
- **Audio Processing**: Web Audio API (`AudioContext`, `AnalyserNode`), `MediaRecorder`, browser `IndexedDB`
- **Testing**: Vitest, React Testing Library

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+

### Installation
```bash
# Clone the repository
git clone https://github.com/RebeccaAyodele/Voca.git
cd Voca

# Install dependencies
pnpm install
```

### Environment Setup
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Fill in your Firebase web project configuration values. For local evaluation without a live Firebase backend, Voca automatically defaults to local in-browser simulation mode.

### Running Locally
```bash
# Start development server
pnpm run dev
```

### Running Tests
```bash
# Run unit tests with Vitest
pnpm run test
```

### Building for Production
```bash
# Typecheck and production build
pnpm run build
```

---

## Security & Privacy Model

- **Local-First Audio**: Recordings are held in IndexedDB on the user's device and are never uploaded without explicit user action.
- **Firestore Isolation**: Security rules enforce strict ownership (`request.auth.uid == userId`) on all profile, session, and assessment records.
- **Firebase App Check**: Protects cloud inference and backend services against unauthorized access.
- **Zero Secrets in Client**: No privileged service account keys or private secrets are bundled into client code.
