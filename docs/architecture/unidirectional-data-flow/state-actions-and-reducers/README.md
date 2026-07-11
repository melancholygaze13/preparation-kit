---
title: "State, Actions, and Reducers"
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
last_reviewed: 2026-07-11
tags:
  - unidirectional-data-flow
  - reducers
  - state
---

# State, Actions, and Reducers

> State describes what is true, actions describe what happened, and a reducer decides
> the next state. All mutations follow the same visible direction.

## Quick Recall

- Views render state and send actions; they do not mutate shared feature state directly.
- Actions should carry facts or intent, not executable closures or mutable dependencies.
- A reducer synchronously applies one action to one state and describes any effects.
- Store independent facts once and derive display values to prevent contradictory state.
- UDF helps when transitions and effects need traceability. It can be excessive for
  small features with simple local mutation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
