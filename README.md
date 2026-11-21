# Voca

Voca is an AI-powered speaking and communication-development platform. It helps people improve through repeated speaking practice, measurable speech feedback, personalised coaching and visible progress.

## Core loop
**Practise → Measure → Understand → Improve → Track progress.**

## Current product direction
- Responsive web application, optimised for Chrome.
- PWA capabilities as progressive enhancement; installability must not compromise the full web experience.
- React + TypeScript + Vite; pnpm.
- Firebase Authentication, Cloud Firestore, Firebase AI Logic, App Check and Firebase Hosting.
- Browser recording with MediaRecorder and Web Audio API.
- Hybrid AI coaching with truthful on-device/cloud source reporting.

## Read before implementation
1. `AGENTS.md` — instructions for the coding agent.
2. `docs/PRD.md` — product requirements and MVP scope.
3. `docs/ARCHITECTURE.md` — system boundaries and data flow.
4. `docs/TECHNICAL_IMPLEMENTATION.md` — implementation contracts and technical choices.
5. `docs/DESIGN_SYSTEM.md` — visual direction and UI rules.
6. `docs/IMPLEMENTATION_PLAN.md` — phased build order.
7. `docs/HACKATHON_COMPLIANCE.md` — competition checklist and verification links.

## Status
This repository starts as a specification package. The implementation agent must first inspect the workspace, verify current official Firebase Hybrid AI Hackathon requirements, then scaffold the app and build the MVP in vertical slices.

## Important
Do not claim a feature, hybrid inference path, test, deployment or competition requirement is complete until it has been implemented and verified.
