---
title: "Protocol Extensions and Dispatch: Theory"
domain: "Swift"
topic: "Protocols"
concept: "Protocol Extensions and Dispatch"
page_type: theory
interview_priority: core
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Protocol Extensions and Dispatch: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Requirement calls go through conformance witnesses. Extension-only calls are ordinary
statically selected members. The same spelling can therefore produce different behavior
after a value is viewed through a protocol type.

## How It Works

```swift
protocol Describable {
    func describe() -> String
}

extension Describable {
    func describe() -> String { "default" }
    func debugLabel() -> String { "protocol" }
}

struct Item: Describable {
    func describe() -> String { "item" }
    func debugLabel() -> String { "item debug" }
}
```

Calling `describe()` through `any Describable` uses `Item`'s witness. Calling
`debugLabel()` through that static protocol view uses the extension member because it is
not a requirement. If polymorphism is intended, declare it in the protocol.

### Core Invariants

- Polymorphic behavior is represented by a requirement.
- Defaults obey the same postconditions and complexity expectations.
- Constrained defaults do not create ambiguous or behavior-changing overlaps.
- Extension helpers do not masquerade as overridable customization points.

### Constraints and Guarantees

- Protocol extensions cannot add stored state or make a protocol inherit another protocol.
- A conformer need not implement a requirement with an available default.
- Static and witness dispatch differences are language behavior, not optimizer accidents.

## Engineering Judgment

Use defaults for universal behavior derivable from requirements. Require explicit
implementation when policy, performance, security, or lifecycle differs by conformer.
Keep convenience helpers extension-only only when static dispatch is intentional.

## Production Application

Test calls through concrete, generic, and existential views. Benchmark defaults where
complexity differs. Audit isolation: synchronous requirements cannot be satisfied by
actor-isolated witnesses unless the protocol/conformance expresses that isolation.

## Staff and Principal Perspective

Default implementations are ecosystem policy. Version them cautiously, document laws,
and compile external conformer fixtures before adding requirements or overlapping defaults.

## References

- [The Swift Programming Language: Protocol extensions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/#Protocol-Extensions)
