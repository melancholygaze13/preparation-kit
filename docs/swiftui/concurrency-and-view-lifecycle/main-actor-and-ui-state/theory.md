---
title: "MainActor and UI State: Theory"
domain: "SwiftUI"
topic: "Concurrency and View Lifecycle"
concept: "MainActor and UI State"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-06-23
tags:
  - main-actor
  - actor-isolation
  - observable
---

# MainActor and UI State: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

`MainActor` is a global actor that serializes access to UI-facing mutable state.
Isolation is a compile-time ownership rule and runtime executor relationship. It is
not simply “dispatch this closure to the main thread,” and it does not make slow
synchronous code responsive.

Place the UI state machine on the main actor. Let dependencies perform suspension,
I/O, or explicitly concurrent CPU work, then return `Sendable` values for the model
to commit.

## How It Works

### Isolate the UI Model

In a target without main-actor default isolation, mark observable UI models:

```swift
@MainActor
@Observable
final class SearchModel {
    private(set) var results: [SearchResult] = []
    private(set) var phase: Phase = .idle

    func search(_ query: String) async {
        phase = .loading
        // await dependency and update state
    }
}
```

The annotation makes synchronous access to isolated members require main-actor
context. SwiftUI `View` conformance is main-actor isolated in modern Swift, so view
code can use such models naturally. Check project default-isolation settings before
adding redundant annotations or comparing behavior across targets.

Use `@State` when a view creates and owns an observable model. Pass it through
ordinary properties, `@Bindable` when bindings are needed, or the environment for a
genuinely hierarchy-wide dependency.

### Suspension Is Not Blocking

An actor-isolated async function stays logically isolated while executing actor
code, but an `await` can suspend it. During suspension, the actor can run other work.
Network I/O does not block the actor while suspended.

CPU-heavy synchronous parsing, image processing, compression, or large transforms
do block whichever executor runs them. In Swift 6.2, a plain nonisolated async call
generally remains on the caller's actor unless explicitly declared concurrent. Use
`@concurrent` on suitable nonisolated work when it must run on the concurrent pool:

```swift
nonisolated struct Decoder {
    @concurrent
    func decode(_ data: Data) async throws -> [Item] {
        try JSONDecoder().decode([Item].self, from: data)
    }
}
```

Do not offload ordinary async I/O. It already yields while waiting. Measure before
moving small transforms across an isolation boundary, because crossing requires
`Sendable` inputs and results and adds design complexity.

### Reentrancy across await

Actor serialization prevents simultaneous access, but another actor-isolated method
can run while the first call is suspended. Assumptions made before `await` may no
longer hold afterward:

```swift
@MainActor
func load(_ id: Item.ID) async {
    selectedID = id
    let item = try? await repository.item(id)

    guard selectedID == id else { return }
    selectedItem = item
}
```

This guard protects current intent. Without it, an older request can overwrite a
newer selection even though every mutation occurs on `MainActor`. This is a logical
race, not a memory data race.

Keep mutation before and after suspension small. Capture required input into local
constants, await the dependency, then revalidate state and commit once. Avoid
partially updating several properties across multiple awaits unless the intermediate
states are deliberate and renderable.

### Isolation Boundaries and Sendable

Values crossing between actors must be safe to transfer. Prefer immutable value
types that conform to `Sendable`. Do not apply `@unchecked Sendable` to silence a
diagnostic; it asserts a thread-safety guarantee the compiler cannot verify.

A repository with shared mutable state may be an actor. Not every service needs an
actor: a stateless value type or an immutable dependency is simpler. Actor choice
should follow mutable ownership, not the desire to make a type “background.”

Use `MainActor.run` when nonisolated async code has a small, explicit UI commit. It
is usually unnecessary inside an already main-actor-isolated model. Repeated hops
often indicate the whole UI state machine should be isolated instead.

### Errors and State Transitions

Model cancellation separately from failure. A canceled request commonly preserves
existing content and does not show an alert. A real error becomes a typed UI state
or error presentation owned by the main-actor model.

Prefer one commit that preserves invariants:

```swift
let response = try await client.search(query)
guard query == currentQuery else { return }
phase = response.isEmpty ? .empty : .loaded(response)
```

An enum phase can prevent combinations such as `isLoading == false`, `error != nil`,
and stale results being interpreted differently by separate views.

### Synchronous Callbacks and Legacy APIs

Some delegate and callback APIs do not express actor isolation in their signatures.
Do not assume a callback is main-actor isolated because documentation or current
behavior says it arrives on the main thread. Prefer an async wrapper whose boundary
can transfer a `Sendable` result, then await it from the isolated model.

When a callback has a documented main-actor guarantee that the compiler cannot see,
encode that boundary narrowly and assert it in debug builds. `MainActor.assumeIsolated`
is only valid when the runtime guarantee is real; using it to silence an uncertain
callback can trap or hide a race. Avoid scattering task hops across callback bodies.

Checked continuations bridge one-shot callback APIs. They must resume exactly once
on every path. Multi-value delegates fit an `AsyncStream` with termination cleanup.
The bridge owns callback mechanics; the UI model owns presentation state.

### Actor APIs and Invariants

Design actor-isolated methods around complete state transitions rather than exposing
public mutable properties. `beginLoading`, `commit`, and `fail` can validate a
request generation and preserve related fields together. This reduces the number of
call sites that must understand reentrancy.

An actor method is not an atomic transaction across `await`. If an invariant must
hold throughout, gather inputs before suspension or split the work into prepare and
commit phases. Never keep a “busy” Boolean and assume no other isolated call can run
while the method awaits.

## Constraints and Guarantees

- Main-actor isolation serializes access to isolated declarations.
- An actor can process other messages while an isolated function is suspended.
- `await` marks possible suspension; it does not promise a thread switch.
- Strict concurrency requires transferable values across isolation boundaries.
- Module default actor isolation changes which annotations are implicit.
- Main-actor execution does not protect responsiveness from heavy synchronous work.

## Engineering Decisions

| Concern | Decision |
|---|---|
| UI-facing mutable state | Main-actor-isolated model |
| Shared cache with mutable entries | Actor or proven synchronization |
| Stateless async network client | Often no actor required |
| CPU-heavy pure transform | Nonisolated `@concurrent` function after measurement |
| Commit from nonisolated code | Small `MainActor.run` block |
| State used after `await` | Revalidate before commit |

## Production Application

Enable strict concurrency consistently across modules. Differences in default actor
isolation can make identical code compile or behave differently at package
boundaries. Treat build settings as architecture, not local compiler noise.

Use Instruments for hangs and main-thread stalls. A correctly isolated model can
still freeze animation if it parses large data synchronously. Add task and request
identifiers to logs so actor-safe but stale commits remain diagnosable.

Compiler enforcement and runtime profiling cover different failures. Strict
concurrency catches illegal sharing; signposts, hangs, and responsiveness metrics
show whether legal work still monopolizes the main actor. Both belong in the rollout
criteria for a concurrency migration.

At Staff scope, define isolation for module APIs, transferable DTOs, and ownership
of shared mutable services. Migrate boundaries incrementally rather than spreading
`nonisolated`, `@preconcurrency`, or unchecked conformance to suppress diagnostics.

## References

- [`MainActor`](https://developer.apple.com/documentation/swift/mainactor)
- [Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
- [Approachable concurrency](https://developer.apple.com/videos/play/wwdc2025/268/)
- [Swift 6.2 released](https://www.swift.org/blog/swift-6.2-released/)
