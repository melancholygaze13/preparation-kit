---
title: "Ports, Adapters, and Protocol Ownership: Theory"
domain: "Architecture"
topic: "Clean Architecture and Ports and Adapters"
concept: "Ports, Adapters, and Protocol Ownership"
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
  - ports-and-adapters
  - protocols
  - dependency-inversion
---

# Ports, Adapters, and Protocol Ownership: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Ports and Adapters separates application behavior from the mechanisms that drive it
and the mechanisms it calls. A **port** is a contract at the application boundary. An
**adapter** translates between that contract and a specific UI, database, HTTP API,
system framework, test, or vendor SDK.

The shape is not literally six-sided. The important distinction is inside versus
outside and the ability to attach more than one adapter where that has value.

## Distinguish Driving and Driven Ports

| Direction | Port example | Adapter example |
|---|---|---|
| Driving, into application | `SubmitOrder` operation | SwiftUI screen, widget, test, deep-link handler |
| Driven, out of application | `OrderSubmitting` capability | HTTP client adapter, in-memory fake |
| Driving, into application | `RefreshCatalog` operation | Pull-to-refresh UI, background refresh |
| Driven, out of application | `CatalogReading` capability | SwiftData, REST API, fixture adapter |

Driving adapters translate external input into application calls. Driven adapters
implement capabilities the application requests. Both keep their technology-specific
types outside the core.

## Let the Consumer Shape the Port

An output port should describe the smallest capability the use case needs:

```swift
protocol SessionReading: Sendable {
    func currentUser() async throws -> User?
}
```

A provider-owned protocol that exposes `fetch(path:headers:decoder:)` makes consumers
understand transport even if the concrete client is hidden. The application should
not be forced to accept a broad provider API.

Consumer ownership does not require duplicating identical protocols in every type.
Share a port when several consumers need the same stable capability and meaning. Split
it when callers need different policy or broad access creates accidental coupling.

## Put Translation in Adapters

An adapter owns more than method forwarding. It translates:

- request and response shapes;
- identifiers, dates, units, and missing values;
- infrastructure errors into application failures;
- callback or delegate APIs into `async` or streams;
- cancellation and actor or queue requirements;
- vendor lifecycle and configuration;
- observability and safe diagnostic context.

If all those details remain in the use case, the protocol has not created a clean
boundary. If the adapter starts deciding eligibility or pricing policy, product rules
have leaked outward.

## Choose the Right Swift Abstraction

A Swift port can be a protocol, a closure-based capability, a generic parameter, or
a concrete value with functions. Protocols suit several conforming types and module
contracts. Closure values are compact for small capabilities and easy test replacement.
Generics preserve static dispatch but can spread type parameters. Existentials simplify
storage but introduce type erasure and some runtime cost.

Choose from API clarity and ownership. Do not make every value type conform to a
protocol solely to mock it. A stable concrete formatter or pure function is already
easy to test.

Swift protocol conformances are global within a program. Avoid retroactive conformance
to make a vendor type appear as a domain port when a small wrapper adapter gives clearer
ownership and prevents conformance conflicts.

## Handle Multiple Adapters Honestly

Multiple implementations are valuable when they represent real runtime choices, such
as online and offline sources, production and test, or platform-specific delivery.
They must obey the same behavioral contract, not merely compile.

Use contract tests for shared expectations: identifier handling, error meaning,
cancellation, ordering, and idempotency. A fake that returns impossible results can
make inner tests pass while the production adapter violates assumptions.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Core can run without UI or database | More contracts and adapter wiring |
| Vendor change is contained | Translation may duplicate similar models |
| Tests use focused replacements | Weak fakes can hide integration failures |
| Ports reveal required capabilities | Protocol proliferation reduces readability |
| Multiple delivery mechanisms can share policy | A generic port can become a lowest-common-denominator API |

## Engineering Decisions

For each port, define owner, product meaning, error and cancellation behavior, ordering,
thread or actor requirements, and compatibility expectations. Test application policy
through the port and adapter behavior against the real external contract.

At Staff scope, keep shared ports small, assign API owners, and provide supported
adapters and contract suites. Version externally consumed ports deliberately. Avoid a
central `Services` package whose broad protocols couple all features to one platform
team.

## References

- [Hexagonal Architecture — original article](https://alistair.cockburn.us/hexagonal-architecture)
- [Protocols — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/)
- [Access Control — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
