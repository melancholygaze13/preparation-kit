---
title: "Store, State, Action, and Reducer: Interview Questions"
domain: "Architecture"
topic: "The Composable Architecture (TCA)"
concept: "Store, State, Action, and Reducer"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-11
tags:
  - tca
  - reducers
  - unidirectional-data-flow
---

# Store, State, Action, and Reducer: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Explain TCA's core runtime model](#q1-explain-tcas-core-runtime-model) | Senior | State transition loop |
| [How do you design state and actions?](#q2-how-do-you-design-state-and-actions) | Senior | Domain modeling |
| [When should a feature have its own reducer?](#q3-when-should-a-feature-have-its-own-reducer) | Senior | Composition boundary |

---

<a id="q1-explain-tcas-core-runtime-model"></a>
## Q1: Explain TCA's core runtime model

### Short Answer

State is the feature's source of truth, actions describe every event, and the reducer
turns one action into immediate state changes plus effects. The store runs that loop,
runs effects, feeds their actions back to the reducer, and exposes observable state.

### Expanded Answer

Views read state and send actions; they do not perform feature policy. This creates one
visible mutation path and makes effect responses testable. It still requires good state
ownership, dependency boundaries, and feature scopes.

<a id="q2-how-do-you-design-state-and-actions"></a>
## Q2: How do you design state and actions?

### Short Answer

I keep owned source values in state and derive values that do not need independent
lifetime. I name actions after events such as a tap, response, or child delegate outcome.
That keeps decisions in the reducer instead of letting callers send desired mutations.

### Example

I prefer `saveButtonTapped` over `setSaving(true)`. The reducer can validate the draft,
set loading state, and return the save effect as one policy decision.

<a id="q3-when-should-a-feature-have-its-own-reducer"></a>
## Q3: When should a feature have its own reducer?

### Short Answer

When it has meaningful state, behavior, lifetime, tests, reuse, or ownership. I do not
create a reducer for every small view. A presentational component can receive values and
closures while the parent feature keeps the behavior.

### Trade-offs

More reducers improve isolation and reuse, but add action routing and state composition.
Too few create one large reducer; too many turn simple UI structure into architecture.
