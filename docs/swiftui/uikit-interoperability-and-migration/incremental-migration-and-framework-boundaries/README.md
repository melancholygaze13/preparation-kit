---
title: "Incremental Migration and Framework Boundaries"
domain: "SwiftUI"
topic: "UIKit Interoperability and Migration"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
---

# Incremental Migration and Framework Boundaries

> Incremental migration replaces UIKit with SwiftUI in bounded steps. A framework
> boundary is the contract where the two UI systems meet. Each boundary needs one
> owner for state, navigation, lifecycle, and side effects.

## Quick Recall

- Migrate by feature, screen, or stable component boundary, not by random view
  fragments.
- Decide whether UIKit or SwiftUI owns navigation before moving a flow.
- Keep domain state and side effects behind shared feature dependencies, not
  inside framework-specific views.
- Use wrappers as transition tools with clear contracts and removal criteria.
- Test boundary behavior: state synchronization, accessibility, layout, deep
  links, cancellation, and rollback.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
