---
title: "Test Doubles, Contracts, and Integration: Theory"
domain: "Architecture"
topic: "Architecture Testing and Testability"
concept: "Test Doubles, Contracts, and Integration"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-07-11
tags:
  - test-doubles
  - contract-tests
  - integration-tests
---

# Test Doubles, Contracts, and Integration: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A test double trades realism for control. It can make failures, timing, and observations
deterministic, but it cannot prove that the replaced implementation behaves the same
way. Use doubles for policy tests and real components for risks created by integration.

The production boundary should belong to the caller's needs. A feature may depend on a
small `ProfileLoading` port instead of mocking a large networking SDK. The concrete
adapter translates that port to URL loading. This keeps third-party details out of both
the feature and its tests.

## Choose the Smallest Useful Double

| Double | Purpose | Example |
|---|---|---|
| Dummy | Fills an unused parameter | A logger ignored by this scenario |
| Stub | Returns controlled values | Loader returns a chosen profile or error |
| Spy | Records meaningful interactions | Records whether analytics emitted an event |
| Fake | Provides a lightweight working implementation | In-memory key-value store |

Teams often use “mock” for all of these. The label matters less than the reason the
double exists. A double should expose only the control and observation the test needs.

Prefer a hand-written stub or fake for a narrow port. Large generated mocks can be
useful for broad legacy protocols, but they make it easy to verify every call and copy
production structure into the test. If setup requires many irrelevant methods, the
production boundary may be too large.

## Design Owned Contracts

Define a protocol near the consumer when the consumer needs substitution or dependency
inversion. Include behavior the consumer actually uses, including important failure and
cancellation rules. Do not copy every method from the concrete service.

```swift
protocol ProfileLoading: Sendable {
    func profile(for id: User.ID) async throws -> Profile
}

struct StubProfileLoader: ProfileLoading {
    let result: Result<Profile, any Error>

    func profile(for id: User.ID) async throws -> Profile {
        try result.get()
    }
}
```

This stub proves how the consumer reacts to a result. It does not prove URL construction,
decoding, authentication, retry behavior, or cancellation in the real adapter. Cover
those risks separately.

Avoid protocols created only to replace a stable value with one method. Directly pass
a closure, value, clock, or configuration when that is the clearer contract. Also avoid
adding production switches such as `if isTesting`; composition should select the
dependency outside the feature.

## Prevent Drift with Contracts

A contract test is a shared set of behavioral examples for implementations of the same
port. If both an in-memory store and a database adapter claim the same behavior, run the
same cases against both:

- a missing key returns `nil` rather than an invented default;
- writing then reading preserves the supported value;
- deletion makes the value unavailable;
- invalid data follows the documented error policy.

Contract tests are most useful for owned adapters with multiple implementations. They
reduce drift, but they do not make implementations identical. The database still needs
integration tests for schema constraints, migration, transactions, and persistence
across instances.

For an HTTP service, the client and server may validate the same versioned schema or
recorded examples in their own pipelines. A mobile test should not depend on a live
production service. Use a controlled test server or transport fixture for protocol
coverage, then monitor real compatibility after release.

## Know When Reality Matters

Use the real component when its behavior creates the risk:

| Risk | Suitable test |
|---|---|
| JSON key, date, or missing-field behavior | Real decoder with representative payload |
| Database query, constraint, or migration | Temporary real store with schema fixtures |
| HTTP request construction | Real adapter with controlled transport or local server |
| Dependency assembly | Composition test that resolves the production graph |
| Framework lifecycle | Focused host or UI integration test |

An integration test still needs isolation. Give each test its own database, files,
account, or namespace. Reset through supported APIs where possible. Shared mutable
fixtures create order dependence and hide ownership problems.

## Concurrency and Parallel Tests

Modern test runners may execute tests in parallel. Treat global registries, process-wide
singletons, fixed file paths, shared databases, and mutable static stubs as hazards.
Prefer per-test dependency graphs and unique resources.

Serialization can protect an unavoidable shared resource, but it reduces throughput
and can hide a production race. Use it as a deliberate boundary, not the default fix.
Swift Testing provides a serialized trait when a suite or parameterized cases truly
must run serially. It does not serialize a non-parameterized test against unrelated tests.

## Engineering Decisions

| Choice | Benefit | Cost or risk |
|---|---|---|
| Stub or spy | Fast control and precise failure | Can encode an inaccurate contract |
| Fake | Reusable and stateful | May become a second production implementation |
| Real local component | High fidelity | More setup and runtime |
| Live remote service | Maximum environmental realism | Slow, unavailable, mutable, and hard to reproduce |

At Staff scope, keep shared test support versioned and owned. Define which contracts
adapters must satisfy, provide safe fixture builders, and keep a small number of high-
value integration environments. A “test utilities” module without ownership often
becomes another coupling hub.

## References

- [Testing in Xcode](https://developer.apple.com/documentation/xcode/testing)
- [Running tests serially or in parallel](https://developer.apple.com/documentation/testing/parallelization)
- [Target — Swift Package Manager](https://docs.swift.org/swiftpm/documentation/packagedescription/target/)
