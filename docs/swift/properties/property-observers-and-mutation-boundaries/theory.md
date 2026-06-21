---
title: "Property Observers and Mutation Boundaries: Theory"
domain: "Swift"
topic: "Properties"
concept: "Property Observers and Mutation Boundaries"
page_type: theory
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-21
tags:
  - property-observers
  - mutation
  - invariants
  - observability
---

# Property Observers and Mutation Boundaries: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> `willSet` runs before an assignment and `didSet` after it; both are synchronous
> hooks around mutation, not validation or concurrency primitives.

- `willSet` receives the incoming value; `didSet` receives the previous value.
- Observers run on assignments even when the new value compares equal to the old value.
- Initial assignment during initialization does not invoke the property's observers.
- Passing an observed property as `inout` uses writeback, so observers run when the
  call returns even if the callee made no effective change.
- Keep observers bounded and local; use explicit mutation APIs for validation,
  multi-property transactions, fallible work, and external side effects.

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

## Failure Modes

- **Validation in `didSet`:** Invalid state is assigned before repair.
- **Observer cascade:** One write triggers synchronous writes and notifications across a graph.
- **Duplicate expensive work:** Equal assignments still invoke the observer.
- **`inout` surprise:** A no-op call triggers writeback effects.
- **Reentrant callback:** Observer notification causes another mutation mid-transition.
- **Concurrent writers:** Observer code runs in racing contexts and corrupts shared state.

## Engineering Judgment

| Requirement | Better boundary |
|---|---|
| Cheap local normalization | `didSet` or private setter |
| Reject invalid value | Validating initializer or throwing method |
| Update several properties atomically | One explicit mutation method/owner |
| Publish asynchronous event | Owner commits, then explicit async pipeline |
| Observe framework-owned inherited state | Observer where lifecycle rules permit |
| Synchronize concurrent access | Actor or encapsulated synchronization |

## Production Considerations

### Performance and Reliability

Observers are paid on every assignment, including equal values and `inout` writeback.
Do not perform disk, network, blocking locks, or unbounded fan-out inside them. Make
notification ordering explicit and prevent callback cycles.

### Concurrency and Thread Safety

Observers execute in the context performing the write. They inherit actor isolation
when the enclosing state is isolated, but do not establish it. For actor state, keep
observers synchronous; route async work through an explicit operation and revalidate
state after suspension.

### Testing and Observability

Test initialization, equal assignment, normalization boundaries, `inout`, callback
reentrancy, and exact notification ordering. Instrument observer latency and cascade
depth only where these hooks sit on critical production paths.

### Compatibility and Migration

Adding an observer can silently add cost and side effects to existing assignment
syntax. Migrate high-impact behavior to named APIs, dual-publish notifications when
needed, and verify callers that use key paths or `inout`.

## Staff and Principal Perspective

Observers should not become an implicit event bus. At system scale, define mutation
owners, transaction boundaries, event schemas, delivery semantics, and reentrancy
policy. Establish review rules that keep cross-module effects out of property hooks.

## Common Mistakes

### `didSet` Is a Validation Boundary

**Why it is wrong:** The value has already been assigned, the observer cannot throw,
and related properties are not updated atomically.

**Better approach:** Validate inputs first in an initializer or explicit mutation API.

### Observers Run Only When Values Differ

**Why it is wrong:** Assignment triggers observers regardless of `Equatable` equality.

**Better approach:** Compare deliberately inside the observer when deduplication is valid.

## References

- [The Swift Programming Language: Properties](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/properties/)
- [The Swift Programming Language: Declarations](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/declarations/)
