---
title: "Members, Extensions, and Conformances: Theory"
domain: "Swift"
topic: "Access Control"
concept: "Members, Extensions, and Conformances"
page_type: theory
interview_priority: situational
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Members, Extensions, and Conformances: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

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

## Engineering Judgment

Design the external interface first, then mark declarations explicitly. Group private helpers for
locality, not to evade ownership. Treat public conformances as global ecosystem commitments.

## References

- [The Swift Programming Language: Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [The Swift Programming Language: Extensions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/extensions/)
