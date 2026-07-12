---
title: "Sets: Theory"
domain: "Swift"
topic: "Collection Types"
concept: "Sets"
page_type: theory
levels:
  - senior
interview_priority: high
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-12
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

## Constraints and Guarantees

Hashing narrows the search; equality decides identity. A collision is therefore
normal and must not change correctness. A poor hash can reduce performance, but a
hash value must never be used as a persistent identifier or equality substitute.

Synthesized `Hashable` uses the stored properties that participate in synthesis.
That is correct only when those properties match the domain's identity rule. For
an entity whose display name can change, hashing the name may be the wrong model.
Prefer a stable immutable ID, or store immutable value snapshots in the set.

Set algebra returns values whose ordering is unspecified. If a result crosses a
network, persistence, snapshot-test, or signature boundary, sort using an explicit
stable key. Do not depend on the order observed in one run.

## Engineering Decisions

Use a set when uniqueness, membership, or set algebra is central. Use an array
when order or duplicates matter. Use a dictionary when each key owns a value.
Like other Swift collections, a set has value semantics but shared mutation of
one variable still needs synchronization.

Decide what a duplicate means before inserting. Silently dropping a second value
is correct for mathematical membership, but can hide conflicting records during
an import. When conflicts matter, detect the existing element and return or log a
domain result instead of treating insertion as unconditional success.

## Production Application

Test the laws of equality and hashing with values that differ in mutable,
nonidentity fields. Also test deterministic serialization separately from set
membership. If lookup performance matters, measure realistic data distributions;
average constant time is not a latency guarantee for every input.

## References

- [The Swift Programming Language: Sets](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/collectiontypes/#Sets)
- [Swift `Set`](https://developer.apple.com/documentation/swift/set)
- [Swift `Hashable`](https://developer.apple.com/documentation/swift/hashable)
