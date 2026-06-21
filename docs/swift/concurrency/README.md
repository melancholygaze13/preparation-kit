---
title: "Concurrency"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-21
---

# Concurrency

## Scope

Swift's data-race-safe concurrency model: async execution, structured tasks,
cancellation, actors, isolation, and values crossing concurrency domains.

## Prerequisites

- [Closures](../closures/README.md)
- [Error Handling](../error-handling/README.md)
- [Classes and Structures](../classes-and-structures/README.md)

## Learning Path

1. [Async Execution and Suspension](async-execution-and-suspension/README.md)
2. [Structured Tasks and Cancellation](structured-tasks-and-cancellation/README.md)
3. [Actors, Isolation, and Sendability](actors-isolation-and-sendability/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Async Execution and Suspension](async-execution-and-suspension/README.md) | Model suspension, executor behavior, async sequences, and effectful boundaries without blocking threads. | Senior |
| [Structured Tasks and Cancellation](structured-tasks-and-cancellation/README.md) | Keep child work scoped, awaitable, priority-aware, bounded, and cooperatively cancellable. | Senior |
| [Actors, Isolation, and Sendability](actors-isolation-and-sendability/README.md) | Protect shared mutation, revalidate across suspension, and transfer only concurrency-safe values. | Senior |

## Source Section

- [Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
