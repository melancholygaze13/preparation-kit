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
last_reviewed: 2026-07-26
---

# Modal Presentation, Dismissal, and Ownership

> Modal presentation places one controller over another for a separate task.
> Dismissal ends that relationship. The presented flow owns its content, while
> the presenting side decides how completion or cancellation affects the app.

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
