---
title: "Async Sequences, Streams, and Continuations: Theory"
domain: "Swift"
topic: "Concurrency"
concept: "Async Sequences, Streams, and Continuations"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Async Sequences, Streams, and Continuations: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> `AsyncSequence` lets a consumer await each element; it does not by itself guarantee cancellation, bounded buffering, producer cleanup, or broadcast delivery.

- `for await` may suspend for each element; throwing sequences use `for try await`.
- On consumer cancellation, iterator code must observe cancellation and producers must stop through an explicit termination path.
- `AsyncStream` is a single iteration stream abstraction; multiple consumers are not an implicit broadcast contract.
- Buffer policy is part of API semantics. Inspect `yield` results and account for dropped elements.
- Checked continuations bridge one-shot callbacks and must resume exactly once on every path.

## Mental Model

An async sequence is a pull-shaped consumer interface over possibly push-shaped work.
The adapter owns impedance mismatch: rate, buffering, completion, cancellation, error,
and producer lifetime. A continuation temporarily represents a suspended task, not a
general event emitter.

## How It Works

`AsyncSequence.makeAsyncIterator()` creates iterator state; each `next()` can suspend,
return an element, finish with `nil`, or throw. Custom iterators should check cancellation
and release resources when iteration stops.

`AsyncStream` and `AsyncThrowingStream` adapt multi-value callbacks or delegates. Choose
newer factory/construction APIs supported by the deployment toolchain when they make
continuation ownership explicit. Configure a bounded buffering policy and inspect
`yield` to detect termination or dropped values.

```swift
let (stream, continuation) = AsyncStream<Event>.makeStream(
    bufferingPolicy: .bufferingNewest(32)
)

continuation.onTermination = { @Sendable _ in
    source.stop()
}

source.onEvent = { event in
    switch continuation.yield(event) {
    case .enqueued: break
    case .dropped: metrics.incrementDroppedEvents()
    case .terminated: source.stop()
    @unknown default: source.stop()
    }
}
```

The specific bridge must synchronize callbacks if the source invokes them concurrently.
`onTermination` may race production; cleanup must be idempotent. One stream value should
normally have one consuming iteration. Implement multicast with an explicit actor-owned
subscriber registry and a buffer/policy per subscriber.

Use `withCheckedContinuation` or `withCheckedThrowingContinuation` for exactly one
result. Resume on success, failure, cancellation, and every early-exit path exactly once.
When bridging cancellable callbacks, coordinate continuation and operation handle so
cancel-before-registration and callback-after-cancel cannot double resume.

### Core Invariants

- A checked continuation is resumed exactly once.
- Producer shutdown is idempotent and reachable from consumer termination.
- Buffer size and overflow behavior are explicit and observable.
- A single-consumer stream is not accidentally exposed as broadcast.
- Cancellation and normal end-of-stream remain distinguishable where policy requires it.

### Constraints and Guarantees

- Async-sequence protocols define iteration shape, not producer cancellation semantics.
- `AsyncStream` buffering is not backpressure unless the producer responds to yield outcomes.
- Checked continuations diagnose misuse but do not automatically bridge cancellation or lifetime.

## Failure Modes

- Consumer exits while delegate or socket production continues.
- Unbounded buffering causes memory growth under a slow consumer.
- Dropped elements violate a lossless business contract without telemetry.
- Multiple consumers divide or race elements while callers expected broadcast.
- A callback resumes twice or never resumes, trapping or hanging the task.

## Engineering Judgment

### When to Use It

Use async sequences for values over time and streams to adapt callback/delegate producers.
Use checked continuations for one-shot callbacks when no native async API exists.

### When Not to Use It

Do not wrap a single result in a stream, use a continuation for multiple events, or
choose a lossy buffer for an audit/logging contract.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| Direct `AsyncSequence` | Composable pull interface | Custom iterator lifecycle | Native source |
| Bounded `AsyncStream` | Simple callback bridge | Overflow policy required | UI/event feed |
| Checked continuation | Misuse diagnostics | One-shot only | Legacy completion API |
| Explicit broadcaster | Per-subscriber policy | More ownership and memory | True multicast |

### Alternatives

Return a single async value, expose an actor method for state snapshots, or use a domain
event system when persistence, replay, or cross-process delivery is required.

## Production Considerations

### Performance

Measure buffer occupancy, dropped/coalesced elements, producer-to-consumer latency, and
subscriber count. Buffering newest reduces staleness but discards history.

### Concurrency and Thread Safety

Legacy callbacks can arrive concurrently or after termination. Isolate mutable bridge
state and ensure callbacks capture only safe values.

### Testing

Drive a fake producer synchronously, await exact elements, finish or cancel iteration,
and assert source cleanup. Test buffer overflow and continuation terminal races.

### Observability and Debugging

Expose yields by result, buffer high-water mark, termination reason, producer lifetime,
and continuation age for diagnosing never-resumed operations.

### Compatibility and Migration

Deployment availability governs newer stream factories. Keep the adapter at the legacy
boundary and avoid exposing continuation types in domain APIs.

## Staff and Principal Perspective

### System Impact

Backpressure and broadcast semantics are system contracts. A default buffer choice can
turn a local adapter into memory pressure or silent data loss across the product.

### Decision Framework

Classify cardinality, loss tolerance, producer control, consumer count, completion,
failure, cancellation, and replay needs before choosing the abstraction.

### Organizational Impact

Document stream ownership and overflow policy in public APIs. Standardize metrics for
drops and leaked producers so incidents are diagnosable across teams.

## Common Mistakes

### Claiming async sequences naturally handle cancellation

**Why it is wrong:** Consumer cancellation is only a signal; iterator, adapter, producer,
cleanup, and buffering behavior must implement the policy.

**Better approach:** Define cancellation checks, `onTermination`, idempotent producer stop, and buffer overflow handling.

## References

- [The Swift Programming Language: Asynchronous sequences](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Asynchronous-Sequences)
- [SE-0298: Async/await sequences](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0298-asyncsequence.md)
- [SE-0314: AsyncStream and AsyncThrowingStream](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0314-async-stream.md)
- [AsyncStream](https://developer.apple.com/documentation/swift/asyncstream)
- [CheckedContinuation](https://developer.apple.com/documentation/swift/checkedcontinuation)
