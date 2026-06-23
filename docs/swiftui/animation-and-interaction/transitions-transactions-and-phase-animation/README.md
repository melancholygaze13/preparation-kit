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
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - transitions
  - transactions
  - phase-animator
---

# Transitions, Transactions, and Phase Animation

> A transition animates insertion or removal of a view identity. Transactions carry
> animation context, while phase and keyframe APIs describe deliberate multi-stage motion.

## Quick Recall

- A transition requires a structural insertion or removal plus an animated state change.
- Use asymmetric transitions when insertion and removal need different behavior.
- Transactions can replace or disable animation for a subtree.
- Use phase animation for discrete ordered states and keyframes for timed tracks.
- Sequence animations with completion or phase APIs, not arbitrary sleeps.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
