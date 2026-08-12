---
title: "Concurrency, State, and Side Effects"
domain: "Architecture"
page_type: topic-index
interview_priority: high
status: reviewed
last_reviewed: 2026-08-12
---

# Concurrency, State, and Side Effects

## Learning Path

1. [Isolation Ownership and Main-Actor Boundaries](isolation-ownership-and-main-actor-boundaries/README.md)
2. [Task and Effect Lifetimes](task-and-effect-lifetimes/README.md)
3. [Cancellation, Stale Results, and Logical Races](cancellation-stale-results-and-logical-races/README.md)
4. [Event Ordering, Streams, and Backpressure](event-ordering-streams-and-backpressure/README.md)

## Preparation Paths

- **Rapid review:** Read the four concept overviews, then rehearse isolation ownership,
  task lifetime, stale-result protection, and stream buffering decisions.
- **Standard preparation:** Complete all four bundles in order. They connect Swift's
  concurrency rules to feature architecture and production behavior.
- **Role-specific depth:** Staff and Principal candidates should focus on shared
  effect infrastructure, cross-module ownership, observability, and migration rules.

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Isolation Ownership and Main-Actor Boundaries](isolation-ownership-and-main-actor-boundaries/README.md) | Aligns mutable state with one explicit concurrency owner. | High | 11 min |
| [Task and Effect Lifetimes](task-and-effect-lifetimes/README.md) | Connects asynchronous work to feature and request ownership. | High | 11 min |
| [Cancellation, Stale Results, and Logical Races](cancellation-stale-results-and-logical-races/README.md) | Prevents obsolete work from committing invalid state. | High | 11 min |
| [Event Ordering, Streams, and Backpressure](event-ordering-streams-and-backpressure/README.md) | Controls values over time when producers and consumers differ. | High | 11 min |
