---
title: "Drag and Drop, Context Menus, and Haptics"
domain: "UIKit"
topic: "Animation, Transitions, and Interaction"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-10
---

# Drag and Drop, Context Menus, and Haptics

> Use UIKit's standard interactions for preview, animation, and input adaptation.
> App code should define valid data movement, current actions, and semantic feedback
> without making a hidden gesture the only route to a feature.

## Quick Recall

- Use `NSItemProvider` for transferable drag data; `localObject` is only a same-app
  optimization.
- Validate a drop before mutating the model, then update the UI from that model.
- Build context menus from current item state and revalidate destructive actions.
- Match haptic type to meaning, prepare only when an event is likely, and keep
  visual or spoken feedback equivalent.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
