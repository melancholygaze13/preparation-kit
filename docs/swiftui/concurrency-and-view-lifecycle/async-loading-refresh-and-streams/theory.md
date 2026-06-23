---
title: "Async Loading, Refresh, and Streams: Theory"
domain: "SwiftUI"
topic: "Concurrency and View Lifecycle"
concept: "Async Loading, Refresh, and Streams"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-06-23
tags:
  - loading-state
  - refreshable
  - async-sequence
---

# Async Loading, Refresh, and Streams: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Async UI has two separate concerns:

- A state machine describes what the user can see and do now.
- A task or stream supplies events that transition that state.

Do not reduce the state machine to `isLoading`. Initial load, refresh with existing
content, empty success, failure, and stale offline content have different rendering
and interaction policies.

## How It Works

### Model Explicit Phases

An enum prevents contradictory flags:

```swift
enum LoadPhase<Value> {
    case idle
    case loading
    case loaded(Value)
    case empty
    case failed(Error)
}
```

Real products often separate content from activity:

```swift
struct FeedState {
    var items: [Item] = []
    var isRefreshing = false
    var error: DisplayError?
    var lastUpdated: Date?
}
```

This lets refresh preserve readable content while showing smaller progress. Choose
the model based on legal states. Avoid storing raw errors if the view only needs a
safe message and retry action.

Initial loading can justify a full placeholder because no content exists. Refresh
usually keeps existing content to avoid flicker and loss of context. Empty means a
successful result with no items; it should not look like a network failure.

### Loading with `.task`

Attach screen-scoped initial work to a stable identity:

```swift
FeedView(state: model.state)
    .task {
        await model.loadIfNeeded()
    }
```

`loadIfNeeded` puts cache and freshness policy in the model or repository rather
than assuming `.task` runs once. For input-dependent data, use `.task(id:)` and
validate relevance before commit.

Expose an async model method that callers can await. A synchronous `load()` that
internally starts an unstructured task hides completion and errors from tests and
callers.

### Refresh

`refreshable` installs an asynchronous refresh action in the environment. Supported
containers expose platform-appropriate interaction, and the indicator remains for
the duration of the awaited action:

```swift
List(model.items) { item in
    ItemRow(item: item)
}
.refreshable {
    await model.refresh()
}
```

The model should coalesce or define overlap with an existing initial load. Repeated
refreshes might join one in-flight request, replace it, or be ignored. Do not let two
responses commit in an undefined order.

A custom control can read the environment `refresh` action and invoke it. This keeps
the action composable and lets the container decide whether refresh is available.

### Consuming Async Sequences

An `AsyncSequence` represents values that arrive over time. Consume a screen-scoped
sequence in `.task`:

```swift
.task(id: accountID) {
    do {
        for try await update in repository.updates(for: accountID) {
            try Task.checkCancellation()
            model.apply(update)
        }
    } catch is CancellationError {
        return
    } catch {
        model.showStreamFailure(error)
    }
}
```

Disappearance or ID change cancels the consumer. The producer must observe
termination and release delegates, sockets, notification observers, or other
resources. A sequence that never finishes is correct only while its owning service
is intentionally alive.

If several screens need the same evolving state, a repository or observable model
may own one connection and broadcast normalized state. Opening one network stream
per row or per recomputation is usually the wrong lifetime.

### Producing Async Streams

Use `AsyncStream.makeStream` or `AsyncThrowingStream.makeStream` to obtain the stream
and continuation without awkward capture. Yield each event, finish exactly once
when production ends, and set `onTermination` to stop underlying work.

Choose buffering deliberately:

| Policy | Appropriate semantics |
|---|---|
| Unbounded | Finite producer known not to outrun consumer |
| Buffer newest | Only recent sensor, progress, or status values matter |
| Buffer oldest | Earliest queued events must be processed; later overflow may drop |
| No custom stream | Use an existing async API or shared state when possible |

An unbounded buffer for a high-volume producer can grow memory without limit.
Dropping events is safe only when domain semantics allow it. Financial transactions
and commands need durable delivery, not an in-memory UI stream.

### Error and Retry Policy

