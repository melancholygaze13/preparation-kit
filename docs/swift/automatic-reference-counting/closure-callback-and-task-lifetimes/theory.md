---
title: "Closure, Callback, and Task Lifetimes: Theory"
domain: "Swift"
topic: "Automatic Reference Counting"
concept: "Closure, Callback, and Task Lifetimes"
page_type: theory
interview_priority: high
estimated_read_minutes: 4
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-07-12
---

# Closure, Callback, and Task Lifetimes: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Treat a callback as an owned resource. Define how many times it may run: zero or
once, a limited number of times, or without a fixed limit. Define who owns it,
what consumes or cancels it, and what it captures. Simply adding `weak` does not
define a lifecycle.

## How It Works

```swift
final class Request {
    private var completion: (() -> Void)?

    func onCompletion(_ action: @escaping () -> Void) {
        precondition(completion == nil)
        completion = action
    }

    func finish() {
        let action = completion
        completion = nil
        action?()
    }

    func cancel() {
        completion = nil
    }
}
```

The one-shot callback is removed before invocation. A local strong reference keeps it valid during
the call. Clearing storage breaks possible cycles. It also defines what happens if
the callback registers another callback while it runs. Production code must
synchronize or isolate these state changes if concurrent code can call them.

For long-lived observation, return a cancellation token owned by the subscriber and make repeated cancellation
safe. For tasks, retain a handle when a lifecycle owner must cancel or await work, but ensure the
task observes cancellation and eventually exits.

### Rules That Must Stay True

- The allowed number of callback invocations and every final state are explicit.
- Stored callbacks release on completion, cancellation, replacement, and owner shutdown.
- Required work has a strong operation owner independent of temporary UI observers.
- Weak disappearance follows a documented fallback rather than an accidental silent return.
- Every task has bounded completion or cooperative cancellation that reaches a termination point.

### Constraints and Guarantees

- Closures are reference types and capture class references strongly unless a capture list says otherwise.
- A capture list snapshots the evaluated reference/value; it does not deep-copy an object.
- Cancellation sets task cancellation state; task code must check or reach cancellation-aware operations.
- Unwrapping a weak reference into a strong local keeps the object alive for that local scope.
- `@Sendable` checking and actor isolation govern data-race safety separately from ARC ownership.

## Engineering Judgment

### When to Use It

Use strong capture when the operation must keep a dependency alive and no cycle persists past a
defined terminal state. Use weak for optional observers. Prefer explicit token/task ownership and
clearing over capture-list-only fixes.

### When Not to Use It

Do not bind long-running work to a view/controller lifetime when the work must survive navigation.
Do not use unowned in callbacks whose delivery time is controlled externally.

### Trade-offs

| Strategy | Benefit | Risk | Best fit |
|---|---|---|---|
| Strong capture + explicit release | Required work completes | Leak if terminal release fails | One-shot/finite operation |
| Weak capture | Observer does not extend owner lifetime | Silent loss of work | Optional UI observation |
| Unowned capture | Nonoptional access | Trap on delayed delivery | Owner-held closure that cannot outlive its owner |
| Operation/task owner | Central cancellation and state | Additional lifecycle object | Long-running required work |

## Production Application

### Performance

Retained closures can keep large graphs and buffers alive. Capture focused values/dependencies and
measure memory kept alive and task counts. Weak references are not a general memory optimization.

### Concurrency and Thread Safety

Isolate callback storage and state transitions. Handle cancellation, reentrancy, and actor hops.
A strong reference prevents deallocation but does not make callback ordering or mutation safe.

### Testing

Test completion, cancellation, replacement, owner disappearance, reentrancy, delayed delivery,
infinite/slow streams, and task cancellation cooperation. Assert both required delivery and release.

### Observability and Debugging

Track operation IDs, callback registration/consumption, task start/end/cancel, and terminal reason.
Correlate retained owners with active operations before classifying them as leaks.

### Compatibility and Migration

Replacing callbacks with async APIs changes cancellation, retention, and delivery behavior. Ship an
adapter, define the single owner of completion, prevent double delivery, and migrate clients in stages.

## Staff and Principal Perspective

Callback and task ownership is an architecture-wide rule across UI, service, and
platform layers. Standardize cancellation-token patterns, metrics for completion
states, and review requirements for tasks without a fixed end and closures retained
by external code.

## References

- [The Swift Programming Language: Automatic Reference Counting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/)
- [The Swift Programming Language: Closures](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/closures/)
- [The Swift Programming Language: Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
