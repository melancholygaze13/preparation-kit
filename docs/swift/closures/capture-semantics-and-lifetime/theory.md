---
title: "Capture Semantics and Lifetime: Theory"
domain: "Swift"
topic: "Closures"
concept: "Capture Semantics and Lifetime"
page_type: theory
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - closures
  - captures
  - lifetime
  - sendable
---

# Capture Semantics and Lifetime: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> A closure captures the surrounding bindings it uses. Mutable captures can form
> shared persistent state; capture lists can snapshot values or choose strong,
> weak, and unowned ownership for references.

- Escaping closures extend the lifetime of their capture context beyond the
  creating scope.
- Assigning one closure value to another variable preserves reference to the same
  closure and captured mutable state.
- `[value]` captures the value produced when the closure is created; ordinary use
  of an outer variable can observe later mutation.
- Strongly capturing an owner that strongly stores the closure can create a cycle.
  Weak and unowned captures encode different lifetime guarantees.
- `@Sendable` closure checking restricts unsafe captures, but shared global or
  referenced state still needs actor isolation or synchronization.

## Mental Model

A closure value consists conceptually of executable code plus a capture context:

```text
closure = code + captured environment
```

The environment can contain immutable snapshots, shared mutable storage, or
references to objects. The arrow type does not reveal its size, ownership graph,
or concurrency behavior.

## How It Works

### Capturing Surrounding Bindings

```swift
func makeIncrementer(step: Int) -> () -> Int {
    var total = 0

    return {
        total += step
        return total
    }
}
```

The returned closure preserves `total` and `step` after `makeIncrementer` returns.
`total` remains mutable state shared by every reference to that closure. Swift may
optimize immutable captures, but code should rely on observable value and lifetime
semantics rather than a particular box or allocation representation.

### Closures Are Reference Types

Assigning a closure does not create an independent captured environment:

```swift
let first = makeIncrementer(step: 2)
let second = first

first()   // 2
second()  // 4, using the same captured total
```

This reference behavior does not give closures general equality or stable
identity. It means copies of the closure value invoke the same behavior context.
Create the closure factory again when independent state is required.

### Ordinary Capture versus Value Capture

Ordinary closure capture can observe a variable's later value:

```swift
var mode = Mode.preview
let currentMode = { mode }

mode = .live
currentMode() // .live
```

A capture list evaluates its capture initializer when the closure is created:

```swift
var mode = Mode.preview
let originalMode = { [mode] in mode }

mode = .live
originalMode() // .preview
```

Use a value capture when the closure needs a deliberate snapshot. For a class
reference, `[object]` snapshots the reference strongly, not a deep copy of the
object. Later object mutation remains visible.

Capture lists can name derived values:

```swift
let operation = { [requestID = request.id] in
    logger.record(requestID)
}
```

This reduces retention and documents exactly which snapshot the operation needs.

### Capturing self

An escaping closure that uses class instance state captures `self`. Explicit
`self` or a capture-list entry makes that ownership decision visible:

```swift
service.load { [self] result in
    apply(result)
}
```

This is a strong capture. It is correct when the operation must keep the owner
alive until completion and no ownership cycle exists. Avoid reflexively weakening
every capture: losing the owner can silently discard required work.

For a value-type `self`, capture preserves value semantics. An escaping closure
cannot capture mutable `self` from a mutating structure or enumeration method,
because that would allow shared mutation beyond the exclusive method access.

### Strong Reference Cycles

A common cycle occurs when an instance owns a closure property and that closure
strongly captures the instance:

```text
instance -> closure property -> captured instance
```

Neither reference count reaches zero. Break the cycle by changing ownership,
clearing the stored closure at a defined lifecycle point, capturing only needed
values, or using weak/unowned capture when its lifetime assumptions are valid.

One-shot callbacks should release their stored closure after invocation. Long-lived
registrations should return a token or cancellation owner. Capture lists are only
one part of a complete lifecycle design.

### weak and unowned Captures

`[weak self]` does not retain the instance and exposes `self` as optional because
it can become `nil` before invocation:

```swift
service.observe { [weak self] event in
    guard let self else { return }
    handle(event)
}
```

Use weak when the callback may validly outlive the owner and no work is required
after owner deallocation. Decide whether silent return, deregistration, or another
fallback is correct.

`[unowned self]` also avoids retaining but assumes the instance is alive whenever
the closure runs. Access after deallocation traps. Use it only when the ownership
graph proves the closure cannot outlive the referenced object. “It usually lives
longer” is not a proof.

### Capturing Less State

Capturing an entire controller, repository, or request can retain a large graph
and blur dependencies. Capture immutable IDs, values, or focused collaborators
when they are sufficient:

```swift
let userID = session.userID
queue.enqueue { [userID] in
    audit(userID)
}
```

Do not capture a value snapshot if correctness requires the latest state. Choose
between snapshot, weak owner, strong operation owner, or actor lookup based on the
domain's time semantics.

### Capture and inout Access

An escaping closure cannot capture an `inout` parameter because the exclusive
access is bounded to the function call. Allowing the closure to retain that access
would escape the writeback lifetime. Nonescaping closures can participate in
scoped access when the compiler can prove the lifetime.

Copy the required value explicitly or redesign ownership; do not use unsafe
pointers to bypass the rule unless implementing a separately justified unsafe
lifetime contract.

### Sendable Captures and Concurrency

An `@Sendable` closure can cross concurrency domains only with captures satisfying
sendability rules. Capturing and mutating a local variable from concurrently
executing work is rejected because the capture could race.

