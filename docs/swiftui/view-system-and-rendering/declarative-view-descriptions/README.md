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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - declarative-ui
  - view-builder
  - view-composition
---

# Declarative View Descriptions

> A SwiftUI `View` value describes the UI for the current inputs. It is not the
> persistent object on screen. SwiftUI can evaluate `body` repeatedly and use
> each new description to update framework-managed UI and state.

## Quick Recall

- `body` should be a cheap, deterministic description of current state.
- A modifier returns another view value; modifier order can change semantics.
- A result builder combines branches and child expressions into one result.
  SwiftUI calls it `ViewBuilder` in older SDKs and `ContentBuilder` in Xcode 27.
- Keep I/O, model mutation, and expensive transformations out of `body`.
- Extract a real subview when it creates a useful boundary for dependencies,
  ownership, reuse, or testing.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
