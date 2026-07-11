---
title: "Repository Boundaries and Query Ownership: Theory"
domain: "Architecture"
topic: "Data Layer, Repositories, and Offline State"
concept: "Repository Boundaries and Query Ownership"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-07-11
tags:
  - repositories
  - query-design
  - data-boundaries
---

# Repository Boundaries and Query Ownership: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A repository gives application policy a stable way to obtain and change domain data.
It hides whether that data comes from HTTP, a database, memory, or a combination. Its
contract describes what the consumer means, not how one current store works.

```swift
protocol OrderRepository: Sendable {
    func recentOrders(limit: Int) async throws -> [OrderSummary]
    func order(id: Order.ID) async throws -> Order?
    func saveDraft(_ draft: OrderDraft) async throws -> Order
}
```

This boundary can change from REST plus files to GraphQL plus SwiftData without making
the feature speak either schema. A protocol is not automatically a good repository.
The value comes from a coherent contract, source policy, and ownership.

## Design from Consumer Needs

Avoid a universal interface such as `fetch<T>`, `save<T>`, and `delete<T>`. It leaks
storage concepts, gives weak guarantees, and moves query construction into every caller.
Prefer methods or query values that state useful behavior:

- which records qualify;
- stable sort order;
- page size and cursor meaning;
- whether deleted or pending records appear;
- accepted freshness or offline behavior;
- authorization and not-found behavior.

For a broad search surface, a typed query value can prevent method explosion. Keep the
query in domain language. A `CustomerSearch` may expose region, status, sort, and cursor;
it should not expose `NSPredicate`, SQL, or transport query strings outside the adapter.

The consumer should own why it needs data. The repository should own how to satisfy that
request. If two features need different projections, do not force both through one large
entity merely to reuse a method. Return the smallest stable domain shape that serves the
use case.

## Place Policy at the Right Boundary

| Decision | Typical owner |
|---|---|
| Which source is fresh enough | Repository or data policy |
| How remote and local results merge | Repository or sync component |
| Whether checkout can continue offline | Application or product policy |
| How transport errors become data errors | Adapter or repository boundary |
| What the UI shows for an empty result | Feature or presentation policy |

A repository can enforce data rules such as cache freshness, deduplication, transaction
scope, and optimistic version checks. It should not decide a product workflow merely
because the necessary data passes through it.

Separate commands when mutation has meaningful workflow. `approveLoan` may belong to an
application use case that validates permission, records audit context, and calls a narrow
gateway. Naming it `repository.update(loan)` hides those decisions.

## Choose Snapshot or Observation

A one-shot async query fits commands and explicit refresh. A stream fits local-first UI,
shared state, and external store changes. The contract must define:

- whether it emits an initial value;
- ordering and duplicate behavior;
- how failure and completion work;
- whether cancellation stops underlying observation;
- which actor or isolation boundary owns delivered values.

Do not return storage-managed objects across contexts or actors. Return immutable domain
values, projections, or stable identifiers and refetch inside the receiving context.
SwiftData provides model actors for isolated storage work, while its environment model
context is main-actor bound. Core Data has its own context and queue confinement rules.
The repository must respect the selected framework rather than inventing unsafe
`Sendable` conformances.

## Define Transaction and Error Guarantees

If a method writes several records, state whether the operation is atomic. A repository
cannot promise a local transaction and remote transaction are one atomic commit unless
the complete protocol supports it. More often it commits a local intent, then syncs it
with retry and reconciliation.

Expose errors that change caller decisions: unauthorized, unavailable, conflict,
validation failure, or storage corruption. Keep raw HTTP, database, and vendor errors
inside adapters, but preserve them for diagnostics. Do not flatten every failure to
“network error”; a local query can fail without any network request.

## Avoid Empty Abstraction

A repository that forwards every method of one service can add naming and mocking cost
without creating a useful boundary. Directly inject a small client when there is only
one source, one consumer, and no mapping or policy to hide. Add a repository when it
coordinates sources, protects domain models, stabilizes a module API, or owns reusable
query behavior.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Keeps storage and transport details out of features | Another API and mapping layer |
| Centralizes freshness and query behavior | Can become a large generic service |
| Supports test doubles at an owned boundary | Doubles can drift from real adapters |
| Allows source changes behind a stable contract | Poor contracts hide important guarantees |

At Staff scope, assign repository ownership by business capability rather than one
central “data team” API. Publish query and error guarantees, contract-test adapters, and
measure latency, cache hit rate, stale reads, and failure classes at the boundary.

## References

- [SwiftData `ModelContext`](https://developer.apple.com/documentation/swiftdata/modelcontext)
- [SwiftData concurrency support](https://developer.apple.com/documentation/swiftdata/concurrencysupport)
- [Core Data](https://developer.apple.com/documentation/coredata)
