---
title: "Containment and Child View Controllers"
domain: "UIKit"
topic: "View Controller Lifecycle and Containment"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# Containment and Child View Controllers

> Containment creates a parent-child relationship between view controllers.
> Correct
> containment keeps parent-child lifetime, view hierarchy, and appearance
> callbacks in sync.

## Quick Recall

- Call `addChild(_:)`, add the child view, then call `didMove(toParent:)`.
- For removal, call `willMove(toParent: nil)`, deactivate parent-installed
  constraints, remove the view, then call
  `removeFromParent()`.
- The parent owns the child controller after containment is established.
- Use containment for reusable screen regions with their own lifecycle.
- Avoid child controllers when a simple view is enough.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
