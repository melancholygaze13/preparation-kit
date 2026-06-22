---
title: "Async Functions, Suspension, and Executors: Theory"
domain: "Swift"
topic: "Concurrency"
concept: "Async Functions, Suspension, and Executors"
page_type: theory
interview_priority: core
estimated_read_minutes: 5
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Async Functions, Suspension, and Executors: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A task runs synchronous segments separated by suspension points. An executor schedules
those segments; an actor supplies isolation and an executor. Reason about task lifetime
and isolation, not thread identity. Asynchrony improves waiting; parallelism improves
independent CPU throughput only when work and capacity justify it.

## How It Works

An `async` function can be called from another asynchronous context, an asynchronous
`@main` entry point, or a task. `await` lets the current task suspend until the callee
produces a result. A call can complete synchronously, so `await` is a permission to
suspend rather than a scheduling guarantee.

```swift
func loadDashboard() async throws -> Dashboard {
    let account = try await loadAccount()
    let activity = try await loadActivity(for: account.id)
    return Dashboard(account: account, activity: activity)
}
```

The second call depends on the first and is correctly sequential. Independent work
belongs in `async let` or a task group. Suspending I/O does not block an actor; decoding
a large response synchronously does.

Swift 6.2 can enable caller-actor execution and default main-actor isolation per module.
Under those settings, a plain async helper called from `@MainActor` stays there until it
reaches an API that suspends or an explicit concurrent boundary. Mark CPU-heavy,
sendable work `@concurrent`; do not use it merely because a function performs I/O.

### Core Invariants

- Actor-isolated state is accessed only on its isolation domain.
- No semaphore or blocking wait is used to obtain an async result.
- Independent work is made concurrent explicitly and remains capacity-bounded.
- CPU-intensive synchronous segments do not run on latency-sensitive executors.
- Module isolation settings are part of the API's execution semantics.

### Constraints and Guarantees

- Swift guarantees that possible suspension points are marked with `await`; it does not
  guarantee a suspension, thread hop, FIFO execution, or parallelism.
- Code between suspension points is synchronous within its current task. Other tasks
  can still execute concurrently, and actor state can change while this task suspends.
- `@concurrent` is current Swift 6.2 behavior and requires matching toolchain and mode;
  older targets follow their configured language and isolation rules.

## Engineering Judgment

### When to Use It

Use async functions for naturally suspendable operations and asynchronous entry points.
Use `@concurrent` for substantial CPU work whose inputs and results can safely cross
isolation. Keep UI state transitions on `@MainActor`.

### When Not to Use It

Do not make trivial synchronous APIs async, use async as a background-thread synonym,
or offload ordinary network waits. Do not introduce concurrency when ordering is required.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| Sequential `await` | Simple ordering and failure flow | No overlap | Dependent operations |
| Structured child tasks | Overlaps independent work | Capacity and aggregation policy | Independent operations |
| `@concurrent` | Protects caller actor from CPU work | Isolation transfer and scheduling cost | Large transforms |

### Alternatives

Keep small work synchronous, use actors for mutable ownership, and use low-level locks
or Dispatch only where a synchronous interoperability or performance boundary requires it.

## Production Application

### Performance

Measure executor wait, hop count, main-actor stalls, CPU duration, allocation, and total
latency. More tasks can increase overhead without increasing throughput.

### Concurrency and Thread Safety

Never encode correctness using a thread ID. Declare actor isolation, send only safe
values, and revalidate actor state after every suspension.

### Testing

Await production operations directly. Inject controllable dependencies to prove whether
independent work overlaps and whether actor-bound work remains responsive.

### Observability and Debugging

Use Instruments concurrency views and signposts around CPU regions. Record operation IDs,
task names where available, executor queueing, and suspension-to-resumption latency.

### Compatibility and Migration

Record each target's Swift language mode, strict-concurrency level, and default isolation.
Moving a public API from synchronous to async is source-breaking and propagates through callers.

## Staff and Principal Perspective

### System Impact

Execution placement is a capacity decision: one CPU-heavy helper inherited by a shared
actor can serialize an entire feature or service boundary.

### Decision Framework

Classify work as ordered or independent, waiting or CPU-bound, actor-owned or transferable,
then select suspension, child tasks, or explicit concurrent execution.

### Organizational Impact

Publish target isolation settings and profiling budgets. Review API execution contracts
when modules migrate because identical source can have different semantics by setting.

## References

- [The Swift Programming Language: Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
- [SE-0296: Async/await](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0296-async-await.md)
- [SE-0461: Run nonisolated async functions on the caller's actor by default](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0461-async-function-isolation.md)
- [SE-0466: Control default actor isolation inference](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0466-control-default-actor-isolation.md)
- [WWDC25: Embracing Swift concurrency](https://developer.apple.com/videos/play/wwdc2025/268/)
