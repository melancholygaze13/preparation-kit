---
title: "Localization, Right-to-Left, and Reduced Motion: Interview Questions"
domain: "SwiftUI"
topic: "Accessibility and Adaptive UI"
concept: "Localization, Right-to-Left, and Reduced Motion"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - localization
  - right-to-left
  - reduce-motion
---

# Localization, Right-to-Left, and Reduced Motion: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why should localized sentences not be concatenated?](#q1-why-should-localized-sentences-not-be-concatenated) | Senior | Grammar and ordering |
| [How do you support right-to-left layout?](#q2-how-do-you-support-right-to-left-layout) | Senior | Directional semantics |
| [What should Reduce Motion change?](#q3-what-should-reduce-motion-change) | Senior | Equivalent presentation |

---

<a id="q1-why-should-localized-sentences-not-be-concatenated"></a>
## Q1: Why should localized sentences not be concatenated?

### Short Answer

Languages reorder words and apply different plural, gender, and grammar rules. I
localize one complete message with meaningful interpolation so translators can produce
the correct sentence.

### Expanded Answer

I use format styles for locale-sensitive values and keep stable identifiers separate
from localized presentation. Accessibility labels, errors, and actions are localized
along with visible content.

<a id="q2-how-do-you-support-right-to-left-layout"></a>
## Q2: How do you support right-to-left layout?

### Short Answer

I use leading and trailing semantics, directional symbols, and system controls that
mirror appropriately. I preserve intrinsic direction for content such as code or some
media controls only when deliberate.

### Expanded Answer

I test mixed-direction text, navigation, custom gestures, alignment, forms, and
VoiceOver. Device or language checks do not replace using the current layout direction.

<a id="q3-what-should-reduce-motion-change"></a>
## Q3: What should Reduce Motion change?

### Short Answer

It should replace large spatial movement, zoom, parallax, or repeated motion with a
smaller effect, fade, or immediate change while preserving meaning and completion feedback.

### Expanded Answer

The feature state and business timing remain independent from animation. Motion is
never the only signal, and focus and accessibility order remain correct in both paths.
Reduced motion can retain a short useful fade rather than disabling every transition.
