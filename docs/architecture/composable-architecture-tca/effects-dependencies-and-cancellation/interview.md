---
title: "Effects, Dependencies, and Cancellation: Interview Questions"
domain: "Architecture"
topic: "The Composable Architecture (TCA)"
concept: "Effects, Dependencies, and Cancellation"
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
  - effects
  - cancellation
---

# Effects, Dependencies, and Cancellation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How does TCA model asynchronous work?](#q1-how-does-tca-model-asynchronous-work) | Senior | Effect lifecycle |
| [How do dependencies work in TCA?](#q2-how-do-dependencies-work-in-tca) | Senior | Capability boundaries |
| [How do you prevent stale or conflicting effects?](#q3-how-do-you-prevent-stale-or-conflicting-effects) | Senior | Cancellation and ordering |

---

<a id="q1-how-does-tca-model-asynchronous-work"></a>
## Q1: How does TCA model asynchronous work?

### Short Answer

The reducer updates immediate state and returns an effect. The effect uses declared
dependencies and sends result actions back to the store. The reducer handles those
actions, so async work never retains and mutates reducer state outside its transition.

### Expanded Answer

I capture required state values before returning `.run`, map success and expected
failure into domain actions, and handle cancellation as a lifecycle outcome. I avoid
starting untracked tasks inside the reducer.

<a id="q2-how-do-dependencies-work-in-tca"></a>
## Q2: How do dependencies work in TCA?

### Short Answer

Reducers declare registered capabilities with `@Dependency`. Production receives live
values, while tests and previews can override them. I inject clocks, IDs, and randomness
as well as service clients so the complete decision remains deterministic.

### Trade-offs

This avoids passing dependencies through every reducer initializer, but makes the graph
less visible at construction. I keep keys narrow, owned, and searchable and do not use
dependency values as unowned global state.

<a id="q3-how-do-you-prevent-stale-or-conflicting-effects"></a>
## Q3: How do you prevent stale or conflicting effects?

### Short Answer

I define the product policy first. Latest-wins work uses a stable cancellation ID with
in-flight replacement. Independent feature instances need distinct identities. For
operations that may still finish, I include request identity and reject stale responses.

### Expanded Answer

Cancellation is cooperative, so the dependency must observe it. I test by controlling
completion order, not with sleeps: start A, start B, complete B, then A, and assert the
documented final state.
