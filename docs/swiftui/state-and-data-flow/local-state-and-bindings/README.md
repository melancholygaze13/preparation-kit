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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - state
  - binding
  - source-of-truth
---

# Local State and Bindings

> `@State` gives a view identity ownership of mutable UI storage. `@Binding`
> gives another view read-write access to existing storage without transferring
> ownership. The owned storage remains the single source of truth: the one place
> the application treats as authoritative for that value.

## Quick Recall

- Put each mutable value at the nearest owner that controls its lifetime.
- Keep `@State` private and use it for transient UI state.
- Pass a plain value for read-only access and a binding only for genuine mutation.
- A state initializer supplies the first value; it does not track later input changes.
- With Xcode 27, omit an inline default when `init` must supply a state's first value.
- Prefer explicit domain actions when unrestricted two-way mutation would bypass rules.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
