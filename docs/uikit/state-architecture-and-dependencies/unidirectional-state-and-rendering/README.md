---
title: "Unidirectional State and Rendering"
domain: "UIKit"
topic: "State, Architecture, and Dependencies"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# Unidirectional State and Rendering

> Unidirectional flow sends changes in one direction: an event updates one owned
> state value, then the screen renders that state. The goal is not a
> framework; it is to make updates predictable when user actions, async work,
> and lifecycle events overlap.

## Quick Recall

- Keep one source of truth for screen state.
- Treat taps, delegate callbacks, and async results as events.
- Update state first, then render UIKit views from the accepted state.
- Make rendering repeatable so the same state produces the same UI.
- Use this pattern when a screen has enough state that ad hoc mutation becomes
  hard to reason about.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
