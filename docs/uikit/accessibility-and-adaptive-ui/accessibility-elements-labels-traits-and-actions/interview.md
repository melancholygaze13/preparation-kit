---
title: "Accessibility Elements, Labels, Traits, and Actions: Interview Questions"
domain: "UIKit"
topic: "Accessibility and Adaptive UI"
concept: "Accessibility Elements, Labels, Traits, and Actions"
page_type: interview
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-26
---

# Accessibility Elements, Labels, Traits, and Actions: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you decide what should be one accessibility element?](#q1-element-boundary) | Senior | Accessibility tree design |
| [What is the difference between label, value, hint, and traits?](#q2-label-value-hint-traits) | Senior | Spoken model |
| [How do you expose a gesture-only action to VoiceOver?](#q3-gesture-action) | Staff | Custom actions |

---

<a id="q1-element-boundary"></a>
## Q1: How do you decide what should be one accessibility element?

### Short Answer

Make one accessibility element for one item the user understands as a unit or
operates with one action.

### Expanded Answer

If a row has an icon, title, subtitle, and status but taps as one unit, I would
usually expose one grouped element. The label and value describe the row's
meaning. The button or selected traits describe its role and state.

If the subviews have independent actions, they may need separate elements.

---

<a id="q2-label-value-hint-traits"></a>
## Q2: What is the difference between label, value, hint, and traits?

### Short Answer

The label identifies the element. The value describes current state. The hint
explains a non-obvious result. Traits describe role or behavior.

### Expanded Answer

For a favorite toggle, the label might be "Favorite", the value might be "On",
and the button trait tells VoiceOver it can be activated. A hint is only useful
if the action result is not clear from the label and role.

I would avoid labels such as "Favorite button" because the trait already gives
the control type.

---

<a id="q3-gesture-action"></a>
## Q3: How do you expose a gesture-only action to VoiceOver?

### Short Answer

Add a visible control when possible, or add a `UIAccessibilityCustomAction` so
assistive technology can invoke the same operation.

### Expanded Answer

Gesture-only actions are easy to miss. For example, a swipe-to-archive row can
also expose an "Archive" custom action. The action should use the same command
path as the visual gesture so behavior stays consistent.

For a design system, I would standardize common action names and verify them in
accessibility testing.
