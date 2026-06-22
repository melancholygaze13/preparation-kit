---
title: "Sets: Theory"
domain: "Swift"
topic: "Collection Types"
concept: "Sets"
page_type: theory
levels:
  - senior
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Sets: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A set models uniqueness and membership without order. It uses a hash to find a
small search area, then equality to confirm the matching element.

## Equality and Hashing

Set elements conform to `Hashable`, which includes `Equatable`. The required
contract is simple: when `a == b`, both values must produce the same hash during
one program execution. Unequal values may have the same hash.

Equality should be reflexive, symmetric, and transitive. Base equality and
hashing on the same stable fields. Do not persist `hashValue`; Swift can change
hash seeds and results between executions.

Mutating a field used by equality or hashing while a class instance is stored in
a set can make the element unreachable through normal lookup. Prefer immutable
identity or remove, update, and reinsert the element.

## Operations and Cost

Sets provide insertion, removal, membership, union, intersection, subtraction,
and symmetric difference. Average lookup, insertion, and removal are expected to
be constant time with a useful hash distribution. These are not hard real-time
guarantees.

Iteration order is not part of the contract. Sort at a presentation or encoding
boundary when deterministic order is required.

## Engineering Decisions

Use a set when uniqueness, membership, or set algebra is central. Use an array
when order or duplicates matter. Use a dictionary when each key owns a value.
Like other Swift collections, a set has value semantics but shared mutation of
one variable still needs synchronization.

## References

- [The Swift Programming Language: Sets](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/collectiontypes/#Sets)
- [Swift `Set`](https://developer.apple.com/documentation/swift/set)
- [Swift `Hashable`](https://developer.apple.com/documentation/swift/hashable)
