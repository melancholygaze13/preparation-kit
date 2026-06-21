---
title: "Sendability and Swift 6 Migration: Theory"
domain: "Swift"
topic: "Concurrency"
concept: "Sendability and Swift 6 Migration"
page_type: theory
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
---

# Sendability and Swift 6 Migration: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> `Sendable` means a value can cross isolation domains safely; it does not make operations atomic or synchronize shared mutation.

- Value types are sendable only when their stored graph is safe; nested non-sendable references matter.
- A sendable class must meet stricter immutability/isolation rules; `@unchecked Sendable` requires an audited synchronization proof.
- `@Sendable` closures restrict captured state because the closure can cross concurrency domains.
- Region-based isolation can prove safe transfer of a disconnected non-sendable graph; `sending` expresses ownership transfer at an API boundary.
- Swift 6 adoption is per target/module; language mode, strict checking, default isolation, and dependency annotations can differ.

## Mental Model

Isolation answers who may access state. Sendability answers what can cross between those
owners. Region-based isolation adds flow-sensitive proof that a non-sendable value is
disconnected and transferred rather than aliased. Migration is the work of making these
ownership facts explicit across every module boundary.

## How It Works

`Sendable` is a marker protocol with semantic requirements. Internal value types can
often infer conformance when every stored value is sendable. Public and resilient API
surfaces should state the intended contract explicitly. Actors and global-actor-isolated
types are safe to send because access remains isolated.

`@Sendable` function types require safe captures. A mutable local captured by concurrently
executing closures is not made safe by capturing syntax; restructure into immutable values,
an actor, or a synchronized owner.

`sending` parameters and results describe transfer: after a non-sendable value is sent,
the source isolation domain must not retain/use aliases that would race. Region-based
isolation lets the compiler reason about connected object graphs rather than rejecting
all non-sendable values categorically.

`@unchecked Sendable` moves the proof burden to the author. Acceptable cases are narrow:
a final reference type whose complete mutable state is consistently protected by a
documented lock/atomic/queue protocol, including callbacks and nested references.

Migration should start with warnings under complete strict checking, inventory global
state and boundary diagnostics, isolate authoritative state, adopt native async APIs,
then enable Swift 6 mode target by target. `@preconcurrency` is a temporary import/boundary
tool for dependencies that have not expressed concurrency contracts; it does not make
unsafe code safe.

### Core Invariants

- Every cross-isolation value is sendable or proven transferred without aliases.
- Closure captures remain valid under the closure's isolation and lifetime.
- Unchecked conformances have documented synchronization and stress/TSan coverage.
- Target build settings and imported module contracts are recorded during migration.
- Cancellation remains distinct while adapting GCD, delegates, Operation, and Combine.

### Constraints and Guarantees

- Compiler checking prevents many data races, not higher-level races such as stale writes.
- Region analysis is conservative and source-flow dependent; refactoring can change diagnostics.
- Different modules can use different Swift modes and default isolation settings in one product.

## Failure Modes

- Marking a mutable class unchecked only to silence a diagnostic.
- Assuming a struct is safe while it stores a mutable non-sendable reference.
- Capturing mutable state in a sendable callback without an isolation owner.
- Applying `@preconcurrency` broadly and losing useful diagnostics.
- Enabling Swift 6 everywhere at once without dependency and boundary sequencing.

## Engineering Judgment

### When to Use It

Use explicit sendability for public transfer types and `sending` when ownership transfer
is the real contract. Prefer values and actors before manual synchronization.

### When Not to Use It

Do not promise sendability for convenience, publish mutable reference graphs as messages,
or treat strict-concurrency warnings as compiler noise.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| Immutable sendable value | Simple transfer | Copy/schema evolution | Messages and snapshots |
| Actor-isolated reference | Mutable owner | Async access/hops | Shared domain state |
| `sending` transfer | Supports non-sendable ownership move | Caller loses safe reuse | One-owner handoff |
| Audited unchecked class | Preserves synchronous API | Highest proof burden | Locked legacy/low-level type |

### Alternatives

Redesign a boundary around identifiers or immutable DTOs, keep non-sendable objects within
one actor, or wrap legacy callbacks in an isolated adapter.

## Production Considerations

### Performance

Measure copy cost, actor hops, lock contention, and serialization. Do not choose unchecked
shared references solely to avoid hypothetical copying.

### Concurrency and Thread Safety

Use Thread Sanitizer to find runtime races in exercised paths, but do not treat a clean
run as a proof. Review every field and callback in unchecked conformances.

### Testing

Compile representative clients under Swift 6 complete checking. Stress synchronized
types, run TSan, and test actor/closure boundary behavior and cancellation.

### Observability and Debugging

Track dynamic isolation assertion failures, migration diagnostic counts by category,
and runtime race reports. Preserve trace context across legacy adapters.

### Compatibility and Migration

Sequence leaf libraries before app targets where practical. Record per-module
`SWIFT_VERSION`, strict-concurrency, upcoming features, and default actor isolation.
Use adapters around Objective-C, GCD, Operation, delegate, and Combine boundaries.

## Staff and Principal Perspective

### System Impact

Sendable API shapes become architecture: they determine which modules own mutable state
and how schemas evolve between independently migrated components.

### Decision Framework

For each diagnostic, identify the real owner, aliases, transfer direction, API contract,
and lowest-risk fix. Suppress only with an expiry and named proof owner.

### Organizational Impact

Set a diagnostics budget and target rollout order. Library owners publish isolation and
sendability contracts; platform teams provide shared adapters and track suppression debt.

## Common Mistakes

### Equating Sendable with thread-safe operations

**Why it is wrong:** Sendability permits transfer; it does not make compound access atomic.

**Better approach:** Assign mutation to an actor/lock owner and send immutable values or explicit ownership transfers.

## References

- [The Swift Programming Language: Sendable types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Sendable-Types)
- [SE-0302: Sendable and @Sendable closures](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0302-concurrent-value-and-concurrent-closures.md)
- [SE-0414: Region-based isolation](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0414-region-based-isolation.md)
- [SE-0430: `sending` parameter and result values](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0430-transferring-parameters-and-results.md)
- [Swift 6 Migration Guide: Data-race safety](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/dataracesafety/)
- [Swift 6 Migration Guide: Incremental adoption](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/incrementaladoption/)
