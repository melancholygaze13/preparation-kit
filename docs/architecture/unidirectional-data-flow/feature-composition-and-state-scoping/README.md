---
title: "Feature Composition and State Scoping"
domain: "Architecture"
topic: "Unidirectional Data Flow"
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
  - unidirectional-data-flow
  - composition
  - state-scoping
---

# Feature Composition and State Scoping

> Compose independent feature domains through explicit parent-child contracts. Scope
> views to the smallest state and actions they need while keeping shared facts under
> one owner.

## Quick Recall

- A child domain owns its state, actions, reducer, effects, and lifetime.
- A parent embeds or identifies child state and routes child actions to its reducer.
- Parent-child communication should use meaningful delegate actions, not reach into
  another feature's internals.
- Shared state needs one owner; derived copies and drafts need explicit sync rules.
- Optional and collection child state must drive effect cancellation and cleanup.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
