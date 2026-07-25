---
title: "View Identity and Lifetime"
domain: "SwiftUI"
topic: "View System and Rendering"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - view-identity
  - state-lifetime
  - identifiable
---

# View Identity and Lifetime

> Identity answers whether a new view value represents the same UI element as
> before. Its lifetime is the period during which that identity remains present.
> SwiftUI ties local state and other framework-managed behavior to that lifetime.

## Quick Recall

- Structural identity comes from a view's type and position in the hierarchy.
- Explicit identity comes from stable data IDs or an intentional `.id` value.
- A new value with the same identity is an update; a new identity is replacement.
- Changing identity resets local state and can restart lifecycle-bound work.
- Collection IDs must describe domain identity, not the current position or render.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
