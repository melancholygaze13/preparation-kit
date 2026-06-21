---
title: "Value and Reference Semantics: Theory"
domain: "Swift"
topic: "Classes and Structures"
concept: "Value and Reference Semantics"
page_type: theory
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - value-semantics
  - reference-semantics
  - copy-on-write
  - performance
---

# Value and Reference Semantics: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> Value semantics promise independent observable values after assignment or
> argument passing; reference semantics allow multiple references to one instance.

- Swift structures and enumerations are value types; classes are reference types.
- Value semantics describe observable behavior, not an eager byte-for-byte copy.
- Standard collections use copy-on-write optimizations, but arbitrary structs do
  not gain copy-on-write automatically and custom implementations must preserve it.
- A value containing a mutable class reference is not a deep snapshot of that graph.
- Pass-by-value does not imply a fixed performance cost; profile size, storage,
  mutation patterns, and optimizer behavior.

## Mental Model

After `b = a`, ask what mutation through `b` can make observable through `a`.
For a proper value, changing `b` does not change `a`'s value. For references, both
names may observe the same instance.

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

Passing either kind to a function follows the same semantic distinction. A normal
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

Value semantics do not require compiler-synthesized `Equatable`, and equality does
not determine whether a type has value semantics. Equality is a domain relation;
copy behavior is an ownership relation. A class can implement value-like equality
while still being aliased, and a value can omit equality entirely.

### Core Invariants

- Mutating one value does not change another independently held value.
- Shared backing storage is not exposed as shared mutable behavior.
- Reference aliases observe one deliberate instance and lifecycle.
- Equality and identity are not substituted for one another.
- Optimization preserves the documented semantic contract.

### Constraints and Guarantees

- Struct and enum assignment uses value semantics; class assignment shares an instance.
- Value semantics do not promise deep copying of referenced members.
- COW is an implementation strategy, not a language-wide guarantee for structures.
- `let` freezes a value binding but freezes only the reference of a class binding.
- Neither value nor reference semantics alone guarantees `Sendable` conformance,
  atomicity, immutability, or race freedom.

## Failure Modes

- **Shallow snapshot:** Reference members change through another copy.
- **COW uniqueness check omitted:** Mutation leaks across values.
- **Mutable storage escapes:** Callers bypass detachment and invalidate invariants.
- **Large value blamed without evidence:** A class rewrite adds allocation and aliasing
  while missing the actual bottleneck.
- **Reference used as cache key by mutable equality:** Hash/equality changes after insertion.
- **Value sent concurrently with unsafe internals:** Surface syntax hides non-sendable state.

## Engineering Judgment

### Choosing Semantics

| Requirement | Better starting point |
|---|---|
| Immutable message or snapshot | Value |
| Independent local mutation | Value |
| One shared resource or session | Reference with explicit owner |
| Large logical value with sparse writes | Value API, consider measured COW storage |
| Coordinated shared mutable state | Actor or synchronized reference owner |
| Polymorphic capability without identity | Protocol plus suitable concrete semantics |

### Trade-offs and Alternatives

Pure stored-value structs maximize transparency but may move substantial data.
COW preserves a value interface and can reduce copying at the cost of uniqueness
checks, storage complexity, and harder profiling. Reference types make sharing
cheap and explicit but distribute alias and lifetime reasoning. Persistent data
structures are another value-oriented option for large branching histories.

## Production Considerations

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
Introduce a new boundary type, dual-run semantic tests, migrate storage and caches,
then remove the old representation after consumers no longer depend on it.

## Staff and Principal Perspective

### System Impact

Value snapshots reduce coupling across modules and concurrency domains, while shared
references can centralize scarce resources. Standardize semantics at architecture
boundaries: DTOs, state snapshots, caches, and service owners should not make
consumers reverse-engineer whether mutation propagates.

### Decision Framework

Define observable copy behavior, graph ownership, mutation frequency, concurrency
crossings, equality, lifecycle, and performance evidence. Treat a COW implementation
as an optimization project with invariant tests, not an API redesign shortcut.

### Organizational Impact

Document types with non-obvious reference members. Give shared mutable owners a
team and operational boundary. Require benchmarks and semantic regression tests for
representation migrations used across modules.

## Common Mistakes

### Value Semantics Means Deep Copy

**Why it is wrong:** A copied struct copies its fields according to their semantics;
a class-typed field remains a reference to the same instance.

**Better approach:** Use value-semantic members, immutable references, or correctly
detaching storage when independent graphs are required.

### Copy-on-Write Is Automatic

**Why it is wrong:** Standard collections implement COW; declaring a struct around a
class does not create correct detachment behavior.

**Better approach:** Implement and test uniqueness-preserving mutation deliberately,
or keep straightforward stored values until profiling justifies complexity.

## References

- [The Swift Programming Language: Classes and Structures](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/classesandstructures/)
- [Swift.org: Value and Reference Types](https://www.swift.org/documentation/articles/value-and-reference-types.html)
- [WWDC15: Building Better Apps with Value Types in Swift](https://developer.apple.com/videos/play/wwdc2015/414/)
