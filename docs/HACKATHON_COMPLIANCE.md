# Firebase Hybrid AI Hackathon — Compliance and Verification

**Project:** Voca  
**Official event:** https://firebasehybridaihackathon.devpost.com/  
**Resources:** https://firebasehybridaihackathon.devpost.com/resources  
**Rules:** https://firebasehybridaihackathon.devpost.com/rules

## 1. Mandatory instruction

The official rules and resources pages are authoritative. The implementation agent must open them and verify all current requirements before relying on this checklist. Do not assume a remembered deadline, prize, category, eligibility condition or technical requirement is still current.

## 2. Project strategy

Voca is targeting the Web / Chrome platform. It will be a full web application and may include PWA capabilities as progressive enhancement. PWA installability should not replace or weaken the normal browser web experience.

## 3. Hybrid AI demonstration

The product must use Firebase AI Logic at runtime, not merely list it as a dependency.

Planned demonstration:
1. A real supported on-device Firebase AI Logic text coaching request.
2. A real cloud Firebase AI Logic request.
3. A preferred-on-device request that demonstrates cloud fallback where local inference is unavailable, if supported by the current SDK and device.
4. Actual inference-source metadata displayed in a demo diagnostics panel.
5. Clear separation between browser signal processing, cloud audio transcription and hybrid text coaching.

Do not fake local inference by running ordinary JavaScript heuristics. Do not claim that web Gemini Nano processed audio if the supported on-device capability is text (and supported image input) rather than audio.

## 4. Technical checks

- [ ] Firebase AI Logic imported and invoked in the running application.
- [ ] Firebase AI Logic SDK version meets current hybrid web requirements.
- [ ] Supported Chrome Desktop version verified.
- [ ] On-device model capability and availability tested on the demo machine.
- [ ] Model initialisation follows current official user-gesture requirements.
- [ ] Cloud inference path tested.
- [ ] Hybrid fallback tested.
- [ ] Actual inference source captured from SDK response.
- [ ] Firebase App Check configured and enforced as required.
- [ ] Supporting Firebase products integrated meaningfully.
- [ ] No private credentials committed or shipped to client.

## 5. Submission checks

- [ ] Confirm team and participant eligibility in official rules.
- [ ] Confirm project category and platform eligibility.
- [ ] Confirm current submission deadline and timezone.
- [ ] Public source repository on accepted platform.
- [ ] Open-source licence included.
- [ ] Working public demo and access instructions.
- [ ] Public demo video; check maximum duration in rules.
- [ ] README explains setup, architecture, Firebase products and hybrid inference.
- [ ] Explain what was built during the hackathon.
- [ ] Disclose any pre-existing code/assets as required.
- [ ] Provide test instructions and any demo account details permitted by rules.
- [ ] Submit all required Devpost fields before deadline.

## 6. Official references

- Main event: https://firebasehybridaihackathon.devpost.com/
- Resources: https://firebasehybridaihackathon.devpost.com/resources
- Rules: https://firebasehybridaihackathon.devpost.com/rules
- Firebase AI Logic: https://firebase.google.com/docs/ai-logic
- Hybrid inference: https://firebase.google.com/docs/ai-logic/hybrid
- App Check: https://firebase.google.com/docs/app-check
- Firestore: https://firebase.google.com/docs/firestore
- Firebase Hosting: https://firebase.google.com/docs/hosting

## 7. Caution

This document is an engineering checklist, not a legal or eligibility determination. The official event rules control if anything here differs. Verify all current platform support, model names, SDK signatures and submission requirements at implementation time.
