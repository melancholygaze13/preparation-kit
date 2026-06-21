---
title: "Type Methods and API Design: Theory"
domain: "Swift"
topic: "Methods"
concept: "Type Methods and API Design"
page_type: theory
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
tags: [type-methods, static, factories, api-design]
---

# Type Methods and API Design: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> A type method operates on type-level policy or creates values without requiring an instance.

- Declare type methods with `static`; classes can use `class` when overriding the
  method is intentionally supported.
- Inside a type method, `self` is the type, which supports polymorphic factories where applicable.
- Prefer initializers for direct construction and named type methods for distinct
  policies, parsing, presets, or cached/canonical results.
- Type methods do not justify hidden singletons or mutable global dependencies.
- Mutable type state accessed by methods still requires explicit actor isolation or synchronization.

## Mental Model

Use a type method when the receiver is the type itself. If the implementation mainly
coordinates services or global state, it belongs to an injected owner even if static
syntax would make the call shorter.

## How It Works

### Static and Class Methods

```swift
struct Angle {
    let radians: Double

    static func degrees(_ value: Double) -> Self {
        Self(radians: value * .pi / 180)
    }
}
```

`static` works on structures, enumerations, and classes and is not overridden. A class
method declared with `class` participates in class overriding. Expose overridability
only as a deliberate subclass contract; otherwise prefer `static` or a `final` class.

### Initializer, Factory, or Free Function

Use an initializer when construction is the obvious direct mapping and failure fits
`init?` or `throws`. Use a named type method when the name communicates policy such as
`cached`, `preview`, `parse`, or `defaultConfiguration`. Use a free function when
several peer types participate and none naturally owns the operation.

Factories should reveal whether they return a fresh value, shared canonical instance,
or cached resource. Returning shared mutable references from innocent construction
syntax creates aliasing surprises.

### Type-Level State

```swift
@MainActor
final class FeatureRegistry {
    private static var enabled: Set<String> = []

    static func enable(_ feature: String) {
        enabled.insert(feature)
    }
}
```

This code has explicit main-actor ownership, but static state remains process-global,
hard to substitute, and coupled to lifecycle. An injected actor instance is usually
better when tests, multiple environments, or scoped ownership matter.

### API Evolution

Overloads and default arguments should keep call sites unambiguous. Do not use a type
method as a compatibility dumping ground. Add intent-specific names, preserve failure
and isolation semantics, and deprecate old entry points with a migration path.

### Core Invariants

- Type methods express behavior genuinely owned by the type.
- Factory names disclose construction, caching, and sharing semantics.
- Overridable class methods define an intentional subclass contract.
- Shared state has an explicit isolation and lifecycle owner.
- API changes preserve or clearly migrate effects and failure behavior.

### Constraints and Guarantees

- `static` type methods cannot be overridden; `class` methods can be overridden by subclasses.
- Type-method `self` refers to the type rather than an instance.
- Type methods have no implicit instance state.
- Namespace placement provides no dependency injection, synchronization, or test isolation.
- Actor/global-actor isolation constrains calls but does not remove global-state coupling.

## Failure Modes

- **Static service locator:** Dependencies become hidden and tests mutate global configuration.
- **Factory hides singleton:** Callers assume independent instances but receive aliases.
- **Unnecessary `class` method:** Subclasses can weaken invariants through overrides.
- **Overload ambiguity:** Defaults and generic inference select surprising APIs.
- **Mutable static race:** Type method serializes nothing by itself.
- **Utility dumping ground:** Unrelated operations accumulate under a convenient type name.

## Engineering Judgment

| Requirement | Prefer |
|---|---|
| Direct construction | Initializer |
| Named construction policy | Type factory |
| Operation on one instance | Instance method |
| Symmetric operation across peer types | Free function/service |
| Scoped shared resource | Injected owner |
| UI-global shared policy | Explicit `@MainActor` owner where justified |

## Production Considerations

### Performance and Concurrency

Factories may allocate, cache, perform I/O, or return shared references; document and
instrument the meaningful cost. Isolate mutable static state explicitly. Actor hops
and locks are operational costs, but removing them without removing sharing creates races.

### Testing and Observability

Test fresh-versus-shared identity, failure, cache invalidation, subclass behavior when
supported, and concurrent access. Prefer injected instances so tests do not depend on
global reset order. Emit metrics at the owning service, not every factory forwarding call.

### Compatibility and Migration

Moving a static API to an instance owner requires dependency plumbing. Introduce an
instance protocol and adapter, inject it at composition roots, migrate call sites,
observe static usage, then deprecate the global entry point.

## Staff and Principal Perspective

Static APIs create architecture even when they look local. Establish rules for
factories, shared instances, overridable methods, isolation, and dependency injection.
Give common registries and caches a team, lifecycle, quotas, telemetry, and migration
plan. Permit static convenience only when ownership remains explicit.

## Common Mistakes

### Static Means Stateless

**Why it is wrong:** A type method can read and mutate type properties or other globals.

**Better approach:** Audit dependencies and isolate or inject shared owners.

### Factory Always Returns a New Instance

**Why it is wrong:** A factory may cache or canonicalize; syntax does not guarantee identity.

**Better approach:** Make sharing semantics explicit in naming, documentation, and tests.

## References

- [The Swift Programming Language: Methods](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/methods/)
- [The Swift Programming Language: Declarations](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/declarations/)
- [SE-0466: Control Default Actor Isolation Inference](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0466-control-default-actor-isolation.md)
