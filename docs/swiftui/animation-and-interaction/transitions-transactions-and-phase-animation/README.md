---
title: "Transitions, Transactions, and Phase Animation"
domain: "SwiftUI"
topic: "Animation and Interaction"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - transitions
  - transactions
  - phase-animator
---

# Transitions, Transactions, and Phase Animation

> A transition describes insertion or removal. A transaction carries update context,
> including animation. A phase animation moves through discrete presentation states.
> These mechanisms do not own business state or async workflow timing.

## Quick Recall

- A transition requires a structural insertion or removal plus an animated state change.
- Use asymmetric transitions when insertion and removal need different behavior.
- Transactions can replace or disable animation for a subtree.
- Use phase animation for discrete ordered states and keyframes for timed tracks.
- Sequence animations with completion or phase APIs, not arbitrary sleeps.

A transition does nothing when the view remains in the hierarchy and only a property
changes. The insertion or removal must also happen in an animated transaction.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
