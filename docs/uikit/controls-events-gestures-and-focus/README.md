---
title: "Controls, Events, Gestures, and Focus"
domain: "UIKit"
page_type: topic-index
interview_priority: high
status: reviewed
last_reviewed: 2026-08-12
---

# Controls, Events, Gestures, and Focus

UIKit interaction questions test whether you can send input to the right owner
without creating hidden dependencies. Learn the responder chain, control actions,
gesture coordination, and non-touch input well enough to debug conflicts.

## Learning Path

### Rapid Review

1. [Responder Chain and Event Delivery](responder-chain-and-event-delivery/README.md)
2. [Target-Action, Controls, and Primary Actions](target-action-controls-and-primary-actions/README.md)

### Standard Preparation

3. [Gesture Recognizer Coordination](gesture-recognizer-coordination/README.md)
4. [Focus, Pointer, Keyboard, and Menu Interactions](focus-pointer-keyboard-and-menu-interactions/README.md)

### Role-Specific Depth

For iPad, Mac Catalyst, tvOS, or productivity roles, give extra attention to
focus, pointer, hardware-keyboard, and menu behavior. Touch-only roles can keep
that concept concise after learning the responder chain and gesture rules.

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Responder Chain and Event Delivery](responder-chain-and-event-delivery/README.md) | Explains how events and unhandled actions move through UIKit. | High | 10 min |
| [Target-Action, Controls, and Primary Actions](target-action-controls-and-primary-actions/README.md) | Defines standard control behavior and command routing. | High | 10 min |
| [Gesture Recognizer Coordination](gesture-recognizer-coordination/README.md) | Resolves simultaneous, dependent, and competing gestures. | High | 11 min |
| [Focus, Pointer, Keyboard, and Menu Interactions](focus-pointer-keyboard-and-menu-interactions/README.md) | Supports interaction beyond direct touch. | High | 10 min |
