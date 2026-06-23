---
title: "Accessibility Tree, Labels, and Actions: Interview Questions"
domain: "SwiftUI"
topic: "Accessibility and Adaptive UI"
concept: "Accessibility Tree, Labels, and Actions"
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
  - accessibility-tree
  - voiceover
  - accessibility-actions
---

# Accessibility Tree, Labels, and Actions: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you make a custom row accessible?](#q1-how-do-you-make-a-custom-row-accessible) | Senior | Tree semantics |
| [How do you expose gesture actions?](#q2-how-do-you-expose-gesture-actions) | Senior | Alternative interaction |
| [How do you test accessibility?](#q3-how-do-you-test-accessibility) | Senior | Tools and manual validation |

---

<a id="q1-how-do-you-make-a-custom-row-accessible"></a>
## Q1: How do you make a custom row accessible?

### Short Answer

I begin with semantic controls, then decide whether the row's children should remain
separate or combine into one element. I provide a concise label, current value, and
only necessary hint, while hiding decorative content.

### Expanded Answer

I preserve stable identity and logical focus order. Actions such as favorite or delete
remain named and use the same feature operations as touch input. I test changing,
disabled, error, and large-text states with VoiceOver.

<a id="q2-how-do-you-expose-gesture-actions"></a>
## Q2: How do you expose gesture actions?

### Short Answer

I add named accessibility actions and keyboard alternatives for swipe, drag, or other
gesture-only behavior. Ordinary activation remains a `Button` rather than a tap gesture.

### Expanded Answer

Every input path uses the same authorization, confirmation, and error logic. Destructive
actions have explicit names, and adjustable values expose increment/decrement semantics
instead of requiring precise dragging.

<a id="q3-how-do-you-test-accessibility"></a>
## Q3: How do you test accessibility?

### Short Answer

I combine automated audits and UI assertions with manual testing using VoiceOver,
Voice Control, Switch Control, hardware keyboard, large text, contrast, and motion settings.

### Expanded Answer

Inspector findings are a starting point. I listen to order, labels, values, actions,
focus after updates and modals, and recovery from errors on representative devices.
Automated tests protect critical labels and flows but cannot judge spoken usability alone.
