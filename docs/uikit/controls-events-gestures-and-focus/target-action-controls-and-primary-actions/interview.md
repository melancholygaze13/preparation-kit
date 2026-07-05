---
title: "Target-Action, Controls, and Primary Actions: Interview Questions"
domain: "UIKit"
topic: "Controls, Events, Gestures, and Focus"
concept: "Target-Action, Controls, and Primary Actions"
page_type: interview
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-05
---

# Target-Action, Controls, and Primary Actions: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How does target-action work in UIKit?](#q1-target-action) | Senior | Control events |
| [When would you use `UIAction` instead of a selector?](#q2-uiaction) | Senior | Closure-based actions |
| [How should reusable controls report user intent?](#q3-reusable-controls) | Staff | Ownership boundaries |

---

<a id="q1-target-action"></a>
## Q1: How does target-action work in UIKit?

### Short Answer

A `UIControl` sends a selector to a target when a specific control event occurs,
such as `.touchUpInside` or `.valueChanged`.

### Expanded Answer

The control owns the interaction detail. The target handles the intent. For a
screen-owned button, the target is often the view controller. For a targetless
action, UIKit routes the selector through the responder chain.

The handler should usually be small: read the relevant control state and pass a
semantic intent to the screen or view model.

---

<a id="q2-uiaction"></a>
## Q2: When would you use `UIAction` instead of a selector?

### Short Answer

Use `UIAction` when a closure-based command keeps the title, image, state, and
handler together clearly, such as a simple button, bar item, or menu action.

### Expanded Answer

`UIAction` is convenient, but it has closure lifetime concerns. If a controller
owns a control, and the control owns an action whose closure captures the
controller strongly, the screen can leak. I would capture weakly unless the
lifetime relationship proves a strong capture is safe.

Selectors are still useful for responder-chain commands and Objective-C style
control events.

---

<a id="q3-reusable-controls"></a>
## Q3: How should reusable controls report user intent?

### Short Answer

A reusable control should emit semantic intent, not perform screen-level work.
The owner should decide navigation, persistence, networking, and analytics.

### Expanded Answer

For example, a retry view can expose `onRetry`, a delegate method, or a control
event. It should not know which coordinator to push or which endpoint to call.

This keeps the control reusable and testable. It also prevents hidden ownership
cycles when controls retain action closures that capture screen owners.
