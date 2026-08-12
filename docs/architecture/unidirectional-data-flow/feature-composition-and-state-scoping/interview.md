---
title: "Feature Composition and State Scoping: Interview Questions"
domain: "Architecture"
topic: "Unidirectional Data Flow"
concept: "Feature Composition and State Scoping"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
tags:
  - unidirectional-data-flow
  - composition
  - state-scoping
---

# Feature Composition and State Scoping: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you compose UDF features?](#q1-how-do-you-compose-udf-features) | Senior | Parent-child domains |
| [Where should shared state live?](#q2-where-should-shared-state-live) | Senior | Ownership |
| [How do child lifetime and cancellation interact?](#q3-how-do-child-lifetime-and-cancellation-interact) | Senior | Optional and collection state |

---

<a id="q1-how-do-you-compose-udf-features"></a>
## Q1: How do you compose UDF features?

### Short Answer

Each child owns a state, action, reducer, effects, and lifetime. The parent embeds or
identifies child state, routes child actions, and handles cross-feature outcomes. The
child reports narrow delegate events so the parent does not depend on private steps.

### Expanded Answer

Views receive scoped state and actions rather than the root store. Child reducers are
tested independently; parent tests cover coordination. Module boundaries can hide
internal actions when independent ownership justifies the API cost.

<a id="q2-where-should-shared-state-live"></a>
## Q2: Where should shared state live?

### Short Answer

One owner should match the fact's narrowest common lifetime. A parent can own flow
state, a session model can own app-wide identity, and a repository can own durable
data policy. Children receive projections or send intents rather than keeping
unsynchronized copies.

### Expanded Answer

An editable draft is a valid copy only with commit and discard rules. I avoid moving
all local state to the root because that couples unrelated features and expands
observation. Direct sibling mutation is replaced by a parent action or shared owner.

<a id="q3-how-do-child-lifetime-and-cancellation-interact"></a>
## Q3: How do child lifetime and cancellation interact?

### Short Answer

The parent owns child presence. Removing optional or collection state ends that child
scope and cancels its effects. Cancellation IDs include stable child identity, and
late actions from a removed child are ignored or diagnosed rather than recreating it.

### Expanded Answer

Collection identity uses domain IDs, not indexes, because rows reorder and delete.
Tests start child work, remove or dismiss the child, and then deliver a late result.
The result must not mutate a different element or resurrect dismissed state.
