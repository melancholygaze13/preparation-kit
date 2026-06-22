---
title: "Stored and Computed Properties: Theory"
domain: "Swift"
topic: "Properties"
concept: "Stored and Computed Properties"
page_type: theory
interview_priority: high
estimated_read_minutes: 4
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - stored-properties
  - computed-properties
  - lazy-properties
  - api-design
---

# Stored and Computed Properties: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Keep one source of truth. Store facts owned by the type and derive views from those
facts. Introduce cached or lazy state only when its lifecycle and invalidation are
part of the design.

## How It Works

### Stored Properties and Value Mutation

```swift
struct Rectangle {
    let width: Double
    let height: Double
}
```

Stored properties exist only on structures and classes. If a structure instance is
bound with `let`, none of its variable stored properties can be changed through that
binding because mutation changes the value. A constant class reference can still
refer to an instance whose variable properties change.

### Computed Properties

```swift
struct Rectangle {
    var width: Double
    var height: Double

    var area: Double { width * height }

    var squareSide: Double {
        get { min(width, height) }
        set { width = newValue; height = newValue }
    }
}
```

A computed property stores no exposed result. A setter receives `newValue` unless a
different parameter name is declared. Getter-only properties can omit `get`.

Derivation prevents stale duplicate state. A setter is appropriate only when its
reverse mapping is unsurprising and preserves invariants. Otherwise use a named
method that makes the transformation explicit.

### Effectful Getters

A read-only computed property can be `async` and/or `throws`:

```swift
struct ConfigurationSource {
    var current: String {
        get async throws {
            try await loadConfiguration()
        }
    }
}
```

Effectful properties have getters only. They make suspension or failure visible at
the call site, but a method is often clearer when the operation accepts arguments,
starts work, changes external state, or should not look like ordinary field access.

### Lazy Stored Properties

```swift
final class Report {
    let rows: [String]
    lazy var index: [String: Int] = buildIndex(from: rows)

    init(rows: [String]) { self.rows = rows }
}
```

`lazy` delays initialization until first use and requires `var` because the initial
value is installed after instance initialization. It is useful for expensive state
that may never be needed or needs fully initialized `self`-owned inputs.

If multiple threads access an uninitialized lazy property concurrently, Swift does
not guarantee that initialization happens only once. Isolate access or provide a
synchronized owner. Also consider captured dependencies: a lazy closure can retain
objects long after construction.

### Store, Compute, or Cache

| Strategy | Best fit | Primary risk |
|---|---|---|
| Stored fact | Authoritative mutable state | Invalid combinations |
| Computed value | Cheap deterministic derivation | Hidden repeated cost |
| Lazy stored value | Optional one-time expensive setup | Races and retained dependencies |
| Explicit cache | Expensive repeatable derivation | Invalidation and memory growth |
| Method | Operation, effects, parameters, or costly work | Less field-like ergonomics |

### Core Invariants

- Each fact has one authoritative representation.
- Derived values agree with their dependencies at the point of access.
- Setters preserve all type invariants.
- Lazy and cached state has one owner and defined invalidation.
- Property syntax does not hide operationally significant effects.

### Constraints and Guarantees

- Stored instance properties belong to structures and classes, not extensions.
- Computed properties can appear on classes, structures, and enumerations.
- `lazy` applies to variable stored properties only.
- Concurrent first access to an instance lazy property is not guaranteed single initialization.
- Getter-only does not mean pure, cheap, immutable, or thread-safe.

## Engineering Judgment

Prefer computation when it is deterministic, cheap, and based on local authoritative
state. Prefer storage when the value is itself authoritative. Use explicit caches
only after measurement, with keys, invalidation, capacity, and isolation specified.
Use a method when effects or cost are central to the operation.

## References

- [The Swift Programming Language: Properties](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/properties/)
- [SE-0310: Effectful Read-only Properties](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0310-effectful-readonly-properties.md)
