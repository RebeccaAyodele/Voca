# Voca — Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** Baseline specification  
**Product:** Voca  
**Primary platform:** Web / Chrome  
**Delivery target:** Polished hackathon MVP

## 1. Product vision

Voca is an AI-powered speaking and communication-development platform that helps people become clearer, more articulate and more effective speakers through structured practice, measurable evidence, personalised coaching and longitudinal progress.

Voca should feel like a personal speaking coach. It must not feel like a transcript viewer with generic AI advice attached.

## 2. Problem

People who want to improve their speaking often lack:
- a consistent, low-friction way to practise;
- objective feedback on observable delivery habits;
- specific explanations of what to improve and why;
- exercises targeted to their weaknesses;
- a way to see whether they are actually improving over time.

## 3. Target users and jobs-to-be-done

Initial target: people developing communication skills for interviews, presentations, public speaking, professional communication and everyday conversation.

Jobs:
1. When I need to practise speaking, help me start quickly with a relevant prompt.
2. After I speak, show me measurable information and evidence from my response.
3. Explain what worked and what needs improvement in language I can act on.
4. Give me a short exercise that targets the most important weakness.
5. Show whether my performance is improving across sessions.

## 4. Product principles

- Evidence before judgement: feedback must point to transcript excerpts or measurable audio evidence.
- Encouraging, not flattering: supportive feedback must remain honest.
- Actionable: each assessment should lead to a concrete next step.
- Personalised over generic: goals and prior assessment history should influence coaching.
- Transparent: label measured, inferred and unavailable metrics distinctly.
- Privacy-conscious: recording upload and retention must be clear and user-controlled.
- Repeatable: the user should have a reason to return and practise.

## 5. Core user journey

1. User creates an account or enters a permitted demo experience.
2. User chooses communication goals and areas they want to improve.
3. User completes a short baseline speaking prompt.
4. User lands on Home and sees a recommended practice activity.
5. User opens Speaking Studio and selects a prompt or free practice.
6. User grants microphone permission and records a response.
7. User reviews the recording and submits it for analysis.
8. Voca processes the audio, calculates supported metrics and obtains a transcript.
9. AI Coach generates structured feedback using transcript, metrics, goals and relevant history.
10. User reviews evidence, replays the recording and chooses a next exercise.
11. Voca updates progress only from completed, valid assessments.

## 6. MVP feature requirements

### 6.1 Authentication and onboarding
- Sign up, sign in and sign out using Firebase Authentication.
- Collect goals: interviews, presentations, public speaking, everyday conversation, professional communication.
- Collect self-reported confidence and experience level as optional context, not objective scores.
- Run a baseline speaking exercise.
- Allow users to edit goals later.

### 6.2 Home dashboard
- Show a useful greeting and a clear primary action to practise.
- Show latest completed session and selected progress indicators.
- Show one recommended challenge based on goals or demonstrated needs.
- Show streak/practice activity only when backed by actual session records.
- Include empty states for new users.

### 6.3 Speaking Studio
- Offer prompt-based practice and free-form practice.
- Support microphone permission, recording start/stop, elapsed time and playback.
- Show recording state clearly; prevent accidental duplicate submissions.
- Allow discard and re-record before submission.
- Explain whether a recording remains local or is uploaded for processing.
- Handle unsupported recording formats, denied microphone access and interrupted recordings.

### 6.4 Speech analysis
Calculate only metrics that can be supported by available input:
- duration from recording timestamps;
- transcript word count;
- speaking rate (words per minute) when transcript and duration are available;
- filler-word counts using a documented configurable lexicon and transcript matching;
- pause count and pause durations using a documented signal-processing threshold and algorithm;
- amplitude/loudness variation as a signal feature, not a judgement of confidence;
- vocabulary diversity using a defined tokenisation method, labelled as an estimate.

Do not imply that a transcript alone reveals pronunciation, articulation, vocal emotion or confidence. Do not display a metric when its inputs are missing or unreliable. Distinguish signal-derived measurements from transcript-derived calculations and model-generated assessments.

### 6.5 AI Coach
Produce structured feedback:
- concise overall summary;
- strengths with evidence;
- improvement areas with evidence;
- actionable recommendations;
- one next exercise with an instruction and suggested duration.

Feedback must be grounded in the submitted transcript and metrics. If evidence is insufficient, say so. Avoid medical, psychological or personality diagnoses. Do not infer sensitive traits.

### 6.6 Skill Map
Initial dimensions:
- clarity and articulation (only score if suitable evidence exists; otherwise mark unavailable);
- fluency;
- vocabulary and expression;
- structure and coherence;
- pace and delivery;
- conciseness.

Scores must have a defined rubric, be based on completed assessments and include confidence/coverage information. Do not fabricate a baseline or score from an empty session.

### 6.7 Progress
- Session history and detail pages.
- Trend visualisations based on actual assessment records.
- Baseline comparison after multiple comparable sessions.
- Practice time and completed challenges.
- Achievements only when earned by explicit rules.

## 7. Hybrid AI product experience

Hybrid inference is part of the product, not a decorative settings toggle.

- Use Firebase AI Logic hybrid inference for supported transcript-based coaching and exercise-generation tasks.
- Use cloud inference for operations requiring cloud-only capabilities, including the selected audio transcription route.
- Detect device model availability and readiness.
- Explain when on-device model setup/download is required.
- Support cloud fallback when permitted.
- Record and expose the actual inference source returned by Firebase AI Logic.
- Never claim audio was processed locally when only subsequent text coaching ran locally.
- Provide a developer/demo view that makes the actual route and fallback behaviour inspectable without exposing private user content.

## 8. Non-functional requirements

- Responsive, accessible UI with keyboard support and clear focus states.
- Good performance on ordinary laptops and mobile browsers.
- Graceful degradation when browser APIs or on-device models are unavailable.
- Strong per-user data isolation in Firestore rules.
- No secrets in client-side environment variables.
- Validate AI output before rendering or persisting.
- Clear loading, empty, retry and error states.
- Automated tests for calculations, schemas, access control and critical journeys.
- Avoid logging raw audio, transcripts or personally identifying user content.

## 9. Out of scope for initial MVP

- Live real-time speech coaching while the user speaks.
- Multi-speaker diarisation.
- Full pronunciation/phoneme scoring unless a reliable, validated implementation is found.
- Social feeds, leaderboards and public profiles.
- Native Android/iOS applications.
- Payments/subscriptions.
- Unreviewed automatic sharing of recordings.
- Claims of emotion or confidence detection from voice.

## 10. MVP acceptance criteria

A user can:
1. Create an account and set speaking goals.
2. Record, replay and submit a speaking exercise.
3. Receive a transcript through the implemented supported route.
4. See correctly calculated metrics with methodology labels.
5. Receive structured, evidence-grounded AI coaching.
6. Complete a recommended follow-up exercise.
7. See the completed session in history and progress.
8. Use the core experience in Chrome even when on-device inference is unavailable, with honest fallback messaging.

The competition demonstration must additionally show a real Firebase AI Logic on-device request and a real cloud request where supported, and report the actual inference source for each.
