---
title: "Generic API Design and Evolution: Theory"
domain: "Swift"
topic: "Generics"
concept: "Generic API Design and Evolution"
page_type: theory
interview_priority: high
estimated_read_minutes: 4
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-08-12
---

# Generic API Design and Evolution: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Generic design must work for both application code and the compiler. Callers must be
able to understand the API, while the compiler must type-check and optimize it. The most
general signature is not always best. It can produce unstable inference, unclear errors,
or constraints that spread through the system.

## How It Works

```swift
protocol KeyValueStore<Key, Value> {
    associatedtype Key: Hashable
    associatedtype Value

    func value(for key: Key) async throws -> Value?
}

struct CachedStore<Base: KeyValueStore>: KeyValueStore
where Base.Key: Sendable, Base.Value: Sendable {
    typealias Key = Base.Key
    typealias Value = Base.Value

    let base: Base

    func value(for key: Key) async throws -> Value? {
        try await base.value(for: key)
    }
}
```

The wrapper preserves the base store's type relationships and states sendability only
where this boundary needs it. A production cache would add explicit ownership and
isolation; generic syntax alone provides neither.

### Rules That Must Stay True

- Public parameters correspond to stable domain variation points.
- Constraints state required behavior at the narrowest responsible boundary.
- Overloads do not depend on subtle ranking for correctness.
- Performance remains correct without specialization.
- Migration preserves or deliberately versions established conformances and type relationships.

### Constraints and Guarantees

- `@inlinable` exposes a function body as part of the module's optimization interface and restricts which declarations it may reference.
- Library evolution and cross-module optimization influence what client code can specialize.
- Neither generic syntax nor `@inlinable` guarantees a specific machine-code shape.
- Source compatibility must account for re-type-checking, not only binary linkage.

## Engineering Judgment

### Decision Framework

1. Identify which type relationships are externally meaningful.
2. State the weakest capabilities needed for correctness.
3. Compare a generic boundary with an existential, closure, or simple concrete API.
4. Test inference and diagnostics from a separate client module.
5. Benchmark runtime, code size, and build time in release conditions.
6. Define compatibility and migration ownership before publishing conformances.

### Trade-offs

| Design | Benefits | Costs | Best fit |
|---|---|---|---|
| Fully generic API | Most compile-time information and composition | Constraints spread into callers and couple source code | Low-level reusable libraries |
| Concrete API over generic core | Stable, approachable public API | More adapters and less caller customization | Application and feature boundaries |
| Existential or closure boundary | Runtime substitution and less generic spread | Hidden relationships and possible indirection | Dependency and plugin boundaries |

## Production Application

### Performance

Use Instruments and representative benchmarks, then inspect release binaries when code
size matters. Include app-start effects and CPU instruction-cache pressure. A faster isolated
specialization can still harm the application if replicated across many types.

### Concurrency and Thread Safety

Generic wrappers inherit the ownership risks of their arguments. Put `Sendable` and actor
isolation constraints at transfer points, and make cancellation and ordering part of
async generic protocol contracts when applicable.

### Testing

Maintain small client projects for common and difficult type-inference cases. Add API
digester/interface checks for published libraries and benchmark both specialized-looking
and existential alternatives.

### Observability and Debugging

Record stable operation names separately from concrete generic type strings. Crash-symbol processing
and crash grouping should tolerate specialized frames and implementation changes.

### Compatibility and Migration

Ship adapters before changing generic signatures. Adding conformances, constraints,
primary associated type exposure, or overloads requires source testing across supported
toolchains. Deprecate old forms only after downstream migration is measurable.

## Staff and Principal Perspective

### System Impact

Generics that spread without limits couple modules through compiler-visible types. Use simple
concrete APIs at team boundaries. Keep generic cores where ownership and release
cadence are aligned.

### Organizational Impact

Set policies for conformance ownership, toolchain baselines, `@inlinable`, performance
evidence, and source-compatibility test projects. Compiler complexity costs time
shared by every contributor and CI job.

## References

- [The Swift Programming Language: Generics](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/generics/)
- [Library evolution in Swift](https://www.swift.org/blog/library-evolution/)
- [The Swift Programming Language: Declaration attributes](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/attributes/#Declaration-Attributes)
- [SE-0193: Cross-module inlining and specialization](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0193-cross-module-inlining-and-specialization.md)
