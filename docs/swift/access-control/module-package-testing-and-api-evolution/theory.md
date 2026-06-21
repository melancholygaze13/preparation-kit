---
title: "Module, Package, Testing, and API Evolution: Theory"
domain: "Swift"
topic: "Access Control"
concept: "Module, Package, Testing, and API Evolution"
page_type: theory
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
---

# Module, Package, Testing, and API Evolution: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> `internal`, `package`, and `public` encode different dependency/release domains; `@testable` and `@usableFromInline` modify specific compiler boundaries without making implementation ordinary public API.

- A module is one distribution/import unit; a package can contain multiple modules.
- `package` shares declarations across modules built with the same package identity.
- `@testable import` exposes internal declarations to a test module when built for testing, not private/fileprivate declarations.
- `@inlinable` publishes a body for client optimization and restricts referenced implementation declarations.
- `@usableFromInline` makes internal ABI symbols usable by inlinable code; it does not make them source-public.

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

## Failure Modes

- Internal APIs become public only to support tests.
- Package access creates a dependency cycle or de facto unowned platform API.
- Broad `@inlinable` use freezes implementation and increases client build cost.
- Test modules depend on every internal detail and block refactoring.
- A module split changes internal/package visibility without a consumer migration plan.

## Engineering Judgment

Test behavior through public/package seams where practical; use `@testable` for focused internal logic,
not pervasive structural coupling. Add package access for intentional multi-module collaboration.
Use inlinable/usable-from-inline only after measured cross-module optimization evidence.

## Production Considerations

### Performance

Measure client runtime, binary size, and build time before exposing optimization bodies. Shared generic
or inlinable code can improve speed while increasing compilation and code size.

### Concurrency and Thread Safety

Cross-module/package access must preserve explicit isolation/sendability. Testability must not bypass
actor boundaries or normalize unsafe shared state.

### Testing

Maintain external public clients, same-package clients, forbidden external access, testable imports,
and generated-interface/API-digester checks appropriate to distribution.

### Observability and Debugging

Track deprecated API usage, package dependency edges, public symbol growth, and build-time hot spots.
Optimization interface changes need release notes for binary framework owners.

### Compatibility and Migration

Before moving/splitting modules, inventory consumers, add forwarding facades/typealiases where valid,
change package/public access deliberately, compile downstream clients, and deprecate in stages.

## Staff and Principal Perspective

### System Impact

Access level shapes build graphs, deployable units, binary compatibility, ownership, and team autonomy.
Package-wide convenience can undermine module layering as easily as public API can leak implementation.

### Decision Framework

Record intended consumers, package/module owner, release cadence, source/ABI/optimization exposure,
test strategy, performance evidence, deprecation window, and rollback.

### Organizational Impact

Govern public/package symbol growth, `@inlinable`, module dependency rules, and testable usage with
automated interface checks and named API owners.

## Common Mistakes

### Making Production API Public for Tests

**Why it is wrong:** Tests become the reason for a permanent external compatibility surface.

**Better approach:** Test supported behavior, use focused `@testable` access where justified, or extract an owned collaborator with a real production boundary.

## References

- [The Swift Programming Language: Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [The Swift Programming Language: Attributes](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/attributes/)
