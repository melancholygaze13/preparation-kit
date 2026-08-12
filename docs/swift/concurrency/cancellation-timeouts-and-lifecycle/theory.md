---
title: "Cancellation, Timeouts, and Lifecycle: Theory"
domain: "Swift"
topic: "Concurrency"
concept: "Cancellation, Timeouts, and Lifecycle"
page_type: theory
interview_priority: core
estimated_read_minutes: 4
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-08-12
---

# Cancellation, Timeouts, and Lifecycle: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Cancellation is a request that flows from a task to the child tasks it owns. A
timeout sends that request when a deadline passes. Cancellation does not forcibly
stop code. The code must check for cancellation, call APIs that respond to it, and
clean up safely even if cleanup runs more than once.

## How It Works

CPU-bound code must poll at useful safe points:

```swift
func square(_ values: [Int]) async throws -> [Int] {
    var output: [Int] = []
    for (index, value) in values.enumerated() {
        if index.isMultiple(of: 256) { try Task.checkCancellation() }
        output.append(value * value)
    }
    return output
}

let values = try await square([2, 3, 4])
print(values) // [4, 9, 16]
```

Use `withTaskCancellationHandler` to forward cancellation to a legacy operation. Its
`onCancel` closure can run concurrently with the operation. Access to a shared
operation handle therefore needs synchronization. The bridge must also handle
cancellation that arrives before the operation has fully started.

A timeout can start the operation and a clock sleep as child tasks in a throwing
task group. Whichever finishes first decides the result, and the other child is
cancelled. The group still waits for both children to finish. An operation that
ignores cancellation can therefore run past the requested timeout.

Prefer a deadline propagated from the request boundary over repeatedly creating full
duration timeouts at every layer. `ContinuousClock` suits elapsed time; inject a clock
or higher-level scheduler for deterministic tests.

### Rules That Must Stay True

- Cancellation is checked before expensive or irreversible work and within long loops.
- Cleanup restores consistency and is safe if invoked more than once.
- `CancellationError` is not translated into a retryable business failure.
- Each stored unstructured handle is cancelled by its owner.
- Deadlines do not expand as calls move downstream.

### Constraints and Guarantees

- `cancel()` sets cancellation state; it does not interrupt arbitrary code.
- Many standard suspending APIs react to cancellation, but an `await` alone does not
  guarantee the callee checks it.
- Cancellation handlers provide prompt notification, not exclusive access or automatic cleanup.

## Engineering Judgment

### When to Use It

Make user navigation, superseded requests, shutdown, and deadlines cancellation sources.
Check before costly work and before changes that must leave state consistent. Do
not check after every instruction.

### When Not to Use It

Do not use cancellation as a business rejection, retry signal, or replacement for
transaction rollback. Do not promise a hard deadline around noncooperative dependencies.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| Throwing check | Composes with error flow | Requires throwing API | Most cancellable work |
| Boolean check | Can return a custom partial result | Easy to forget to pass cancellation onward | Nonthrowing policy |
| Cancellation handler | Prompt legacy cancellation | Race-safe handle storage needed | Callback bridge |
| Deadline race | Uniform timeout policy | Loser cleanup can extend duration | Cooperative operation |

### Alternatives

Use explicit stop messages for long-lived services and server-enforced deadlines when
the remote system owns the expensive resource.

## Production Application

### Performance

Choose polling frequency from cancellation latency requirements and per-iteration cost.
Measure work performed after cancellation, not only request latency.

### Concurrency and Thread Safety

Cancellation callbacks can overlap operation setup. Synchronize shared handles.
Make cancel, start, and complete transitions safe to repeat.

### Testing

Block a dependency on a deterministic gate, cancel the owner, release the gate, then
assert the expected outcome and cleanup. Inject clocks; do not sleep to guess timing.

### Observability and Debugging

Track cancellation source, requested-to-observed latency, timeout budget, cleanup time,
and tasks still active after owner teardown.

### Compatibility and Migration

Map `NSProgress`, `Operation.cancel`, URL-session handles, and callback tokens at a
single boundary. Preserve cancellation rather than wrapping it as an opaque error.

## Staff and Principal Perspective

### System Impact

Cancellation should remove work the system no longer needs. If it stops only UI
updates but not network and CPU work, the system still pays the cost and discards the result.

### Decision Framework

Define the owner, propagation path, safe polling points, cleanup contract, deadline clock,
and noncooperative dependency behavior.

### Organizational Impact

Standardize deadline propagation and cancellation metrics across modules. API owners must
document whether cancellation stops underlying work or merely ignores its result.

## References

- [The Swift Programming Language: Task cancellation](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Task-Cancellation)
- [Task cancellation handler](https://developer.apple.com/documentation/swift/task/withtaskcancellationhandler(operation:oncancel:isolation:))
- [Clock](https://developer.apple.com/documentation/swift/clock)
- [SE-0329: Clock, Instant, and Duration](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0329-clock-instant-duration.md)
