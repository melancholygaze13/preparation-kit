---
title: "Trait Collections, Size Changes, and Adaptation"
domain: "UIKit"
topic: "Auto Layout and Adaptive Layout"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-12
---

# Trait Collections, Size Changes, and Adaptation

> Adaptive UIKit layouts respond to environment changes such as size class,
> display scale, interface style, content size category, and window size. Traits
> describe context; constraints and view state express the response.

## Quick Recall

- Trait collections describe environment, not just device type.
- Size classes are coarse signals; exact available size still matters.
- Use `viewWillTransition(to:with:)` for size changes that need coordinated
  updates.
- Register for the specific traits that affect the view; registration does not
  perform the initial configuration.
- Prefer adaptive layouts over branching only on iPhone or iPad.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
