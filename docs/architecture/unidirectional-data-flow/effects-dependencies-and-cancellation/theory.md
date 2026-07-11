---
title: "Effects, Dependencies, and Cancellation: Theory"
domain: "Architecture"
topic: "Unidirectional Data Flow"
concept: "Effects, Dependencies, and Cancellation"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-07-11
tags:
  - unidirectional-data-flow
  - effects
  - cancellation
---

# Effects, Dependencies, and Cancellation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A reducer decides *what work is needed* without performing uncontrolled external
work itself. The store or effect runtime executes that description and feeds values,
failures, and lifecycle events back through actions.

This preserves one mutation path while allowing asynchronous behavior:

```text
Action -> Reducer -> Effect description -> Runtime -> Result action -> Reducer
```

## Identify Effects and Dependencies

An effect observes or changes something outside the reducer's current state and action.
Examples include HTTP, disk, databases, clocks, UUIDs, analytics, notifications, and
async streams. A dependency is the capability used to perform that work.

Prefer contracts shaped by the feature:

```swift
struct SearchClient: Sendable {
    var results: @Sendable (String) async throws -> [SearchResult]
}

struct SearchDependencies: Sendable {
    var searchClient: SearchClient
    var continuousClock: ContinuousClock
}
```

Tests replace the capability with deterministic behavior. Do not place the client
inside an action or look it up through a global singleton. Both hide what the reducer
requires.

Dependency values need intentional lifetimes. A client can wrap a session-scoped
repository or actor. Injection does not mean creating a new database or URL session
for every reducer call.

## Return Outcomes Through Actions

An effect converts external results into domain actions:

```swift
case let .searchTapped:
    state.results = .loading
    let query = state.query
    return .run { send in
        do {
            let rows = try await searchClient.results(query)
            try Task.checkCancellation()
            await send(.response(.success(rows)))
        } catch is CancellationError {
            // Expected control flow: no failure action.
        } catch {
            await send(.response(.failure(SearchFailure(error))))
        }
    }
```

The runtime decides how `.run` executes and how `send` enters serialized action
processing. Reducers must not assume completion order unless the runtime guarantees it.

Use domain failures rather than passing arbitrary infrastructure errors into state.
Keep enough detail for retry and support, while mapping technical messages to safe
user-facing presentation.

## Give Effects Identity and Policy

Cancellation needs a stable identity and scope. Search may use one ID per feature
instance and cancel in-flight work when the query changes. Row downloads may use an
ID derived from the row's domain identifier.

Define the intended concurrency policy:

| Policy | Suitable use |
|---|---|
| Latest wins | Typeahead search or rapidly changing selection |
| First wins | Prevent duplicate submission while one is active |
| Queue | Ordered writes that must all run |
| Merge | Independent loads whose results can coexist |
| Share | Several observers need one underlying operation |

Do not infer policy from whichever task happens to finish first.

Swift cancellation is cooperative. Canceling a task marks it canceled; the operation
must check or propagate cancellation. An underlying callback API may need a
cancellation handler. Even then, guard result acceptance with effect identity or a
request version because obsolete work may still emit.

## Own Long-Lived Streams

Notifications, location, sockets, and database observations can emit many actions.
The store must start them once at a defined lifecycle boundary and cancel them when
their consumer scope ends. Repeated appearance must not create duplicate subscriptions.

Control backpressure when producers are faster than reducers or UI. Options include
coalescing progress, buffering a bounded number, dropping obsolete values, or moving
high-frequency samples outside feature state. Document the loss policy.

## Separate Durable Operations

A feature effect normally ends with the feature. A payment, upload, offline mutation,
or background transfer may need to survive navigation or process termination. Put
that operation in a durable service or repository with a stable identifier. The store
sends a start command and observes status; it does not keep itself alive to own work.

Retries require product policy: which errors are transient, how backoff works, whether
operations are idempotent, and when the user must intervene. A generic `.retry(3)` can
duplicate unsafe external work.

## Engineering Decisions

Effect tests should assert emitted actions, cancellation, ordering, and dependency use.
Use controlled async fakes or clocks rather than real delays. Integration tests verify
the runtime's serialization and real adapter behavior.

At Staff scope, standardize cancellation IDs, logging correlation, dependency scopes,
and durable operation ownership. Instrument effect age, duplicate subscriptions,
cancellation response, rejected stale results, and retry outcomes. Do not log sensitive
action payloads by default.

## References

- [Redux Fundamentals: Async Logic and Data Fetching](https://redux.js.org/tutorials/fundamentals/part-6-async-logic)
- [Concurrency — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
- [Task — Apple Developer Documentation](https://developer.apple.com/documentation/swift/task)
