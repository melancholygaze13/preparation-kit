---
title: "Modal Presentation, Dismissal, and Ownership"
domain: "UIKit"
topic: "Navigation and Presentation"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-01
---

# Modal Presentation, Dismissal, and Ownership

> Modal presentation creates a presenting/presented relationship for a separate
> task. The presented flow owns its content, but dismissal should be an explicit
> outcome agreed with the presenting context.

## Quick Recall

- `present(_:animated:)` creates a modal presentation relationship.
- The presenting controller may be rerouted by UIKit to a suitable presentation
  context.
- Use a navigation controller inside a modal when the modal task has multiple
  steps.
- Dismissal can be user-driven, programmatic, or interactive.
- Treat dismissal as state or completion, not as a hidden side effect.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
