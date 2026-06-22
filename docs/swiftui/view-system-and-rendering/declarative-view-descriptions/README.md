---
title: "Declarative View Descriptions"
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
  - declarative-ui
  - view-builder
  - view-composition
---

# Declarative View Descriptions

> A SwiftUI `View` value describes the UI for the current inputs. It is not the
> persistent rendered object; SwiftUI can evaluate `body` repeatedly and reconcile
> each new description with framework-managed UI state.

## Quick Recall

- `body` should be a cheap, deterministic description of current state.
- A modifier returns another view value; modifier order can change semantics.
- `@ViewBuilder` turns branches and child expressions into one concrete view type.
- Keep I/O, model mutation, and expensive transformations out of `body`.
- Extract a real subview when it creates a useful boundary for dependencies,
  ownership, reuse, or testing.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
