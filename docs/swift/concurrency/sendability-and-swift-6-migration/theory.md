---
title: "Sendability and Swift 6 Migration: Theory"
domain: "Swift"
topic: "Concurrency"
concept: "Sendability and Swift 6 Migration"
page_type: theory
interview_priority: core
estimated_read_minutes: 5
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Sendability and Swift 6 Migration: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Isolation controls who may access state. Sendability controls which values may
move between tasks, actors, or other isolation boundaries. Region-based isolation
lets the compiler follow how a non-sendable value is used. The compiler can allow
a transfer when the original code keeps no other reference to that value. Swift 6
migration makes these ownership rules explicit at every module boundary.

## How It Works

`Sendable` is a marker protocol: it has no required methods, but conformance promises
that a value can safely cross an isolation boundary. Internal value types can
often infer conformance when every stored value is sendable. Public APIs designed
to remain compatible across library versions should state this promise explicitly. Actors and global-actor-isolated
types are safe to send because access remains isolated.

`@Sendable` function types require safe captures. A mutable local captured by concurrently
executing closures is not made safe by capturing syntax; restructure into immutable values,
an actor, or a synchronized owner.

`sending` parameters and results describe transfer: after a non-sendable value is sent,
the sending task or actor must not keep or use other references that could race. Region-based
isolation lets the compiler examine connected objects instead of rejecting every
non-sendable value in the same way.

`@unchecked Sendable` makes the author responsible for proving safety. Use it only
in narrow cases. For example, a final class may qualify when one documented lock,
atomic strategy, or serial queue protects all mutable state. The proof must include
callbacks and referenced objects, not only direct stored properties.

Migration should start by enabling warnings under complete strict checking. List global
state and errors at module boundaries. Isolate shared mutable state, adopt native async APIs,
then enable Swift 6 mode target by target. `@preconcurrency` is a temporary import/boundary
tool for dependencies that have not expressed concurrency contracts; it does not make
unsafe code safe.

### Rules That Must Stay True

- Every value crossing isolation is sendable or transferred without another usable reference.
- Closure captures remain valid under the closure's isolation and lifetime.
- Unchecked conformances have documented synchronization and stress/TSan coverage.
- Target build settings and imported module contracts are recorded during migration.
- Cancellation remains distinct while adapting GCD, delegates, Operation, and Combine.

### Constraints and Guarantees

- Compiler checking prevents many data races, not higher-level races such as stale writes.
- Region analysis is conservative and source-flow dependent; refactoring can change diagnostics.
- Different modules can use different Swift modes and default isolation settings in one product.

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

Redesign a boundary around identifiers or immutable data-transfer objects, keep non-sendable objects within
one actor, or wrap legacy callbacks in an isolated adapter.

## Production Application

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

Sendable API types shape the architecture. They determine which modules own mutable
state and how shared data formats evolve while components migrate at different times.

### Decision Framework

For each diagnostic, identify the real owner, aliases, transfer direction, API contract,
and lowest-risk fix. Suppress only with an expiry and named proof owner.

### Organizational Impact

Set a limit and timeline for unresolved diagnostics, then choose the target rollout
order. Library owners publish isolation and sendability rules. Platform teams provide
shared adapters and track every temporary suppression until it is removed.

## References

- [The Swift Programming Language: Sendable types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Sendable-Types)
- [SE-0302: Sendable and @Sendable closures](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0302-concurrent-value-and-concurrent-closures.md)
- [SE-0414: Region-based isolation](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0414-region-based-isolation.md)
- [SE-0430: `sending` parameter and result values](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0430-transferring-parameters-and-results.md)
- [Swift 6 Migration Guide: Data-race safety](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/dataracesafety/)
- [Swift 6 Migration Guide: Incremental adoption](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/incrementaladoption/)
