---
title: "Transitions, Transactions, and Phase Animation: Interview Questions"
domain: "SwiftUI"
topic: "Animation and Interaction"
concept: "Transitions, Transactions, and Phase Animation"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - transitions
  - transactions
  - phase-animator
---

# Transitions, Transactions, and Phase Animation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why is my transition not animating?](#q1-why-is-my-transition-not-animating) | Senior | Identity and transaction |
| [When would you modify a transaction?](#q2-when-would-you-modify-a-transaction) | Senior | Animation scope |
| [When do you use phase or keyframe animation?](#q3-when-do-you-use-phase-or-keyframe-animation) | Senior | Multi-stage motion |

---

<a id="q1-why-is-my-transition-not-animating"></a>
## Q1: Why is my transition not animating?

### Short Answer

A transition needs an actual insertion or removal of view identity and the state
change must occur in an animated transaction. If the view stays present and only a
property changes, animate that property instead.

### Expanded Answer

I also inspect ancestor identity. If a parent is replaced, the intended transition
may not have a stable container. Temporary borders and simplified structure help
confirm what enters and leaves.

<a id="q2-when-would-you-modify-a-transaction"></a>
## Q2: When would you modify a transaction?

### Short Answer

When one subtree needs different animation behavior from the broader update, such as
disabling animation for a live value while the surrounding panel expands.

### Expanded Answer

The transaction is contextual for that update. I modify it locally rather than
disabling animation globally. I do not store it as model state or depend on internal
propagation details beyond the documented API.

<a id="q3-when-do-you-use-phase-or-keyframe-animation"></a>
## Q3: When do you use phase or keyframe animation?

### Short Answer

Phases fit a small sequence of discrete presentation states. Keyframes fit precise
timed tracks with overshoot, pause, or coordinated values. Neither should schedule
business operations.

### Expanded Answer

The model owns durable state and async completion; animation derives from it. I define
repeat and interruption policy and provide a reduced-motion alternative. For simple
one-step changes, ordinary animation remains clearer.
