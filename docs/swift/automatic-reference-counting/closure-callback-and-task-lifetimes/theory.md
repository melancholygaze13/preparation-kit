---
title: "Closure, Callback, and Task Lifetimes: Theory"
domain: "Swift"
topic: "Automatic Reference Counting"
concept: "Closure, Callback, and Task Lifetimes"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Closure, Callback, and Task Lifetimes: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> An escaping closure strongly captures referenced class instances by default; retention is correct or cyclic depending on who owns the closure and for how long.

- Owner → stored closure → captured owner is a strong cycle until an edge is released.
- A one-shot callback should release stored ownership when consumed; a multi-shot callback needs explicit cancellation/token ownership.
- `[weak self]` means work may disappear; `[unowned self]` means later access must be provably safe.
- Promoting weak `self` to strong keeps it alive for the promoted scope, including across suspension.
- A task retains its operation context until completion; cancellation is cooperative and does not itself release captures immediately.

## Mental Model

Model a callback as an owned resource with cardinality and termination: zero/one-shot, finite multi-shot,
or unbounded. Then assign an owner, a consumption/cancellation transition, and capture policy. “Add weak”
is not a lifecycle model.

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
the call, while clearing storage breaks possible cycles and handles reentrant registration deliberately.
Production code must synchronize or isolate these transitions if several executors can call them.

For long-lived observation, return a cancellation token owned by the subscriber and make cancellation
idempotent. For tasks, retain a handle when a lifecycle owner must cancel or await work, but ensure the
task observes cancellation and eventually exits.

### Core Invariants

- Callback cardinality and terminal states are explicit.
- Stored callbacks release on completion, cancellation, replacement, and owner shutdown.
- Required work has a strong operation owner independent of transient UI observers.
- Weak disappearance follows a documented fallback rather than an accidental silent return.
- Every task has bounded completion or cooperative cancellation that reaches a termination point.

### Constraints and Guarantees

- Closures are reference types and capture class references strongly unless a capture list says otherwise.
- A capture list snapshots the evaluated reference/value; it does not deep-copy an object.
- Cancellation sets task cancellation state; task code must check or reach cancellation-aware operations.
- A weak-to-strong promotion extends lifetime for the strong binding's scope.
- `@Sendable` checking and actor isolation govern data-race safety separately from ARC ownership.

## Failure Modes

- A stored callback captures its owner and is never cleared.
- Weak capture silently drops a required completion, leaving state inconsistent.
- `guard let self` before a long async loop retains the owner until the loop terminates.
- `deinit` is expected to cancel a task that itself keeps the owner alive.
- Cancellation is requested, but a loop never checks it and retains its graph indefinitely.
- Callback replacement races with invocation and causes duplicate, missing, or use-after-release behavior.

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
| Unowned capture | Nonoptional access | Trap on delayed delivery | Structurally bounded owner-held closure |
| Operation/task owner | Central cancellation and state | Additional lifecycle object | Long-running required work |

## Production Considerations

### Performance

Retained closures can keep large graphs and buffers alive. Capture focused values/dependencies and
measure live-set size and task counts; weak references are not a general memory optimization.

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

Replacing callbacks with async APIs changes cancellation, retention, and delivery semantics. Ship an
adapter, define the single owner of completion, prevent double delivery, and migrate clients in stages.

## Staff and Principal Perspective

Callback and task ownership is an architectural contract across UI, service, and platform layers.
Standardize cancellation-token patterns, terminal-state telemetry, and review requirements for
unbounded tasks and externally retained closures.

## Common Mistakes

### Using Weak Self as a Universal Fix

**Why it is wrong:** It may break a cycle, but it can also discard required work and leave the real callback/task owner undefined.

**Better approach:** Define cardinality, terminal release, operation ownership, and cancellation first; use weak only when disappearance is valid.

## References

- [The Swift Programming Language: Automatic Reference Counting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/)
- [The Swift Programming Language: Closures](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/closures/)
- [The Swift Programming Language: Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
