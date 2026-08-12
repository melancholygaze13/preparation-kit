---
title: "Async Sequences, Streams, and Continuations: Theory"
domain: "Swift"
topic: "Concurrency"
concept: "Async Sequences, Streams, and Continuations"
page_type: theory
interview_priority: high
estimated_read_minutes: 5
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-08-12
---

# Async Sequences, Streams, and Continuations: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An async sequence lets a consumer ask for each value, even when an external source
pushes values whenever they arrive. The adapter must handle different production
and consumption speeds. It also owns buffering, completion, cancellation, errors,
and the producer's lifetime. A continuation represents one suspended task. It is
not a tool for sending many events.

## How It Works

`AsyncSequence.makeAsyncIterator()` creates iterator state; each `next()` can suspend,
return an element, finish with `nil`, or throw. Custom iterators should check cancellation
and release resources when iteration stops.

`AsyncStream` and `AsyncThrowingStream` adapt multi-value callbacks or delegates. Choose
newer factory/construction APIs supported by the deployment toolchain when they make
continuation ownership explicit. Configure a bounded buffering policy and inspect
`yield` to detect termination or dropped values.

```swift
let (stream, continuation) = AsyncStream<Int>.makeStream(
    bufferingPolicy: .bufferingNewest(2)
)

continuation.onTermination = { @Sendable reason in
    print("Stream ended: \(reason)")
}

for value in 1...3 {
    switch continuation.yield(value) {
    case .enqueued:
        break
    case .dropped(let dropped):
        print("Dropped \(dropped)")
    case .terminated:
        break
    @unknown default:
        break
    }
}

continuation.finish()

for await value in stream {
    print(value) // The bounded buffer keeps 2 and 3.
}
```

The specific bridge must synchronize callbacks if the source invokes them concurrently.
`onTermination` may run at the same time as the producer; cleanup must be safe to
repeat. One stream value should
normally have one consuming iteration. To send the same events to several consumers,
use an actor-owned subscriber list with a separate buffer and policy for each consumer.

Use `withCheckedContinuation` or `withCheckedThrowingContinuation` for exactly one
result. Resume on success, failure, cancellation, and every early-exit path exactly once.
When bridging cancellable callbacks, coordinate continuation and operation handle so
cancel-before-registration and callback-after-cancel cannot double resume.

### Rules That Must Stay True

- A checked continuation is resumed exactly once.
- Producer shutdown is safe to repeat and can be reached when the consumer stops.
- Buffer size and overflow behavior are explicit and observable.
- A single-consumer stream is not accidentally exposed as broadcast.
- Cancellation and normal end-of-stream remain distinguishable where policy requires it.

### Constraints and Guarantees

- Async-sequence protocols define how iteration looks, not how producer cancellation behaves.
- `AsyncStream` buffering does not slow the producer when the consumer falls behind.
  That requires the producer to respond to `yield` results.
- Checked continuations diagnose misuse but do not automatically bridge cancellation or lifetime.

## Engineering Judgment

### When to Use It

Use async sequences for values over time and streams to adapt callback/delegate producers.
Use checked continuations for one-shot callbacks when no native async API exists.

### When Not to Use It

Do not wrap a single result in a stream or use a continuation for multiple events.
Do not choose a buffer that drops data when audit or logging rules require every event.

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

## Production Application

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

Count each `yield` result, record the highest buffer use, termination reason, producer lifetime,
and continuation age for diagnosing never-resumed operations.

### Compatibility and Migration

Deployment availability governs newer stream factories. Keep the adapter at the legacy
boundary and avoid exposing continuation types in domain APIs.

## Staff and Principal Perspective

### System Impact

The rules for slowing producers and sending events to several consumers affect the
whole system. A default buffer can turn a local adapter into memory pressure or
silent data loss across the product.

### Decision Framework

Define how many values can arrive, whether loss is acceptable, whether the producer
can slow down, and how many consumers exist. Then define completion,
failure, cancellation, and replay needs before choosing the abstraction.

### Organizational Impact

Document stream ownership and overflow policy in public APIs. Standardize metrics for
drops and leaked producers so incidents are diagnosable across teams.

## References

- [The Swift Programming Language: Asynchronous sequences](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Asynchronous-Sequences)
- [SE-0298: Async/await sequences](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0298-asyncsequence.md)
- [SE-0314: AsyncStream and AsyncThrowingStream](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0314-async-stream.md)
- [AsyncStream](https://developer.apple.com/documentation/swift/asyncstream)
- [CheckedContinuation](https://developer.apple.com/documentation/swift/checkedcontinuation)
