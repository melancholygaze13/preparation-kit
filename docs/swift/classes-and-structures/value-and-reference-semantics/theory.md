---
title: "Value and Reference Semantics: Theory"
domain: "Swift"
topic: "Classes and Structures"
concept: "Value and Reference Semantics"
page_type: theory
interview_priority: core
estimated_read_minutes: 6
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-07-22
tags:
  - value-semantics
  - reference-semantics
  - copy-on-write
  - performance
---

# Value and Reference Semantics: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

After `b = a`, ask whether changing `b` can also change what you see through `a`.
With value semantics, changing `b` does not change `a`. With reference semantics,
both names can refer to the same instance and observe the same changes.

## How It Works

### Assignment and Parameter Passing

```swift
struct Point { var x: Int }
final class Counter { var value = 0 }

var firstPoint = Point(x: 1)
var secondPoint = firstPoint
secondPoint.x = 2                 // firstPoint.x remains 1

let firstCounter = Counter()
let secondCounter = firstCounter
secondCounter.value = 2           // firstCounter.value is also 2
```

Passing either kind to a function follows the same behavior. A normal
value parameter is not an alias that permits the callee to mutate the caller's
binding. A class parameter contains a copied reference to the same instance, so
instance mutation can remain visible.

### Copy-on-Write

Copy-on-write (COW) can share backing storage until a mutation requires separation:

```swift
var original = Array(0..<1_000)
var copy = original       // storage may be shared
copy.append(1_000)        // copy must behave independently
```

The storage strategy is normally unobservable through the value API. Swift's
standard `Array`, `Dictionary`, `Set`, and `String` use COW, but this does not
guarantee zero copies, fixed complexity in every context, or COW for user-defined
structs. A custom COW type must check uniqueness and clone before mutation; leaking
its mutable storage breaks value semantics.

### Reference Members Inside Values

```swift
final class Box { var value: Int; init(_ value: Int) { self.value = value } }
struct Snapshot { var box: Box }

let a = Snapshot(box: Box(1))
let b = a
b.box.value = 2           // a.box.value is now 2
```

The outer struct was copied, but both copies contain a reference to the same box.
This can be intentional implementation storage only if mutations detach correctly.
Otherwise name the type and API to communicate shared semantics instead of calling
it a snapshot.

### Equality Is Separate

Value semantics do not require `Equatable`, whether synthesized by the compiler or
written by hand. Equality asks whether two values mean the same thing in the
domain. Value semantics ask whether changing one copy changes another. A class can
compare equal by value while several references still point to the same instance.
A value type can also omit equality entirely.

### Rules That Must Stay True

- Mutating one value does not change another independently held value.
- Shared backing storage is not exposed as shared mutable behavior.
- Shared references intentionally point to one instance with one lifetime.
- Equality and identity are not substituted for one another.
- Optimization preserves the documented behavior contract.

### Constraints and Guarantees

- Struct and enum assignment uses value semantics; class assignment shares an instance.
- Value semantics do not promise deep copying of referenced members.
- COW is an implementation strategy, not a language-wide guarantee for structures.
- `let` freezes a value binding but freezes only the reference of a class binding.
- Neither value nor reference semantics alone guarantees `Sendable` conformance,
  atomicity, immutability, or race freedom.

## Engineering Judgment

### Choosing Semantics

| Requirement | Better starting point |
|---|---|
| Immutable message or snapshot | Value |
| Independent local mutation | Value |
| One shared resource or session | Reference with explicit owner |
| Large logical value that changes rarely | Value API; consider COW after measurement |
| Coordinated shared mutable state | Actor or synchronized reference owner |
| Interchangeable behavior without shared identity | Protocol plus a suitable concrete type |

### Trade-offs and Alternatives

Structs that store only values make copy behavior clear but may move substantial data.
COW preserves a value interface and can reduce copying at the cost of uniqueness
checks, storage complexity, and harder profiling. Reference types make sharing
cheap and explicit but distribute alias and lifetime reasoning. Persistent data
structures are another value-based option for data with many historical branches.

## Production Application

### Performance

Measure allocations, ARC traffic, copied bytes, mutation frequency, cache behavior,
and peak memory. Benchmark optimized builds with representative sizes. Small values
often benefit from direct storage; large rarely mutated values may benefit from COW.
Do not expose storage identity merely to diagnose performance.

### Concurrency and Thread Safety

Independent sendable values reduce shared-state races, but values can still contain
non-sendable references. COW uniqueness checks are not a synchronization mechanism
for concurrently mutating the same variable. Protect shared bindings with isolation;
prefer immutable snapshots across boundaries.

### Testing

For every value-like API, copy before each mutation path and verify both copies.
Test nested references, slices, empty/full storage, and repeated detach operations.
Use race detection and strict concurrency checking for boundary types, while
keeping semantic tests independent of whether storage happens to be shared.

### Observability and Debugging

Track allocation and copying with Instruments and signposts around meaningful
operations. Diagnose unexpected sharing with object identifiers only in debug
tooling; do not turn implementation storage identity into product behavior.

### Compatibility and Migration

Changing a value to a reference can make formerly independent copies share updates.
Changing a reference to a value can break observers and identity-based registries.
Introduce a new boundary type, test old and new copy behavior side by side, migrate storage and caches,
then remove the old representation after consumers no longer depend on it.

## Staff and Principal Perspective

### System Impact

Value snapshots reduce coupling across modules and concurrency boundaries. Shared
references can centralize scarce resources. Define copy and sharing behavior at
architecture boundaries. Callers of data-transfer objects, state snapshots, caches,
and services should not have to discover whether a change appears elsewhere.

### Decision Framework

Define observable copy behavior, graph ownership, mutation frequency, concurrency
crossings, equality, lifecycle, and performance evidence. Treat a COW implementation
as an optimization project with tests for required behavior, not an API redesign shortcut.

### Organizational Impact

Document types with non-obvious reference members. Give shared mutable owners a
team and operational boundary. Require benchmarks and copy-behavior regression tests for
representation migrations used across modules.

## References

- [The Swift Programming Language: Classes and Structures](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/classesandstructures/)
- [Swift.org: Value and Reference Types](https://www.swift.org/documentation/articles/value-and-reference-types.html)
- [WWDC15: Building Better Apps with Value Types in Swift](https://developer.apple.com/videos/play/wwdc2015/414/)
