---
title: "Testing Navigation, State, and Side Effects"
domain: "Architecture"
topic: "Architecture Testing and Testability"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - navigation-testing
  - state-testing
  - side-effects
---

# Testing Navigation, State, and Side Effects

> Make decisions observable as state or owned commands, and put nondeterminism behind
> injected boundaries. Tests can then drive events, control effect completion, and
> assert navigation, cancellation, or stale-result policy without waiting on real time.

## Quick Recall

- Test state transitions as inputs and outputs before testing rendered UI.
- Represent navigation as state or verify commands at an owned router boundary.
- Control clocks, IDs, randomness, and effect results; never wait with fixed sleeps.
- Test loading, success, failure, cancellation, and out-of-order completion explicitly.
- Keep a few integration or UI tests for real framework presentation and deep links.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
