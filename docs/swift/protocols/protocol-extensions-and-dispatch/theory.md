---
title: "Protocol Extensions and Dispatch: Theory"
domain: "Swift"
topic: "Protocols"
concept: "Protocol Extensions and Dispatch"
page_type: theory
interview_priority: high
estimated_read_minutes: 4
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-08-12
---

# Protocol Extensions and Dispatch: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Calls to protocol requirements use the conforming type's implementation. Calls to
extension-only methods are selected from the compile-time type. The same spelling can
therefore produce different behavior
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

let concrete = Item()
let erased: any Describable = concrete

print(concrete.describe())  // item
print(erased.describe())    // item: protocol requirement dispatch
print(concrete.debugLabel()) // item debug
print(erased.debugLabel())   // protocol: extension-only static dispatch
```

Calling `describe()` through `any Describable` uses `Item`'s witness. Calling
`debugLabel()` through that static protocol view uses the extension member because it is
not a requirement. If polymorphism is intended, declare it in the protocol.

The declaration creates the customization point. A same-named method added by a
conforming type does not retroactively turn an extension-only helper into a requirement.
Concrete tests can therefore pass while generic or existential production code observes
the extension implementation.

Constrained extensions add another selection dimension. A more specific default can be
available when `Self` meets extra constraints, but overlapping defaults make behavior
hard to predict and evolve. Prefer one obvious default or separate named capabilities
when policies differ.

### Rules That Must Stay True

- Polymorphic behavior is represented by a requirement.
- Defaults produce the same promised results and meet the same performance expectations.
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

Do not put security, persistence, retry, or lifecycle policy in a default merely to save
boilerplate. A universal-looking default becomes the behavior of every new conformer.
Require an explicit witness when each conformer must make a decision.

## Production Application

Test calls through concrete, generic, and existential views. Benchmark defaults where
complexity differs. Audit isolation: synchronous requirements cannot be satisfied by
actor-isolated witnesses unless the protocol/conformance expresses that isolation.

When evolving a public protocol, compile a conformer that uses each default and one that
supplies its own witness. Concrete-only tests are insufficient for dispatch behavior.

## Staff and Principal Perspective

Default implementations affect every conforming type. Change them cautiously, document
their rules, and compile small external conformers before adding requirements or overlapping defaults.

## References

- [The Swift Programming Language: Protocol extensions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/#Protocol-Extensions)
