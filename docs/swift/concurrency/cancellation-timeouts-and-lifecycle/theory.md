---
title: "Cancellation, Timeouts, and Lifecycle: Theory"
domain: "Swift"
topic: "Concurrency"
concept: "Cancellation, Timeouts, and Lifecycle"
page_type: theory
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
---

# Cancellation, Timeouts, and Lifecycle: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> Cancellation marks a task; code and callees must cooperate before work actually stops.

- `Task.checkCancellation()` throws; `Task.isCancelled` supports nonthrowing policy.
- Parent cancellation propagates to structured children, not unrelated task handles.
- A cancellation handler promptly signals underlying work but does not terminate the task.
- Cleanup must leave invariants valid and preserve cancellation as a distinct outcome.
- Model timeouts as deadlines using `Clock`; cancel losing work and account for cleanup latency.

## Mental Model

Cancellation is a request flowing through an ownership tree. A timeout is one policy
that issues that request when a deadline wins. Neither is preemption: correctness depends
on cancellation checks, cancellable suspension points, and idempotent cleanup.

## How It Works

CPU-bound code must poll at useful safe points:

```swift
func transform(_ values: [Value]) async throws -> [Output] {
    var output: [Output] = []
    for (index, value) in values.enumerated() {
        if index.isMultiple(of: 256) { try Task.checkCancellation() }
        output.append(expensiveTransform(value))
    }
    return output
}
```

Use `withTaskCancellationHandler` to forward cancellation to a legacy operation. Its
`onCancel` closure can run concurrently with the operation, so shared handle state needs
safe synchronization and the operation must tolerate cancel-before-start races.

A timeout races the operation against clock sleep in a throwing task group. The first
successful result or timeout error determines policy, and remaining children are
cancelled. Because the group waits for children, a noncooperative operation can make
observed duration exceed the nominal timeout.

Prefer a deadline propagated from the request boundary over repeatedly creating full
duration timeouts at every layer. `ContinuousClock` suits elapsed time; inject a clock
or higher-level scheduler for deterministic tests.

### Core Invariants

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

## Failure Modes

- A broad `catch` retries cancellation and creates zombie work.
- CPU loops ignore cancellation and delay navigation or shutdown.
- A handler races initialization of the legacy cancellation token.
- The timeout child returns while the losing operation continues unowned.
- Cleanup awaits indefinitely or exposes partial state.

## Engineering Judgment

### When to Use It

Make user navigation, superseded requests, shutdown, and deadlines cancellation sources.
Check at costly boundaries and consistency points rather than every instruction.

### When Not to Use It

Do not use cancellation as a business rejection, retry signal, or replacement for
transaction rollback. Do not promise a hard deadline around noncooperative dependencies.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| Throwing check | Composes with error flow | Requires throwing API | Most cancellable work |
| Boolean check | Custom partial result | Easy to forget propagation | Nonthrowing policy |
| Cancellation handler | Prompt legacy cancellation | Race-safe handle storage needed | Callback bridge |
| Deadline race | Uniform timeout policy | Loser cleanup can extend duration | Cooperative operation |

### Alternatives

Use explicit stop messages for long-lived services and server-enforced deadlines when
the remote system owns the expensive resource.

## Production Considerations

### Performance

Choose polling frequency from cancellation latency requirements and per-iteration cost.
Measure work performed after cancellation, not only request latency.

### Concurrency and Thread Safety

Cancellation callbacks can overlap operation setup. Synchronize shared handles and make
cancel/start/complete transitions idempotent.

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

Cancellation is load shedding. If it stops only UI updates but not network and CPU work,
the system retains cost while hiding the result.

### Decision Framework

Define the owner, propagation path, safe polling points, cleanup contract, deadline clock,
and noncooperative dependency behavior.

### Organizational Impact

Standardize deadline propagation and cancellation metrics across modules. API owners must
document whether cancellation stops underlying work or merely ignores its result.

## Common Mistakes

### Assuming timeout means the operation stopped

**Why it is wrong:** The losing task must observe cancellation, and structured scope waits for it.

**Better approach:** Use cooperative dependencies, propagate deadlines, and measure cancellation drain time.

## References

- [The Swift Programming Language: Task cancellation](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Task-Cancellation)
- [Task cancellation handler](https://developer.apple.com/documentation/swift/task/withtaskcancellationhandler(operation:oncancel:isolation:))
- [Clock](https://developer.apple.com/documentation/swift/clock)
- [SE-0329: Clock, Instant, and Duration](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0329-clock-instant-duration.md)
