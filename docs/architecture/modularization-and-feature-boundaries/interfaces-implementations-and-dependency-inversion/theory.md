---
title: "Interfaces, Implementations, and Dependency Inversion: Theory"
domain: "Architecture"
topic: "Modularization and Feature Boundaries"
concept: "Interfaces, Implementations, and Dependency Inversion"
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
  - modularization
  - dependency-inversion
  - interfaces
---

# Interfaces, Implementations, and Dependency Inversion: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Physical dependency inversion uses module boundaries to make volatile implementation
code depend on a stable consumer-facing contract. The feature imports an interface;
the app composition root imports both interface and implementation and connects them.

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 600" title="Interfaces, Implementations, and Dependency Inversion" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the Interfaces, Implementations, and Dependency Inversion diagram</a></figcaption>
</figure>

Runtime calls go from the feature to the live adapter, but source imports point toward
the interface. The implementation can change without making the feature import its SDK.

## Design a Small Interface Module

```swift
public struct PaymentAuthorizer: Sendable {
    public var authorize: @Sendable (PaymentRequest) async throws -> Authorization

    public init(
        authorize: @escaping @Sendable (PaymentRequest) async throws -> Authorization
    ) {
        self.authorize = authorize
    }
}
```

The interface exposes product terms and documented behavior. The live module maps a
vendor SDK into those values. Test support can provide fixtures or controlled clients
without the feature importing the live package.

An interface module should remain small. If it exports vendor types, storage records,
or every internal helper, the split adds target cost without reducing coupling.

## Choose Ownership and Direction

The module being protected normally owns or governs the contract. A payments platform
team may own a shared interface when the business capability is stable across features.
A feature may own a narrower port when its needs differ.

Avoid one provider-defined mega-protocol because it gives every consumer all methods
and forces them to change with provider growth. Consumer-oriented capabilities can be
composed over one internal implementation.

## Compare Packaging Shapes

| Shape | Fits | Cost |
|---|---|---|
| One feature module with internal adapter | One owner and implementation | No physical replacement boundary |
| Interface + live implementation | Volatile SDK, independent build, several consumers | More targets and public API |
| Interface + live + test support | Many clients need consistent fixtures | Test API and version maintenance |
| Several platform implementations | iOS, widget, server, or offline variants | Contract must express real common behavior |

Do not create `FeatureInterface` and `FeatureImplementation` for every feature by rule.
A feature entry factory exported from one module may hide implementation well enough.

## Use Swift Access Levels Deliberately

`public` exposes API outside a module. `package` can share declarations across targets
in one package without making them public to external clients. `internal` remains the
default implementation boundary.

Keep exported types minimal and give public initializers explicitly when required.
Public API increases compatibility and documentation responsibility even in a
same-repository app because many modules can compile against it.

## Handle Testability Without Leaking Implementation

Consumer tests inject interface values or fakes. Live adapter tests import the
implementation and verify mapping, cancellation, and SDK behavior. Contract tests can
run against both to ensure common semantics.

Do not expose internals publicly only for tests. Use focused test-support products,
`@testable` within controlled module tests, or test through the public contract. Test
support must not become an alternate production dependency path.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Features avoid concrete SDK and infrastructure imports | More targets and assembly |
| Implementation can rebuild and evolve independently | Interface API requires compatibility |
| Test support is reusable and focused | Fakes can drift from live semantics |
| Dependency rules become compiler-enforced | Too many interface modules fragment discovery |
| Platform variants can share product contracts | Lowest-common-denominator contracts lose meaning |

## Engineering Decisions

Split interface and implementation when import direction, independent ownership,
multiple implementations, or build isolation has measured value. Record contract
semantics, concurrency, lifetime, errors, and compatibility—not only method signatures.

At Staff scope, assign interface owners, control public API growth, automate forbidden
imports, and provide migrations. Review whether interface modules reduce actual change
coupling rather than only making the graph look layered.

## References

- [Access Control — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [Protocols — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/)
- [Target — PackageDescription](https://docs.swift.org/swiftpm/documentation/packagedescription/target/)
