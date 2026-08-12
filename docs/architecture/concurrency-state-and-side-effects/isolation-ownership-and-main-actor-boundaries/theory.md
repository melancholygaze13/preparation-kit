---
title: "Isolation Ownership and Main-Actor Boundaries: Theory"
domain: "Architecture"
topic: "Concurrency, State, and Side Effects"
concept: "Isolation Ownership and Main-Actor Boundaries"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
tags:
  - actor-isolation
  - main-actor
  - ownership
---

# Isolation Ownership and Main-Actor Boundaries: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Isolation assigns mutable state to a concurrency domain. Code in that domain can read
and change the state in sequence. Code outside must cross the boundary through an API
the compiler can check.

Start with ownership, not executors: which feature or service decides how this state
changes? Presentation state normally belongs to the main actor. A cache, connection
registry, or shared token coordinator may justify its own actor. Immutable value types
often need no actor at all.

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 588" title="Isolation Ownership and Main-Actor Boundaries" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the Isolation Ownership and Main-Actor Boundaries diagram</a></figcaption>
</figure>

The arrows carry values and explicit operations. They do not expose the service's
mutable storage to the UI.

## Choose the Smallest Sufficient Owner

Use local immutable values when possible. Use `@MainActor` when state drives UI or is
tightly coupled to UI lifecycle. Use a custom actor for shared mutable state that must
be accessed safely from several concurrency domains.

An actor is not automatically a better service layer. It adds asynchronous calls,
`Sendable` requirements at its boundary, reentrancy concerns, and testing cost. A
stateless client that sends requests and returns values usually does not need an actor.
Likewise, adding one actor per type can scatter a single rule across many queues of work.

Keep the mutation rule with the owner. For example, an authentication actor can own the
current credential and refresh deduplication. It should not return a mutable credential
box that callers can change independently.

## Main-Actor Boundary

`@MainActor` states that a declaration belongs to the main actor. It is stronger and
clearer than dispatching individual writes to the main queue. Annotate the UI-facing
type or operation so callers and the compiler see the boundary.

```swift
@MainActor
final class ProfileModel {
    private(set) var state: State = .idle
    private let repository: ProfileRepository

    init(repository: ProfileRepository) {
        self.repository = repository
    }

    func load() async {
        state = .loading

        do {
            let profile = try await repository.profile()
            state = .loaded(profile)
        } catch is CancellationError {
            // The owner ended this attempt; do not present it as a failure.
        } catch {
            state = .failed(error.localizedDescription)
        }
    }
}
```

Suspending for network I/O does not block the main actor. CPU-heavy parsing or image
processing is different: do not perform it synchronously on the main actor. In Swift
6.2, execution behavior can also depend on module settings such as default main-actor
isolation and caller-actor execution for nonisolated async functions. Treat those as
explicit target-level architecture decisions, not hidden assumptions.

The main actor is closely related to the main thread, but actor isolation is the useful
contract. Do not build correctness around checking thread identity after suspension.

## Actor Reentrancy

An actor processes only one isolated region at a time, but it is reentrant. At an
`await`, the current operation can suspend and another operation can change actor state.
Therefore, a check made before `await` may be stale afterward.

```swift
actor TokenVault {
    private var generation = 0
    private var token: Token?

    func replaceToken() async throws -> Token {
        let expectedGeneration = generation
        let refreshed = try await requestToken()

        guard generation == expectedGeneration else {
            throw VaultError.obsoleteRefresh
        }

        generation += 1
        token = refreshed
        return refreshed
    }
}
```

The exact policy varies. You might deduplicate refreshes with an in-flight task, reject
an obsolete result, or let the latest completed result win. The important rule is to
revalidate actor state after suspension before committing.

Avoid force-unwrapping actor state based on a pre-`await` check. Another operation may
have removed or replaced that state while the method was suspended.

## Boundary Design

Values crossing isolation domains should be `Sendable`. Immutable structs and enums make
ownership easier to see. Closures that cross the boundary may need `@Sendable`, and their
captures must also be safe to transfer.

Expose operations that preserve the owner's rules. `reserveInventory(_:)` is safer than
`getInventory()` followed by `setInventory(_:)`, because the check and mutation stay in
one isolated operation. Keep synchronous updates that must be observed together on the
same side of an `await`.

Do not use `@unchecked Sendable` to silence a diagnostic around ordinary mutable state.
It shifts proof from the compiler to the team. Reserve it for a type with a real,
reviewed synchronization strategy that the compiler cannot express.

## Engineering Decisions

| Choice | Fits | Main cost |
|---|---|---|
| Immutable value | Snapshot or message with no shared mutation | Copying or replacement strategy |
| `@MainActor` owner | UI state and UI framework access | CPU work must move elsewhere |
| Custom actor | Shared mutable service state | Async boundary, reentrancy, `Sendable` design |
| Lock-protected type | Small synchronous critical section or low-level interop | Manual correctness and blocking risk |

At Staff scope, define isolation in module APIs and code review rules. Decide target
settings deliberately, document which layer owns each shared state domain, and migrate
one boundary at a time. Measure main-actor stalls separately from data-race correctness;
a program can be race-free and still freeze the UI.

## References

- [The Swift Programming Language: Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
- [SE-0306: Actors](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0306-actors.md)
- [Swift 6.2 release: approachable concurrency](https://www.swift.org/blog/swift-6.2-released/)
- [Swift compiler: nonisolated async on the caller's actor](https://docs.swift.org/compiler/documentation/diagnostics/nonisolated-nonsending-by-default/)
