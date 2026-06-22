---
title: "Property Observers and Mutation Boundaries: Theory"
domain: "Swift"
topic: "Properties"
concept: "Property Observers and Mutation Boundaries"
page_type: theory
interview_priority: situational
estimated_read_minutes: 3
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - property-observers
  - mutation
  - invariants
  - observability
---

# Property Observers and Mutation Boundaries: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An observer surrounds one property's write. It can normalize local state or emit a
small signal, but it cannot make a larger state transition atomic or reject the
assignment before invalid state becomes observable.

## How It Works

### Observer Values and Timing

```swift
struct Progress {
    var fraction = 0.0 {
        willSet { precondition(newValue.isFinite) }
        didSet { fraction = min(max(fraction, 0), 1) }
    }
}
```

Custom names can replace `newValue` and `oldValue`. Assigning a property within its
own `didSet` replaces the value without recursively invoking that same observer.
Even so, normalization after assignment can briefly complicate reasoning; a private
stored property plus validated mutation API is clearer for important invariants.

### Initialization and Inheritance Boundary

Observers are not called while a type's own initialization assigns its stored
properties. This avoids observing a partially initialized instance. Later
assignments invoke them. Inherited-property observation has additional initialization
ordering rules and belongs with inheritance and initialization mechanics.

### `inout` Writeback

```swift
func inspect(_ value: inout Int) { }

var count = 0 { didSet { print(oldValue, count) } }
inspect(&count) // writeback invokes didSet
```

Treat `inout` as a temporary mutation boundary with writeback, not a permanent
reference. An observer may therefore run even when a function appears read-only.
Avoid putting expensive effects in observers whose property is passed as `inout`.

### Observers Versus Explicit Mutation

Use an explicit method when a change can fail, touches multiple properties, starts
asynchronous work, needs ordering or authorization, or must return a result. The
method can validate first and commit once. Observers are suitable for cheap local
normalization, debug assertions, and narrowly scoped notification.

### Core Invariants

- Important validation occurs before committing externally visible state.
- Multi-property transitions have one mutation owner.
- Observer work is synchronous, bounded, and nonblocking.
- Notifications cannot reenter the owner in an uncontrolled way.
- `inout` call sites account for observer writeback behavior.

### Constraints and Guarantees

- Observers can be added to stored properties and to inherited properties, subject
  to the language's declaration rules.
- Observers run on assignment regardless of equality.
- A property's own observers do not run for its initial assignment during initialization.
- Observers do not provide atomicity, rollback, failure propagation, or thread safety.
- `willSet` cannot prevent assignment by throwing.

## Engineering Judgment

| Requirement | Better boundary |
|---|---|
| Cheap local normalization | `didSet` or private setter |
| Reject invalid value | Validating initializer or throwing method |
| Update several properties atomically | One explicit mutation method/owner |
| Publish asynchronous event | Owner commits, then explicit async pipeline |
| Observe framework-owned inherited state | Observer where lifecycle rules permit |
| Synchronize concurrent access | Actor or encapsulated synchronization |

## References

- [The Swift Programming Language: Properties](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/properties/)
- [The Swift Programming Language: Declarations](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/declarations/)
