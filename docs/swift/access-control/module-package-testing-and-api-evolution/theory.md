---
title: "Module, Package, Testing, and API Evolution: Theory"
domain: "Swift"
topic: "Access Control"
concept: "Module, Package, Testing, and API Evolution"
page_type: theory
interview_priority: situational
estimated_read_minutes: 2
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Module, Package, Testing, and API Evolution: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

There are multiple interfaces: source API, binary ABI, optimization interface, package-internal API,
and test seam. A declaration can participate in more than one. Review generated interfaces and client
behavior rather than assuming one access keyword describes every commitment.

## How It Works

```swift
public struct Identifier {
    @usableFromInline
    internal let rawValue: UInt64

    @inlinable
    public var isZero: Bool { rawValue == 0 }

    public init(rawValue: UInt64) { self.rawValue = rawValue }
}
```

Clients can call `isZero`, and their optimizer can see its body. `rawValue` remains unavailable as
ordinary source API but becomes ABI-relevant for inlinable code. This is a compatibility cost, not a
way to bypass intentional access design.

### Core Invariants

- Module/package boundaries match dependency ownership and release cadence.
- Tests validate supported seams without forcing production visibility growth.
- Inlinable bodies expose only implementation details accepted as compatibility surface.
- Package APIs maintain layering and do not create cycles between modules.
- Public narrowing/removal follows measurable deprecation and migration.

### Constraints and Guarantees

- Package declarations require matching compiler package identity and are unavailable to external packages.
- `@testable` requires the imported module to be compiled with testing enabled.
- `@testable` does not grant access to private/fileprivate declarations.
- `@inlinable` permits, but does not guarantee, client inlining or specialization.
- `@usableFromInline` declarations remain internal for source access while carrying ABI constraints.

## Engineering Judgment

Test behavior through public/package seams where practical; use `@testable` for focused internal logic,
not pervasive structural coupling. Add package access for intentional multi-module collaboration.
Use inlinable/usable-from-inline only after measured cross-module optimization evidence.

## References

- [The Swift Programming Language: Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [The Swift Programming Language: Attributes](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/attributes/)
