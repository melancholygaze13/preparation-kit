---
title: "Requirements, Conformance, and Synthesis: Theory"
domain: "Swift"
topic: "Protocols"
concept: "Requirements, Conformance, and Synthesis"
page_type: theory
interview_priority: high
estimated_read_minutes: 4
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-07-12
---

# Requirements, Conformance, and Synthesis: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A protocol is a set of callable requirements plus behavior rules. Swift connects a
conforming type's implementations to those requirements. The compiler checks the required
shape. Safe substitution also depends on behavior, performance, mutation, errors, and concurrency.

## How It Works

```swift
protocol Resettable {
    var isEmpty: Bool { get }
    mutating func reset()
    init()
}

struct Buffer: Resettable {
    private var bytes: [UInt8] = []
    var isEmpty: Bool { bytes.isEmpty }
    mutating func reset() { bytes.removeAll(keepingCapacity: true) }
    init() {}
}
```

A `{ get set }` property requires readable and writable capability; a conformer may use
stored or computed implementation. Static/type requirements use `static` in the protocol;
classes may satisfy appropriate requirements with `class` where overriding is intended.

Synthesized conformance is available only under language-defined conditions. It reduces
repeated code but can encode the wrong domain identity or network schema. Adding or reordering
stored state may change synthesized equality, hashing, or coding behavior.

### Equality, Hashing, and Identity Protocols

Common protocol questions often hide an identity decision. `Equatable` says when two
values are the same for this domain. `Hashable` adds a lookup contract: equal values
must produce the same hash during one program execution. `Identifiable` supplies a
stable identity value for diffing and selection, but it does not say all visible
fields are equal. `Comparable` defines an ordering, which must stay consistent enough
for sorting and range decisions.

These protocols should be based on stable domain fields. Do not include cached,
localized, time-varying, or mutable display fields unless changing them truly changes
identity. For class instances used as dictionary keys or set elements, mutating a
hash-relevant property while the instance is stored can make lookup incorrect.
Swift's hash values are intentionally not persistence keys; store a real identifier
when data must survive launches or cross a process boundary.

### Rules That Must Stay True

- Every requirement has one valid witness for the conformance.
- Each implementation follows the protocol's documented behavior rules.
- Mutation and initialization requirements remain valid for value and class conformers.
- Synthesis does not accidentally define persistence or business identity.
- Equality, hashing, identity, and ordering are consistent with each other where
  the domain requires it.
- Conformance ownership is explicit and globally compatible.

### Constraints and Guarantees

- Protocols cannot provide stored instance state.
- Requirements cannot declare default parameter values.
- A conformance is global for the type/protocol pair, not local to one value.
- Marker protocols can impose behavior requirements without callable members.

## Engineering Judgment

Use protocols for stable capabilities with multiple useful conformers or replaceable
boundaries. Avoid protocols with one implementation, groups of unrelated state, and contracts that expose an
implementation's full surface without a consumer need.

For standard protocols, write down the domain policy before accepting synthesis. A
database row may be `Identifiable` by primary key, `Equatable` by all meaningful fields,
and sorted by a display date. Those are three different contracts. Reusing one field
for all of them is correct only when the product behavior really matches that rule.

## Production Application

Test protocol laws across conformers, mutation, failure, and synthesized schema changes.
Benchmark existential/generic use only on hot paths. Audit sendability and isolation of
witnesses; conformance does not add synchronization.

## Staff and Principal Perspective

Protocol ownership is platform ownership. Keep contracts minimal, publish behavior rules,
provide conformance test suites, and treat new public requirements as coordinated migrations.

## References

- [The Swift Programming Language: Protocols](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/)
- [The Swift Programming Language: Declarations](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/declarations/)
- [Swift `Hashable`](https://developer.apple.com/documentation/swift/hashable)
- [Swift `Identifiable`](https://developer.apple.com/documentation/swift/identifiable)
