---
title: "Accessibility Elements, Labels, Traits, and Actions"
domain: "UIKit"
topic: "Accessibility and Adaptive UI"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-06
---

# Accessibility Elements, Labels, Traits, and Actions

> Accessibility is a parallel interaction model, not a set of labels added at
> the end. A UIKit screen should expose the same meaning, state, and actions to
> assistive technology that it exposes visually.

## Quick Recall

- Make an element accessible when it represents one meaningful thing a user can
  focus or operate.
- Use labels for identity, values for current state, hints only when the action
  is not obvious, and traits for role or behavior.
- Group small visual pieces when the combined meaning is what the user needs.
- Add custom accessibility actions for non-obvious gestures or secondary row
  actions.
- Test with VoiceOver and UI tests that use stable accessibility identifiers.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
