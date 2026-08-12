---
title: "Store, State, Action, and Reducer"
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
  - reducers
  - unidirectional-data-flow
---

# Store, State, Action, and Reducer

> A TCA feature models its state, every event that can affect it, and one reducer that
> turns an action into immediate state changes plus effects. The store is the runtime
> that processes actions, runs effects, and exposes observable state.

## Quick Recall

- `State` is the feature's owned source of truth; derive values instead of duplicating them.
- `Action` describes events, including user intent, child events, and effect responses.
- A reducer synchronously mutates state and returns work to run outside that transition.
- The store owns the runtime loop; views observe state and send actions.
- Composition should follow feature ownership, not create one reducer for every view.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
