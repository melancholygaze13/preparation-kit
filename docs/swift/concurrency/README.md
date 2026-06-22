---
title: "Concurrency"
domain: "Swift"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-06-22
---

# Concurrency

## Scope

Swift concurrency controls asynchronous work and protects shared state. This
topic covers tasks, cancellation, actors, sendability, testing, and migration.

## Prerequisites

- [Closures](../closures/README.md)
- [Error Handling](../error-handling/README.md)
- [Classes and Structures](../classes-and-structures/README.md)

## Rapid Review

1. [Async Functions, Suspension, and Executors](async-functions-suspension-and-executors/README.md)
2. [Structured Concurrency and Task Groups](structured-concurrency-and-task-groups/README.md)
3. [Unstructured Tasks and Task Context](unstructured-tasks-and-task-context/README.md)
4. [Cancellation, Timeouts, and Lifecycle](cancellation-timeouts-and-lifecycle/README.md)
5. [Async Sequences, Streams, and Continuations](async-sequences-streams-and-continuations/README.md)
6. [Actors, Global Actors, and Reentrancy](actors-global-actors-and-reentrancy/README.md)
7. [Sendability and Swift 6 Migration](sendability-and-swift-6-migration/README.md)
8. [Concurrency Testing and Observability](concurrency-testing-and-observability/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Async Functions, Suspension, and Executors](async-functions-suspension-and-executors/README.md) | Distinguishes suspension, blocking, and parallel work. | Core | 9 min |
| [Structured Concurrency and Task Groups](structured-concurrency-and-task-groups/README.md) | Connects child lifetime, results, failure, and cancellation to a parent scope. | Core | 8 min |
| [Unstructured Tasks and Task Context](unstructured-tasks-and-task-context/README.md) | Explains task ownership and when detached work is unsafe. | Core | 7 min |
| [Cancellation, Timeouts, and Lifecycle](cancellation-timeouts-and-lifecycle/README.md) | Shows why cancellation is cooperative and who must stop work. | Core | 7 min |
| [Actors, Global Actors, and Reentrancy](actors-global-actors-and-reentrancy/README.md) | Protects shared state without assuming an actor method is fully atomic. | Core | 10 min |
| [Sendability and Swift 6 Migration](sendability-and-swift-6-migration/README.md) | Explains safe isolation transfer and strict-concurrency adoption. | Core | 9 min |
| [Async Sequences, Streams, and Continuations](async-sequences-streams-and-continuations/README.md) | Covers values over time and safe callback bridging. | High | 7 min |
| [Concurrency Testing and Observability](concurrency-testing-and-observability/README.md) | Makes timing-sensitive behavior testable and diagnosable. | High | 9 min |

## Source Section

- [The Swift Programming Language: Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
- [Swift 6 Migration Guide](https://www.swift.org/migration/)