Move shared mutable state into an actor or synchronized owner:

```swift
actor Counter {
    private var value = 0

    func increment() {
        value += 1
    }
}
```

The closure can capture the actor reference and `await` its isolated operation.
`@Sendable` does not inspect or protect arbitrary global state reached indirectly.

### Core Invariants

- Every captured dependency remains valid for the closure's full lifetime.
- Snapshot captures intentionally represent creation-time values.
- Mutable captured state has one defined owner and synchronization policy.
- Strong, weak, and unowned choices match the proven lifetime graph.
- Stored closures have explicit release or cancellation behavior.
- Function copies do not imply independent captured state.

### Constraints and Guarantees

- Escaping can extend captured values and references beyond lexical scope.
- Capture lists evaluate captured expressions at closure creation.
- Capturing a reference value does not clone the referenced object.
- Weak references can become nil; unowned access after deallocation traps.
- Escaping closures cannot retain a mutable `inout` access or mutating value-type
  `self`.
- Sendable capture checking is not full global-state synchronization.

## Failure Modes

- **Strong cycle through closure property:** Owner and closure never deallocate.
- **Weak capture drops required work:** Callback silently returns after owner loss.
- **Unowned lifetime assumption fails:** Late invocation traps.
- **Value capture is stale:** Operation uses creation-time configuration when it
  needed current state.
- **Reference capture mistaken for snapshot:** Object mutations leak into delayed
  work.
- **Closure copy assumed independent:** Two call sites mutate the same capture.
- **Large graph retained:** Small queued work keeps screens, caches, or payloads
  alive.
- **Mutable capture crosses tasks:** Produces a race or strict-concurrency error.

## Engineering Judgment

### Capture Decision Table

| Need | Capture strategy |
|---|---|
| Creation-time immutable value | Capture-list value snapshot |
| Latest actor-owned state | Capture actor and await lookup |
| Operation must keep owner alive | Intentional strong capture |
| Callback may outlive optional owner | Weak capture with explicit nil policy |
| Lifetime proves reference always alive | Unowned capture, used sparingly |
| Independent mutable state | Create a separate closure context or named owner |

### Trade-offs

Strong capture simplifies required completion but can extend lifetime or cycle.
Weak capture breaks retention while introducing optional disappearance. Value
snapshots isolate time but can become stale. Actor ownership provides concurrency
safety at an asynchronous and reentrancy cost.

## Production Considerations

### Performance

Escaping capture contexts may allocate. Capturing large value graphs can copy or
retain storage; capturing references can retain entire object graphs. Measure
memory lifetime, queue depth, and capture allocation in optimized builds. Prefer
focused captures but do not duplicate large values without profiling.

### Concurrency and Thread Safety

Treat mutable captured variables as shared state once calls can overlap. Use
`@Sendable`, global-actor annotations, actors, or locks to encode ownership. A
weak reference is not a concurrency primitive: the object can deallocate or its
state can change between checks and later asynchronous work.

### Testing

Test capture-time versus invocation-time values, independent factory contexts,
copied closure references, owner deallocation, callback cancellation, and repeated
invocation. For weak and unowned designs, test the exact lifetime boundary.
Concurrency tests should exercise overlapping calls under strict checking.

### Observability and Debugging

Use memory graphs, deinitialization signals, registration counts, queued-operation
age, and cancellation metrics. Log stable operation IDs rather than closure
addresses. Inspect capture contexts in debugger only as implementation evidence,
not an ABI contract.

### Compatibility and Migration

Changing a callback from nonescaping to escaping expands lifetime and capture
requirements. Adding `@Sendable` can expose non-Sendable captures at callers.
Migrate ownership with adapters, cancellation, leak telemetry, and strict-
concurrency diagnostics rather than widespread unchecked annotations.

## Staff and Principal Perspective

### System Impact

Closure captures can turn local callbacks into hidden service ownership. Queues,
observers, caches, and UI controllers retain each other through edges that are not
visible in function types, affecting memory, cancellation, and incident diagnosis.

### Decision Framework

Review what is captured, whether it is snapshot or live state, who retains whom,
maximum escape duration, release trigger, nil or deallocation policy, concurrent
invocation, isolation, and operational visibility.

### Organizational Impact

Require observer and queue APIs to expose cancellation ownership. Include capture
graphs in reviews of long-lived closures. Treat strict-concurrency and leak
findings as architecture signals, and centralize patterns for one-shot callback
release instead of relying on `[weak self]` as a universal convention.

## Common Mistakes

### Adding weak self Mechanically

**Why it is wrong:** It changes the contract from “operation keeps owner alive” to
“work may disappear,” which can lose required effects.

**Better approach:** Model the lifetime graph and choose strong, weak, cancellation,
or a separate operation owner deliberately.

### Treating Capture Lists as Deep Copies

**Why it is wrong:** Capturing a class-valued binding snapshots the reference, not
the object graph.

**Better approach:** Capture a value snapshot or immutable domain model when deep
state isolation is required.

## References

- [The Swift Programming Language: Capturing Values](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/closures/#Capturing-Values)
- [The Swift Programming Language: Closures Are Reference Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/closures/#Closures-Are-Reference-Types)
- [The Swift Programming Language: Strong Reference Cycles for Closures](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Strong-Reference-Cycles-for-Closures)
- [SE-0035: Limiting `inout` Capture to `@noescape` Contexts](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0035-limit-inout-capture.md)
- [SE-0302: Sendable and @Sendable Closures](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0302-concurrent-value-and-concurrent-closures.md)