Initial failure can replace the empty screen with retry. Refresh failure often keeps
content and shows a nonblocking message. A stream failure might reconnect with
bounded exponential backoff, switch to polling, or require user action.

Retry must respect cancellation and network conditions. Add jitter for many clients,
cap attempts or elapsed time, and reset backoff after a healthy period. Authentication
and authorization errors should not be retried as transient network failures.

Avoid retry loops in the view. A repository owns protocol details; the feature model
owns what the user sees and whether an explicit retry is available.

### Back Pressure and Work Per Event

`for await` processes one element at a time. If handling each event is slow, the
producer's buffering policy determines memory and loss. Coalesce rapid UI updates,
move expensive pure transformation off the UI actor when justified, and commit a
small state change on the main actor.

Do not start an unstructured task for every event without a limit. That loses
ordering, cancellation, and resource control. Use sequential handling when order
matters or a bounded task-group design when independent events can run concurrently.

### Cache, Offline, and Freshness

A feed can have useful cached content while its live connection is unavailable.
Represent freshness separately from presence. Show the last successful update and a
retry path when age affects a decision. Do not classify cached nonempty content as
fully loaded if the product requires a current value for a transaction.

Use a stale-while-revalidate policy when immediate cached content is valuable: load
the local snapshot, render it, then request newer data and merge it by stable
identity. The repository defines merge and conflict rules. The view should not
replace an entire list merely because events arrived incrementally.

Offline transitions can pause retries and preserve pending intent. When connectivity
returns, add jitter rather than reconnecting every client simultaneously. Reachability
is a scheduling hint, not proof that a request will succeed; actual operations still
handle errors.

### Stream Lifecycle Contracts

Document whether a sequence is cold or shared. A cold sequence may start new
production for each iterator; a shared feed may give every subscriber the same
normalized state. Consumers need to know whether late subscribers receive current
state, only future events, or a replay window.

For a custom continuation bridge, finish on normal completion and error, and stop
the producer when the consumer terminates. Avoid retaining the continuation and
producer in a cycle. If the protocol can produce before a consumer is ready, choose
buffering before starting the producer.

## Constraints and Guarantees

- `refreshable` awaits its async action and exposes it through the environment.
- `AsyncSequence` may suspend between elements and can finish or throw.
- Cancellation of a consumer does not clean up a custom producer unless its bridge
  handles termination correctly.
- Async stream buffering is part of correctness and memory behavior.
- View lifetime can restart consumption, so shared connection ownership must be explicit.
- UI state updates still require correct actor isolation and stale-result validation.

## Engineering Decisions

| Situation | Model |
|---|---|
| No content yet | Initial loading phase |
| Updating visible content | Preserve content plus refresh activity |
| Successful zero results | Explicit empty state |
| Screen-only event subscription | `.task` consuming sequence |
| Shared live connection | Repository or longer-lived observable model |
| High-rate replaceable values | Bounded newest-value buffer or coalescing |
| Durable business events | Persistent queue or authoritative store, not UI stream |

## Production Application

Track time to first useful content, refresh latency, cache age, empty success,
failure class, cancellation, reconnection, and buffer drops. Avoid metrics that
classify cancellation as network failure.

Test state transitions with injected repositories and controllable sequences. Cover
initial failure, refresh failure with content, empty success, cancellation, stream
finish, reconnect, and producer faster than consumer. Await signals instead of
sleeping.

Test buffer overflow using a deliberately slow consumer and assert the documented
drop policy. Test a canceled consumer releases its observer or connection. Memory
and connection-count assertions often catch lifecycle defects that final UI state
alone cannot reveal.

At Staff scope, standardize loading and freshness semantics across features without
forcing one visual component everywhere. Define connection ownership, offline
behavior, retry budgets, observability, and resource limits as platform contracts.

## References

- [`refreshable(action:)`](https://developer.apple.com/documentation/swiftui/view/refreshable%28action%3A%29)
- [`RefreshAction`](https://developer.apple.com/documentation/swiftui/refreshaction)
- [`AsyncSequence`](https://developer.apple.com/documentation/swift/asyncsequence)
- [`AsyncStream`](https://developer.apple.com/documentation/swift/asyncstream)
- [Meet AsyncSequence](https://developer.apple.com/videos/play/wwdc2021/10058/)
