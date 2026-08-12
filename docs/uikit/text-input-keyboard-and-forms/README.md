---
title: "Text Input, Keyboard, and Forms"
domain: "UIKit"
page_type: topic-index
interview_priority: high
status: reviewed
last_reviewed: 2026-08-12
---

# Text Input, Keyboard, and Forms

UIKit text input questions test whether you can keep editing behavior, form
state, keyboard movement, and privacy rules separate. Strong answers explain
where input events belong, how the focused field stays visible, and how secure
fields use standard platform behavior without leaking data.

## Learning Path

### Rapid Review

1. [Text Fields, Text Views, and Delegate Boundaries](text-fields-text-views-and-delegate-boundaries/README.md)
2. [Keyboard Avoidance and Scroll Coordination](keyboard-avoidance-and-scroll-coordination/README.md)

### Standard Preparation

3. [Focus, Validation, and Form State](focus-validation-and-form-state/README.md)
4. [Secure Input, AutoFill, and Content Types](secure-input-autofill-and-content-types/README.md)

### Role-Specific Depth

For identity, payments, or health roles, deepen secure entry, AutoFill, privacy,
and recovery behavior. For form-heavy or iPad roles, test keyboard avoidance,
focus movement, and validation in resized and hardware-keyboard environments.

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Text Fields, Text Views, and Delegate Boundaries](text-fields-text-views-and-delegate-boundaries/README.md) | Separates editing events from form and domain state. | High | 10 min |
| [Keyboard Avoidance and Scroll Coordination](keyboard-avoidance-and-scroll-coordination/README.md) | Keeps focused content visible without fragile frame assumptions. | High | 10 min |
| [Focus, Validation, and Form State](focus-validation-and-form-state/README.md) | Coordinates user progression and error presentation. | High | 9 min |
| [Secure Input, AutoFill, and Content Types](secure-input-autofill-and-content-types/README.md) | Uses standard input behavior without leaking sensitive data. | High | 9 min |
