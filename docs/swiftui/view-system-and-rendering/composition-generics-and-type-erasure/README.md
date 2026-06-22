---
title: "Composition, Generics, and Type Erasure"
domain: "SwiftUI"
topic: "View System and Rendering"
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
  - generics
  - opaque-types
  - type-erasure
---

# Composition, Generics, and Type Erasure

> Preserve concrete view structure with composition, generics, and `some View` by
> default. Use `AnyView` only at a boundary that genuinely needs runtime-varying
> types, because erasure hides structure and can replace the wrapped hierarchy.

## Quick Recall

- Generic containers keep child types visible and enforce relationships at compile time.
- `some View` hides one concrete type chosen by the implementation.
- `@ViewBuilder` converts supported branches and child expressions into one type.
- `Group` groups content without adding stack-style layout.
- `AnyView` is a runtime type-erased wrapper, not a routine fix for compiler errors.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
