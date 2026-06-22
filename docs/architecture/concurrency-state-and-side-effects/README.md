---
title: "Concurrency, State, and Side Effects"
domain: "Architecture"
page_type: topic-index
interview_priority: high
status: draft
last_reviewed: 2026-06-22
---

# Concurrency, State, and Side Effects

## Learning Path

1. [Isolation Ownership and Main-Actor Boundaries](isolation-ownership-and-main-actor-boundaries/README.md)
2. [Task and Effect Lifetimes](task-and-effect-lifetimes/README.md)
3. [Cancellation, Stale Results, and Logical Races](cancellation-stale-results-and-logical-races/README.md)
4. [Event Ordering, Streams, and Backpressure](event-ordering-streams-and-backpressure/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Isolation Ownership and Main-Actor Boundaries](isolation-ownership-and-main-actor-boundaries/README.md) | Aligns mutable state with one explicit concurrency owner. | High | 1 min |
| [Task and Effect Lifetimes](task-and-effect-lifetimes/README.md) | Connects asynchronous work to feature and request ownership. | High | 1 min |
| [Cancellation, Stale Results, and Logical Races](cancellation-stale-results-and-logical-races/README.md) | Prevents obsolete work from committing invalid state. | High | 1 min |
| [Event Ordering, Streams, and Backpressure](event-ordering-streams-and-backpressure/README.md) | Controls values over time when producers and consumers differ. | High | 1 min |
