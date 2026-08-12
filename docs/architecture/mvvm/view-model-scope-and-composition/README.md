---
title: "View Model Scope and Composition"
domain: "Architecture"
topic: "MVVM"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - mvvm
  - composition
  - scope
---

# View Model Scope and Composition

> Scope a view model to one coherent presentation capability and lifetime. Compose
> child models when they own independent state or behavior, not for every child view.

## Quick Recall

- Screen boundaries are a starting point, not a rule. Follow state, lifetime, and
  responsibility boundaries.
- A parent view model coordinates children but should not copy all child state.
- Stable identifiers and explicit ownership matter when lists create child models.
- Shared product state belongs in a shared model or repository, not duplicated across
  sibling view models.
- Split by a distinct reason to change; a smaller file alone is not better architecture.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
