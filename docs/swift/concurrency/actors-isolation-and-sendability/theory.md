---
title: "Actors, Isolation, and Sendability: Theory"
domain: "Swift"
topic: "Concurrency"
concept: "Actors, Isolation, and Sendability"
page_type: theory
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
---

# Actors, Isolation, and Sendability: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> Actors protect isolated mutable state one synchronous segment at a time; after every `await`, assumptions may be stale.

- Cross-actor isolated access requires `await` and transferred values must be safe to send.
- `Sendable` describes safe concurrency-domain transfer, not atomic mutation.
- Prefer immutable value types, actors, or audited locking over `@unchecked Sendable`.
- `@MainActor` models main-actor ownership; default isolation is configured per module.
- `nonisolated` exposes members that do not require actor state; use it only when truthful.

## How It Works

```swift
actor Counter {
    private var value = 0
    func increment() { value += 1 }
    func snapshot() -> Int { value }
}
```

Actors are reentrant at suspension. A read-await-write sequence must revalidate before
commit, use a generation token, or model in-flight work. Avoid actors that own no state
and merely add hops.

### Core Invariants

- All shared mutation has one isolation owner.
- No mutable reference escapes the actor boundary.
- State is revalidated after suspension.
- Sendable conformances reflect actual value/locking semantics.
- Public isolation remains explicit across modules with different defaults.

## Failure Modes

- Force-unwrapping actor state after await.
- Marking mutable classes unchecked-sendable to silence diagnostics.
- Main-actor isolation used as a generic lock.
- Nonisolated member accesses mutable actor state indirectly.
- Multiple actors create cyclic calls and unclear transaction ownership.

## Engineering Judgment

Use actors for shared mutable state with asynchronous access; use immutable values for
messages and snapshots; use locks for audited synchronous low-level owners. Minimize
cross-actor chatter by moving whole operations to the state owner.

## Production Considerations

Test reentrancy, stale commits, cancellation, transfer boundaries, and shutdown. Measure
actor hop volume, queueing, contention, long synchronous segments, and invariant rejection.
Adopt strict concurrency target by target with boundary adapters and diagnostics budgets.

## Staff and Principal Perspective

Isolation topology is architecture. Define authoritative owners, actor boundaries,
message schemas, transaction scopes, default-isolation settings, migration stages, and
incident telemetry. Avoid distributing one invariant across several actors.

## References

- [The Swift Programming Language: Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
- [SE-0302: Sendable and @Sendable Closures](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0302-concurrent-value-and-concurrent-closures.md)
- [SE-0466: Default Actor Isolation](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0466-control-default-actor-isolation.md)
