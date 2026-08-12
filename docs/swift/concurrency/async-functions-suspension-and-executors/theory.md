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
last_reviewed: 2026-08-12
---

# Async Functions, Suspension, and Executors: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A task runs one synchronous section at a time, separated by possible suspension
points. An executor decides when those sections run. An actor adds protected state
and uses an executor for its work. Reason about the task's lifetime and actor
isolation, not a specific thread. Suspension lets a thread do other work while a
task waits. Parallel execution helps CPU work only when the operations are independent
and the system has enough capacity.

## How It Works

An `async` function can be called from another asynchronous context, an asynchronous
`@main` entry point, or a task. `await` lets the current task suspend until the callee
produces a result. A call can complete synchronously, so `await` is a permission to
suspend rather than a scheduling guarantee.

```swift
struct Account: Sendable {
    let id: Int
}

struct Activity: Sendable {
    let message: String
}

struct Dashboard: Sendable {
    let account: Account
    let activity: Activity
}

func loadAccount() async throws -> Account {
    Account(id: 42)
}

func loadActivity(for accountID: Int) async throws -> Activity {
    Activity(message: "Activity for account \(accountID)")
}

func loadDashboard() async throws -> Dashboard {
    let account = try await loadAccount()
    let activity = try await loadActivity(for: account.id)
    return Dashboard(account: account, activity: activity)
}

let dashboard = try await loadDashboard()
print(dashboard.activity.message)
```

The second call depends on the first and is correctly sequential. Independent work
belongs in `async let` or a task group. Suspending I/O does not block an actor; decoding
a large response synchronously does.

Swift 6.2 can enable caller-actor execution and default main-actor isolation per module.
Under those settings, a plain async helper called from `@MainActor` runs its own
synchronous segments on that actor. A called API may use another executor while the
helper is suspended, but the helper resumes on the caller's actor. Use `@concurrent`
when the helper itself must leave that actor for CPU-heavy, sendable work. Do not use
it merely because a function performs I/O.

### Rules That Must Stay True

- Actor-isolated state is accessed only through that actor.
- No semaphore or blocking wait is used to obtain an async result.
- Independent work becomes concurrent only when requested, with a limit on how much runs at once.
- Long CPU work does not run on an executor that must stay responsive, such as the main actor.
- Module isolation settings are part of the API's execution behavior.

### Constraints and Guarantees

- Swift guarantees that possible suspension points are marked with `await`; it does not
  guarantee a suspension, thread hop, FIFO execution, or parallelism.
- Code between suspension points is synchronous within its current task. Other tasks
  can still execute concurrently, and actor state can change while this task suspends.
- `@concurrent` is current Swift 6.2 behavior and requires matching toolchain and mode;
  older targets follow their configured language and isolation rules.

## Engineering Judgment

### When to Use It

Use async functions for operations that wait and for asynchronous entry points.
Use `@concurrent` for substantial CPU work whose inputs and results can safely cross
isolation. Keep UI state transitions on `@MainActor`.

### When Not to Use It

Do not make trivial synchronous APIs async or treat async as meaning “background
thread.” Do not offload ordinary network waits. Do not introduce concurrency when
ordering is required.

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

Where code runs affects system capacity. One CPU-heavy helper that runs on a shared
actor can force an entire feature or service to wait behind it.

### Decision Framework

Classify work as ordered or independent, waiting or CPU-bound, and actor-owned or safe to transfer,
then select suspension, child tasks, or explicit concurrent execution.

### Organizational Impact

Publish target isolation settings and performance limits. Review where public APIs
run when modules migrate, because identical source can behave differently under
different settings.

## References

- [The Swift Programming Language: Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
- [SE-0296: Async/await](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0296-async-await.md)
- [SE-0461: Run nonisolated async functions on the caller's actor by default](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0461-async-function-isolation.md)
- [SE-0466: Control default actor isolation inference](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0466-control-default-actor-isolation.md)
- [WWDC25: Embracing Swift concurrency](https://developer.apple.com/videos/play/wwdc2025/268/)
