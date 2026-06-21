---
title: "Requirements, Conformance, and Synthesis: Theory"
domain: "Swift"
topic: "Protocols"
concept: "Requirements, Conformance, and Synthesis"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Requirements, Conformance, and Synthesis: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> Protocols specify required capabilities; conforming declarations supply witnesses, but the compiler cannot prove most semantic laws.

- Property requirements state name, type, get/set capability, and type/instance scope—not storage.
- Mark mutating requirements when value-type conformers may change `self`; classes implement them without `mutating`.
- Initializer requirements generally require `required` on nonfinal classes so subclasses preserve conformance.
- Conformance can be declared in the type or an extension and may use eligible synthesized implementations.
- `Equatable`, `Hashable`, `Codable`, and `Sendable` still require semantic review of all stored state.

## Mental Model

A protocol is a set of callable guarantees plus unwritten laws. A witness table connects
a conforming type's implementation to requirements. Syntax proves shape; substitutability
depends on stable semantics, complexity, mutation, error, and concurrency contracts.

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
boilerplate but can encode the wrong domain identity or wire schema. Adding/reordering
stored state may change synthesized equality, hashing, or coding behavior.

### Core Invariants

- Every requirement has one valid witness for the conformance.
- Witness semantics preserve the protocol's documented laws.
- Mutation and initialization requirements remain valid for value and class conformers.
- Synthesis does not accidentally define persistence or business identity.
- Conformance ownership is explicit and globally compatible.

### Constraints and Guarantees

- Protocols cannot provide stored instance state.
- Requirements cannot declare default parameter values.
- A conformance is global for the type/protocol pair, not local to one value.
- Marker protocols can impose semantic requirements without callable members.

## Failure Modes

- Equality or hashing changes after adding a cached field.
- A default/synthesized witness satisfies syntax but violates domain law.
- A mutable requirement is omitted and excludes value-type implementations.
- A nonfinal class initializer witness fails to preserve subclass construction.
- Conformance is added only to unlock an API without accepting its full semantics.

## Engineering Judgment

Use protocols for stable capabilities with multiple meaningful conformers or replaceable
boundaries. Avoid one-implementation protocols, state bags, and contracts that expose an
implementation's full surface without a consumer need.

## Production Considerations

Test protocol laws across conformers, mutation, failure, and synthesized schema changes.
Benchmark existential/generic use only on hot paths. Audit sendability and isolation of
witnesses; conformance does not add synchronization.

## Staff and Principal Perspective

Protocol ownership is platform ownership. Keep contracts minimal, publish semantic laws,
provide conformance test suites, and treat new public requirements as coordinated migrations.

## Common Mistakes

### Equating Compiler Conformance with Behavioral Correctness

**Why it is wrong:** The compiler verifies signatures, not domain laws such as equality consistency or idempotency.

**Better approach:** Document laws and run shared conformance tests against every implementation.

## References

- [The Swift Programming Language: Protocols](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/)
- [The Swift Programming Language: Declarations](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/declarations/)
