---
title: "Members, Extensions, and Conformances: Theory"
domain: "Swift"
topic: "Access Control"
concept: "Members, Extensions, and Conformances"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Members, Extensions, and Conformances: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> A type's visibility does not publish its members automatically; every exposed signature and conformance must remain usable in its access domain.

- Members default to `internal`, including members of public types.
- A member cannot be effectively more visible than its containing type.
- An access modifier on an extension supplies a default for eligible members.
- An extension that declares protocol conformance cannot itself carry an access modifier for that conformance.
- Requirement witnesses must be accessible wherever the type-protocol conformance is usable.

## Mental Model

Access applies to a graph of declarations, not isolated keywords. A public member exposes its types;
a conformance exposes witnesses and semantic laws; an extension changes lookup for every consumer in
scope. Review the complete generated interface.

## How It Works

```swift
public protocol Identified {
    var id: String { get }
}

public struct Record {
    public let id: String
    internal let revision: Int
}

extension Record: Identified { }

private extension Record {
    var diagnosticRevision: String { "r\(revision)" }
}
```

The public conformance uses the public `id` witness. `revision` and its helper remain implementation
details. The conformance's effective accessibility follows the accessible type and protocol.

### Core Invariants

- Published members mention only sufficiently visible types.
- Witness visibility supports every context where the conformance is used.
- Extension defaults do not accidentally publish helpers.
- Retroactive conformances have an owner and collision/evolution policy.
- Generated interfaces match the intended public/package surface.

### Constraints and Guarantees

- Public enum cases have the enum's access; individual cases do not declare narrower access.
- Nested types and members remain bounded by enclosing declaration access.
- A protocol requirement does not declare a separate access modifier from its protocol contract.
- Private members are available to same-file extensions of their declaration under Swift's private rules.
- Typealiases do not hide the accessibility of their underlying types.

## Failure Modes

- A public type has no usable public initializer or members.
- A witness is internal while an external conformance requires it publicly.
- A public typealias exposes an internal implementation type.
- A broad extension modifier publishes convenience helpers unintentionally.
- A retroactive public conformance collides with another module or later owner conformance.

## Engineering Judgment

Design the external interface first, then mark declarations explicitly. Group private helpers for
locality, not to evade ownership. Treat public conformances as global ecosystem commitments.

## Production Considerations

### Performance

Public access does not imply dynamic dispatch; protocol/existential and resilience choices do. Avoid
making implementation symbols public as an optimization workaround.

### Concurrency and Thread Safety

Witness visibility does not satisfy isolation or sendability. Public conformances must also preserve
their concurrency contract across all accessible callers.

### Testing

Compile external conformers/consumers, inspect generated interfaces, and test absence of forbidden
members. Maintain shared conformance-law tests.

### Compatibility and Migration

Publishing members or conformances is difficult to retract. Deprecate, add adapters, migrate clients,
and monitor collisions before narrowing/removing access.

## Staff and Principal Perspective

Extension and conformance visibility affects the whole dependency graph. Establish ownership policy,
generated-interface review, and downstream source fixtures for shared packages/frameworks.

## Common Mistakes

### Assuming Public Type Means Public Members

**Why it is wrong:** Members retain their own default/internal access unless explicitly published.

**Better approach:** Declare and test the minimal public construction and behavior surface intentionally.

## References

- [The Swift Programming Language: Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [The Swift Programming Language: Extensions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/extensions/)
