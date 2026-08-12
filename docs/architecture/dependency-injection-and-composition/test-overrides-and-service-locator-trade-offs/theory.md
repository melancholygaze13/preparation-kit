---
title: "Test Overrides and Service-Locator Trade-offs: Theory"
domain: "Architecture"
topic: "Dependency Injection and Composition"
concept: "Test Overrides and Service-Locator Trade-offs"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
tags:
  - dependency-injection
  - test-doubles
  - service-locator
---

# Test Overrides and Service-Locator Trade-offs: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Dependency substitution is useful when a test must control an external capability.
The safest override belongs to the test's object graph and cannot leak into another
test. A service locator does the opposite by letting application code request a
dependency from shared runtime state.

Both patterns can replace concrete implementations. The architectural difference is
whether requirements remain visible at the consumer boundary.

## Choose Test Doubles by Purpose

| Double | Purpose |
|---|---|
| Stub | Returns controlled values or failures |
| Fake | Provides a lightweight working implementation, such as in-memory storage |
| Spy | Records selected interactions for an observable contract |
| Mock | Encodes expected interactions and fails on mismatch |

Prefer state and outcome assertions. Verify calls only when the interaction itself is
the contract, such as one idempotency key or no analytics event before consent. Tests
that mirror every internal call block safe refactoring.

Fakes must honor important production behavior: cancellation, ordering, uniqueness,
transactions, and error meaning. A synchronous fake can hide races in an async adapter.
Run contract tests against both fake and production implementations where drift would
be expensive.

## Keep Overrides Scoped

The direct approach constructs a graph per test:

```swift
let client = SearchClient { query in
    query == "swift" ? [.fixture] : []
}
let model = SearchViewModel(client: client)
```

For larger graphs, start from a typed test dependency set and override only relevant
capabilities. The dependency set remains a value owned by the test or task, not a
mutable process singleton.

Automatic restoration is essential if an API temporarily overrides shared state.
Use structured scope such as `withDependencies { ... } operation: { ... }`, and make
nested behavior explicit. Even then, parallel execution requires task-local or otherwise
isolated storage; a lock around one global dictionary prevents data races but still
allows logical test interference.

## Control Time and Async Ordering

Inject clocks, ID generators, and async clients. Avoid real sleep, random UUIDs, and
network requests in unit tests. A controlled fake should let the test decide which
request completes first, so cancellation and stale-result rules are exercised.

Do not add a protocol solely to replace a pure deterministic function. Use real value
types where they are cheap and stable. Reserve substitutes for boundaries that need
control or isolation.

## Understand Service Locator

A service locator offers `resolve(Service.self)` or global properties. It separates a
consumer from a concrete implementation, but the consumer still depends on the locator.
Required services are absent from its initializer, and missing registration fails at
runtime.

Risks include:

- hidden and expanding capability access;
- runtime type and scope errors;
- account, scene, and test state leaking through global registration;
- dependency cycles appearing only during resolution;
- difficult static analysis and module enforcement;
- concurrency hazards from mutable registrations.

A locator may be practical at framework-controlled entry points, legacy seams, plugin
systems, or dynamic optional capabilities. Confine lookup to an adapter or composition
root, then inject normal typed dependencies into application code.

## Treat SwiftUI Environment Carefully

SwiftUI environment distributes values through a view hierarchy. It is appropriate for
system context, design tokens, model objects intentionally shared through that hierarchy,
and dependencies that many descendants genuinely use.

It can behave like a scoped locator when views request arbitrary application services.
Missing observable environment objects can cause runtime failure, and required inputs
become less visible. Prefer explicit initializer input for a feature's essential
dependencies; use environment at composition and presentation boundaries where its
hierarchical semantics are the point.

## Engineering Decisions

Tests should prove outcomes, cancellation, error mapping, and concurrency policy. Root
smoke tests verify production registrations. Keep debug or preview override APIs from
shipping unsafe mutable controls into production paths.

At Staff scope, define double semantics, contract suites, parallel-test isolation, and
approved locator boundaries. Audit global registries and environment keys for scope
leaks. Tooling should fail missing production dependencies before a user reaches the
feature.

## References

- [Inversion of Control Containers and Dependency Injection](https://martinfowler.com/articles/injection.html)
- [Environment — SwiftUI](https://developer.apple.com/documentation/swiftui/environment)
- [Concurrency — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
