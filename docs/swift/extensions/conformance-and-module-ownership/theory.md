---
title: "Conformance and Module Ownership: Theory"
domain: "Swift"
topic: "Extensions"
concept: "Conformance and Module Ownership"
page_type: theory
interview_priority: situational
estimated_read_minutes: 4
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Conformance and Module Ownership: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Methods on a foreign type are namespaced by the contributing module, but protocol
conformance is a process-wide fact used by generic and existential code. Declaring one
claims authority over semantics and blocks a future owner from adding a different one
without conflict.

## How It Works

Conforming your own type to an imported protocol is normal. Conforming an imported type
to your own protocol is also owned because your module controls the protocol semantics.
Risk is highest when both declarations are imported:

```swift
import Foundation

extension Date: @retroactive Identifiable {
    public var id: TimeInterval { timeIntervalSinceReferenceDate }
}
```

This syntax explicitly accepts the warning described by SE-0364. If Foundation later
adds `Date: Identifiable`, two modules provide the same conformance. Rebuilding can fail;
already distributed binaries can observe undefined behavior over which witness wins.
Persisted identifiers make semantic disagreement more damaging.

An owned wrapper makes policy explicit:

```swift
struct EventDate: Identifiable, Codable {
    let value: Date
    var id: TimeInterval { value.timeIntervalSinceReferenceDate }
}
```

The wrapper can evolve its schema, sendability, identity, and validation without claiming
global semantics for Foundation's `Date`.

Separate conformance declaration from implementation when that improves auditability:
an empty conformance extension can use synthesized requirements where supported, while
the extension location documents ownership. Protocol default implementations and dispatch
need separate protocol-level reasoning; an extension does not create dynamic overriding.

### Core Invariants

- One accountable module owns each conformance's semantics and evolution.
- Persistent or wire behavior does not depend accidentally on a foreign conformance.
- Retroactive conformances have explicit compatibility analysis and rollback strategy.
- Wrappers cross boundaries when application-specific policy needs independent identity.
- Isolation and sendability of conformance requirements remain truthful.

### Constraints and Guarantees

- Conformance availability is module import dependent at compile time but globally unique in the runtime process.
- `@retroactive` suppresses/acknowledges the compiler warning; it provides no conflict-resolution mechanism.
- Extensions of imported types without imported-protocol conformance do not create the same witness-table conflict, though member names can still collide.
- A same-package exception to the warning is not proof that architecture or semantics are sound.

## Engineering Judgment

### When to Use It

Declare conformances where your module owns the type or the protocol. Consider a
retroactive conformance only under closed deployment control, with one organization-wide
owner, conflict monitoring, and a credible migration path.

### When Not to Use It

Do not publish retroactive conformances from general-purpose libraries or use them for
feature-specific identity, persistence, ordering, or serialization policy.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| Owned conformance | Natural generic integration | Global semantic commitment | Module owns type or protocol |
| Retroactive conformance | Immediate integration | Future collision and binary risk | Rare closed-world bridge |
| Wrapper | Explicit policy and evolution | Conversion/forwarding | App-specific semantics |
| Adapter/free function | No global witness | Less generic integration | Local behavior |

### Alternatives

Use a wrapper, local adapter, key-path parameter, strategy object, or explicit closure
instead of teaching all generic code one global meaning for a foreign type.

## References

- [The Swift Programming Language: Extensions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/extensions/)
- [The Swift Programming Language: Protocols](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/)
- [SE-0364: Warning for Retroactive Conformances of External Types](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0364-retroactive-conformance-warning.md)
