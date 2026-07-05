---
title: "Target-Action, Controls, and Primary Actions"
domain: "UIKit"
topic: "Controls, Events, Gestures, and Focus"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-05
---

# Target-Action, Controls, and Primary Actions

> Controls turn user interaction into actions. Good UIKit code keeps control
> events close to the view and sends intent to the owning screen or model layer.

## Quick Recall

- `UIControl` sends actions for specific control events such as `.touchUpInside`
  and `.valueChanged`.
- Target-action is selector-based; `UIAction` is closure-based.
- A `nil` target routes the action through the responder chain.
- Primary actions are the preferred single main action for controls that support
  them.
- Closure-based actions can create retain cycles if the handler captures an
  owner that retains the control.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
