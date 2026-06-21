---
title: "Async Execution and Suspension: Theory"
domain: "Swift"
topic: "Concurrency"
concept: "Async Execution and Suspension"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Async Execution and Suspension: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> An async function may suspend at `await`, freeing its thread while preserving task state.

- Suspension is not blocking and does not promise another thread.
- Sequential awaits remain sequential; use structured child tasks for independent work.
- Swift 6.2 plain nonisolated async functions run on the caller's actor by default; use `@concurrent` for intentional CPU offloading.
- Async sequences provide pull-based asynchronous iteration and naturally integrate cancellation.
- Continuation bridges must resume exactly once on every path.

## Mental Model

A task is a unit of asynchronous work; executors schedule its synchronous segments
between suspension points. Isolation, not thread identity, defines safe state access.

## How It Works

```swift
func load() async throws -> Data {
    let (data, _) = try await URLSession.shared.data(from: endpoint)
    return data
}
```

`await` marks possible interleaving. I/O suspends naturally; CPU-bound work still
occupies its executor until it returns or explicitly yields. Avoid semaphores and
blocking waits around async APIs.

### Core Invariants

- Async APIs never block merely to wait for async completion.
- Executor assumptions are expressed through isolation.
- Continuations resume exactly once.
- Long loops check cancellation and avoid monopolizing executors.

## Failure Modes

- Assuming async means background execution.
- Serial awaits for independent operations.
- Blocking an actor with CPU work.
- Double- or never-resumed continuation.
- Async stream producer outlives consumer without termination cleanup.

## Engineering Judgment

Use async/await for suspendable operations, async sequences for multiple values over
time, and `@concurrent` only for intentional CPU offloading. Prefer native async APIs;
bridge callbacks once at the boundary with checked continuations.

## Production Considerations

Measure end-to-end latency, suspension, executor contention, buffering, and cancellation.
Test completion, failure, cancellation, continuation misuse, and stream termination.
Changing sync to async is a source and architecture migration.

## Staff and Principal Perspective

Define executor ownership, concurrency budgets, backpressure, cancellation, and tracing
across service boundaries. Async syntax without capacity policy can still overload systems.

## References

- [The Swift Programming Language: Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
- [SE-0461: Async Function Isolation](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0461-async-function-isolation.md)
