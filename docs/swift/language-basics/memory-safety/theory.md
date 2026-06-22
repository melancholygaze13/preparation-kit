---
title: "Memory Safety Fundamentals: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Memory Safety Fundamentals"
page_type: theory
levels:
  - senior
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Memory Safety Fundamentals: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Safe Swift prevents common invalid-memory operations. The compiler and runtime
enforce rules for initialization, bounds, lifetime, type access, and exclusivity.
This does not prevent every data race or logic error.

## Main Guarantees

- A value must be initialized before it is read.
- Safe collection subscripting checks that an index is valid.
- ARC keeps a class instance alive while strong references own it.
- Two accesses conflict when they overlap on the same storage and at least one
  access writes.

`inout` creates temporary exclusive access for a function call. Do not treat it
as a pointer that can be stored for later.

Unsafe pointers and imported C APIs weaken these protections. At that boundary,
you must prove lifetime, bounds, initialization, alignment, type binding,
ownership, and synchronization. Keep unsafe code small and expose a safe wrapper.

## Concurrency Boundary

Memory safety and data-race safety are related but different. A class can remain
alive and every index can be valid while two tasks still mutate its state without
synchronization. Use actor isolation, immutability, or a suitable lock for shared
mutable state.

## References

- [The Swift Programming Language: Memory Safety](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/memorysafety/)
