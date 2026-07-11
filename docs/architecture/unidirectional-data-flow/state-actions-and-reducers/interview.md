---
title: "State, Actions, and Reducers: Interview Questions"
domain: "Architecture"
topic: "Unidirectional Data Flow"
concept: "State, Actions, and Reducers"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-11
tags:
  - unidirectional-data-flow
  - reducers
  - state
---

# State, Actions, and Reducers: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How does unidirectional data flow work?](#q1-how-does-unidirectional-data-flow-work) | Senior | Core loop |
| [What makes a good action and reducer?](#q2-what-makes-a-good-action-and-reducer) | Senior | Deterministic transitions |
| [When would you choose UDF over MVVM?](#q3-when-would-you-choose-udf-over-mvvm) | Senior | Fit and trade-offs |

---

<a id="q1-how-does-unidirectional-data-flow-work"></a>
## Q1: How does unidirectional data flow work?

### Short Answer

The view renders state and sends actions. A reducer applies each action to current
state and describes effects. Effect results return as actions through the same store.
Because there is one mutation path, transitions and ordering are easier to trace and
test.

### Expanded Answer

The store owns state and serial action processing. Views never mutate shared feature
state directly, and effect callbacks do not bypass the reducer. Local visual state can
remain in the view when it does not affect feature behavior.

<a id="q2-what-makes-a-good-action-and-reducer"></a>
## Q2: What makes a good action and reducer?

### Short Answer

An action is a value describing user intent or an outcome. A reducer synchronously
turns state and action into new state plus effect descriptions, without hidden time,
randomness, global services, or async mutation. State stores facts once and represents
important phases explicitly.

### Expanded Answer

I avoid closures and service instances in actions. They make behavior hard to compare,
log, and replay. I inject clocks, identifiers, and clients at the effect boundary.
Reducer tests then assert state and effects for the same inputs.

<a id="q3-when-would-you-choose-udf-over-mvvm"></a>
## Q3: When would you choose UDF over MVVM?

### Short Answer

I choose UDF when a feature has many state transitions, overlapping effects, shared
state, or a strong need for traceability. I choose a simpler observable model or MVVM
when behavior is local and UDF's action, reducer, and effect vocabulary would add more
cost than control.

### Trade-offs

UDF centralizes transitions and supports deterministic tests and diagnostics. It can
produce large domains, excessive actions, broad UI updates, and boilerplate if state
and features are not scoped carefully.
