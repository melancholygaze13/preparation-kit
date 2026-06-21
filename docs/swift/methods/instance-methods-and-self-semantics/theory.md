---
title: "Instance Methods and Self Semantics: Theory"
domain: "Swift"
topic: "Methods"
concept: "Instance Methods and Self Semantics"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
tags: [instance-methods, self, api-design, isolation]
---

# Instance Methods and Self Semantics: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> An instance method has implicit access to `self`; that is an ownership signal, not
> merely shorter syntax.

- Put behavior on a type when it operates on that receiver's state or preserves its invariants.
- Use `self` to resolve ambiguity or communicate capture/receiver intent; do not add it mechanically.
- A nonmutating struct or enum method cannot change value state, while a class method
  can mutate variable properties of the referenced instance.
- Method calls can hide cost and effects, so use names and `async`/`throws` to expose them.
- Actor-isolated methods serialize access to actor state, but assumptions must be
  revalidated after every suspension point.

## Mental Model

The receiver is an implicit parameter. Ask whether the operation conceptually belongs
to that receiver and whether the receiver owns every dependency needed to perform it.

## How It Works

### Receiver Context

```swift
struct RetryPolicy {
    let maximumAttempts: Int

    func permits(attempt: Int) -> Bool {
        attempt < maximumAttempts
    }
}
```

Inside the method, property and method names are resolved through `self` when no local
name shadows them. Use explicit `self` when a parameter has the same name or when it
materially clarifies which instance is being captured or mutated.

### Behavior Placement

An instance method should use or protect receiver-owned state. A formatter that needs
locale, feature flags, networking, and persistence does not become cohesive merely by
being added to a model. Keep orchestration in a service and pass values across a narrow boundary.

Methods are often preferable to public setters because they can name intent:

```swift
final class Download {
    private(set) var isCancelled = false

    func cancel() {
        guard !isCancelled else { return }
        isCancelled = true
    }
}
```

The method defines idempotency and becomes the place for future invariant checks.

### Effects and Cost

`async`, `throws`, argument labels, and verbs communicate operational behavior. A
method named `loadProfile()` establishes different expectations from `profile()` or
a property. Avoid boolean control parameters that make calls unreadable; use distinct
methods or a policy type when behaviors have different consequences.

### Isolation and Suspension

```swift
actor Inventory {
    private var reservations: Set<UUID> = []

    func reserve(_ id: UUID) -> Bool {
        reservations.insert(id).inserted
    }
}
```

Actor methods run on the actor's executor when accessing isolated state. External
cross-actor calls require `await` even if the method itself has no suspension. If an
actor method does suspend, other work can interleave; state read before `await` may no
longer be current afterward. Plain `async` also does not inherently mean background execution.

### Core Invariants

- Receiver methods preserve the receiver's documented valid state.
- Dependencies and side effects are visible at the appropriate API boundary.
- Idempotency, failure, cancellation, and ordering are defined when relevant.
- Actor state is revalidated after suspension.
- Method placement follows ownership rather than convenience.

### Constraints and Guarantees

- Instance methods have access to the current instance through `self`.
- Value-type state changes require a `mutating` method.
- Reference-type methods can change variable instance properties without `mutating`.
- `async` permits suspension; it does not guarantee parallel or background execution.
- Isolation protects actor state access, not invariants assumed across an `await`.

## Failure Modes

- **God model:** Unrelated orchestration accumulates as methods on a data type.
- **Anemic public mutation:** Callers reconstruct invariants through property assignments.
- **Hidden effects:** A harmless-looking method performs I/O or broad global mutation.
- **Boolean mode explosion:** Call sites no longer reveal which operation occurs.
- **Actor reentrancy:** A method commits using state that changed while suspended.
- **Ambiguous receiver:** Shadowed names update the wrong value or obscure capture behavior.

## Engineering Judgment

| Operation | Better home |
|---|---|
| Reads/preserves one value's invariants | Instance method |
| Coordinates several independent owners | Service/use-case object |
| Pure operation with no natural receiver | Free function |
| Creates a value from type policy | Type method or initializer |
| Mutates actor-owned shared state | Actor-isolated instance method |
| Configures behavior through many flags | Policy type or separate methods |

## Production Considerations

### Performance and Observability

Method syntax says nothing about cost. Profile hot calls, allocations, actor hops, and
I/O. Instrument business operations at the ownership boundary with stable operation
IDs, duration, result, and cancellation rather than logging every small method.

### Concurrency and Testing

Document isolation and sendable boundary values. Test idempotency, failure, cancellation,
and state changes around suspension. Avoid timing-based actor tests; assert deterministic
snapshots and outcomes. Keep pure logic outside actors when it does not need shared state.

### Compatibility and Migration

Changing sync to async, nonthrowing to throwing, or nonisolated to actor-isolated is a
source-level API migration. Add a new boundary, migrate callers, propagate cancellation
and isolation deliberately, then deprecate the old method.

## Staff and Principal Perspective

Method surfaces reveal architectural ownership. Review large types for dependency and
mutation concentration, publish isolation and failure contracts, and keep cross-module
workflows in named owners. Standardize API vocabulary for commands, queries, loading,
cancellation, and idempotency so operational behavior remains discoverable.

## Common Mistakes

### Methods Automatically Improve Encapsulation

**Why it is wrong:** A method can still expose unrelated dependencies, global state,
or invalid transitions.

**Better approach:** Place behavior with its state owner and narrow the mutation surface.

### Async Means Background Work

**Why it is wrong:** `async` means the method can suspend; executor behavior depends on isolation.

**Better approach:** Model isolation explicitly and offload CPU work only when intended.

## References

- [The Swift Programming Language: Methods](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/methods/)
- [The Swift Programming Language: Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
- [SE-0461: Run Nonisolated Async Functions on the Caller's Actor by Default](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0461-async-function-isolation.md)
