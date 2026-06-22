---
title: "Actors, Global Actors, and Reentrancy: Theory"
domain: "Swift"
topic: "Concurrency"
concept: "Actors, Global Actors, and Reentrancy"
page_type: theory
interview_priority: core
estimated_read_minutes: 5
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Actors, Global Actors, and Reentrancy: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An actor is an owner and serialization boundary, not a monitor lock around an entire
async method. Every suspension ends one isolated transaction; the resumed segment starts
later against potentially different state. Actor topology should mirror invariant ownership.

## How It Works

External access to actor-isolated mutable state requires actor execution. A synchronous
actor method runs without interleaving until it returns; an async method can be reentered
whenever it suspends.

```swift
actor Cache {
    private var values: [Key: Value] = [:]
    private var generation = 0

    func refresh(_ key: Key) async throws {
        let observedGeneration = generation
        let value = try await load(key)
        guard generation == observedGeneration else { return }
        values[key] = value
    }

    func invalidateAll() {
        generation += 1
        values.removeAll()
    }
}
```

An in-flight task table can deduplicate identical work, but define whether one caller's
cancellation cancels shared work or only stops that caller waiting.

Use `@MainActor` for UI and lifecycle state whose invariant belongs to the main actor.
Custom global actors coordinate a process-wide domain, so use them sparingly. An
`isolated` actor parameter lets a helper execute synchronously in the borrowed actor
context. `nonisolated` members cannot rely on isolated state and are useful for immutable
identity or protocol requirements that truthfully need no actor access.

Swift 6.2 supports global-actor-isolated conformances and `isolated deinit` on supported
toolchains. The former constrains use of the conformance to its actor; the latter lets
teardown access actor-isolated state but remains synchronous—async cleanup needs an
explicit lifecycle API.

### Core Invariants

- One authoritative isolation owner protects each mutable invariant.
- Actor state is revalidated after suspension before commit.
- Mutable references do not escape isolated storage unprotected.
- `nonisolated` and isolated conformance annotations describe real access requirements.
- Cross-actor workflows do not pretend to be one atomic transaction.

### Constraints and Guarantees

- Actors prevent concurrent isolated access; they do not prevent logical races across awaits.
- Actor scheduling is not specified as FIFO and actor execution is not bound to one thread.
- `@MainActor` ensures main-actor isolation; code can still run elsewhere during
  nonisolated or concurrent calls and while suspending in external APIs.

## Engineering Judgment

### When to Use It

Use an actor when shared mutable state has async clients and one owner can preserve its
invariants. Use global actors for a truly global execution domain such as UI state.

### When Not to Use It

Do not create actors that own no state, distribute one transaction across several actors,
or use `@MainActor` as a universal lock.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| Actor | Compiler-checked async isolation | Reentrancy and hop cost | Async shared state |
| Global actor | Uniform domain across types | Broad serialization/coupling | UI or global subsystem |
| Lock/Mutex | Small synchronous critical section | Manual proof, no suspension | Low-level sync owner |
| Immutable snapshot | No shared mutation | Copy/staleness | Cross-boundary reads |

### Alternatives

Prefer value semantics and task-local ownership where sharing is unnecessary. Use
audited synchronization for synchronous APIs that cannot become actor-isolated.

## Production Application

### Performance

Measure actor queue delay, hop count, long synchronous segments, deduplication ratio,
and rejected stale commits. Coarsening ownership simplifies invariants but can bottleneck.

### Concurrency and Thread Safety

Do not hold a lock across `await`. Values crossing actor boundaries must satisfy current
sendability and region-isolation rules.

### Testing

Gate the awaited dependency, mutate actor state while suspended, then release and assert
the stale result is rejected. Test duplicate requests and shared-work cancellation policy.

### Observability and Debugging

Log operation/generation IDs and isolation-boundary events. Use `assertIsolated()` in
debug-only diagnostics where it clarifies legacy callback assumptions.

### Compatibility and Migration

Actorizing an API adds async call sites and sendability requirements. Migrate ownership
boundaries, not individual properties, and account for module isolation settings.

## Staff and Principal Perspective

### System Impact

Actor boundaries define transaction and scalability boundaries. Several actors cannot
provide atomicity across remote effects; orchestration needs idempotency and compensation.

### Decision Framework

Identify authoritative state, invariant scope, suspension points, message shape, and hop
budget. Choose the fewest owners that preserve useful independent concurrency.

### Organizational Impact

Assign ownership of global actors and shared actor APIs. Publish isolation contracts and
migration sequencing so client teams do not add local workarounds.

## References

- [The Swift Programming Language: Actors](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Actors)
- [SE-0306: Actors](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0306-actors.md)
- [SE-0316: Global actors](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0316-global-actors.md)
- [SE-0470: Global-actor isolated conformances](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0470-isolated-conformances.md)
