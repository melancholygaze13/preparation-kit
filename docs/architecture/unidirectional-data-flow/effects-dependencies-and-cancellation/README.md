---
title: "Effects, Dependencies, and Cancellation"
domain: "Architecture"
topic: "Unidirectional Data Flow"
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
  - unidirectional-data-flow
  - effects
  - cancellation
---

# Effects, Dependencies, and Cancellation

> Reducers describe external work; an effect runtime executes it and sends outcomes
> back as actions. Identity and lifetime make cancellation and stale-result policy
> explicit.

## Quick Recall

- Network, persistence, clocks, randomness, analytics, and long-running streams are
  effects because their results are not determined by reducer inputs alone.
- Inject narrow capabilities rather than reading global services inside reducers.
- Effect results must return through actions, including meaningful failures.
- Cancellation is cooperative and does not itself prevent an obsolete result from
  being accepted.
- Durable work should outlive a feature store and expose status to it, rather than
  being owned by presentation state.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
