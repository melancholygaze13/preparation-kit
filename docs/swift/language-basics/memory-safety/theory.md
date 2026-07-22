---
title: "Memory Safety Fundamentals: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Memory Safety Fundamentals"
page_type: theory
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-22
---

# Memory Safety Fundamentals: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Safe Swift prevents common invalid-memory operations. The compiler and runtime
enforce rules for initialization, bounds, lifetime, type access, and exclusive
mutation. These guarantees do not prevent ordinary logic errors. Concurrency
safety adds separate isolation and `Sendable` checks around shared data.

## Main Guarantees

- A value must be initialized before it is read.
- Safe collection subscripting checks that an index is valid.
- ARC keeps a class instance alive while strong references own it.
- Two nonatomic accesses conflict when they overlap on the same storage and at
  least one access writes.

An access has a location, a duration, and a read-or-write mode. Most simple
property reads and assignments are instantaneous. `inout`, a mutating method,
and a property observer can create a longer access. A conflict exists when two
accesses overlap, address the same storage, and are not both reads or both
atomic.

`inout` creates temporary exclusive access for a function call. Conceptually it
uses copy-in/copy-out behavior, although the compiler may optimize it in place.
Do not treat it as an escaping pointer or depend on the optimization.

```swift
func balance(_ a: inout Int, _ b: inout Int) { /* ... */ }

var score = 10
// balance(&score, &score) // Error: overlapping exclusive accesses
```

Stored properties of a local value can sometimes be proven disjoint, but that is
a specific rule, not permission to alias arbitrary `inout` arguments.

Unsafe pointers and imported C APIs weaken these protections. At that boundary,
you must prove lifetime, bounds, initialization, alignment, type binding,
ownership, and synchronization. Keep unsafe code small and expose a safe wrapper.

## Concurrency Boundary

Exclusive-access checks also catch conflicts on a single thread. Data races
involve unsynchronized access from concurrent execution and need concurrency
checking or synchronization. In Swift 6 language mode, strict concurrency
checking uses isolation and `Sendable` rules to reject unsafe crossings that the
compiler can see. Unsafe pointers, unchecked conformances, foreign code, and
other explicit escape hatches still place proof on the programmer.

For intentionally shared mutable state, use actor isolation, immutability, or a
suitable lock. Use Thread Sanitizer to test paths that depend on runtime or
foreign-code behavior; it complements static checking rather than replacing it.

## References

- [The Swift Programming Language: Memory Safety](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/memorysafety/)
- [Swift 6 Language Mode](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/swift6mode/)
