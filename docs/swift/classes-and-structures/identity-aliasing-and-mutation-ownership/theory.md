---
title: "Identity, Aliasing, and Mutation Ownership: Theory"
domain: "Swift"
topic: "Classes and Structures"
concept: "Identity, Aliasing, and Mutation Ownership"
page_type: theory
interview_priority: core
estimated_read_minutes: 6
levels:
  - senior
  - staff
  - principal
status: reviewed
last_reviewed: 2026-06-22
tags:
  - identity
  - aliasing
  - mutation
  - concurrency
---

# Identity, Aliasing, and Mutation Ownership: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

For every mutable instance, draw one ownership boundary. References outside it are
either read-only views, messages, or controlled commands—not arbitrary mutation
handles. Identity is useful only when the domain needs to distinguish instances.

## How It Works

### Identity Versus Equality

```swift
final class Account: Equatable {
    let id: UUID
    var displayName: String

    init(id: UUID, displayName: String) {
        self.id = id
        self.displayName = displayName
    }

    static func == (lhs: Account, rhs: Account) -> Bool { lhs.id == rhs.id }
}

let a = Account(id: UUID(), displayName: "Primary")
let alias = a
let replica = Account(id: a.id, displayName: "Primary")

a === alias       // true: same instance
a === replica     // false: different instances
a == replica      // true: same domain identity policy
```

Identity operators apply to class instances. They answer a narrower question than
equality and should not replace a stable domain identifier in persistence, network
messages, analytics, or cross-process caches.

### Aliasing and `let`

```swift
final class Settings { var theme = "system" }

let settings = Settings()
let shared = settings
shared.theme = "dark"       // visible through settings
```

The constant is the reference, not the object's transitive state. Conversely, a
structure stored in `let` cannot have a variable property changed through that
binding because mutation would replace part of the value.

Aliasing is not intrinsically wrong. It is required for one connection, cache, or
session. The risk is allowing every holder to mutate without ordering rules,
invariant enforcement, or a defined lifecycle.

### Mutation Ownership

Centralize transitions behind a narrow interface:

```swift
actor DownloadRegistry {
    private var progressByID: [UUID: Double] = [:]

    func record(progress: Double, for id: UUID) {
        progressByID[id] = min(max(progress, 0), 1)
    }

    func snapshot() -> [UUID: Double] { progressByID }
}
```

The actor owns mutation ordering and returns a value snapshot. A lock-protected
final class can be correct when synchronous access or platform integration demands
it, but locking policy must remain encapsulated. Exposing mutable storage defeats
the owner regardless of primitive.

### Lifecycle Boundaries

Reference ownership also determines when resources remain alive and when cleanup
can occur. Avoid making deallocation timing the business protocol. Provide explicit
`close`, cancellation, or scoped ownership when correctness depends on release.
Detailed ARC and deinitialization mechanics belong to their dedicated topic.

### Identity in UI and Caches

Use stable domain IDs to track logical entities across reconstruction. Use object
identity only for process-local questions such as avoiding duplicate registration
of the same instance. Identity-based caches can retain objects unexpectedly and do
not survive serialization or relaunch.

### Core Invariants

- Domain equality and process-local instance identity remain distinct.
- One component owns each shared mutable state transition.
- Callers cannot bypass isolation through an escaped mutable reference.
- Lifecycle-sensitive resources have explicit cancellation or closure policy.
- Stable identifiers, not addresses or object identity, cross process boundaries.

### Constraints and Guarantees

- `===` and `!==` test class instance identity, not value equality.
- A `let` class binding fixes the reference, not the instance's mutable properties.
- ARC manages lifetime, not thread safety or business cleanup ordering.
- `Sendable` conformance does not make unsynchronized mutable reference state safe;
  classes require appropriate immutability or synchronization semantics.
- Actors serialize isolated access, but reentrancy across suspension still requires
  invariant revalidation.

## Engineering Judgment

### Ownership Choices

| Situation | Ownership model |
|---|---|
| Immutable transferable state | Sendable value snapshot |
| Asynchronous shared mutation | Actor owner |
| Synchronous shared mutation | Encapsulated lock-protected final class |
| Platform object with required identity | Reference wrapper with explicit boundary |
| Cross-process logical entity | Stable domain ID plus values/messages |
| Local duplicate-instance detection | `===` or process-local object identity |

### Trade-offs and Alternatives

An actor provides language-enforced isolation but introduces async boundaries and
reentrancy considerations. A lock-protected class supports synchronous callers but
depends on disciplined encapsulation and lock ordering. Immutable snapshots avoid
shared mutation but can be stale and need a publication strategy. Select based on
ordering, latency, platform constraints, and ownership—not syntax preference.

## Production Application

### Performance

Reference sharing can avoid copying but introduces allocation, ARC, indirection,
contention, and poorer locality. Actor hops and snapshot creation also cost work.
Profile end-to-end latency and contention; do not trade clear ownership for a
microbenchmark win.

### Concurrency and Thread Safety

Audit every alias crossing a task, callback, queue, or module boundary. Keep mutable
state actor-isolated or under one encapsulated synchronization policy. At actor
suspension points, capture assumptions and revalidate them before committing.

### Testing

Test equality and identity separately. Exercise concurrent commands through the
owner, cancellation, shutdown, reentrancy, and attempts to obtain mutable storage.
Use deterministic state snapshots for assertions and stress tools for race coverage.

### Observability and Debugging

Log stable entity IDs, owner transitions, task/operation IDs, cancellation, queue
depth, and contention. Object identifiers may correlate logs within one process but
must be labeled diagnostic and never treated as durable identity.

### Compatibility and Migration

To replace shared references with values, first define stable IDs and a source of
truth, publish snapshots, then remove mutation handles. To introduce a shared owner,
route writes through an adapter, detect direct mutations, migrate readers, and only
then make the old representation unavailable. Plan rollback for both representations.

## Staff and Principal Perspective

### System Impact

Ownership boundaries shape module APIs, task topology, cache coherence, persistence,
UI observation, and incident diagnosis. A shared mutable model without one owner is
an architectural dependency graph hidden inside references.

### Decision Framework

Identify domain ID, process-local identity needs, authoritative state, all writers,
ordering and consistency requirements, isolation mechanism, snapshot policy,
lifecycle protocol, observability, and migration path. Reject designs where these
responsibilities are distributed implicitly among aliases.

### Organizational Impact

Assign ownership of shared state and synchronization primitives to a component and
team. Publish mutation APIs and shutdown contracts. Use architecture checks and
code review to prevent raw mutable references from crossing declared boundaries.

## References

- [The Swift Programming Language: Classes and Structures](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/classesandstructures/)
- [The Swift Programming Language: Automatic Reference Counting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/)
- [SE-0302: Sendable and @Sendable Closures](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0302-concurrent-value-and-concurrent-closures.md)
