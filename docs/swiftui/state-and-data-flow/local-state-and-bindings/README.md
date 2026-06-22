---
title: "Local State and Bindings"
domain: "SwiftUI"
topic: "State and Data Flow"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - state
  - binding
  - source-of-truth
---

# Local State and Bindings

> `@State` gives a view identity ownership of mutable UI storage. `@Binding`
> gives another view read-write access to existing storage without transferring
> ownership or creating a second source of truth.

## Quick Recall

- Put each mutable value at the nearest owner that controls its lifetime.
- Keep `@State` private and use it for transient UI state.
- Pass a plain value for read-only access and a binding only for genuine mutation.
- A state initializer supplies the first value; it does not track later input changes.
- Prefer explicit domain actions when unrestricted two-way mutation would bypass rules.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
