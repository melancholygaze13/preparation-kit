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
last_reviewed: 2026-08-12
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

### Expanded Answer

State should represent valid feature situations and keep request or presentation identity
when lifetime depends on it. Actions describe facts the reducer can interpret, including
effect responses. Mutation-shaped actions leak policy to callers and make it harder to
see why a state transition occurred.

### Example

I prefer `saveButtonTapped` over `setSaving(true)`. The reducer can validate the draft,
set loading state, and return the save effect as one policy decision.

<a id="q3-when-should-a-feature-have-its-own-reducer"></a>
## Q3: When should a feature have its own reducer?

### Short Answer

When it has meaningful state, behavior, lifetime, tests, reuse, or ownership. I do not
create a reducer for every small view. A presentational component can receive values and
closures while the parent feature keeps the behavior.

### Expanded Answer

The reducer boundary should match a domain that can be reasoned about independently.
Extraction is useful when a child has its own effects, destination lifetime, or team
ownership. A purely visual subtree remains a view so action routing does not mirror the
view hierarchy mechanically.

### Trade-offs

More reducers improve isolation and reuse, but add action routing and state composition.
Too few create one large reducer; too many turn simple UI structure into architecture.
