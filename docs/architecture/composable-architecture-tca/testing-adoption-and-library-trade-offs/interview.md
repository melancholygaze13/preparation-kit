---
title: "Testing, Adoption, and Library Trade-offs: Interview Questions"
domain: "Architecture"
topic: "The Composable Architecture (TCA)"
concept: "Testing, Adoption, and Library Trade-offs"
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
  - test-store
  - architecture-adoption
---

# Testing, Adoption, and Library Trade-offs: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you test a TCA feature?](#q1-how-do-you-test-a-tca-feature) | Senior | `TestStore` workflow |
| [When would you choose TCA?](#q2-when-would-you-choose-tca) | Senior | Fit and trade-offs |
| [How would you adopt TCA in an existing app?](#q3-how-would-you-adopt-tca-in-an-existing-app) | Staff | Migration and governance |

---

<a id="q1-how-do-you-test-a-tca-feature"></a>
## Q1: How do you test a TCA feature?

### Short Answer

I create a local `TestStore` with chosen state and dependency overrides. I send an
action, assert immediate state, receive effect actions, and assert final state and effect
completion. Tests are async, and I normally isolate them to the main actor.

### Expanded Answer

I use exhaustive tests for small leaf reducers and selective tests for composed flows.
I control clocks and effect completion rather than sleep. `TestStore` covers reducer
policy; integration and UI tests still cover adapters and framework presentation.

<a id="q2-when-would-you-choose-tca"></a>
## Q2: When would you choose TCA?

### Short Answer

When complex state, effects, navigation, or multi-team composition make a consistent
transition model and deterministic testing worth the library cost. I would not require
it for every small screen with local state and little behavior.

### Trade-offs

TCA provides explicit mutation, effect testing, dependency overrides, and composition.
It adds action modeling, training, compile and upgrade cost, and broad coupling to a
third-party runtime. Reducers alone do not guarantee good feature boundaries.

<a id="q3-how-would-you-adopt-tca-in-an-existing-app"></a>
## Q3: How would you adopt TCA in an existing app?

### Short Answer

I pilot one vertical feature behind an adapter boundary and keep one source of truth.
I measure delivery, defects, tests, builds, and onboarding before expanding. Then I set
a supported version, dependency ownership, migration policy, and a few proven conventions.

### Expanded Answer

I avoid a full rewrite and avoid synchronizing a TCA store with a legacy view model in
both directions. Legacy callbacks enter as actions or dependencies. Expansion follows
measured benefit, while deprecations and build cost remain visible engineering work.
