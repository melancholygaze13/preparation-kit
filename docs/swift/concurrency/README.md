---
title: "Concurrency"
domain: "Swift"
page_type: topic-index
status: reviewed
last_reviewed: 2026-06-21
---

# Concurrency

## Scope

Swift's task and isolation model: suspension and execution, structured and
unstructured lifetime, cancellation, asynchronous values, actor isolation,
sendability, migration, testing, and operational control.

## Prerequisites

- [Closures](../closures/README.md)
- [Error Handling](../error-handling/README.md)
- [Classes and Structures](../classes-and-structures/README.md)

## Learning Path

1. [Async Functions, Suspension, and Executors](async-functions-suspension-and-executors/README.md)
2. [Structured Concurrency and Task Groups](structured-concurrency-and-task-groups/README.md)
3. [Unstructured Tasks and Task Context](unstructured-tasks-and-task-context/README.md)
4. [Cancellation, Timeouts, and Lifecycle](cancellation-timeouts-and-lifecycle/README.md)
5. [Async Sequences, Streams, and Continuations](async-sequences-streams-and-continuations/README.md)
6. [Actors, Global Actors, and Reentrancy](actors-global-actors-and-reentrancy/README.md)
7. [Sendability and Swift 6 Migration](sendability-and-swift-6-migration/README.md)
8. [Concurrency Testing and Observability](concurrency-testing-and-observability/README.md)

## Concepts

| Concept | Summary | Level |
|---|---|---|
| [Async Functions, Suspension, and Executors](async-functions-suspension-and-executors/README.md) | Separate suspension from parallel execution and place CPU work on an intentional executor. | Senior |
| [Structured Concurrency and Task Groups](structured-concurrency-and-task-groups/README.md) | Scope child lifetime, results, failure, cancellation, and capacity to an awaited parent. | Senior |
| [Unstructured Tasks and Task Context](unstructured-tasks-and-task-context/README.md) | Own task handles and understand inherited versus detached execution context. | Senior |
| [Cancellation, Timeouts, and Lifecycle](cancellation-timeouts-and-lifecycle/README.md) | Propagate cooperative cancellation and make deadlines, cleanup, and owner teardown explicit. | Senior |
| [Async Sequences, Streams, and Continuations](async-sequences-streams-and-continuations/README.md) | Model asynchronous values and bridge callback APIs with explicit buffering and termination. | Senior |
| [Actors, Global Actors, and Reentrancy](actors-global-actors-and-reentrancy/README.md) | Protect invariants while accounting for reentrancy, global isolation, and boundary cost. | Senior |
| [Sendability and Swift 6 Migration](sendability-and-swift-6-migration/README.md) | Prove safe transfer and stage strict-concurrency adoption across module boundaries. | Staff |
| [Concurrency Testing and Observability](concurrency-testing-and-observability/README.md) | Verify interleavings deterministically and operate concurrency using capacity and latency signals. | Staff |

## Source Section

- [The Swift Programming Language: Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
- [Swift 6 Migration Guide](https://www.swift.org/migration/)
