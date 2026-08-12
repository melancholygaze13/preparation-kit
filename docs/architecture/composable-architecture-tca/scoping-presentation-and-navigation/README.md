---
title: "Scoping, Presentation, and Navigation"
domain: "Architecture"
topic: "The Composable Architecture (TCA)"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - tca
  - navigation
  - feature-composition
---

# Scoping, Presentation, and Navigation

> A parent composes child reducers by mapping parent state and actions to the child's
> domain. Presentation and navigation are state, so creating or removing destination
> state controls lifetime and can be tested without driving the UI.

## Quick Recall

- Scope state and actions together; a child store must not outlive its state.
- Use optional or enum state for tree presentation such as sheets and destinations.
- Use `StackState` and `StackAction` for typed stack navigation.
- Parents own route policy; children report narrow delegate outcomes upward.
- Keep UI integration tests because state tests do not prove framework presentation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
