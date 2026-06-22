---
title: "Abstraction Boundary Design and Evolution: Theory"
domain: "Swift"
topic: "Opaque and Boxed Protocol Types"
concept: "Abstraction Boundary Design and Evolution"
page_type: theory
interview_priority: situational
estimated_read_minutes: 3
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Abstraction Boundary Design and Evolution: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Ask two questions: who chooses the concrete type, and must that choice vary while the program runs?
Then ask which type equalities downstream operations require. The narrowest boundary that preserves
those equalities without leaking implementation structure is usually the right design.

## How It Works

| Boundary | Type chooser | Runtime variation | Static identity retained | Typical use |
|---|---|---:|---:|---|
| `<T: P>` | Caller | No within one specialization | Yes | Reusable algorithm |
| `some P` result | Implementation | No within one opaque declaration | Yes, hidden | Private composition returned publicly |
| `any P` | Runtime owner | Yes | No, except stated constraints | Plugin/configuration/storage seam |
| Manual eraser | Runtime owner and wrapper policy | Yes | Only relationships the wrapper models | Curated compatibility facade |

```swift
protocol Exporter {
    func export(_ payload: String) async throws
}

struct FileExporter: Exporter {
    func export(_ payload: String) async throws { }
}

struct NetworkExporter: Exporter {
    func export(_ payload: String) async throws { }
}

func defaultExporter() -> some Exporter {
    FileExporter()
}

func configuredExporter(useNetwork: Bool) -> any Exporter {
    useNetwork ? NetworkExporter() : FileExporter()
}
```

The default factory hides one fixed representation. The configured factory chooses between
implementations at runtime, so existential semantics match its contract.

### Core Invariants

- The boundary preserves every relationship required by downstream correctness.
- Runtime substitution is owned where configuration and lifecycle are controlled.
- Performance remains correct without specialization or existential optimization.
- Public changes include adapters, source fixtures, and rollback strategy.
- Isolation, sendability, cancellation, and ownership are part of the abstraction contract.

### Constraints and Guarantees

- Replacing concrete, generic, opaque, and existential signatures is source-sensitive even when protocol requirements match.
- Opaque constraints are public while non-inlinable underlying representation can remain hidden.
- Existential erasure cannot later recreate relationships the boundary never recorded.
- A manual eraser defines its own semantic laws and must maintain them across all wrapped conformers.

## Engineering Judgment

### When to Use It

Keep generic or opaque forms inside aligned ownership where static composition matters. Introduce
existential or manual erasure at plugin, dependency-injection, configuration, and independently
released module boundaries that genuinely require runtime substitution.

### When Not to Use It

Do not create an abstraction before there is a real variation point. A concrete domain type is
often more stable and comprehensible than a protocol plus erasure machinery.

### Trade-offs

| Priority | Prefer | Validate |
|---|---|---|
| Preserve input/output type equality | Generic | Constraint spread and diagnostics |
| Hide one implementation type | Opaque result | Branch identity and inlining policy |
| Replace implementations at runtime | Existential | Erased operations, lifetime, dispatch |
| Stabilize a custom minimal surface | Manual eraser | Laws, forwarding, value/reference semantics |
| Stabilize a domain boundary | Concrete facade | Adapter and conversion ownership |

## References

- [The Swift Programming Language: Opaque and Boxed Protocol Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/opaquetypes/)
- [SE-0244: Opaque Result Types](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0244-opaque-result-types.md)
- [SE-0335: Introduce Existential `any`](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0335-existential-any.md)
- [SE-0353: Constrained Existential Types](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0353-constrained-existential-types.md)
